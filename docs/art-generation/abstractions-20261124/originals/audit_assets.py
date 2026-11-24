"""Read-only PNG/provenance audit; never modifies raster assets."""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[4]
DOC = Path(__file__).resolve().parent
IDS = ["originalabstracted" + n for n in ["pomni", "ragatha", "gangle", "kinger", "zooble"]]
STATES = ["selection", "stance", "intro", "attack", "heavy", "hit", "walk", "jump", "crouch", "victory", "defeat"]
rows, missing, issues = [], [], []
for character in IDS:
    for state in STATES:
        path = ROOT / "assets/encore/abstractions" / character / (state + ".png")
        relative = path.relative_to(ROOT).as_posix()
        if not path.is_file():
            missing.append(relative)
            continue
        data = path.read_bytes()
        digest = hashlib.sha256(data).hexdigest()
        with Image.open(path) as im:
            im.load()
            row = {"asset": relative, "bytes": len(data), "sha256": digest, "dimensions": list(im.size), "format": im.format, "mode": im.mode}
            if im.mode != "RGBA":
                issues.append({"asset": relative, "issue": "expected RGBA"})
            else:
                alpha = im.getchannel("A")
                histogram = alpha.histogram()
                box = alpha.point(lambda value: 255 if value >= 12 else 0).getbbox()
                row.update(alpha_zero_fraction=histogram[0] / (im.width * im.height), visible_alpha12_bbox=list(box) if box else None)
                if box:
                    margins = [box[0], box[1], im.width - box[2], im.height - box[3]]
                    row["visible_alpha12_margins_ltrb"] = margins
                    row["minimum_visible_margin_pixels"] = min(margins)
                    if min(margins) <= 0:
                        issues.append({"asset": relative, "issue": "visible alpha reaches canvas edge"})
                else:
                    issues.append({"asset": relative, "issue": "empty visible alpha"})
                if histogram[0] == 0:
                    issues.append({"asset": relative, "issue": "no fully transparent pixels"})
        receipt_path = DOC / character / (state + ".json")
        if receipt_path.is_file():
            receipt = json.loads(receipt_path.read_text())
            native = Path(receipt.get("path") or "")
            row["receipt"] = receipt_path.relative_to(ROOT).as_posix()
            row["native_path"] = str(native)
            row["regeneration_after_executor_loss"] = receipt.get("regeneration_after_executor_loss", False)
            row["survived_executor_loss"] = receipt.get("survived_executor_loss", False)
            row["native_exists"] = native.is_file()
            row["native_sha256_matches"] = native.is_file() and hashlib.sha256(native.read_bytes()).hexdigest() == digest
            if not row["native_sha256_matches"]:
                issues.append({"asset": relative, "issue": "native missing or different bytes"})
        else:
            issues.append({"asset": relative, "issue": "receipt missing"})
        rows.append(row)
hash_groups = {}
for row in rows:
    hash_groups.setdefault(row["sha256"], []).append(row["asset"])
duplicates = [group for group in hash_groups.values() if len(group) > 1]
report = {"date": "2026-11-24", "expected": 55, "present": len(rows), "complete": len(rows) == 55 and not missing, "issues": issues, "duplicate_byte_groups": duplicates, "missing": missing, "total_runtime_bytes": sum(row["bytes"] for row in rows), "assets": rows}
(DOC / "asset-audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({key: report[key] for key in ["expected", "present", "complete", "issues", "duplicate_byte_groups", "total_runtime_bytes"]}, ensure_ascii=False))
