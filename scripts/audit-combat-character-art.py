"""Inventory the individual character artwork without modifying any image.

Use --provenance-dir for optional native-generation records from the production
session. Publication and coverage come from the actual runtime modules.
"""
from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import subprocess

from PIL import Image


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[1])
parser.add_argument("--provenance-dir", type=Path)
parser.add_argument("--comparison-base", default="HEAD", help="Git commit used to count newly added artwork paths")
parser.add_argument("--output", type=Path, required=True)
args = parser.parse_args()
root = args.repo_root.resolve()


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def portable(value: str) -> str:
    """Keep repository paths and source generation IDs, not scratch locations."""
    for marker in ("CainOS/", "generated_images/", "new-art/"):
        if marker in value:
            tail = value.split(marker, 1)[1]
            return tail if marker == "CainOS/" else marker + tail
    return value


def records(value):
    if isinstance(value, dict):
        if isinstance(value.get("id"), str):
            yield value
        for child in value.values():
            if isinstance(child, (dict, list)):
                yield from records(child)
    elif isinstance(value, list):
        for child in value:
            yield from records(child)


generation_by_hash = defaultdict(list)
if args.provenance_dir:
    for filename in sorted(args.provenance_dir.rglob("*.json")):
        try:
            document = json.loads(filename.read_text())
        except (OSError, ValueError):
            continue
        for item in records(document):
            candidates = set()
            # A replaced output or input reference is not evidence that the
            # current prompt generated that older image. Read output fields only.
            for key in ("output", "outputPath", "sourceGeneratedImage", "outputHint", "source"):
                value = item.get(key)
                if isinstance(value, str):
                    candidates.update(re.findall(r"(/[^\s\"']*/generated_images/[^\s\"']+\.png)", value))
            for candidate in candidates:
                source = Path(candidate)
                if not source.is_file():
                    continue
                refs = []
                for key in ("reference", "ref", "referencePath", "referencePaths"):
                    val = item.get(key, [])
                    for ref in ([val] if isinstance(val, str) else val if isinstance(val, list) else []):
                        if isinstance(ref, str):
                            refs.append(portable(ref))
                row = {
                    "generationId": source.stem,
                    "method": item.get("method") or item.get("generator") or "image_gen.imagegen",
                    "prompt": item.get("prompt") or item.get("generationPrompt"),
                    "referencePaths": list(dict.fromkeys(refs)),
                    "promptAttribution": item.get("promptAttribution"),
                    "recoveryNote": item.get("recoveryNote") or item.get("provenanceRecovery") or item.get("provenanceNote"),
                    "visualReview": item.get("visualReview") or item.get("qa", {}).get("visualReview") or item.get("qa", {}).get("visualReviewNotes"),
                    "edgeReviewDisposition": item.get("qa", {}).get("alpha12EdgeDisposition"),
                }
                row = {key: val for key, val in row.items() if val is not None and val != []}
                h = digest(source)
                if row not in generation_by_hash[h]:
                    generation_by_hash[h].append(row)

catalog_code = """
import { FIGHTERS, VARIANTS, ARCHIVE } from './combat/data.mjs';
import { ART_FILES, ART_VERSION } from './combat/offline-manifest.mjs';
import { archiveSelectionParts } from './combat/illustrations.mjs';
console.log(JSON.stringify({
 fighters: FIGHTERS.map(x => x.id), variants: VARIANTS.map(x => x.id),
 archive: ARCHIVE.map(x => ({id:x.id,name:x.name,parts:archiveSelectionParts(x.id).map(p=>p.id)})),
 published: ART_FILES.map(x=>x.replace(/^\\.\\.\\//,'')), artVersion: ART_VERSION
}));
"""
catalog = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", catalog_code], cwd=root, text=True))
comparison_base = subprocess.check_output([
    "git", "rev-parse", args.comparison_base + "^{commit}"
], cwd=root, text=True).strip()
base_paths = set(subprocess.check_output([
    "git", "ls-tree", "-r", "--name-only", comparison_base, "--", "assets/encore/selection", "assets/encore/stance", "assets/encore/poses"
], cwd=root, text=True).splitlines())
published = set(catalog["published"])
slots = ["selection", "stance", "intro", "attack", "heavy", "hit", "walk", "jump", "crouch", "victory", "defeat"]
actors = set(catalog["fighters"] + catalog["variants"])
files = {}
missing = []
for entry in catalog["archive"]:
    required = slots if entry["id"] in actors else ["selection"]
    for slot in required:
        subjects = entry["parts"] or [entry["id"]] if slot == "selection" else [entry["id"]]
        for subject in subjects:
            stem = f"assets/encore/{slot}/{subject}" if slot in ("selection", "stance") else f"assets/encore/poses/{subject}/{slot}"
            chosen = next((stem + ext for ext in (".webp", ".png") if stem + ext in published), None)
            if chosen is None:
                missing.append({"archiveId": entry["id"], "subjectId": subject, "slot": slot})
                continue
            files.setdefault(chosen, {"archiveId": entry["id"], "subjectId": subject, "slot": slot})

