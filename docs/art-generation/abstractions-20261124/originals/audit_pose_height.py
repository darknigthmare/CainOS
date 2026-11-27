"""Read-only native landmark measurements for five runtime pose height factors.

No raster is modified or written. The sole output is pose-height-measurements.json.
Measurements are visual guides, not an assertion of exact skeletal correspondence.
"""
from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json
import math

import numpy as np
from PIL import Image
from scipy import ndimage


DOCS = Path(__file__).resolve().parent
ROOT = DOCS.parents[3]
REPORT = DOCS.parent / "canvas/width-calibration-after.json"
calibration = json.loads(REPORT.read_text())
rois = {
    "originalabstractedpomni": {
        "stance": (835, 480, 1010, 600),
        "intro": (640, 320, 815, 440),
        "hit": (520, 360, 690, 480),
        "victory": (640, 330, 810, 440),
        "heavy": (690, 545, 870, 710),
    },
    "originalabstractedragatha": {
        "stance": (900, 360, 1140, 610),
        "heavy": (680, 410, 890, 620),
    },
}
factors = {
    "originalabstractedpomni": {"intro": 1.45, "hit": 1.40, "victory": 1.55, "heavy": 1.40},
    "originalabstractedragatha": {"heavy": 1.35},
}
records = []
for ident, poses in rois.items():
    stance_estimate = None
    for pose, roi in poses.items():
        file = f"assets/encore/abstractions/{ident}/{pose}.png"
        path = ROOT / file
        raw = path.read_bytes()
        pixels = np.array(Image.open(path).convert("RGBA")).astype(int)
        x0, y0, x1, y1 = roi
        region = pixels[y0:y1, x0:x1]
        red, green, blue, alpha = (region[:, :, k] for k in range(4))
        if ident.endswith("pomni"):
            mask = (((red > 100) & (red - green > 60) & (red - blue > 60)) |
                    ((blue > 100) & (blue - red > 60) & (blue - green > 60))) & (alpha > 200)
            marker = "Horizontal extent of the largest connected saturated red/blue pinwheel pupil"
            threshold = "((R>100 and R-G>60 and R-B>60) or (B>100 and B-R>60 and B-G>60)) and alpha>200"
        else:
            mask = (blue > 90) & (blue - red > 40) & (blue - green > 10) & (alpha > 200)
            marker = "Vertical extent (long axis) of the largest connected blue face-button component"
            threshold = "B>90 and B-R>40 and B-G>10 and alpha>200"
        labels, count = ndimage.label(mask)
        populations = np.bincount(labels.ravel())
        populations[0] = 0
        label = int(populations.argmax())
        ys, xs = np.where(labels == label)
        marker_box = [int(xs.min() + x0), int(ys.min() + y0),
                      int(xs.max() + x0 + 1), int(ys.max() + y0 + 1)]
        ay, ax = np.where(pixels[:, :, 3] >= 12)
        alpha_box = [int(ax.min()), int(ay.min()), int(ax.max() + 1), int(ay.max() + 1)]
        source_length = marker_box[2] - marker_box[0] if ident.endswith("pomni") else marker_box[3] - marker_box[1]
        source_height = alpha_box[3] - alpha_box[1]
        if pose == "stance":
            entry = next(row for row in calibration["stances"] if row["id"] == ident)
            prior_height, prior_width = entry["visibleHeight"], entry["visibleWidth"]
        else:
            entry = next(row for row in calibration["actions"] if row["id"] == ident and row["pose"] == pose)
            prior_height, prior_width = entry["afterHeight"], entry["afterWidth"]
        assert hashlib.sha256(raw).hexdigest() == entry["sha256"]
        estimate = source_length * prior_height / source_height
        if pose == "stance":
            stance_estimate = estimate
        factor = factors.get(ident, {}).get(pose, 1)
        records.append({
            "id": ident, "pose": pose, "file": file,
            "sha256": hashlib.sha256(raw).hexdigest(),
            "nativeDimensions": list(pixels.shape[:2][::-1]),
            "marker": marker, "roiXYXYExclusive": list(roi),
            "colorPredicate": threshold, "componentConnectivity": 4,
            "markerComponentPixels": int(populations[label]),
            "markerBoundingBoxXYXYExclusive": marker_box,
            "markerEquivalentAreaDiameterNative": math.sqrt(4 * populations[label] / math.pi),
            "markerSourceLength": source_length,
            "alpha12BoundingBoxXYXYExclusive": alpha_box,
            "priorRenderHeight": prior_height, "priorRenderWidth": prior_width,
            "estimatedMarkerLengthBefore": estimate,
            "factorForExactMarkerEquality": stance_estimate / estimate,
            "selectedUniformHeightFactor": factor,
            "estimatedMarkerLengthAfter": estimate * factor,
            "predictedRenderHeightBeforeWidthCeiling": prior_height * factor,
            "predictedRenderWidthBeforeWidthCeiling": prior_width * factor,
            "maxIllustratedWidth": entry["maxIllustratedWidth"],
            "predictedWidthCeilingActive": prior_width * factor > entry["maxIllustratedWidth"],
        })
out = {
    "schema": "encore-original-abstraction-pose-landmarks/v1",
    "createdAt": datetime.now(timezone.utc).isoformat(),
    "sourceReport": str(REPORT.relative_to(ROOT)),
    "sourceReportSha256": hashlib.sha256(REPORT.read_bytes()).hexdigest(),
    "method": "Native unmodified RGBA PNG, manually selected landmark region, largest connected color component. Compare landmark source length multiplied by pre-factor rendered silhouette height and divided by native alpha12 silhouette height. Factors are rounded visual corrections; final production matrices are audited independently.",
    "limitations": [
        "The landmark length is an approximate visual-size proxy; head angle, foreshortening and independent painted variations remain.",
        "Runtime downsamples the source to its cached canvas, so native alpha bounds and production measurements may differ by a fraction of a pixel.",
        "The five factors uniformly scale the complete pose before the existing width ceiling. They do not warp images, edit source PNGs or change gameplay collision bodies.",
        "Individual generated state illustrations are not a full animation cycle or evidence of canonical 1:1 fidelity."
    ],
    "nativePngEdits": False,
    "factors": factors,
    "records": records,
}
(DOCS / "pose-height-measurements.json").write_text(json.dumps(out, indent=2) + "\n")
print(json.dumps({"records": len(records), "factors": factors, "nativePngEdits": False}))
