from pathlib import Path
from PIL import Image
from datetime import datetime, timezone
import hashlib
import json

ROOT = Path(__file__).resolve().parents[4]
HERE = Path(__file__).resolve().parent
jobs = json.loads((HERE / 'generated/final-jobs.json').read_text())

definitions = {
    'bunnyjax': {
        'fighterId': 'jax', 'name': 'Jax — Bunny', 'nativeFacing': 1,
        'sourceUrl': 'https://glitchproductions.store/products/bunny-jax-plush',
        'sourceTitle': 'GLITCH — Bunny Jax Plush',
        'imageUrl': 'https://glitchproductions.store/cdn/shop/files/JaxBunnyPlush.webp?v=1793889637&width=1600',
        'visibleTraits': [
            'Lapin lavande compact à quatre pattes courtes, tête très grande et deux oreilles larges dressées.',
            'Très grands yeux noirs à croissants jaunes ; aucun nez ni bouche.',
            'Nœud corail rose avec bouton jaune central ; petite queue ronde conservée dans la vue trois quarts.',
        ],
        'referenceFiles': ['bunnyjax.webp', 'bunnyjax-side.webp'],
        'scope': 'Adaptation 2D du design de peluche officiel. Aucune apparition en épisode affirmée. Garde en trois quarts vers la droite, portrait frontal ; proportions compactes du produit conservées.',
    },
    'maidribbit': {
        'fighterId': 'ribbit', 'name': 'Ribbit — Maid Pendantz', 'nativeFacing': 1,
        'sourceUrl': 'https://glitchproductions.store/products/ribbit-pendantz-blindbox',
        'sourceTitle': 'GLITCH — Ribbit Pendantz Blindbox, Maid Ribbit',
        'imageUrl': 'https://cdn.shopify.com/s/files/1/0786/4903/3026/files/Maid.png?v=1786203146',
        'visibleTraits': [
            'Tête verte, museau menthe, joues roses, grands yeux noirs à bord blanc et paupières inférieures indigo, sourire en U.',
            'Coiffe blanche festonnée, col à deux pointes, manches courtes à dentelle, corsage et robe noirs, tablier et ourlet blancs.',
            'Emblème vert menthe de nénuphar rond à encoche en V, distinct du cœur ; ni anneau ni sangle de porte-clés.',
            'Bas du corps entièrement masqué par la jupe comme dans la référence ; aucune jambe, chaussure ni chaussette ajoutée.',
        ],
        'referenceFiles': ['maidribbit.png'],
        'scope': 'Composition statique visible du Pendantz, sans son attache commerciale. La jupe conserve les occultations : aucune anatomie sous la robe n’est qualifiée. Cette tenue est distincte de Café Ribbit.',
    },
    'ghostlyvacuum': {
        'fighterId': 'ghostly', 'name': 'Ghostly — aspirateur', 'nativeFacing': 1,
        'sourceUrl': 'https://glitchproductions.store/products/digital-friends-animiniz-blindbox',
        'sourceTitle': 'GLITCH — Digital Friends Animiniz Blindbox, Ghostly',
        'imageUrl': 'https://cdn.shopify.com/s/files/1/0786/4903/3026/files/DCAZ_DigitalFriends_Ghostly.png?v=1785851930',
        'visibleTraits': [
            'Petit spectre menthe à grosse tête ronde, pointe en haut à gauche, yeux en anneaux crème sans pupilles sombres et petite bouche blanche.',
            'Deux bras courts courbes, corps inférieur effilé émergeant du raccord noir et crème de la machine.',
            'Aspirateur charbon à disque latéral argenté, tuyau coudé à droite, tubes noirs et raccords clairs devant, losange clair sur la cuve.',
            'Aucun portail, décor de présentation, bulle, sol ou ombre de sol conservé.',
        ],
        'referenceFiles': ['ghostly.png'],
        'scope': 'Composition personnage et appareil indivisible d’après la photographie officielle ; la machine est un accessoire visuel statique. Aucun nouveau pouvoir, effet ou mécanisme de jeu déduit.',
    },
    'mingtrophy': {
        'fighterId': 'ming', 'name': 'Ming — trophée', 'nativeFacing': 1,
        'sourceUrl': 'https://glitchproductions.store/products/digital-friends-animiniz-blindbox',
        'sourceTitle': 'GLITCH — Digital Friends Animiniz Blindbox, Ming',
        'imageUrl': 'https://cdn.shopify.com/s/files/1/0786/4903/3026/files/DCAZ_DigitalFriends_Ming.png?v=1785851930',
        'visibleTraits': [
            'Mannequin articulé menthe, grande tête anguleuse à deux yeux blancs et pupilles sombres inégales, sans nez ni bouche.',
            'Casquette bleu ciel ; grande couronne circulaire dorée de laurier derrière la tête.',
            'Bras baissés, mains en moufles, jambes segmentées et pieds sur le dessus rouge du socle noir et or.',
            'Plaque FAVORITE CHARACTER et petit carton plié Ming préservés ; aucun portail de présentation.',
        ],
        'referenceFiles': ['ming.png'],
        'scope': 'Composition statique personnage, laurier, carton et trophée d’après la figurine officielle. Les textes appartiennent au produit référencé, pas à une nouvelle interface. Aucun trophée de gameplay ajouté.',
    },
    'disappearingguymicrophone': {
        'fighterId': 'disappearingguy', 'name': 'Disappearing Guy — microphone', 'nativeFacing': -1,
        'sourceUrl': 'https://glitchproductions.store/products/digital-friends-animiniz-blindbox',
        'sourceTitle': 'GLITCH — Digital Friends Animiniz Blindbox, Disappearing Guy',
        'imageUrl': 'https://cdn.shopify.com/s/files/1/0786/4903/3026/files/DCAZ_DigitalFriends_DisappearingGuy.png?v=1785851930',
        'visibleTraits': [
            'Mannequin rouge articulé, tête anguleuse intégralement vide, sans visage ajouté.',
            'Large chapeau brun orangé de cow-boy, bord relevé ondulé, ruban brun sombre et plis décoratifs.',
            'Bras repliés et mains près du pied de microphone noir ; petit micro noir à bague argentée et socle rond complet.',
            'Jambes et pieds rouges visibles, orientation native légèrement vers la gauche, portail commercial absent.',
        ],
        'referenceFiles': ['disappearingguy.png'],
        'scope': 'Composition statique du produit avec microphone attaché visuellement. Orientation native gauche conservée et déclarée ; aucune disparition animée ni nouveau mouvement inventé.',
    },
}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

