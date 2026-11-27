"""Measure native Gameoverse files and write their static runtime definitions.

This script only copies native bytes and reads image metadata/alpha. It does not
resize, recolour, crop, clean, or re-encode source artwork.
"""
from hashlib import sha256
import json
from pathlib import Path
import shutil

from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
NATIVE = ROOT.parent / "generated_images"
ASSETS = ROOT / "assets/encore/crossovers/gameoverse/kaufmo"
DATE = "2026-11-27"
BASE_COMMIT = "cc972c8412bddb5278ef7c609dd82897325a2922"
SOURCE_URLS = [
    "https://glitchproductions.store/products/kaufmo-plush",
    "https://www.glitchprod.com/gameoverse",
]
SCOPE = (
    "Création originale de crossover pour Encore : un portrait de sélection et "
    "une garde statique séparés, un personnage par image. La garde sert aux états "
    "sans dessin dédié. Aucun cycle ou dessin d’action ajouté ; aucune apparition "
    "canonique affirmée."
)
FAMILIES = [
    {
        "style": "hommage", "label": "Hommage · Kit",
        "traits": [
            "Visage blanc ovale de Kaufmo, yeux noirs et triangles, sourire rouge, cône jaune à bord bleu et pompon rouge.",
            "Tunique jaune à bande crème angulaire, manches et short anthracite, trois boutons rouges et collerette bleue.",
            "Manchettes jaunes à anneau corail et étoile magenta empruntées aux codes de Kit ; gants blancs et chaussures rouges de Kaufmo, sans anatomie féline.",
        ],
        "native": {
            "selection": "exec-7c170edf-37d9-4b18-a9e9-72c2e90dda84.png",
            "stance": "exec-c2bc5dd3-a885-42d6-b970-67f0bd52527d.png",
        },
    },
    {
        "style": "resident", "label": "Résident · Archiviste des mondes",
        "traits": [
            "Kaufmo normal conservé : visage, chapeau conique, collerette bleue, gants blancs et chaussures rouges.",
            "Manteau cobalt à bordure jaune, gilet crème à trois boutons rouges et petite étoile magenta au col.",
            "Pantalon jaune, ceinture brune, étui violet à cartouches et carte ivoire roulée : métier et tenue originaux pour Encore.",
        ],
        "native": {
            "selection": "exec-ee1d1bd5-d8d2-4285-9aa7-3f2ba1f87e4d.png",
            "stance": "exec-810956cc-8b4a-4f86-97cb-c72d3a5fa8bf.png",
        },
    },
    {
        "style": "fusion", "label": "Fusion · Clown de cristal",
        "traits": [
            "Transformation corporelle en cristaux facettés : tête et mains de quartz blanc, joints et collerette cobalt.",
            "Cône doré à sphère rouge, visage de Kaufmo conservé, torse saphir à trois nodules rubis et étoile magenta au col.",
            "Jambes d’or segmentées et grands pieds rubis ; palette de jeu et motifs cristallins originaux, sans costume canonique revendiqué.",
        ],
        "native": {
            "selection": "exec-5a6d42b3-4bae-4321-b4e5-178ee82b80a0.png",
            "stance": "exec-4e412a47-1bce-4c58-b6c7-bc552408ea55.png",
        },
    },
]


def digest(path):
    return sha256(path.read_bytes()).hexdigest()


def info(path):
    return {"path": str(path.relative_to(ROOT)), "bytes": path.stat().st_size,
            "sha256": digest(path)}


