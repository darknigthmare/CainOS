"""Audit read-only native sprites and make a clearly separate review contact sheet."""

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
DEFINITION = ROOT / "docs/art-generation/npc-crossovers-next-wave-20261120/definitions/glitch-murderdrones-ribbit-hommage.json"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def relative(path):
    return str(path.relative_to(ROOT))


definition = json.loads(DEFINITION.read_text())
slots = definition["requiredSlots"]
entries = []
reference_checks = 0
sheet = Image.new("RGB", (1280, 1140), "#f3f4f7")
draw = ImageDraw.Draw(sheet)

for index, slot in enumerate(slots):
    receipt_path = HERE / "generated" / f"{slot}.json"
    job_path = HERE / "jobs" / f"{slot}.json"
    receipt = json.loads(receipt_path.read_text())
    png = ROOT / receipt["file"]
    original = Path(receipt["nativeSourceFile"])
    image = Image.open(png)
    alpha = image.getchannel("A")
    bounds = alpha.point(lambda value: 255 if value > 12 else 0).getbbox()
    digest = sha(png)
    assert receipt["status"] == "accepted_native"
    assert receipt["visualReview"]["status"] == "accepted"
    assert receipt["slot"] == slot
    assert receipt["appearanceId"] == definition["id"]
    assert digest == receipt["sha256"] == sha(original)
    assert png.stat().st_size == receipt["bytes"]
    assert sha(DEFINITION) == receipt["definitionSHA256"]
    assert image.mode == "RGBA" and list(image.size) == receipt["dimensions"]
    assert list(bounds) == receipt["alpha12Bounds"]
    assert bounds[0] > 0 and bounds[1] > 0
    assert bounds[2] < image.width and bounds[3] < image.height
    for reference in receipt["portableReferences"]:
        path = ROOT / reference["file"]
        assert sha(path) == reference["sha256"]
        assert path.stat().st_size == reference["bytes"]
        reference_checks += 1
    entries.append({
        "slot": slot,
        "file": relative(png),
        "targetFile": receipt["targetFile"],
        "bytes": png.stat().st_size,
        "sha256": digest,
        "dimensions": list(image.size),
        "alphaExtrema": list(alpha.getextrema()),
        "alpha12Bounds": list(bounds),
        "nativeCopyVerified": True,
        "job": {"file": relative(job_path), "sha256": sha(job_path)},
        "receipt": {"file": relative(receipt_path), "sha256": sha(receipt_path)},
    })
    x, y = (index % 4) * 320, (index // 4) * 380
    tile = Image.new("RGBA", (304, 340))
    checker = ImageDraw.Draw(tile)
    for cy in range(0, 340, 20):
        for cx in range(0, 304, 20):
            color = "#e4e7ed" if (cx // 20 + cy // 20) % 2 else "#ffffff"
            checker.rectangle((cx, cy, cx + 19, cy + 19), fill=color)
    preview = image.copy()
    preview.thumbnail((286, 322), Image.Resampling.LANCZOS)
    tile.alpha_composite(preview, ((304 - preview.width) // 2, (340 - preview.height) // 2))
    sheet.paste(tile.convert("RGB"), (x + 8, y + 30))
    draw.text((x + 12, y + 9), f"{index + 1:02d}  {slot}", fill="#1d2330")

assert len(entries) == 11
assert len({entry["sha256"] for entry in entries}) == 11
preview_path = HERE / "native-alpha-review.png"
sheet.save(preview_path)
report = {
    "schema": "encore-native-family-completion/v1",
    "appearanceId": definition["id"],
    "createdAt": datetime.now(timezone.utc).isoformat(),
    "generationMethod": "image_gen.imagegen",
    "count": len(entries),
    "totalBytes": sum(entry["bytes"] for entry in entries),
    "slots": slots,
    "allNativeCopiesVerified": True,
    "allNativeAlphaPreserved": True,
    "uniqueImageHashes": len({entry["sha256"] for entry in entries}),
    "portableReferenceComparisons": reference_checks,
    "includedInRuntime": False,
    "runtimeIntegrationStatus": "Pending root integration and final Canvas/build evidence",
    "definition": {"file": relative(DEFINITION), "sha256": sha(DEFINITION)},
    "reviewPreview": {"file": relative(preview_path), "sha256": sha(preview_path), "scope": "Derived QA contact sheet only; never a runtime asset"},
    "assets": entries,
}
(HERE / "generation-completion.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"count": report["count"], "bytes": report["totalBytes"], "references": reference_checks, "manifestSHA256": sha(HERE / "generation-completion.json"), "preview": relative(preview_path)}))
