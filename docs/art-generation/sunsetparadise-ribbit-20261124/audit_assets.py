#!/usr/bin/env python3
"""Read-only PNG/native-byte audit for the thirty-three Ribbit/Sunset slots."""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
DOCS = Path(__file__).resolve().parent
STYLES = ("hommage", "resident", "fusion")
STATES = ("selection", "stance", "intro", "attack", "heavy", "hit", "walk", "jump", "crouch", "victory", "defeat")
records, missing, issues = [], [], []
for style in STYLES:
    for state in STATES:
        rel = f"assets/encore/crossovers/sunsetparadise/ribbit/{style}/{state}.png"
        path = ROOT / rel
        if not path.is_file():
            missing.append(rel)
            continue
        row = {"file": rel, "style": style, "state": state}
        try:
            raw = path.read_bytes()
            row.update(bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest(),
                       sha=hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest())
            with Image.open(path) as im:
                im.load()
                row.update(width=im.width, height=im.height, mode=im.mode, format=im.format)
                if im.mode != "RGBA" or im.format != "PNG":
                    issues.append({"file": rel, "issue": "Expected native RGBA PNG"})
                else:
                    alpha = im.getchannel("A")
                    hist = alpha.histogram()
                    bbox = alpha.point(lambda v: 255 if v >= 12 else 0).getbbox()
                    row.update(alphaZeroFraction=hist[0] / (im.width * im.height),
                               alphaOpaqueFraction=hist[255] / (im.width * im.height),
                               alpha12BBox=bbox,
                               alphaExtrema=alpha.getextrema())
                    if hist[0] == 0 or hist[255] == 0 or bbox is None:
                        issues.append({"file": rel, "issue": "Missing genuine transparent/opaque pixels"})
                    elif bbox[0] <= 0 or bbox[1] <= 0 or bbox[2] >= im.width or bbox[3] >= im.height:
                        issues.append({"file": rel, "issue": "Meaningful alpha touches canvas edge"})
                    if bbox:
                        row["alpha12Margins"] = [bbox[0], bbox[1], im.width-bbox[2], im.height-bbox[3]]
            receipt_path = DOCS / style / (state + ".json")
            receipt = json.loads(receipt_path.read_text())
            native = Path(receipt["native_path"])
            row["native_path"] = str(native)
            row["nativeBytesVerified"] = native.is_file() and native.read_bytes() == raw
            row["fullResultStoreKey"] = receipt["result_store_key"]
            row["tool"] = receipt["tool"]
            row["regeneration_after_executor_loss"] = receipt["regeneration_after_executor_loss"]
            row["byte_identical_to_lost_asset"] = receipt["byte_identical_to_lost_asset"]
            if not row["nativeBytesVerified"]:
                issues.append({"file": rel, "issue": "Native copy not byte-identical or unavailable"})
            if receipt.get("sha256") != row["sha256"]:
                issues.append({"file": rel, "issue": "Receipt SHA-256 differs from runtime file"})
            if receipt.get("transparent_background") is not True or receipt.get("tool") != "image_gen__imagegen":
                issues.append({"file": rel, "issue": "Unexpected generation provenance"})
            row["referenceSHA256"] = {str(Path(p).relative_to(ROOT)) if Path(p).is_relative_to(ROOT) else p:
                                     hashlib.sha256(Path(p).read_bytes()).hexdigest()
                                     for p in receipt.get("references", []) if Path(p).is_file()}
        except Exception as exc:
            issues.append({"file": rel, "issue": str(exc)})
        records.append(row)
groups = {}
for row in records:
    if "sha256" in row:
        groups.setdefault(row["sha256"], []).append(row["file"])
duplicates = [paths for paths in groups.values() if len(paths) > 1]
report = {"date": "2026-11-24", "expected": 33, "present": len(records),
          "complete": len(records) == 33 and not missing and not issues and not duplicates,
          "issues": issues, "duplicate_byte_groups": duplicates, "missing": missing,
          "total_runtime_bytes": sum(r.get("bytes", 0) for r in records), "assets": records}
(DOCS / "asset-audit.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({k:v for k,v in report.items() if k not in ("assets", "missing")}))

