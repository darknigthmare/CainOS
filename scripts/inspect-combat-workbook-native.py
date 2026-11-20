"""Read-only native XLSX extraction and semantic comparison for tracker recovery.

This script never writes an XLSX or XML. Workbook authoring belongs exclusively
to recover-combat-workbook-native.mjs and the primary @oai/artifact-tool runtime.
Unknown features fail closed; native IDs and equivalent string encodings are
normalized, while values, types, formulas, effective styles and rules remain.
"""
import argparse
import hashlib
import json
import posixpath
import re
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
local = lambda tag: tag.rsplit("}", 1)[-1]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def attrs(node, allowed):
    require(set(node.attrib) <= set(allowed),
            f"Unsupported {local(node.tag)} attributes: {set(node.attrib) - set(allowed)}")


def children(node, allowed):
    require({local(n.tag) for n in node} <= set(allowed),
            f"Unsupported {local(node.tag)} children: {[local(n.tag) for n in node]}")


def boolean(value, default=False):
    if value is None:
        return default
    require(value in ("0", "1", "true", "false"), f"Unsupported boolean {value}")
    return value in ("1", "true")


def color(node):
    if node is None:
        return None
    attrs(node, ["rgb"])
    value = node.get("rgb", "").upper()
    require(re.fullmatch(r"(?:FF)?[0-9A-F]{6}", value) is not None,
            f"Unsupported color {node.attrib}")
    return "#" + value[-6:]


def font(node, differential=False):
    children(node, ["name", "sz", "b", "i", "color"])
    value = {} if differential else {"name": "Carlito", "size": 11, "bold": False, "italic": False, "color": None}
    for item in node:
        tag = local(item.tag)
        if tag == "color":
            value["color"] = color(item)
        elif tag in ("b", "i"):
            attrs(item, ["val"])
            value["bold" if tag == "b" else "italic"] = boolean(item.get("val"), True)
        else:
            attrs(item, ["val"])
            value["name" if tag == "name" else "size"] = item.get("val") if tag == "name" else float(item.get("val"))
    return value


def fill(node, differential=False):
    children(node, ["patternFill"])
    p = node.find("m:patternFill", NS)
    if p is None:
        return None
    attrs(p, ["patternType"])
    children(p, ["fgColor", "bgColor"])
    kind = p.get("patternType", "none")
    if differential and kind in ("none", "solid") and len(p) == 1 and local(p[0].tag) == "bgColor":
        return color(p[0])
    if kind in ("none", "gray125"):
        require(len(p) == 0, "Unexpected colors on empty/pattern fill")
        return None if kind == "none" else {"unsupportedPattern": kind}
    require(kind == "solid", f"Unsupported fill pattern {kind}")
    bg = p.find("m:bgColor", NS)
    if bg is not None:
        require(bg.attrib in ({"indexed": "64"}, {}) or
                (differential and color(bg) == color(p.find("m:fgColor", NS))),
                f"Unsupported fill background {bg.attrib}")
    return color(p.find("m:fgColor", NS))


def borders(node):
    attrs(node, [])
    children(node, ["left", "right", "top", "bottom", "diagonal"])
    out = {}
    for item in node:
        attrs(item, ["style"])
        children(item, ["color"])
        style = item.get("style")
        if not style:
            require(len(item) == 0, "Color without a border style")
            continue
        require(local(item.tag) != "diagonal" and style == "thin", "Unsupported border")
        out[local(item.tag)] = {"style": style, "color": color(item.find("m:color", NS))}
    return out


