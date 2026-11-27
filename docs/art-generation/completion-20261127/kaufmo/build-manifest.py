"""Read-only measurement of new native PNGs and static-family declarations."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import hashlib
import json

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
BASE = "cc972c8412bddb5278ef7c609dd82897325a2922"
SCOPE = ("Création originale de crossover pour Encore : un portrait de sélection et une garde statique "
         "séparés, un personnage par image. La garde est réutilisée pour les états non dessinés. "
         "Aucun cycle d’animation ou dessin d’action ajouté ; aucune apparition canonique affirmée.")
SERIES = {
    "sunsetparadise": ("Sunset Paradise", "https://www.glitchprod.com/sunset-paradise"),
    "gaslightdistrict": ("The Gaslight District", "https://www.glitchprod.com/gaslight-district"),
    "knightsofguinevere": ("Knights of Guinevere", "https://www.glitchprod.com/knights-of-guinevere"),
}
IDENTITY_URL = "https://glitchproductions.store/products/kaufmo-plush"

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def measure(p):
    with Image.open(p) as im:
        im.load()
        assert im.mode == "RGBA", str(p)
        a = im.getchannel("A")
        h = a.histogram()
        box = a.point(lambda x: 255 if x > 12 else 0).getbbox()
        assert h[0] > 0 and sum(h[240:]) > 1000 and box
        assert 0 < box[0] < box[2] < im.width and 0 < box[1] < box[3] < im.height
        return {"path": p.relative_to(ROOT).as_posix(), "bytes": p.stat().st_size,
                "sha256": sha(p), "width": im.width, "height": im.height, "mode": im.mode,
                "alphaBounds12": list(box), "fullyTransparentPixels": h[0],
                "lowAlphaEdgePixels": sum(h[1:13]), "visiblePixelsOver12": sum(h[13:]),
                "pixelsAtLeast240Alpha": sum(h[240:]), "nativePixelsUnmodified": True}

def main():
    families, definitions, reviews, references = [], [], {}, {}
    native_sources = {}
    for set_name in ["sunset", "gaslight", "knights"]:
        for row in json.loads((HERE / (set_name + "-prompts.json")).read_text()):
            series, style = row["series"], row["style"]
            title, url = SERIES[series]
            identifier = f"glitch-{series}-kaufmo-{style}"
            directory = f"assets/encore/crossovers/{series}/kaufmo/{style}"
            files = {slot: measure(ROOT / directory / (slot + ".png")) for slot in ["selection", "stance"]}
            assert files["selection"]["sha256"] != files["stance"]["sha256"]
            for slot in files:
                native = Path(row[slot + "Source"])
                if native.is_file():
                    assert sha(native) == files[slot]["sha256"], identifier + " native bytes differ"
                native_sources[files[slot]["path"]] = row[slot + "Source"]
            urls = [IDENTITY_URL, url]
            if series == "gaslightdistrict":
                urls.append("https://glitchproductions.store/products/mel-animatez")
            for ref in row["refs"]:
                p = Path(ref)
                references[p.relative_to(ROOT).as_posix()] = {"path": p.relative_to(ROOT).as_posix(),
                    "sha256": sha(p), "bytes": p.stat().st_size}
            fam = {"id": identifier, "fighterId": "kaufmo", "series": series, "seriesTitle": title,
                   "style": style, "label": row["label"], "traits": row["traits"],
                   "files": files, "prompts": set_name + "-prompts.json",
                   "sourceUrls": urls, "nativeFacing": 1, "authoredSlots": ["selection", "stance"],
                   "canonicalCostumeClaim": False,
                   "sourceKind": "Original Encore crossover using official identity and universe references",
                   "visualReview": {"reviewed": True, "oneCharacterPerImage": True, "stanceFullBody": True,
                       "selectionIntentionalWaistPortrait": True, "identityAndCostumeMatch": True,
                       "issues": [], "scope": "Native images and pair consistency inspected; production Canvas review is separate."}}
            families.append(fam)
            definitions.append({"id": identifier, "fighterId": "kaufmo", "name": title + " · " + row["label"],
                "sourceId": f"encore-kaufmo-{series}-{style}-20261127-completion",
                "sourceTitle": "Encore — Kaufmo × " + title + " : " + row["label"],
                "sourceUrl": url, "sourceUrls": urls,
                "sourceKind": "Création originale pour Encore avec références officielles",
                "sourceScope": "Les références établissent Kaufmo et les codes visuels de l’univers ; le crossover n’est pas une apparition officielle.",
                "scope": SCOPE, "traits": row["traits"], "directory": "../" + directory,
                "introducedOn": "2026-11-27", "nativeFacing": 1,
                "crossover": {"series": series, "style": style}, "canonicalCostumeClaim": False,
                "visual": {"maxIllustratedWidth": 210}})
            reviews[identifier] = {"status": "verified-base-files",
                "sha256": {slot: files[slot]["sha256"] for slot in files},
                "captureId": "docs/art-generation/completion-20261127/kaufmo/manifest.json",
                "visibleTraits": row["traits"],
                "identityEvidence": "Kaufmo Plush officiel, garde Encore publiée et références officielles de " + title + " relus ; apparence originale.",
                "framing": "Garde complète orientée à droite ; portrait cadré intentionnellement à la taille, chapeau et mains complets.",
                "transparency": "PNG RGBA natifs, alpha mesuré et compositions sur fond opaque relues ; pixels natifs conservés.",
                "proportions": "Proportions de chaque dessin conservées ; échelle uniforme attendue du renderer existant.",
                "scope": SCOPE, "sourceUrls": urls, "issues": []}
    assert len(families) == 9
    manifest = {"schema": "encore-kaufmo-static-completion/v1", "date": "2026-11-27", "baseCommit": BASE,
        "productionTool": "Built-in image_gen.imagegen, one call per native asset",
        "phase": "static-bases-only", "newNativeImages": 18, "newAppearanceFamilies": 9,
        "previousUnpublishedImagesRecovered": 0, "references": list(references.values()),
        "referenceUrls": json.loads((HERE / "references/sources.json").read_text()),
        "families": families, "nativeOutputs": native_sources, "scope": SCOPE,
        "canonicalOneToOneCertified": False,
        "reviewStatus": "Native files and pair consistency reviewed; production Canvas is a separate gate.",
        "alternativeCandidates": [
            {"path": "docs/art-generation/completion-20261127/kaufmo/candidates/gaslight-resident-four-buttons.png",
             "status": "Superseded: fourth torso button corrected by native imagegen edit."},
            {"path": "docs/art-generation/completion-20261127/kaufmo/candidates/knights-fusion-glow.png",
             "status": "Superseded by native transparency-focused edit. RGB beneath alpha0 can appear as colored haze in raw previews; proper alpha composition is clean. No pixel processing was applied."}
        ]}
    (HERE / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    module = "/** Nine original Kaufmo static crossover families; native source evidence in completion-20261127/kaufmo. */\n"
    module += "export const COMPLETION_20261127_KAUFMO_BASE_DEFINITIONS = Object.freeze(" + json.dumps(definitions, ensure_ascii=False, indent=2) + ");\n"
    module += "export const COMPLETION_20261127_KAUFMO_BASE_REVIEWS = Object.freeze(" + json.dumps(reviews, ensure_ascii=False, indent=2) + ");\n"
    (ROOT / "combat/base-sprite-completion-20261127-kaufmo.mjs").write_text(module)
    # Review-only derivative; runtime PNGs are never overwritten or reencoded.
    tile_w, tile_h = 480, 380
    sheet = Image.new("RGB", (tile_w * 3, 72 + tile_h * 3), "#243247")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
    heading = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 25)
    draw.text((18, 15), "Kaufmo · 9 familles originales · 18 bases natives", font=heading, fill="#fff0cf")
    draw.text((18, 48), "Portrait + garde séparés. Montage de contrôle alpha ; le rendu en jeu est vérifié séparément.", font=font, fill="#d9e4f2")
    for i, fam in enumerate(families):
        # One universe per column and one style per row.
        col, row_index = i // 3, i % 3
        x, y = col * tile_w, 72 + row_index * tile_h
        draw.text((x + 10, y + 8), fam["seriesTitle"], font=font, fill="#fff0cf")
        draw.text((x + 10, y + 31), fam["label"], font=font, fill="#d9e4f2")
        for j, slot in enumerate(["selection", "stance"]):
            with Image.open(ROOT / fam["files"][slot]["path"]) as im:
                visible = im.getchannel("A").point(lambda a: 255 if a > 12 else 0).getbbox()
                view = im.crop(visible)
                view.thumbnail((220, 310), Image.Resampling.LANCZOS)
                px = x + 12 + j * 235 + (220 - view.width) // 2
                py = y + 57 + (310 - view.height) // 2
                sheet.paste(view, (px, py), view.getchannel("A"))
    sheet.save(HERE / "native-overview.jpg", quality=92)
    print(json.dumps({"families": 9, "nativePngs": 18,
        "bytes": sum(f["bytes"] for fam in families for f in fam["files"].values()),
        "manifest": str(HERE / "manifest.json")}))

if __name__ == "__main__":
    main()
