#!/usr/bin/env python3
"""Install the reviewed Queenie base pairs without touching artwork or offline data.

Run after all 36 native PNGs exist and have been visually inspected:
  python scripts/install-combat-base-continuation-20261125-b.py --reviews review.json

Repeat --reviews for separate reviewers. Each JSON contains an ``appearances``
array of {id, status: "reviewed", sha256: {selection, stance},
reviewedFiles: {selection, stance}, observations: [...], issues: [],
nativeFacing: 1|-1}. Paths are relative to the repository. Reviews must identify
the exact inspected bytes; this installer never creates a visual approval.
Use --check-only to validate without replacing the runtime module.
"""

import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
FOLDER = Path("docs/art-generation/base-sprites-20261125-b")
TARGET = ROOT / "combat/base-sprite-continuation-20261125-b.mjs"
SERIES = ("gaslightdistrict", "knightsofguinevere", "gameoverse",
          "lackadaisy", "smg4", "ultrajumpmania")
STYLES = ("hommage", "resident", "fusion")
SLOTS = ("selection", "stance")
EXPECTED = [f"glitch-{series}-queenie-{style}"
            for series in SERIES for style in STYLES]
BASELINE_SHA256 = "9a45765d00dc4e9b650cbb60ab045c954fd59101100aaeb5e122f6f47a0f41ce"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def read_json(file):
    return json.loads(file.read_text(encoding="utf-8"))


def specs():
    first = read_json(ROOT / FOLDER / "queenie-atmospheres/specs.json")
    first = first if isinstance(first, list) else first["appearances"]
    second = read_json(ROOT / FOLDER / "queenie-other-worlds/appearance-specs.json")
    rows = first + second
    require(len(rows) == 18, "The two design specs must contain exactly 18 families")
    by_id = {row["id"]: row for row in rows}
    require(set(by_id) == set(EXPECTED), "Unexpected, missing or duplicate Queenie design ID")
    return [by_id[identifier] for identifier in EXPECTED]


def native_png(relative):
    file = ROOT / relative
    require(file.is_file(), f"Missing native PNG: {relative}")
    content = file.read_bytes()
    with Image.open(file) as image:
        require(image.format == "PNG" and image.mode == "RGBA", f"Expected native RGBA PNG: {relative}")
        image.load()
        alpha = image.getchannel("A")
        lo, hi = alpha.getextrema()
        require(lo == 0 and hi > 12, f"Real transparency and visible pixels required: {relative}")
        bounds = alpha.point(lambda value: 255 if value >= 12 else 0).getbbox()
        require(bounds is not None, f"Empty sprite: {relative}")
        width, height = image.size
        require(min(width, height) >= 512, f"Unexpectedly small source image: {relative}")
        require(0 < bounds[0] < bounds[2] < width and 0 < bounds[1] < bounds[3] < height,
                f"Visible artwork meets the canvas edge: {relative}; review framing before installation")
    return {"file": relative, "sha256": sha256(content), "bytes": len(content),
            "width": width, "height": height, "bounds": list(bounds)}


def visual_reviews(files):
    result = {}
    for name in files:
        file = Path(name)
        file = file if file.is_absolute() else ROOT / file
        file = file.resolve()
        require(file.is_relative_to(ROOT), "Save review evidence inside the repository before installing it")
        data = read_json(file)
        rows = data if isinstance(data, list) else data["appearances"]
        for row in rows:
            identifier = row["id"]
            require(identifier in EXPECTED and identifier not in result,
                    f"Unexpected or duplicated visual review: {identifier}")
            require(row.get("status") == "reviewed", f"Visual review still pending: {identifier}")
            require(row.get("issues") == [], f"Resolve recorded visual issues first: {identifier}")
            require(row.get("nativeFacing") in (-1, 1), f"Record inspected native orientation: {identifier}")
            require(isinstance(row.get("observations"), list) and row["observations"]
                    and all(isinstance(value, str) and value.strip() for value in row["observations"]),
                    f"Record actual visual observations: {identifier}")
            result[identifier] = {**row, "captureId": file.relative_to(ROOT).as_posix()}
    require(set(result) == set(EXPECTED),
            "Missing explicit visual reviews for: " + ", ".join(identifier for identifier in EXPECTED if identifier not in result))
    return result