def style_catalog(root):
    children(root, ["numFmts", "fonts", "fills", "borders", "cellStyleXfs", "cellXfs", "cellStyles", "dxfs", "colors"])
    custom = root.find("m:numFmts", NS)
    formats = {0: "General", 2: "0.00", 3: "#,##0"}
    if custom is not None:
        attrs(custom, ["count"])
        for item in custom:
            require(local(item.tag) == "numFmt", "Unexpected number-format record")
            attrs(item, ["numFmtId", "formatCode"])
            number, code = int(item.get("numFmtId")), item.get("formatCode")
            require(number >= 164 and number not in formats and code in {"General", "0.00", "#,##0"},
                    f"Unsupported custom number format {number}: {code}")
            formats[number] = code
    fonts = [font(n) for n in root.find("m:fonts", NS)]
    fills = [fill(n) for n in root.find("m:fills", NS)]
    edges = [borders(n) for n in root.find("m:borders", NS)]
    styles = []
    for xf in root.find("m:cellXfs", NS):
        attrs(xf, ["numFmtId", "fontId", "fillId", "borderId", "xfId", "applyAlignment", "applyNumberFormat", "applyFont", "applyFill", "applyBorder"])
        children(xf, ["alignment"])
        require(int(xf.get("xfId", "0")) == 0, "Unsupported named-style inheritance")
        fmt = int(xf.get("numFmtId", "0"))
        require(fmt in formats, f"Unsupported number format {fmt}")
        align = {"horizontalAlignment": "general", "verticalAlignment": "bottom", "wrapText": False}
        a = xf.find("m:alignment", NS)
        if a is not None:
            attrs(a, ["horizontal", "vertical", "wrapText"])
            align.update(horizontalAlignment=a.get("horizontal", "general"), verticalAlignment=a.get("vertical", "bottom"), wrapText=boolean(a.get("wrapText")))
        styles.append({"font": fonts[int(xf.get("fontId", "0"))], "fill": fills[int(xf.get("fillId", "0"))],
                       "borders": edges[int(xf.get("borderId", "0"))], "numberFormat": formats[fmt], **align})
    differential = []
    dxf_nodes = root.find("m:dxfs", NS)
    for item in dxf_nodes if dxf_nodes is not None else []:
        attrs(item, [])
        children(item, ["font", "fill"])
        d = {}
        if item.find("m:font", NS) is not None:
            d["font"] = font(item.find("m:font", NS), True)
        if item.find("m:fill", NS) is not None:
            d["fill"] = fill(item.find("m:fill", NS), True)
        differential.append(d)
    return styles, differential


def position(address):
    m = re.fullmatch(r"([A-Z]+)([1-9][0-9]*)", address)
    require(m is not None, f"Unsupported address {address}")
    c = 0
    for letter in m[1]:
        c = c * 26 + ord(letter) - 64
    return int(m[2]), c


def range_reference(value):
    require(len(value.split()) == 1, f"Discontiguous ranges need an explicit adapter: {value}")
    parts = value.split(":")
    require(1 <= len(parts) <= 2, f"Unsupported range {value}")
    first, last = parts[0], parts[-1]
    start, end = position(first), position(last)
    require(start[0] <= end[0] and start[1] <= end[1], f"Reversed range {value}")
    return first if first == last else first + ":" + last


def relationships(z, source):
    filename = posixpath.join(posixpath.dirname(source), "_rels", posixpath.basename(source) + ".rels")
    if filename not in z.namelist():
        return {}
    out = {}
    for item in ET.fromstring(z.read(filename)):
        require(item.get("TargetMode") is None, "External relationships are unsupported")
        target = item.get("Target")
        out[item.get("Id")] = {"type": item.get("Type").rsplit("/", 1)[-1],
                               "file": target.lstrip("/") if target.startswith("/") else posixpath.normpath(posixpath.join(posixpath.dirname(source), target))}
    return out


def tree(node):
    return [local(node.tag), sorted(node.attrib.items()), node.text or "", [tree(n) for n in node]]