def measure(path):
    with Image.open(path) as im:
        assert im.mode == "RGBA", str(path)
        alpha = im.getchannel("A")
        histogram = alpha.histogram()
        bounds = alpha.point(lambda value: 255 if value > 12 else 0).getbbox()
        assert bounds and histogram[0] > 0 and sum(histogram[240:]) > 0
        return {**info(path), "width": im.width, "height": im.height,
                "mode": im.mode, "alphaBounds12": list(bounds),
                "fullyTransparentPixels": histogram[0],
                "lowAlphaEdgePixels": sum(histogram[1:13]),
                "visiblePixelsOver12": sum(histogram[13:]),
                "pixelsAtLeast240Alpha": sum(histogram[240:]),
                "lastEightRowsMaximumAlpha": max(alpha.crop((0, im.height - 8, im.width, im.height)).getextrema()),
                "nativePixelsUnmodified": True}


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


references = [
    {"path": ROOT / "docs/art-generation/recovery-20261127/kaufmo/references/game-kaufmo-stance.png",
     "sourcePage": None, "role": "Existing Encore Kaufmo visual continuity; not an official episode source."},
    {"path": ROOT / "docs/art-generation/recovery-20261127/kaufmo/references/kaufmo-plush-1.png",
     "sourcePage": SOURCE_URLS[0], "role": "Official normal Kaufmo identity reference, reused without duplication."},
    {"path": HERE / "references/kit-official.png",
     "sourcePage": SOURCE_URLS[1],
     "downloadUrl": "https://static.wixstatic.com/media/b48361_3ffd772159bd425dab8ab5affcc2b78d~mv2.png",
     "role": "Official Kit artwork; yellow tunic, cream centre stripe, charcoal sleeves and gauntlet colour/shape references."},
    {"path": HERE / "references/world-official.png",
     "sourcePage": SOURCE_URLS[1],
     "downloadUrl": "https://static.wixstatic.com/media/1d8dbc_7acdeeb4f7184836a63d0ad39c0fd729~mv2.png",
     "role": "Official videogame-world artwork; angular shapes and blue/violet palette. The archive and crystal-clown designs remain original."},
]
references = [{**{k: v for k, v in ref.items() if k != "path"},
               **info(ref["path"]), "inspectedBeforeGeneration": True,
               "checkedOn": DATE} for ref in references]
write_json(HERE / "references/sources.json", {
    "schema": "encore-gameoverse-primary-references/v1", "checkedOn": DATE,
    "officialPage": SOURCE_URLS[1], "references": references,
    "sourceScope": "Primary references establish identity and visible design language. They do not establish these original crossover costumes as canon.",
})