def check_prefix():
    baseline_bytes = (ROOT / FOLDER / "integration-baseline-522.json").read_bytes()
    require(sha256(baseline_bytes) == BASELINE_SHA256, "The frozen 522-costume baseline changed")
    baseline = json.loads(baseline_bytes)
    source = """
import {createHash} from 'node:crypto';
import {FIGHTERS, COSTUMES, CROSSOVER_COSTUMES} from './combat/data.mjs';
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
console.log(JSON.stringify({fighterIds:FIGHTERS.map(f=>f.id),
 costumeIds:COSTUMES.slice(0,522).map(c=>c.id),
 fightersSHA256:sha(FIGHTERS),costumesSHA256:sha(COSTUMES.slice(0,522)),
 crossoversSHA256:sha(CROSSOVER_COSTUMES.slice(0,414))}));
"""
    run = subprocess.run(["node", "--input-type=module"], input=source, cwd=ROOT,
                         text=True, capture_output=True, timeout=30, check=True)
    current = json.loads(run.stdout)
    for field, value in current.items():
        require(value == baseline[field], f"Preserved catalogue prefix changed: {field}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--reviews", action="append", default=[], help="JSON evidence from actual image inspection; repeatable")
    parser.add_argument("--check-only", action="store_true")
    args = parser.parse_args()
    designs = specs()
    missing = [entry["paths"][slot] for entry in designs for slot in SLOTS
               if not (ROOT / entry["paths"][slot]).is_file()]
    require(not missing, f"All 36 PNGs are required; {len(missing)} missing:\n" + "\n".join(missing))
    approved = visual_reviews(args.reviews)
    check_prefix()
    definitions, reviews, all_assets = [], {}, []
    for design in designs:
        identifier = design["id"]
        series, style = design["series"], design["style"]
        require(design["fighterId"] == "queenie" and identifier == f"glitch-{series}-queenie-{style}",
                f"Unexpected owner or design key: {identifier}")
        directory = f"assets/encore/crossovers/{series}/queenie/{style}"
        expected_files = {slot: f"{directory}/{slot}.png" for slot in SLOTS}
        require(design["paths"] == expected_files, f"Unexpected source paths: {identifier}")
        review = approved[identifier]
        require(review.get("reviewedFiles") == expected_files, f"The visual review identifies other files: {identifier}")
        assets = {slot: native_png(expected_files[slot]) for slot in SLOTS}
        hashes = {slot: assets[slot]["sha256"] for slot in SLOTS}
        require(review.get("sha256") == hashes, f"Image bytes changed since visual inspection: {identifier}")
        require(hashes["selection"] != hashes["stance"], f"Portrait and stance must be separately authored: {identifier}")
        definition = {key: design[key] for key in ("id", "fighterId", "name", "sourceId", "sourceTitle", "sourceUrl", "sourceUrls", "sourceKind", "scope", "traits")}
        definition.update({"directory": "../" + directory, "introducedOn": "2026-11-25",
                           "nativeFacing": review["nativeFacing"], "crossover": {"series": series, "style": style},
                           "sourceScope": design.get("sourceScope", "Références d’univers documentées ; cette apparition de Queenie est une création originale pour Encore."),
                           "canonicalCostumeClaim": False, "visual": {"maxIllustratedWidth": 220}})
        definitions.append(definition)
        reviews[identifier] = {"status": "verified-base-files", "sha256": hashes,
            "captureId": review["captureId"], "visibleTraits": review["observations"],
            "identityEvidence": design["sourceTitle"],
            "framing": "Les deux silhouettes restent contenues dans leurs cadres au seuil alpha 12 ; bornes mesurées à l’installation.",
            "transparency": "PNG RGBA natifs ; transparence réelle vérifiée sans retouche des pixels.",
            "proportions": "Échelle uniforme et orientation native déclarée ; le rendu en jeu demande sa vérification séparée.",
            "scope": design["scope"], "sourceUrls": design["sourceUrls"], "issues": []}
        all_assets.extend(assets.values())
    require(len({asset["sha256"] for asset in all_assets}) == 36, "Every one of the 36 files must be distinct")
    content = ("/**\n * Queenie's six remaining crossover collections, 25 November 2026.\n"
               " * Generated by scripts/install-combat-base-continuation-20261125-b.py\n"
               " * from explicit visual reviews and the measured native PNG bytes.\n"
               " * Portrait and static stance only; no animation or simulation changes.\n */\n"
               "export const CONTINUATION_B_BASE_DEFINITIONS = Object.freeze("
               + json.dumps(definitions, ensure_ascii=False, indent=2) + ");\n"
               "export const CONTINUATION_B_BASE_REVIEWS = Object.freeze("
               + json.dumps(reviews, ensure_ascii=False, indent=2) + ");\n")
    if not args.check_only:
        temporary = TARGET.with_suffix(".mjs.installing")
        temporary.write_text(content, encoding="utf-8")
        os.replace(temporary, TARGET)
    print(json.dumps({"mode": "check-only" if args.check_only else "installed",
                      "families": len(definitions), "pngFiles": len(all_assets),
                      "nativeBytes": sum(asset["bytes"] for asset in all_assets),
                      "preservedCostumePrefix": 522, "runtimeModule": TARGET.relative_to(ROOT).as_posix(),
                      "offlineManifestUpdated": False, "canonicalFidelityCertified": False}, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, KeyError, subprocess.SubprocessError) as error:
        print(f"Installation refused: {error}", file=sys.stderr)
        sys.exit(1)
