#!/usr/bin/env python3
"""Read PNGs and in-memory crops through the pinned gamedev raster helpers."""
from __future__ import annotations
import importlib.util
import json
from pathlib import Path
import sys
from PIL import Image, __version__ as pillow_version

# This is a read-only import: callers also use -B so the vendored snapshot stays exact.
sys.dont_write_bytecode = True
helper_path = Path(__file__).resolve().parents[1] / "docs/gamedev/upstream/skills/disciplines/create-game-assets/scripts/asset_report.py"
spec = importlib.util.spec_from_file_location("encore_upstream_asset_report", helper_path)
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


def read_batch(request):
    root = Path(request["root"]).resolve()
    output = []
    for job in request["images"]:
        row = {"path": job["path"], "crops": [], "problems": []}
        try:
            target = (root / job["path"]).resolve()
            if not target.is_relative_to(root):
                raise ValueError("image path escapes the asset root")
            with Image.open(target) as verified:
                if verified.format != "PNG":
                    raise ValueError("referenced raster is not a PNG")
                verified.verify()
            details = helper.inspect(target, None)
            details.pop("path", None)
            row.update(details)
            with Image.open(target) as source:
                source.load()
                for crop in job["crops"]:
                    x, y, width, height = crop["rect"]
                    if any(type(v) is not int for v in (x, y, width, height)) or min(x, y) < 0 or min(width, height) < 1 or x + width > source.width or y + height > source.height:
                        raise ValueError("crop is outside the decoded PNG: " + crop["key"])
                    region = source.crop((x, y, x + width, y + height))
                    alpha = region.convert("RGBA").getchannel("A")
                    histogram = alpha.histogram()
                    # The Canvas renderer considers alpha >= 12 visible.
                    visible_mask = alpha.point(lambda value: 255 if value >= 12 else 0)
                    row["crops"].append({
                        "key": crop["key"],
                        **helper.alpha_stats(region),
                        "visible_pixels": sum(histogram[12:]),
                        "visible_content_bounds": list(visible_mask.getbbox() or (0, 0, 0, 0)),
                    })
        except (OSError, ValueError, KeyError, TypeError, SyntaxError) as error:
            row["problems"].append(str(error))
        output.append(row)
    return {"pillow": pillow_version, "images": output}


if __name__ == "__main__":
    try:
        print(json.dumps(read_batch(json.load(sys.stdin)), sort_keys=True))
    except Exception as error:
        print(json.dumps({"error": str(error), "images": []}, sort_keys=True))
        sys.exit(1)
