#!/usr/bin/env python3
"""Update the Encore 0.7 tracker with verified CI evidence using Python stdlib.

The original OOXML parts, styles, tables and user-note cells are retained.
Known summary COUNTA/COUNTIFS results receive checked cached values. This is
not a general spreadsheet calculation engine or a desktop Excel validation.
Publication uses the repository's rollback-capable Node publisher.
"""
import argparse
import copy
import hashlib
import io
import json
import math
import os
import posixpath
import re
import subprocess
import tempfile
import zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
import xml.etree.ElementTree as ET

NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
P = "http://schemas.openxmlformats.org/package/2006/relationships"
MC = "http://schemas.openxmlformats.org/markup-compatibility/2006"
ET.register_namespace("", NS)
ET.register_namespace("r", R)
ET.register_namespace("mc", MC)
TAG = lambda name: "{" + NS + "}" + name
TABLE_KEYS = {
    "Fonctionnalités": "features", "Combattants": "roster",
    "Techniques": "moves", "Arènes": "stages", "Atlas": "atlas",
    "Production": "production", "Scénarios": "scenarios", "QA": "qa",
}
STATUS = ["Implémenté", "Partiel", "Prévu", "À vérifier"]
QA_STATUS = ["Réussi", "Échec", "Non exécuté", "À vérifier"]
ERRORS = ("#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#N/A", "#NUM!", "#NULL!", "#SPILL!", "#CALC!")

def digest(value):
    return hashlib.sha256(value).hexdigest()

def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))

