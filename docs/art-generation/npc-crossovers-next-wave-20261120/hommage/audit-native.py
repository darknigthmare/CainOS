"""Audit read-only native sprites and make a clearly separate review contact sheet."""

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageDraw


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
DEFINITION = ROOT / "docs/art-generation/npc-crossovers-next-wave-20261120/definitions/glitch-murderdrones-ribbit-hommage.json"
ARCHIVE = HERE / "attempts/family-01"
CORRECTED_SLOTS = ["selection", "stance", "intro", "attack", "hit", "jump", "crouch", "defeat"]
RETAINED_SLOTS = ["heavy", "walk", "victory"]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def relative(path):
    return str(path.relative_to(ROOT))


definition = json.loads(DEFINITION.read_text())
archive_manifest = json.loads((ARCHIVE / "manifest.json").read_text())
for archived in archive_manifest["files"]:
    assert sha(ROOT / archived["archiveFile"]) == archived["sha256"], "Immutable family archive changed"
slots = definition["requiredSlots"]
entries = []
reference_checks = 0
runtime_copy_checks = 0
sheet = Image.new("RGB", (1280, 1140), "#f3f4f7")
draw = ImageDraw.Draw(sheet)

for index, slot in enumerate(slots):
    receipt_path = HERE / "generated" / f"{slot}.json"
    receipt = json.loads(receipt_path.read_text())
    matching_jobs = []
    for candidate in (HERE / "jobs").glob("*.json"):
        job = json.loads(candidate.read_text())
        if all(job.get(key) == receipt.get(key) for key in ["appearanceId", "slot", "prompt", "referencePaths"]):
            matching_jobs.append(candidate)
    assert len(matching_jobs) == 1, f"Expected exactly one actual job for {slot}"
    job_path = matching_jobs[0]
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
    original_receipt = json.loads((ARCHIVE / "generated" / f"{slot}.json").read_text())
    if slot in RETAINED_SLOTS:
        assert digest == sha(ARCHIVE / "generated" / f"{slot}.png")
        assert receipt["sourceGenerationId"] == original_receipt["sourceGenerationId"]
        assert receipt["prompt"] == original_receipt["prompt"]
        assert receipt["referencePaths"] == original_receipt["referencePaths"]
        allowed_metadata_changes = {"portableReferences", "includedInRuntime"}
        assert {key: value for key, value in receipt.items() if key not in allowed_metadata_changes} == {
            key: value for key, value in original_receipt.items() if key not in allowed_metadata_changes
        }, "A retained receipt changed beyond reference relocation or runtime activation"
        assert original_receipt["includedInRuntime"] is False
        assert isinstance(receipt["includedInRuntime"], bool)
        assert len(receipt["portableReferences"]) == len(original_receipt["portableReferences"])
        for current_ref, old_ref in zip(receipt["portableReferences"], original_receipt["portableReferences"]):
            if old_ref["file"] == relative(HERE / "generated/selection.png"):
                assert current_ref["file"] == relative(ARCHIVE / "generated/selection.png")
                assert current_ref["originalReferencePath"] == old_ref["file"]
                assert current_ref["sha256"] == old_ref["sha256"]
                assert current_ref["bytes"] == old_ref["bytes"]
                assert current_ref["relocationReason"]
            else:
                assert current_ref == old_ref
    else:
        assert slot in CORRECTED_SLOTS
        assert digest != original_receipt["sha256"]
        required_references = [
            relative(ARCHIVE / "generated" / f"{slot}.png"),
            "assets/encore/stance/ribbit.png",
        ]
        assert all(reference in receipt["referencePaths"] for reference in required_references)
        extra_references = [reference for reference in receipt["referencePaths"] if reference not in required_references]
        assert len(extra_references) <= 1
        # A retry may edit a rejected native attempt, while still retaining
        # both the original archived pose and the agreed anatomy reference.
        for reference in extra_references:
            prior_attempt = (ROOT / reference).resolve()
            assert prior_attempt.is_relative_to(HERE / "attempts")
            assert prior_attempt.name == f"{slot}.png"
    for reference in receipt["portableReferences"]:
        path = ROOT / reference["file"]
        assert sha(path) == reference["sha256"]
        assert path.stat().st_size == reference["bytes"]
        reference_checks += 1
    if receipt["includedInRuntime"]:
        target = ROOT / receipt["targetFile"]
        assert target.is_file() and sha(target) == digest
        runtime_copy_checks += 1
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
        "includedInRuntime": receipt["includedInRuntime"],
        "runtimeNativeCopyVerified": bool(receipt["includedInRuntime"]),
        "revisionDisposition": "retained_original_native" if slot in RETAINED_SLOTS else "new_native_harmonization",
        "sourceGenerationId": receipt["sourceGenerationId"],
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
    "revision": {
        "reason": "Original three-lobe hand harmonization for this batch, consistent with its Resident/Fusion selections; no canonical or officially demonstrated anatomy claim.",
        "archivedFamily": {"file": relative(ARCHIVE / "manifest.json"), "sha256": sha(ARCHIVE / "manifest.json")},
        "archivedFilesUnmodified": True,
        "newAcceptedCorrections": len(CORRECTED_SLOTS),
        "rejectedCorrectionAttempts": 1,
        "correctionImageGenerationCalls": 9,
        "retainedOriginalDrawings": len(RETAINED_SLOTS),
        "correctedSlots": CORRECTED_SLOTS,
        "retainedSlots": RETAINED_SLOTS,
        "historicalSeed": {"file": relative(ARCHIVE / "generated/selection.png"), "sha256": sha(ARCHIVE / "generated/selection.png")},
        "retainedReferenceRelocation": "Only portableReferences were relocated to the unchanged archived seed, with originalReferencePath and relocationReason; historical prompts and referencePaths remain unchanged. Subsequent runtime integration changed includedInRuntime to true without changing drawing provenance or image bytes.",
    },
    "includedInRuntime": runtime_copy_checks == len(entries),
    "runtimeNativeCopiesVerified": runtime_copy_checks,
    "runtimeIntegrationStatus": "Runtime copies verified against the native PNG hashes; final Canvas/build evidence belongs to the wave-level reports.",
    "definition": {"file": relative(DEFINITION), "sha256": sha(DEFINITION)},
    "reviewPreview": {"file": relative(preview_path), "sha256": sha(preview_path), "scope": "Derived QA contact sheet only; never a runtime asset"},
    "assets": entries,
}
(HERE / "generation-completion.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"count": report["count"], "bytes": report["totalBytes"], "references": reference_checks, "manifestSHA256": sha(HERE / "generation-completion.json"), "preview": relative(preview_path)}))