def table(z, filename):
    t = ET.fromstring(z.read(filename))
    attrs(t, ["id", "name", "displayName", "ref", "headerRowCount", "totalsRowCount", "totalsRowShown"])
    children(t, ["autoFilter", "tableColumns", "tableStyleInfo"])
    require(t.get("name") == t.get("displayName"), "Different table display name")
    require(int(t.get("headerRowCount", "1")) == 1 and int(t.get("totalsRowCount", "0")) == 0 and not boolean(t.get("totalsRowShown")), "Unsupported table headers/totals")
    cols = t.find("m:tableColumns", NS)
    names = []
    for c in cols:
        attrs(c, ["id", "name"])
        require(len(c) == 0, "Calculated or totals table columns need an explicit adapter")
        names.append(c.get("name"))
    af = t.find("m:autoFilter", NS)
    if af is not None:
        attrs(af, ["ref"])
        require(len(af) == 0 and af.get("ref") == t.get("ref"), "Active table filtering needs an explicit adapter")
    style = t.find("m:tableStyleInfo", NS)
    attrs(style, ["name", "showFirstColumn", "showLastColumn", "showRowStripes", "showColumnStripes"])
    require(not boolean(style.get("showFirstColumn")) and not boolean(style.get("showLastColumn")), "Emphasized table edge columns unsupported")
    return {"name": t.get("name"), "range": t.get("ref"), "columns": names, "filter": af is not None,
            "style": style.get("name"), "rowStripes": boolean(style.get("showRowStripes")), "columnStripes": boolean(style.get("showColumnStripes"))}