assets = []
families = []
for family_id, definition in definitions.items():
    family_assets = []
    for job in (j for j in jobs if j['id'] == family_id):
        path = ROOT / 'assets/encore/base-costumes' / family_id / (job['slot'] + '.png')
        raw = Path(job['generatedPath'])
        with Image.open(path) as im:
            im.load()
            assert im.mode == 'RGBA'
            alpha = im.getchannel('A')
            hist = alpha.histogram()
            count = im.width * im.height
            mask = alpha.point(lambda value: 255 if value >= 12 else 0)
            bounds = mask.getbbox()
            assert hist[0] > 0 and bounds is not None
            edge_max = max(alpha.crop(rect).getextrema()[1] for rect in [
                (0, 0, im.width, 1), (0, im.height - 1, im.width, im.height),
                (0, 0, 1, im.height), (im.width - 1, 0, im.width, im.height)])
            assert edge_max < 12, (family_id, job['slot'], edge_max)
            assert path.read_bytes() == raw.read_bytes()
            entry = {
                'familyId': family_id, 'slot': job['slot'], 'file': path.relative_to(ROOT).as_posix(),
                'bytes': path.stat().st_size, 'sha256': digest(path), 'width': im.width,
                'height': im.height, 'mode': im.mode, 'alphaMin': min(i for i,v in enumerate(hist) if v),
                'alphaMax': max(i for i,v in enumerate(hist) if v),
                'fullyTransparentPixels': hist[0], 'transparentFraction': hist[0] / count,
                'partiallyTransparentPixels': sum(hist[1:255]), 'opaquePixels': hist[255],
                'visibleBoundsAlpha12': list(bounds), 'borderMaximumAlpha': edge_max,
                'originalGeneratedBytesPreserved': True,
                'prompt': job['prompt'], 'generationTool': 'built-in image_gen.imagegen',
                'nativeOutput': job['generatedPath'], 'reference': definition['imageUrl'],
                'visualReview': 'Compared individually to the downloaded primary reference; one subject, no visible clipping, native alpha; runtime review is recorded separately by the integrator.',
            }
            if job.get('revisionPrompt'):
                entry['revisionPrompt'] = job['revisionPrompt']
                entry['revisionReason'] = job['revisionReason']
                entry['rejectedOutput'] = job['rejectedOutput']
            assets.append(entry)
            family_assets.append(entry)
    references = []
    for filename in definition.pop('referenceFiles'):
        path = HERE / 'references' / filename
        references.append({'file': path.relative_to(ROOT).as_posix(), 'sha256': digest(path), 'bytes': path.stat().st_size})
    families.append({
        'id': family_id, **definition, 'sourceId': 'glitch-base-20261125-' + family_id,
        'sourceKind': 'Produit dérivé officiel ; illustration 2D pour Encore',
        'sourceScope': 'La référence officielle atteste le design de marchandise visible, sans attester une apparition en épisode.',
        'canonicalCostumeClaim': False, 'baseOnly': True, 'presentation': 'static',
        'authoredSlots': ['selection', 'stance'],
        'directory': '../assets/encore/base-costumes/' + family_id,
        'references': references,
        'assetReview': {
            'status': 'verified-base-files',
            'sha256': {entry['slot']: entry['sha256'] for entry in family_assets},
            'visibleTraits': definition['visibleTraits'],
            'identityEvidence': definition['sourceTitle'],
            'framing': 'All visible subject edges are inside the native canvas at alpha >= 12; actual dimensions and bounds are recorded per image.',
            'transparency': 'Native RGBA retained byte-for-byte; transparent pixels measured. Some native border pixels have alpha 1, below the renderer threshold; no matte editing performed.',
            'proportions': 'Individual visual comparison against the named primary product image. No pixel-exact or unseen-angle certification.',
            'issues': [], 'scope': definition['scope'],
            'captureId': 'docs/art-generation/base-sprites-20261125/official/manifest.json',
        },
    })

manifest = {
    'schema': 'encore-official-static-bases/v1',
    'createdAt': datetime.now(timezone.utc).isoformat(),
    'baselineCommit': '616a585274506f20c54386d8be07a76e75e1f198',
    'scope': 'Five reference-based appearances; ten individual static PNGs; no action poses or animation frames.',
    'production': 'Recreated after no recoverable source files for the previously announced unpublished lot were found. These are newly generated bytes, not recovered old files.',
    'tool': 'built-in image_gen.imagegen',
    'summary': {'families': len(families), 'acceptedPNGs': len(assets), 'generationCalls': 11, 'rejectedAttempts': 1, 'animations': 0, 'nativeAlphaFiles': len(assets)},
    'families': families, 'assets': assets,
    'validationLimits': ['Canonical pixel-exact fidelity is not certified.', 'Runtime/Canvas review and build results belong to the root integration evidence, not this source-asset inspection.'],
}
(HERE / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'manifest': str(HERE / 'manifest.json'), 'summary': manifest['summary'], 'bytes': sum(a['bytes'] for a in assets)}, ensure_ascii=False))