def dump_json(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")

def require(condition, message):
    if not condition:
        raise ValueError(message)

def column(number):
    result = ""
    while number:
        number, remainder = divmod(number - 1, 26)
        result = chr(65 + remainder) + result
    return result

def coordinate(reference):
    found = re.fullmatch(r"\$?([A-Z]+)\$?(\d+)", reference)
    require(found is not None, "Invalid cell reference: " + reference)
    return found.group(1), int(found.group(2))

def part_target(part, target):
    value = posixpath.normpath(target.lstrip("/") if target.startswith("/") else posixpath.join(posixpath.dirname(part), target))
    require(not value.startswith("../"), "OOXML relationship escapes archive")
    return value

NODE_EXPORT = r"""
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const root = process.argv[1], evidencePath = process.argv[2];
const get = file => import(pathToFileURL(path.join(root,file)));
const [data,session,catalog,audio,ambience,offline] = await Promise.all([
  get('combat/data.mjs'), get('combat/session.mjs'), get('combat/finisher-catalog.mjs'),
  get('combat/audio.mjs'), get('combat/audio-ambiences.mjs'), get('combat/offline-manifest.mjs')
]);
const evidence = JSON.parse(fs.readFileSync(evidencePath,'utf8'));
for (const report of evidence.browserReports || []) {
  const actual = createHash('sha256').update(JSON.stringify(report.report)).digest('hex');
  if(actual !== report.reportSha256)throw new Error('Browser report digest mismatch: '+report.file);
}
console.log(JSON.stringify({
  gameVersion:data.GAME.version, sessionVersion:session.GAME_VERSION, contentDate:data.GAME.contentDate,
  fighters:data.FIGHTERS.map(({id,name})=>({id,name})), stages:data.STAGES.map(({id,name})=>({id,name})),
  finishers:catalog.FINISHER_CATALOG, notice:catalog.FINISHER_NOTICE,
  ambiences:ambience.AUDIO_AMBIENCES, effects:audio.AUDIO_EFFECT_IDS,
  aliases:audio.AUDIO_EFFECT_ALIASES, replayVersions:session.REPLAY_VERSIONS,
  offlineVersion:offline.OFFLINE_VERSION, artVersion:offline.ART_VERSION, artFiles:offline.ART_FILES,
  counts:{fighters:data.FIGHTERS.length,moves:data.MOVES.length,stages:data.STAGES.length,
    modes:session.MODES.length,atlas:data.ROSTER_ARCHIVE.length,variants:data.VARIANTS.length,
    archiveOnly:data.ROSTER_ARCHIVE.length-data.FIGHTERS.length-data.VARIANTS.length,
    soundEffects:audio.AUDIO_EFFECT_IDS.length,offlineImages:offline.ART_FILES.length,offlineBytes:offline.ART_BYTES,
    finishers:catalog.FINISHER_CATALOG.length,audioAmbiences:Object.keys(ambience.AUDIO_AMBIENCES).length}
}));
"""
NODE_PUBLISH = r"""
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const input=JSON.parse(fs.readFileSync(0,'utf8'));
const {publishWorkbookArtifacts}=await import(pathToFileURL(input.module));
await publishWorkbookArtifacts({outputDirectory:input.outputDirectory,files:input.files});
"""

class Tracker:
    def __init__(self, filename):
        self.original = filename.read_bytes()
        with zipfile.ZipFile(io.BytesIO(self.original)) as archive:
            require(archive.testzip() is None, "Input workbook has a corrupt ZIP member")
            self.infos = archive.infolist()
            require(len({info.filename for info in self.infos}) == len(self.infos), "Duplicate ZIP member")
            self.parts = {info.filename: archive.read(info.filename) for info in self.infos}
        self.changed = {}
        self._cells = {}
        self.shared = []
        if "xl/sharedStrings.xml" in self.parts:
            strings = ET.fromstring(self.parts["xl/sharedStrings.xml"])
            self.shared = ["".join(node.text or "" for node in item.iter(TAG("t"))) for item in strings.findall(TAG("si"))]
        self.book = ET.fromstring(self.parts["xl/workbook.xml"])
        relationships = self.relations("xl/workbook.xml")
        self.sheets = {}
        for sheet in self.book.find(TAG("sheets")):
            name = sheet.attrib["name"]
            part = relationships[sheet.attrib["{" + R + "}id"]]
            self.sheets[name] = {"part": part, "xml": ET.fromstring(self.parts[part])}
        require(len(self.sheets) == 10, "Expected ten tracker sheets")
        self.tables = {}
        for name, sheet in self.sheets.items():
            table_parts = sheet["xml"].find(TAG("tableParts"))
            if table_parts is None:
                continue
            rels = self.relations(sheet["part"])
            require(len(table_parts) == 1, "Expected one native table: " + name)
            table_part = rels[table_parts[0].attrib["{" + R + "}id"]]
            table = ET.fromstring(self.parts[table_part])
            start, end = table.attrib["ref"].split(":")
            require(coordinate(start) == ("A", 5), "Unexpected table header: " + name)
            columns = table.find(TAG("tableColumns"))
            self.tables[name] = {"part": table_part, "xml": table, "width": len(columns),
                                 "end": coordinate(end)[1], "headers": [c.attrib["name"] for c in columns]}
        require(len(self.tables) == 9, "Expected nine native tracker tables")

    def relations(self, part):
        relpath = posixpath.join(posixpath.dirname(part), "_rels", posixpath.basename(part) + ".rels")
        root = ET.fromstring(self.parts[relpath])
        return {rel.attrib["Id"]: part_target(part, rel.attrib["Target"])
                for rel in root if rel.attrib.get("TargetMode") != "External"}

    def value(self, cell):
        if cell is None:
            return ""
        kind = cell.attrib.get("t")
        if kind == "inlineStr":
            return "".join(node.text or "" for node in cell.find(TAG("is")).iter(TAG("t")))
        node = cell.find(TAG("v"))
        raw = node.text if node is not None and node.text is not None else ""
        if kind == "s":
            return self.shared[int(raw)]
        if kind == "b":
            return raw == "1"
        if kind in ("str", "e") or not raw:
            return raw
        try:
            value = float(raw)
            return int(value) if value.is_integer() else value
        except ValueError:
            return raw

    def rows(self, name):
        return self.sheets[name]["xml"].find(TAG("sheetData"))

    def cells(self, name):
        if name not in self._cells:
            self._cells[name] = {cell.attrib["r"]: cell for row in self.rows(name) for cell in row}
        return self._cells[name]

    def table_rows(self, name):
        table = self.tables[name]
        result = []
        for row in self.rows(name):
            index = int(row.attrib["r"])
            if index < 6 or index > table["end"]:
                continue
            cells = {coordinate(cell.attrib["r"])[0]: cell for cell in row}
            result.append((index, [self.value(cells.get(column(i))) for i in range(1, table["width"] + 1)]))
        return result

    def cell(self, name, reference):
        cells = self.cells(name)
        if reference in cells:
            return cells[reference]
        letters, number = coordinate(reference)
        rows = self.rows(name)
        row = next((item for item in rows if int(item.attrib["r"]) == number), None)
        if row is None:
            row = ET.Element(TAG("row"), {"r": str(number)})
            rows.append(row)
        cell = ET.SubElement(row, TAG("c"), {"r": reference})
        cells[reference] = cell
        return cell

    def put(self, name, reference, value, formula=None):
        cell = self.cell(name, reference)
        if formula is None and cell.find(TAG("f")) is None and self.value(cell) == value:
            return
        for child in list(cell):
            cell.remove(child)
        cell.attrib.pop("t", None)
        if formula is not None:
            ET.SubElement(cell, TAG("f")).text = formula.lstrip("=")
        if isinstance(value, bool):
            cell.attrib["t"] = "b"; ET.SubElement(cell, TAG("v")).text = "1" if value else "0"
        elif isinstance(value, (int, float)) and math.isfinite(value):
            ET.SubElement(cell, TAG("v")).text = str(value)
        elif formula is not None:
            cell.attrib["t"] = "str"; ET.SubElement(cell, TAG("v")).text = str(value)
        else:
            cell.attrib["t"] = "inlineStr"
            node = ET.SubElement(ET.SubElement(cell, TAG("is")), TAG("t"))
            node.attrib["{http://www.w3.org/XML/1998/namespace}space"] = "preserve"
            node.text = "" if value is None else str(value)

    def note_cells(self):
        result = {}
        for name in TABLE_KEYS:
            table = self.tables[name]
            require(table["headers"][-1] == "Notes utilisateur", "Missing notes column: " + name)
            cells = self.cells(name)
            for index, values in self.table_rows(name):
                cell = cells.get(column(table["width"]) + str(index))
                if cell is not None and (self.value(cell) != "" or cell.find(TAG("f")) is not None):
                    result[(name, str(values[0]))] = ET.tostring(cell, encoding="unicode")
        return result

    def sync_table(self, name, values):
        table = self.tables[name]
        require(all(len(row) == table["width"] for row in values), "Row schema mismatch: " + name)
        ids = [str(row[0]) for row in values]
        require(len(set(ids)) == len(ids) and all(ids), "Duplicate or empty generated ID: " + name)
        existing = {str(row[0]): index for index, row in self.table_rows(name)}
        require(len(existing) == len(self.table_rows(name)), "Duplicate workbook ID: " + name)
        require(set(existing).issubset(ids), "Removing existing rows is not supported: " + name)
        added = [row for row in values if str(row[0]) not in existing]
        added_ids = {str(row[0]) for row in added}
        old_end = table["end"]; count = len(added); new_end = old_end + count
        if count:
            for row in self.rows(name):
                number = int(row.attrib["r"])
                if number > old_end:
                    require(not any(cell.find(TAG("f")) is not None for cell in row), "Formula below table needs explicit migration: " + name)
                    row.attrib["r"] = str(number + count)
                    for cell in row:
                        cell.attrib["r"] = coordinate(cell.attrib["r"])[0] + str(number + count)
            template = next(row for row in self.rows(name) if int(row.attrib["r"]) == 6)
            style_cells = {coordinate(cell.attrib["r"])[0]: cell for cell in template}
            for offset, values_row in enumerate(added, 1):
                number = old_end + offset
                attrs = dict(template.attrib); attrs.update(r=str(number), ht=str(126 if name in ("Production", "QA") else 90), customHeight="1")
                row = ET.SubElement(self.rows(name), TAG("row"), attrs)
                for index in range(1, table["width"] + 1):
                    letters = column(index)
                    style = style_cells.get(letters)
                    attrs = {key: value for key, value in (style.attrib.items() if style is not None else []) if key not in ("r", "t")}
                    attrs["r"] = letters + str(number)
                    ET.SubElement(row, TAG("c"), attrs)
                existing[str(values_row[0])] = number
            sheet = self.sheets[name]["xml"]
            for element in sheet.iter():
                if element.tag in (TAG("conditionalFormatting"), TAG("dataValidation")) and "sqref" in element.attrib:
                    element.attrib["sqref"] = re.sub(r"(?<=:)(\$?[A-Z]+\$?)" + str(old_end) + r"(?=\s|$)", lambda m: m.group(1) + str(new_end), element.attrib["sqref"])
                if element.tag == TAG("mergeCell"):
                    def shift(match):
                        number = int(match.group(2))
                        return match.group(1) + str(number + count if number > old_end else number)
                    element.attrib["ref"] = re.sub(r"([A-Z]+)(\d+)", shift, element.attrib["ref"])
            table["end"] = new_end
            ref = "A5:" + column(table["width"]) + str(new_end)
            table["xml"].attrib["ref"] = ref
            filter_node = table["xml"].find(TAG("autoFilter"))
            if filter_node is not None:
                filter_node.attrib["ref"] = ref
        self._cells.pop(name, None)
        for values_row in values:
            index = existing[str(values_row[0])]
            for offset, value in enumerate(values_row, 1):
                # Existing note XML (including formulas, typed 0/false and styles)
                # is never rewritten; row positions are unchanged by appending.
                if name in TABLE_KEYS and str(values_row[0]) not in added_ids and offset == table["width"]:
                    continue
                self.put(name, column(offset) + str(index), value)

    def xml_bytes(self, part, element):
        namespaces = dict(value for _, value in ET.iterparse(io.BytesIO(self.parts[part]), events=["start-ns"]))
        for prefix, uri in namespaces.items():
            if prefix and not re.fullmatch(r"ns\d+", prefix):
                ET.register_namespace(prefix, uri)
        result = ET.tostring(element, encoding="utf-8", xml_declaration=True)
        # ElementTree can drop unused namespace declarations mentioned by mc:Ignorable.
        found = namespaces
        for prefix in element.attrib.get("{" + MC + "}Ignorable", "").split():
            if prefix in found and (b"xmlns:" + prefix.encode() + b"=") not in result:
                start = result.index(b"<", result.index(b"?>") + 2)
                end = result.index(b">", start)
                result = result[:end] + (' xmlns:' + prefix + '="' + found[prefix] + '"').encode() + result[end:]
        return result

    def write(self, filename):
        for name, sheet in self.sheets.items():
            rows = self.rows(name)
            rows[:] = sorted(rows, key=lambda row: int(row.attrib["r"]))
            for row in rows:
                row[:] = sorted(row, key=lambda cell: (len(coordinate(cell.attrib["r"])[0]), coordinate(cell.attrib["r"])[0]))
            dimension = sheet["xml"].find(TAG("dimension"))
            if dimension is not None:
                refs = [coordinate(cell.attrib["r"]) for row in rows for cell in row]
                right = max((col for col, _ in refs), key=lambda x: (len(x), x))
                dimension.attrib["ref"] = "A1:" + right + str(max(index for _, index in refs))
            self.changed[sheet["part"]] = self.xml_bytes(sheet["part"], sheet["xml"])
        for table in self.tables.values():
            self.changed[table["part"]] = self.xml_bytes(table["part"], table["xml"])
        calc = self.book.find(TAG("calcPr"))
        if calc is None:
            calc = ET.SubElement(self.book, TAG("calcPr"))
        calc.attrib.update(calcMode="auto", fullCalcOnLoad="1", forceFullCalc="1")
        self.changed["xl/workbook.xml"] = self.xml_bytes("xl/workbook.xml", self.book)
        with zipfile.ZipFile(filename, "w") as archive:
            for info in self.infos:
                archive.writestr(info, self.changed.get(info.filename, self.parts[info.filename]))

def upsert(rows, replacement):
    found = next((index for index, row in enumerate(rows) if row[0] == replacement[0]), None)
    if found is None:
        rows.append(replacement)
    else:
        replacement[-1] = rows[found][-1]
        rows[found] = replacement

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", default=".")
    parser.add_argument("--evidence")
    parser.add_argument("--output-dir")
    parser.add_argument("--input-workbook")
    args = parser.parse_args()
    root = Path(args.repo_root).resolve()
    output = Path(args.output_dir).resolve() if args.output_dir else root / "docs"
    evidence_file = Path(args.evidence).resolve() if args.evidence else root / "audit-combat/ci/evidence-0.7.0.json"
    input_file = Path(args.input_workbook).resolve() if args.input_workbook else root / "docs/DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx"
    data_file = root / "docs/combat-tracker-data.json"
    verification_file = root / "docs/combat-workbook-verification.json"
    original_data = read_json(data_file)
    evidence_bytes = evidence_file.read_bytes()
    evidence = json.loads(evidence_bytes)
    node = os.environ.get("NODE_EXECUTABLE", "node")
    require(evidence.get("schema") == "encore-ci-evidence/v1" and evidence.get("gameVersion") == "0.7.0", "Expected current 0.7 CI evidence")
    require(evidence.get("pass") is True and evidence.get("runtimeUnchangedDuringTests") is True, "CI evidence is not successful and stable")
    require(evidence.get("runtimeSourceHashes") == evidence.get("runtimeSourceHashesAfter"), "Runtime changed during CI")
    def file_digest(relative):
        target = (root / relative).resolve()
        require(target.is_relative_to(root) and target.is_file(), "Invalid source path: " + relative)
        return digest(target.read_bytes())
    for filename, expected in evidence["runtimeSourceHashes"].items():
        require(file_digest(filename) == expected, "Runtime drift: " + filename)
    head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=root, text=True).strip()
    require(head == evidence.get("sourceCommit"), "CI evidence belongs to another commit")
    current_tests = {str(file.relative_to(root)) for file in (root / "tests").glob("combat-*.test.mjs")}
    require(len(evidence["nodeReports"]) == len(current_tests) and current_tests == {report["file"] for report in evidence["nodeReports"]}, "Node suite coverage is incomplete or duplicated")
    metadata = json.loads(subprocess.check_output([node, "--input-type=module", "-e", NODE_EXPORT, str(root), str(evidence_file)], cwd=root, text=True))
    require(metadata["gameVersion"] == metadata["sessionVersion"] == "0.7.0", "Runtime version mismatch")
    require(len(metadata["finishers"]) == 42 and len(metadata["ambiences"]) == 12, "Incomplete 0.7 catalogues")
    fresh_qa = []
    occurrences = Counter()
    def add_qa(kind, report, name, expected):
        key = report["file"] + "\0" + report["label"] + "\0" + name
        occurrences[key] += 1
        identifier = "CI07-" + kind + "-" + digest((key + "\0" + str(occurrences[key])).encode())[:16]
        proof = ("CI 0.7.0 · " + evidence["completedAt"] + "\n" + str(evidence.get("runUrl") or "Exécution locale") +
                 "\nCommit " + evidence["sourceCommit"] + "\nSource SHA-256 " + report["sourceSha256"] +
                 "\nJournal " + report["log"])
        fresh_qa.append([identifier, "CI 0.7 · " + ("Node" if kind == "N" else "Chromium"), name, "Réussi", "P0",
                         "node " + report["file"], proof, expected, ""])
    for report in evidence["nodeReports"]:
        require(report["passed"] is True and report["exitCode"] == 0 and not report["timedOut"], "Unsuccessful Node suite")
        require(report["count"] == report["passedCount"] == len(report["testNames"]) > 0, "Invalid Node case counts")
        require(file_digest(report["file"]) == report["sourceSha256"], "Node test source drift")
        for name in report["testNames"]:
            add_qa("N", report, name, "Assertions exécutées par la suite Node ; aucun test physique ou validation canonique implicite.")
    for report in evidence["browserReports"]:
        require(report["passed"] is True and report["exitCode"] == 0 and not report["timedOut"], "Unsuccessful browser suite")
        require(file_digest(report["file"]) == report["sourceSha256"], "Browser test source drift")
        require(report["checks"] and report["checks"] == report["report"]["checks"], "Browser checks mismatch")
        for check in report["checks"]:
            require(check.get("pass") is True, "Failed browser assertion")
            name = check.get("name") or check.get("label") or check.get("title")
            require(isinstance(name, str) and name, "Browser assertion has no name")
            expected = check.get("expected") or check.get("description") or "Portée limitée aux assertions et au navigateur consignés dans le rapport CI."
            add_qa("B", report, name, str(expected))
    totals = evidence["totals"]
    node_count = sum(report["count"] for report in evidence["nodeReports"])
    browser_count = sum(len(report["checks"]) for report in evidence["browserReports"])
    require(totals["nodeTests"] == totals["nodePassed"] == node_count, "Node total mismatch")
    require(totals["browserChecks"] == totals["browserPassed"] == browser_count, "Browser total mismatch")
    require(totals["nodeSuites"] == len(evidence["nodeReports"]) and totals["browserSuites"] == len(evidence["browserReports"]) == 12, "Suite total mismatch")
    book = Tracker(input_file)
    notes_before = book.note_cells()
    data = copy.deepcopy(original_data)
    # Preserve actual user edits and sorted row identities from the source workbook.
    for sheet, key in TABLE_KEYS.items():
        observed = book.table_rows(sheet)
        expected_ids = {str(row[0]) for row in data[key]}
        require(len(observed) == len(expected_ids) and {str(row[0]) for _, row in observed} == expected_ids, "Workbook/JSON identity mismatch: " + sheet)
        data[key] = [row for _, row in observed]
    names = {fighter["id"]: fighter["name"] for fighter in metadata["fighters"]}
    stage_names = {stage["id"]: stage["name"] for stage in metadata["stages"]}
    rows = data["features"]
    feature = next(row for row in rows if row[0] == "CQC-24")
    feature[3] = "Partiel"
    feature[5] = "combat/finisher-catalog.mjs / combat/finishers.mjs / combat/render-finishers.mjs"
    feature[6] = "42 présentations de KO, trois par artiste, déclenchées après un vrai KO final ; passage volontaire et mouvements réduits."
    feature[7] = "Tableaux procéduraux d'illustrations existantes. Dessins dédiés, voix et fidélité canonique 1:1 restent à produire ou vérifier."
    upsert(rows, ["PRE-21", "Présentation", "Ambiances sonores propres aux arènes", "Implémenté", "P1",
                  "combat/audio-ambiences.mjs / combat/audio.mjs",
                  "Douze compositions d'ambiance originales, volume indépendant, arrêt à la pause et changement propre d'arène.",
                  "Synthèse locale originale ; aucun son de la série ni mixage validé sur matériel physique.", ""])
    for row in rows:
        if row[0] == "PRO-05":
            row[7] = "Versions prises en charge : " + ", ".join(metadata["replayVersions"]) + ". Les règles de simulation restent versionnées."
        if row[0] == "PRD-01":
            row[6] = "Régénérer le classeur et les données, puis publier les quatre sorties 0.7 avec sauvegardes et restauration sur échec."
            row[7] = "Le classeur, les données, la vérification et les preuves 0.7 sont préparés ensemble ; leur remplacement n’est pas simultanément atomique. Récupération après arrêt brutal manuelle."
        if row[0] == "PRD-04":
            row[5] = "docs/combat-qa-evidence-0.7.0.json"
            row[7] = "CI 0.7 et historique 0.6 séparés. Les anciennes captures ne sont pas réestampillées comme nouvel essai."
        if row[0] in ("PRD-01", "PRD-12") and "scripts/build-combat-workbook-delta.py" not in row[5]:
            row[5] += " / scripts/build-combat-workbook-delta.py"
    production = data["production"]
    for entry in metadata["finishers"]:
        beats = "\n".join(str(beat["frame"]) + " f · " + beat["title"] + " : " + beat["description"] for beat in entry["beats"])
        upsert(production, ["FIN-" + entry["id"], "Finition visuelle", names[entry["fighterId"]], entry["title"],
                            "Implémenté", "P1", "combat/finisher-catalog.mjs / combat/finishers.mjs / combat/render-finishers.mjs",
                            str(entry["durationFrames"]) + " frames de présentation ; trois tableaux.\n" + beats,
                            entry["adaptation"] + "\nTravail artistique restant : " + entry["remainingArtWork"] +
                            "\nRéférences à comparer : " + ", ".join(entry["sourceIds"]), ""])
    for stage_id, ambience in metadata["ambiences"].items():
        upsert(production, ["ART-" + stage_id + "-ambience", "Arène", stage_names[stage_id], "Ambiance sonore",
                            "Implémenté", "P2", "combat/audio-ambiences.mjs / combat/audio.mjs",
                            ambience["title"] + " · " + str(ambience["periodSeconds"]) + " s · " + str(len(ambience["layers"])) + " couches",
                            ambience["description"] + " " + ambience["provenance"] + " Mixage sur appareils physiques à vérifier.", ""])
    for identifier, label in [("trap", "Piège"), ("ko", "KO")]:
        require(identifier in metadata["effects"], "Missing sound effect: " + identifier)
        upsert(production, ["SFX-" + identifier, "Audio", "Commun", label, "Implémenté", "P1", "combat/audio.mjs",
                            "Motif synthétique distinct " + identifier, "Synthèse originale ; volume et déclenchement vérifiés par CI. Écoute sur matériel réel à poursuivre.", ""])
        upsert(production, ["SYNTH-" + identifier, "Motif sonore", "Commun", label, "Implémenté", "P1", "combat/audio.mjs",
                            "Motif original disponible, indépendant de la musique.", "Enveloppe et ressources bornées ; arrêt à la pause.", ""])
    active_ids = {row[0] for row in fresh_qa}
    for row in data["qa"]:
        if row[0] not in active_ids and row[3] in ("Réussi", "Échec") and not row[1].startswith("Historique "):
            version = "0.7.0" if str(row[0]).startswith("CI07-") else "0.6.0"
            row[1] = "Historique " + version + " · " + row[1]
            row[6] = "Historique " + version + " ; ne constitue pas une réexécution de cette CI.\n" + row[6]
    for row in fresh_qa:
        upsert(data["qa"], row)
    new_sources = [
        {"id":"finishers-07","title":"Encore — 42 présentations de KO","kind":"Création de fan-game","url":"combat/finisher-catalog.mjs","scope":metadata["notice"]},
        {"id":"audio-ambiences-07","title":"Encore — douze ambiances sonores","kind":"Synthèse originale","url":"combat/audio-ambiences.mjs","scope":"Compositions originales propres aux arènes ; aucune captation de la série ni validation du mixage physique."},
        {"id":"ci-evidence-07","title":"Encore — preuves de CI 0.7","kind":"Exécutions automatiques","url":"docs/combat-qa-evidence-0.7.0.json","scope":"Rapports de processus, sources SHA-256 et assertions réellement exécutées. L'historique 0.6 reste dans son fichier original."},
    ]
    source_map = {source["id"]: source for source in data["sources"]}
    for source in new_sources:
        source_map[source["id"]] = source
    data["sources"] = list(source_map.values())
    data["version"] = "0.7.0"; data["asOf"] = metadata["contentDate"]
    data["counts"].update(metadata["counts"])
    data["counts"].update(features=len(rows), production=len(production), scenarios=len(data["scenarios"]), qa=len(data["qa"]))
    data["qaSummary"] = {status: sum(row[3] == status for row in data["qa"]) for status in QA_STATUS}
    data["qaSummaryScope"] = "Historique conservé et cas CI 0.7 ; ces lignes ne sont pas toutes des tests indépendants de la version courante."
    data["currentQa"] = {"gameVersion":"0.7.0","sourceCommit":evidence["sourceCommit"],"runUrl":evidence.get("runUrl"),
                         "totals":totals,"rowIds":sorted(active_ids),"evidence":"docs/combat-qa-evidence-0.7.0.json"}
    data["historicalQaRows"] = len(data["qa"]) - len(active_ids)
    for sheet, key in TABLE_KEYS.items():
        book.sync_table(sheet, data[key])
    book.sync_table("Références", [[s["id"],s["title"],s["kind"],s["url"],s["scope"]] for s in data["sources"]])
    summary = "Synthèse"
    book.put(summary,"H2","Version 0.7.0 · " + metadata["contentDate"])
    book.put(summary,"H13",str(node_count) + " tests Node · CI 0.7")
    book.put(summary,"H14",str(browser_count) + " contrôles Chromium · CI 0.7")
    book.put(summary,"H15",str(data["historicalQaRows"]) + " lignes historiques / revues conservées")
    book.put(summary,"H16","Les lignes CI07 identifient les essais de cette version.")
    book.put(summary,"A22","Historique et CI documentés")
    cached = {}
    def formula(cell, expression, value):
        book.put(summary,cell,value,expression); cached[cell] = value
    for cell,key,sheet in [("B7","fighters","Combattants"),("B8","moves","Techniques"),("B9","stages","Arènes"),("B10","atlas","Atlas")]:
        formula(cell,"COUNTA('" + sheet + "'!A6:A" + str(book.tables[sheet]["end"]) + ")",data["counts"][key])
    formula("B11","COUNTIFS('Atlas'!C6:C" + str(book.tables["Atlas"]["end"]) + ',"Variante visuelle")',data["counts"]["variants"])
    for number,sheet,key,index in [(15,"Fonctionnalités","features",3),(16,"Production","production",4),(17,"Scénarios","scenarios",7),(18,"Atlas","atlas",4)]:
        end=book.tables[sheet]["end"]; letter=column(index+1)
        for c,status in enumerate(STATUS,2):
            formula(column(c)+str(number),"COUNTIFS('"+sheet+"'!"+letter+"$6:"+letter+"$"+str(end)+","+column(c)+"$14)",sum(row[index]==status for row in data[key]))
        formula("F"+str(number),"COUNTA('"+sheet+"'!A6:A"+str(end)+")",len(data[key]))
    for c,status in enumerate(QA_STATUS,2):
        formula(column(c)+"22","COUNTIFS('QA'!D6:D"+str(book.tables["QA"]["end"])+","+column(c)+"21)",data["qaSummary"][status])
    formula("F22","COUNTA('QA'!A6:A"+str(book.tables["QA"]["end"])+")",len(data["qa"]))
    end=book.tables["Production"]["end"]; scenario_end=book.tables["Scénarios"]["end"]
    def count_production(domain):
        return sum(row[1]==domain for row in production)
    pb = "'Production'!B6:B" + str(end)
    pd = "'Production'!D6:D" + str(end)
    pe = "'Production'!E6:E" + str(end)
    sb = "'Scénarios'!B6:B" + str(scenario_end)
    formula("H19", f'''COUNTIFS({sb},"Route individuelle")&" routes et "&COUNTIFS({pb},"Tableau d’histoire")&" tableaux"''',
            str(sum(row[1]=="Route individuelle" for row in data["scenarios"]))+" routes et "+str(count_production("Tableau d’histoire"))+" tableaux")
    formula("H20", f'''COUNTIFS({pb},"Briefing illustré")&" briefings de rencontre"''',str(count_production("Briefing illustré"))+" briefings de rencontre")
    formula("H21", f'''COUNTIFS({pb},"Arène",{pd},"Musique de l’arène")&" thèmes musicaux d’arènes"''',str(sum(row[1]=="Arène" and row[3]=="Musique de l’arène" for row in production))+" thèmes musicaux d’arènes")
    for cell,domain,suffix in [("H22","Motif sonore"," motifs sonores synthétiques"),("H23","Présentation individuelle"," séquences de présentation"),
                               ("H24","Animation d’arène"," ambiances visuelles animées"),("H25","Costume"," costumes redessinés"),("H31","Finition visuelle"," présentations de KO")]:
        formula(cell,f'''COUNTIFS({pb},"{domain}")&"{suffix}"''',str(count_production(domain))+suffix)
    formula("H32", f'''COUNTIFS({pb},"Arène",{pd},"Ambiance sonore",{pe},"Implémenté")&" ambiances sonores originales"''',str(len(metadata["ambiences"]))+" ambiances sonores originales")
    output.mkdir(parents=True,exist_ok=True)
    baseline = {"gameVersion":original_data["version"],"workbookSHA256":digest(book.original),
                "trackerDataSHA256":digest(data_file.read_bytes()),"verificationSHA256":digest(verification_file.read_bytes()),
                "historicalEvidencePath":"docs/combat-qa-evidence.json","historicalEvidenceSHA256":file_digest("docs/combat-qa-evidence.json")}
    with tempfile.TemporaryDirectory(prefix=".encore-07-",dir=output) as temporary:
        temporary=Path(temporary); final_xlsx=temporary/"DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx"
        book.write(final_xlsx)
        reopened=Tracker(final_xlsx)
        require(reopened.note_cells()==notes_before,"A user note, formula or note cell style changed")
        for sheet,key in TABLE_KEYS.items():
            expected={str(row[0]):row for row in data[key]}
            actual={str(row[0]):row for _,row in reopened.table_rows(sheet)}
            require(actual==expected,"Workbook/JSON round trip mismatch: "+sheet)
        for cell,value in cached.items():
            require(reopened.value(reopened.cell(summary,cell))==value,"Summary cache mismatch: "+cell)
        require(reopened.parts["xl/styles.xml"]==book.parts["xl/styles.xml"],"Workbook styles changed")
        unchanged=[part for part in book.parts if part not in book.changed]
        require(all(reopened.parts[part]==book.parts[part] for part in unchanged),"Unedited OOXML part changed")
        formula_count=0; errors=[]
        for sheet in reopened.sheets:
            for reference,cell in reopened.cells(sheet).items():
                if cell.find(TAG("f")) is not None:
                    formula_count+=1
                    if cell.attrib.get("t") == "e": errors.append(sheet+"!"+reference)
        require(not errors,"Cached formula errors: "+", ".join(errors))
        native=[]
        for sheet,table in reopened.tables.items():
            style=table["xml"].find(TAG("tableStyleInfo"))
            native.append({"sheet":sheet,"name":table["xml"].attrib["name"],"rows":table["end"]-5,
                           "style":style.attrib.get("name") if style is not None else None,
                           "filter":table["xml"].find(TAG("autoFilter")) is not None})
        source_digests=dict(evidence["runtimeSourceHashes"])
        for report in evidence["nodeReports"]+evidence["browserReports"]:
            source_digests[report["file"]]=report["sourceSha256"]
        for filename in ["scripts/build-combat-workbook-delta.py","scripts/build-combat-workbook.mjs","scripts/workbook-publication.mjs","docs/combat-qa-evidence.json"]:
            source_digests[filename]=file_digest(filename)
        for source in metadata["artFiles"]:
            relative=str((root/"combat"/source).resolve().relative_to(root))
            source_digests[relative]=file_digest(relative)
        source_digests["docs/combat-qa-evidence-0.7.0.json"]=digest(evidence_bytes)
        verification={"schema":"encore-workbook-delta/v1","gameVersion":"0.7.0","createdAt":datetime.now(timezone.utc).isoformat(),
          "sourceCommit":evidence["sourceCommit"],"counts":data["counts"],"qaSummary":data["qaSummary"],"qaSummaryScope":data["qaSummaryScope"],
          "currentQa":data["currentQa"],"historicalQaRows":data["historicalQaRows"],"baseline":baseline,
          "workbookSHA256":digest(final_xlsx.read_bytes()),"nativeTables":native,"sourceDigests":source_digests,
          "formulaErrors":len(errors),"formulas":{"count":formula_count,"summaryCachedValuesChecked":len(cached),
            "generalRecalculation":False,"excelRecalculateOnOpen":True,"desktopExcelOpened":False},
          "notesPreservation":{"preserved":len(notes_before),"identityAndCellXMLPreserved":True,"roundTripPassed":True},
          "stylesPreserved":True,"untouchedPartsPreserved":len(unchanged),"renderedSheets":[],
          "publication":"Existing rollback-capable publisher; group is not simultaneously atomic and sudden shutdown recovery remains manual.",
          "limitations":["No new visual spreadsheet render or desktop Excel opening in this CI.",
            "Known summary formulas have checked cached values; arbitrary user formulas are preserved and recalculated by Excel on opening.",
            "Historical 0.6 QA is retained and labelled, never promoted to current 0.7 execution.",
            "Procedural finishers are integrated; dedicated drawings, voices and canonical 1:1 comparison remain incomplete.",
            "Sound synthesis is original; final mix on physical hardware remains unverified."]}
        for filename,value in [("combat-tracker-data.json",data),("combat-workbook-verification.json",verification)]:
            (temporary/filename).write_bytes(dump_json(value))
        (temporary/"combat-qa-evidence-0.7.0.json").write_bytes(evidence_bytes)
        publication={"module":str(root/"scripts/workbook-publication.mjs"),"outputDirectory":str(output),
          "files":[{"source":str(temporary/name),"name":name} for name in ["DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx","combat-tracker-data.json","combat-workbook-verification.json","combat-qa-evidence-0.7.0.json"]]}
        subprocess.run([node,"--input-type=module","-e",NODE_PUBLISH],input=json.dumps(publication),text=True,cwd=root,check=True)
    require(file_digest("docs/combat-qa-evidence.json")==baseline["historicalEvidenceSHA256"],"Historical evidence was modified")
    print(json.dumps({"gameVersion":"0.7.0","counts":data["counts"],"currentCI":totals,"workbook":str(output/"DIGITAL_CIRCUS_COMBAT_TRACKER.xlsx")},ensure_ascii=False))

if __name__ == "__main__":
    main()