def extract(filename, directory):
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    manifest = {"schema": "encore-native-workbook-snapshot/v1", "sha256": hashlib.sha256(Path(filename).read_bytes()).hexdigest(), "sheets": []}
    with ZipFile(filename) as z:
        forbidden = [n for n in z.namelist() if any(k in n.lower() for k in ("drawing", "chart", "comment", "pivot", "vbaproject", "externallink", "slicer", "timeline", "calcchain"))]
        require(not forbidden, f"Unsupported native objects: {forbidden}")
        wb = ET.fromstring(z.read("xl/workbook.xml"))
        children(wb, ["sheets"])
        links = relationships(z, "xl/workbook.xml")
        styles, dxfs = style_catalog(ET.fromstring(z.read("xl/styles.xml")))
        manifest["styles"] = styles
        manifest["theme"] = tree(ET.fromstring(z.read("xl/theme/theme1.xml")))
        strings = []
        if "xl/sharedStrings.xml" in z.namelist():
            for s in ET.fromstring(z.read("xl/sharedStrings.xml")):
                children(s, ["t"])
                strings.append("".join(s.itertext()))
        for index, entry in enumerate(wb.find("m:sheets", NS), 1):
            attrs(entry, ["name", "sheetId", "state", "{" + REL + "}id"])
            require(entry.get("state", "visible") == "visible", "Hidden sheets unsupported")
            part = links[entry.get("{" + REL + "}id")]
            require(part["type"] == "worksheet", "Unexpected sheet relationship")
            s = ET.fromstring(z.read(part["file"]))
            attrs(s, [])
            children(s, ["sheetPr", "dimension", "sheetViews", "sheetFormatPr", "cols", "sheetData", "conditionalFormatting", "dataValidations", "pageMargins", "tableParts"])
            info = {"name": entry.get("name"), "widths": {}, "heights": {}, "gridLines": True, "freeze": {"rows": 0, "columns": 0}, "tabColor": None, "tables": [], "validations": [], "rules": [], "cells": []}
            properties = s.find("m:sheetPr", NS)
            if properties is not None:
                attrs(properties, [])
                children(properties, ["tabColor", "outlinePr", "pageSetUpPr"])
                info["tabColor"] = color(properties.find("m:tabColor", NS))
                # The source contains only default empty properties from older writers.
                for p in properties:
                    if local(p.tag) != "tabColor":
                        require(p.attrib in ({}, {"summaryBelow": "1", "summaryRight": "1"}), f"Nondefault sheet property {p.attrib}")
            views = s.find("m:sheetViews", NS)
            if views is not None:
                require(len(views) == 1, "Multiple sheet views unsupported")
                view = views[0]
                attrs(view, ["showGridLines", "workbookViewId"])
                children(view, ["pane"])
                info["gridLines"] = boolean(view.get("showGridLines"), True)
                pane = view.find("m:pane", NS)
                if pane is not None:
                    attrs(pane, ["xSplit", "ySplit", "topLeftCell", "activePane", "state"])
                    require(pane.get("state") == "frozen", "Split panes unsupported")
                    cols, rows = int(pane.get("xSplit", "0")), int(pane.get("ySplit", "0"))
                    require(position(pane.get("topLeftCell")) == (rows + 1, cols + 1), "Scrolled freeze panes unsupported")
                    info["freeze"] = {"rows": rows, "columns": cols}
            fmt = s.find("m:sheetFormatPr", NS)
            attrs(fmt, ["defaultRowHeight", "baseColWidth"])
            require(float(fmt.get("defaultRowHeight", "15")) == 15 and float(fmt.get("baseColWidth", "8")) == 8, "Nondefault sheet dimensions unsupported")
            for c in s.findall("m:cols/m:col", NS):
                attrs(c, ["min", "max", "width", "customWidth"])
                for number in range(int(c.get("min")), int(c.get("max")) + 1):
                    info["widths"][str(number)] = float(c.get("width"))
            for row in s.findall("m:sheetData/m:row", NS):
                attrs(row, ["r", "ht", "customHeight"])
                r = int(row.get("r"))
                if row.get("ht") is not None:
                    info["heights"][str(r)] = float(row.get("ht"))
                for c in row:
                    attrs(c, ["r", "s", "t"])
                    children(c, ["v", "is", "f"])
                    rr, cc = position(c.get("r"))
                    require(rr == r, "Cell row mismatch")
                    native_type = c.get("t", "n")
                    v, inline, f = c.find("m:v", NS), c.find("m:is", NS), c.find("m:f", NS)
                    formula = None
                    if f is not None:
                        attrs(f, [])
                        formula = "=" + (f.text or "")
                    if native_type == "inlineStr":
                        require(inline is not None, "Missing inline string")
                        children(inline, ["t"])
                        kind, value = "string", "".join(inline.itertext())
                    elif native_type in ("str", "s"):
                        kind, value = "string", (v.text or "") if v is not None else ""
                        if native_type == "s":
                            value = strings[int(value)]
                    elif native_type == "n":
                        kind, value = ("blank", None) if v is None or v.text is None else ("number", float(v.text))
                    elif native_type == "b":
                        require(v is not None, "Missing boolean")
                        kind, value = "boolean", boolean(v.text)
                    else:
                        raise ValueError(f"Unsupported cell type {native_type} at {info['name']}!{c.get('r')}")
                    sid = int(c.get("s", "0"))
                    require(not isinstance(styles[sid]["fill"], dict), "Unsupported referenced pattern fill")
                    info["cells"].append([rr, cc, kind, value, formula, sid])
            for validation in s.findall("m:dataValidations/m:dataValidation", NS):
                attrs(validation, ["type", "allowBlank", "showDropDown", "showInputMessage", "showErrorMessage", "sqref"])
                children(validation, ["formula1"])
                require(validation.get("type") == "list", "Only list validation is supported")
                require(all(not boolean(validation.get(a)) for a in ["allowBlank", "showDropDown", "showInputMessage", "showErrorMessage"]), "Nondefault validation flags unsupported")
                rule = validation.find("m:formula1", NS).text
                require(rule.startswith('"') and rule.endswith('"'), "Formula-backed validation needs an explicit adapter")
                info["validations"].append({"range": range_reference(validation.get("sqref")), "values": rule[1:-1].split(",")})
            for group in s.findall("m:conditionalFormatting", NS):
                attrs(group, ["sqref"])
                for rule in group:
                    attrs(rule, ["type", "dxfId", "priority", "operator", "text"])
                    require(rule.get("type") == "containsText" and rule.get("operator") == "containsText" and len(rule) == 0, "Unsupported conditional format")
                    info["rules"].append({"range": range_reference(group.get("sqref")), "text": rule.get("text"), "format": dxfs[int(rule.get("dxfId"))], "priority": int(rule.get("priority"))})
            info["rules"].sort(key=lambda r: r["priority"])
            for priority, rule in enumerate(info["rules"], 1):
                rule["priority"] = priority
            rels = relationships(z, part["file"])
            require(all(v["type"] == "table" for v in rels.values()), "Unexpected worksheet relationships")
            for ref in s.findall("m:tableParts/m:tablePart", NS):
                info["tables"].append(table(z, rels[ref.get("{" + REL + "}id")]["file"]))
            margins = s.find("m:pageMargins", NS)
            info["margins"] = {k: float(v) for k, v in margins.attrib.items()} if margins is not None else {}
            require(info["margins"] == {"left": .7, "right": .7, "top": .75, "bottom": .75, "header": .3, "footer": .3}, "Nondefault page margins unsupported")
            name = f"sheet-{index}.json"
            (directory / name).write_text(json.dumps(info, ensure_ascii=False, separators=(",", ":")) + "\n")
            manifest["sheets"].append({"name": info["name"], "file": name, "cells": len(info["cells"]), "formulas": sum(c[4] is not None for c in info["cells"])})
    (directory / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    return manifest


def compare(expected_dir, actual_dir, report):
    expected_dir, actual_dir = Path(expected_dir), Path(actual_dir)
    e = json.loads((expected_dir / "manifest.json").read_text())
    a = json.loads((actual_dir / "manifest.json").read_text())
    differences, checked = [], 0
    def check(x, y, description):
        if x != y and len(differences) < 30:
            differences.append({"at": description, "expected": x, "actual": y})
    check([s["name"] for s in e["sheets"]], [s["name"] for s in a["sheets"]], "sheet names/order")
    check(e["theme"], a["theme"], "native theme")
    for es, actual_sheet in zip(e["sheets"], a["sheets"]):
        ep, ap = json.loads((expected_dir / es["file"]).read_text()), json.loads((actual_dir / actual_sheet["file"]).read_text())
        for prop in ["widths", "heights", "gridLines", "freeze", "tabColor", "tables", "validations", "rules", "margins"]:
            check(ep[prop], ap[prop], f"{es['name']}/{prop}")
        ec, ac = {(c[0], c[1]): c for c in ep["cells"]}, {(c[0], c[1]): c for c in ap["cells"]}
        check(sorted(ec), sorted(ac), f"{es['name']}/cell addresses")
        for address, cell in ec.items():
            current = ac.get(address)
            if current is None:
                continue
            checked += 1
            check(cell[2:5], current[2:5], f"{es['name']}/{address}/type-value-formula")
            check(e["styles"][cell[5]], a["styles"][current[5]], f"{es['name']}/{address}/effective style")
    result = {"schema": "encore-native-workbook-comparison/v1", "status": "passed" if not differences else "failed", "cellsChecked": checked, "expectedSHA256": e.get("sha256"), "actualSHA256": a.get("sha256"), "differences": differences}
    Path(report).write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    require(not differences, f"Native comparison failed; see {report}")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    modes = parser.add_subparsers(dest="mode", required=True)
    p = modes.add_parser("extract"); p.add_argument("xlsx"); p.add_argument("directory")
    p = modes.add_parser("compare"); p.add_argument("expected"); p.add_argument("actual"); p.add_argument("report")
    args = parser.parse_args()
    if args.mode == "extract":
        result = extract(args.xlsx, args.directory)
        print(json.dumps({"sha256": result["sha256"], "sheets": result["sheets"], "styles": len(result["styles"])}))
    else:
        print(json.dumps(compare(args.expected, args.actual, args.report)))