entries = []
problems = []
for relative, identity in sorted(files.items()):
    filename = root / relative
    with Image.open(filename) as im:
        mode = im.mode
        width, height = im.size
        rgba = im.convert("RGBA")
        alpha = rgba.getchannel("A")
        bbox = alpha.point(lambda x: 255 if x >= 12 else 0).getbbox()
        histogram = alpha.histogram()
        if bbox is None:
            problems.append({"file": relative, "problem": "empty_visible_alpha"})
        if mode != "RGBA" or histogram[0] == 0:
            problems.append({"file": relative, "problem": "no_native_transparent_rgba"})
        margins = None if bbox is None else [bbox[0], bbox[1], width - bbox[2], height - bbox[3]]
        # This is a review flag, not an automatic claim of clipped anatomy.
        if margins is not None and min(margins) == 0:
            problems.append({"file": relative, "problem": "visible_pixels_touch_canvas_edge"})
        h = digest(filename)
        provenance = generation_by_hash.get(h, [])
        entries.append({**identity, "file": relative, "sha256": h,
            "bytes": filename.stat().st_size, "dimensions": [width, height], "mode": mode,
            "alphaExtrema": list(alpha.getextrema()), "visibleBoundsAlpha12": list(bbox) if bbox else None,
            "transparentPixelRatio": round(histogram[0] / (width * height), 6), "visibleMargins": margins,
            "newPathComparedWithBranchHead": relative not in base_paths,
            "nativeGenerationRecords": provenance,
            "provenanceStatus": "native_output_hash_matched" if provenance else "existing_or_recovered_project_art",
        })

hashes = defaultdict(list)
for entry in entries:
    hashes[entry["sha256"]].append(entry["file"])
report = {
    "schema": "encore-character-art-inventory/v1",
    "createdAt": datetime.now(timezone.utc).isoformat(),
    "comparisonBaseCommit": comparison_base,
    "artVersion": catalog["artVersion"],
    "method": "Read-only file audit; runtime catalog and offline manifest choose the published assets. Pillow inspects pixels without modifying images.",
    "limitations": [
        "Counts describe individual static drawings, not full animation cycles or distinct canonical identities.",
        "Transparent margins and hashes do not establish visual fidelity or one-character composition; separate visual review is required.",
        "Dimensions are native file dimensions. No 4K, upscaling or canonical 1:1 certification is inferred.",
        "Generation records are linked only when the original native PNG hash equals the published file hash.",
    ],
    "counts": {
        "archiveEntries": len(catalog["archive"]), "fighters": len(catalog["fighters"]),
        "variants": len(catalog["variants"]), "namedCharacterArtFiles": len(entries),
        "bySlot": dict(Counter(x["slot"] for x in entries)), "bytes": sum(x["bytes"] for x in entries),
        "nativeGenerationHashMatches": sum(bool(x["nativeGenerationRecords"]) for x in entries),
        "newPathsComparedWithBranchHead": sum(x["newPathComparedWithBranchHead"] for x in entries),
        "missingSlots": len(missing), "reviewFlags": len(problems),
    },
    "missing": missing, "reviewFlags": problems,
    "identicalFiles": [paths for paths in hashes.values() if len(paths) > 1],
    "files": entries,
}
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"output": str(args.output), **report["counts"]}, ensure_ascii=False))