families, native_outputs, definitions, reviews = [], [], [], {}
for source in FAMILIES:
    style = source["style"]
    family_id = "glitch-gameoverse-kaufmo-" + style
    files = {}
    for slot, filename in source["native"].items():
        target = ASSETS / style / (slot + ".png")
        original = NATIVE / filename
        target.parent.mkdir(parents=True, exist_ok=True)
        if original.exists():
            if not target.exists():
                shutil.copyfile(original, target)
            assert digest(original) == digest(target), "Native bytes differ: " + str(target)
        files[slot] = measure(target)
        files[slot]["nativeOutputFilename"] = filename
        native_outputs.append({"nativeFilename": filename, "finalPath": str(target.relative_to(ROOT)),
                               "sha256": files[slot]["sha256"], "accepted": True})
    prompts = [info(HERE / (style + "-stance-prompt.txt")),
               info(HERE / (style + "-selection-prompt.txt"))]
    if style == "resident":
        prompts.append(info(HERE / "resident-selection-fix-prompt.txt"))
    families.append({
        "id": family_id, "fighterId": "kaufmo", "series": "gameoverse",
        "seriesTitle": "Gameoverse", "style": style, "label": source["label"],
        "traits": source["traits"], "files": files, "prompts": prompts,
        "sourceUrls": SOURCE_URLS, "nativeFacing": 1,
        "authoredSlots": ["selection", "stance"], "canonicalCostumeClaim": False,
        "visualReview": {"reviewed": True, "oneCharacterPerImage": True,
                         "stanceFullBody": True, "selectionIntentionalWaistPortrait": True,
                         "identityAndCostumeMatch": True, "issues": [],
                         "scope": "Native images and pair consistency inspected; production Canvas review is separate."},
    })
    definitions.append({
        "id": family_id, "fighterId": "kaufmo", "name": "Gameoverse · " + source["label"],
        "sourceId": "encore-kaufmo-gameoverse-" + style + "-20261127-completion",
        "sourceTitle": "Encore — Kaufmo × Gameoverse : " + source["label"],
        "sourceUrl": SOURCE_URLS[1], "sourceUrls": SOURCE_URLS,
        "sourceKind": "Création originale pour Encore avec références officielles",
        "sourceScope": "Les références établissent Kaufmo et les codes visuels de Gameoverse ; le crossover n’est pas une apparition officielle.",
        "scope": SCOPE, "traits": source["traits"],
        "directory": "../assets/encore/crossovers/gameoverse/kaufmo/" + style,
        "introducedOn": DATE, "nativeFacing": 1,
        "crossover": {"series": "gameoverse", "style": style},
        "canonicalCostumeClaim": False, "visual": {"maxIllustratedWidth": 210},
    })
    reviews[family_id] = {
        "status": "verified-base-files", "sha256": {slot: file["sha256"] for slot, file in files.items()},
        "captureId": "docs/art-generation/completion-20261127/gameoverse/manifest.json",
        "visibleTraits": source["traits"],
        "identityEvidence": "Kaufmo Plush officiel, garde Encore publiée, Kit et monde Gameoverse officiels relus ; designs de crossover originaux.",
        "framing": "Garde complète vers la droite ; portrait indépendant à la taille, chapeau et mains complets.",
        "transparency": "PNG RGBA natifs, alpha mesuré, pixels conservés. Le portrait Résident conserve quelques pixels natifs alpha 1 en bord inférieur, sous le seuil de cadrage 12.",
        "proportions": "Proportions natives conservées ; échelle uniforme du renderer existant.",
        "scope": SCOPE, "sourceUrls": SOURCE_URLS, "issues": [],
    }

rejected = HERE / "rejected/resident-selection-four-buttons.png"
native_outputs.append({"nativeFilename": "exec-ccd169c2-2274-42f1-ab75-6f8de91de9a9.png",
                       **info(rejected), "accepted": False,
                       "reason": "Four red buttons instead of Kaufmo’s three; corrected with the native image editing tool."})
write_json(HERE / "manifest.json", {
    "schema": "encore-gameoverse-static-completion/v1", "date": DATE,
    "baseCommit": BASE_COMMIT, "productionTool": "Built-in image_gen.imagegen",
    "phase": "static-bases-only", "newNativeImages": 6, "newAppearanceFamilies": 3,
    "imageGenerationCalls": 7, "acceptedImages": 6, "rejectedCandidates": 1,
    "references": references, "families": families, "nativeOutputs": native_outputs,
    "scope": SCOPE, "canonicalOneToOneCertified": False,
    "reviewStatus": "Native files and cross-pair consistency reviewed; runtime Canvas evidence recorded separately.",
})
module = ROOT / "combat/base-sprite-completion-20261127-gameoverse.mjs"
module.write_text(
    "/** Three original Kaufmo × Gameoverse static families; native evidence in completion-20261127/gameoverse. */\n"
    + "export const COMPLETION_20261127_GAMEOVERSE_BASE_DEFINITIONS = Object.freeze("
    + json.dumps(definitions, ensure_ascii=False, indent=2) + ");\n\n"
    + "export const COMPLETION_20261127_GAMEOVERSE_BASE_REVIEWS = Object.freeze("
    + json.dumps(reviews, ensure_ascii=False, indent=2) + ");\n"
)
print(json.dumps({"families": len(families), "acceptedImages": len(families) * 2,
                  "bytes": sum(file["bytes"] for family in families for file in family["files"].values()),
                  "module": str(module.relative_to(ROOT))}))
