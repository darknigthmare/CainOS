#!/usr/bin/env python3
"""Bind the final batch report to executed checks and reviewed production renders."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WAVE = ROOT / 'docs/art-generation/cast-next-missing-20261120'
STAGE = ROOT / 'docs/art-generation/stage-next-missing-20261120'


def read(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


completion = read(WAVE / 'generation-completion.json')
qa = read(WAVE / 'qa-result.json')
canvas = read(WAVE / 'canvas-summary.json')
integrity = read(WAVE / 'build-integrity.json')
counts = read(WAVE / 'runtime-counts.json')
visual = read(WAVE / 'visual-review.json')
independent = read(WAVE / 'independent-review.json')
stage = read(STAGE / 'verification.json')
assert completion['status'] == 'complete_active'
assert qa['exitCode'] == 0 and qa['testSummary']['fail'] == 0 and qa['bothBuildsPassed']
assert canvas['complete'] and canvas['counts']['missing'] == 0
assert integrity['status'] == 'passed'
assert visual['status'] == 'accepted_with_stated_scope'
assert independent['status'] == 'accepted_with_documented_limits'
for entry in independent['visuallyInspectedFiles'] + independent['supportingReports']:
    assert sha(ROOT / entry['file']) == entry['sha256'], 'Stale independent review: ' + entry['file']
sources = qa['sources']
for result in [qa, canvas, integrity]:
    for name, digest in result['sources'].items():
        assert sha(ROOT / name) == digest, 'Stale evidence: ' + name
for name, digest in stage['sources'].items():
    assert sha(ROOT / name) == digest, 'Stale stage evidence: ' + name
assert stage['canvas']['manifestSnapshot']['images'] == counts['offlineImages']
assert stage['canvas']['manifestSnapshot']['artVersion'] == counts['artVersion']
result = {
    'schema': 'encore-next-missing-verification/v1',
    'createdAt': datetime.now(timezone.utc).isoformat(),
    'status': 'local_qa_canvas_and_integrity_passed_browser_not_reexecuted',
    'baseLocalCommit': '3858f03bba652fa56bdf422b5566dea86dbdcb9b',
    'baseRemoteCommit': '3bd83cdf2e63e93275c8478795d5e2af32313f41',
    'generation': {'appearances': 4, 'nativeCostumePngs': 44,
                   'costumeBytes': completion['counts']['bytes'],
                   'stagePngs': 3, 'stageBytes': stage['counts']['newNativeBytes'],
                   'manifest': 'generation-completion.json',
                   'manifestSha256': sha(WAVE / 'generation-completion.json')},
    'qa': {**qa['testSummary'], 'bothBuildsPassed': True,
           'evidence': 'qa-result.json', 'log': 'qa.log'},
    'canvas': {**canvas['counts'], 'method': canvas['method'],
               'evidence': 'canvas-summary.json'},
    'stage': {'id': 'undermap', 'evidence': '../stage-next-missing-20261120/verification.json',
              'counts': stage['counts']},
    'integrity': {key: value for key, value in integrity.items() if key not in ['copies', 'sources']},
    'runtimeCounts': counts,
    'visualReview': {'status': visual['status'], 'evidence': 'visual-review.json',
                     'independentEvidence': 'independent-review.json',
                     'independentSha256': sha(WAVE / 'independent-review.json')},
    'browser': {'status': 'not_reexecuted_locally', 'successfulChecksThisBatch': 0,
                'priorAttempt': '../cast-ribbit-20261120/browser-result.json',
                'note': 'Prior local Chromium aborted before navigation with socket Operation not permitted. That attempt is historical and does not validate this revision. Remote CI is reported separately for the published commit.'},
    'sources': sources,
    'limitations': [
        'Eleven static drawings per appearance do not constitute full animation cycles.',
        'Official merchandise references establish their own design, not episode-specific proportions or motion.',
        'PTO Caine reuses the existing Caine body; the chair and drink are excluded.',
        'Undermap geometry, audio and motion are original game adaptations from one official reference image.',
        'Unqualified costume parts, forty NPC crossover families, full animation and physical-device checks remain open.',
    ],
}
(WAVE / 'verification.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
names = {'watermelongangle': 'Gangle — Pastèque', 'aquablasterpomni': 'Pomni — Aqua Blaster',
         'ptocaine': 'Caine — Congés', 'freakjax': 'Jax — Freak Jax'}
rows = '\n'.join('| ' + names[ident] + ' | 11 | [Galerie](art-generation/cast-next-missing-20261120/review/' + ident + '/README.md) |'
                 for ident in completion['order'])
report = f'''# Encore — quatre apparences et Sous la carte, 20 novembre 2026

**Quatre familles complètes de costumes, soit 44 PNG individuels, et une nouvelle arène à trois plans sont intégrées.** Cette passe poursuit le [lot Ribbit](COMBAT_RIBBIT_CONTINUATION_2026-11-20.md), à partir du commit local `3858f03` et du parent publié `3bd83cdf`. Les fichiers générés sont installés sans redimensionnement, réencodage ni modification d’alpha.

## Apparences ajoutées

| Apparence | Dessins natifs | Rendu de production |
| --- | ---: | --- |
{rows}

Chaque famille comprend un portrait de sélection, une garde et neuf poses : entrée, attaque, coup fort, coup reçu, marche, saut, accroupissement, victoire et défaite. Ce sont des poses statiques originales pour le jeu.

Watermelon Gangle conserve le grand chapeau jaune à nœud pervenche, le haut et la jupe assortis, la batte sombre et la tranche de pastèque. Elle est distincte de l’ancienne tenue au paréo fleuri et à la noix de coco. Aqua Blaster Pomni possède le pistolet à eau de la figurine et aucun brassard. Les deux variantes existantes restent au catalogue.

PTO Caine porte les grandes lunettes menthe à verres jaunes ; son corps debout reprend la tenue de Caine déjà utilisée. Le transat et le verre sont exclus, et les parties masquées dans la figurine assise ne sont pas présentées comme de nouvelles observations. Freak Jax se distingue de `peeledjax` par sa tête jaune ronde sans oreilles dressées, ses yeux noirs carrés, ses membres violets et sa salopette corail intacte. Le volume violet rabattu derrière les épaules ne devient pas une nouvelle queue anatomique.

Les références officielles et leur portée sont décrites dans les quatre fiches de [qualification](art-generation/cast-next-missing-20261120/README.md). Les photos de produits ne certifient pas des proportions ou des poses d’épisode. Les [44 reçus et empreintes](art-generation/cast-next-missing-20261120/generation-completion.json) relient chaque dessin à son appel de génération et à ses références portables.

## Nouvelle arène : Sous la carte

La salle indigo quadrillée sous Candy Canyon devient `undermap`, ajoutée après les 22 arènes historiques. Ses trois plans natifs mesurent réellement **1672 × 941**, pour **1 821 031 octets**. Le service n’a pas fourni la taille 4K demandée ; aucun agrandissement du fichier n’a été appliqué. La paroi, le sol en perspective et les reflets utilisent le chargeur de parallaxe existant.

Un thème musical, une ambiance discrète et une pulsation bleue originaux complètent le décor. Le sol de combat reste à y568 ; les mouvements réduits figent la caméra et la pulsation. Le repli de chargement est lui aussi indigo et quadrillé. Le [dossier du décor](art-generation/stage-next-missing-20261120/README.md) et la [planche de trois caméras](art-generation/stage-next-missing-20261120/review/three-cameras.png) détaillent la comparaison au visuel primaire et les adaptations.

L’ajout d’une arène changeait les tirages fondés sur la longueur du catalogue. Les anciennes routes PNJ sont désormais reliées explicitement à leurs 22 scènes d’origine, et le validateur reconnaît le catalogue historique lors d’une reprise de programme. Les fixtures capturées avant édition conservent **54 récits, 45 programmes / 270 checkpoints et 14 replays / 3 682 frames**. Les anciens contextes restent admis ; les calendriers arbitraires importés restent rejetés. Les versions de simulation, de profil et de replay ne changent pas.

## Vérifications exécutées

| Contrôle | Résultat | Preuve |
| --- | --- | --- |
| QA globale et deux distributions | {qa['testSummary']['tests']} tests Node, {qa['testSummary']['fail']} échec ; deux builds réussis | [Résultat](art-generation/cast-next-missing-20261120/qa-result.json) |
| Costumes dans le moteur Canvas de production | 36 actions, 4 gardes, 4 portraits, 80 contrôles dans les deux sens ; zéro manque | [Synthèse Canvas](art-generation/cast-next-missing-20261120/canvas-summary.json) |
| Décor dans le vrai chargeur et le moteur Canvas | 3 positions de caméra, 3 scènes avec personnages, 6 contrôles réussis | [Revue du décor](art-generation/stage-next-missing-20261120/review/canvas-review.json) |
| Copies dans les deux distributions | 88 comparaisons de costumes, 6 de plans, {integrity['moduleComparisons']} de modules | [Intégrité](art-generation/cast-next-missing-20261120/build-integrity.json) |
| Anciennes images Encore | {integrity['historicalEncoreFilesVerified']:,} fichiers identiques au commit de base | [Même preuve](art-generation/cast-next-missing-20261120/build-integrity.json) |

Les rapports sont liés aux empreintes des sources finales et du manifeste. La [revue visuelle](art-generation/cast-next-missing-20261120/visual-review.json) décrit les observations réellement faites. Les sorties Canvas sous Node/Skia ne constituent pas un parcours navigateur ni un essai matériel. Chromium local avait échoué avant navigation lors du lot précédent ; cette tentative historique n’est pas réattribuée au nouveau lot. La CI du commit publié doit être lue séparément.

## Catalogue après intégration

| Élément | Total mesuré |
| --- | ---: |
| Combattants | {counts['fighters']} |
| Techniques | {counts['techniques']} |
| Costumes sélectionnables | {counts['costumes']} |
| Apparences Circus supplémentaires | {counts['additionalAppearances']} / 429 PNG |
| Arènes partagées | {counts['stages']} / 69 plans |
| Arrangements dédiés réemployant ces décors | {counts['dedicatedArrangements']} |
| Entrées d’archive | {counts['archive']} |
| Images dans le paquet hors ligne | {counts['offlineImages']:,} |
| Octets des images hors ligne | {counts['offlineBytes']:,} |

Version du paquet : `{counts['offlineVersion']}` ; révision artistique : `{counts['artVersion']}`. Les comptes sont issus des [exports de production](art-generation/cast-next-missing-20261120/runtime-counts.json).

## Suivi et éléments toujours ouverts

La [réconciliation du classeur](art-generation/workbook-next-missing-20261120/README.md) ajoute les lignes de ce lot à partir du XLSX déjà réconcilié. Les IDs, l’ordre, les notes et les preuves historiques sont conservés ; seuls les contrôles effectivement exécutés servent aux nouveaux statuts.

Le [registre courant](art-generation/cast-next-missing-20261120/remaining-work.md) retire les quatre familles terminées et l’arène de la file de production. Il garde les références incomplètes pour Maid Ribbit, Jax australien, Gangle néo-zélandaise et film noir, plusieurs assemblages de Zooble et Hotdog Cart Abel. La recherche confirme le short kaki de Jax australien mais pas ses pieds. Les cycles d’animation complets, les crossovers des quarante PNJ et les essais sur appareils physiques restent ouverts.
'''
(ROOT / 'docs/COMBAT_NEXT_MISSING_2026-11-20.md').write_text(report)
gallery = '\n'.join('- [' + names[ident] + '](review/' + ident + '/README.md) · [Qualification](candidate-review-' + ident + '.md)'
                    for ident in completion['order'])
(WAVE / 'README.md').write_text(f'''# Quatre apparences supplémentaires — 20 novembre 2026

**44 PNG natifs individuels sont actifs pour quatre apparences distinctes.** Les dessins restent séparés en jeu ; les planches servent uniquement à leur revue.

{gallery}

Chaque famille possède une sélection, une garde et neuf actions. Le [bilan complet](../../COMBAT_NEXT_MISSING_2026-11-20.md) explique les choix et les limites de fidélité ; les poses sont des adaptations originales de produits officiels.

## Production et contrôles

- [Manifeste de complétion](generation-completion.json) et [inventaire](asset-inventory.json).
- [Vérification consolidée](verification.json), [{qa['testSummary']['tests']} tests et deux builds](qa-result.json).
- [Revue Canvas : 80 contrôles de dessin](canvas-summary.json), [revue visuelle](visual-review.json) et [intégrité des deux distributions](build-integrity.json).
- [Comptes actifs](runtime-counts.json), [travaux restants](remaining-work.md) et [suivi XLSX](../workbook-next-missing-20261120/README.md).
- [Nouvelle arène Sous la carte](../stage-next-missing-20261120/README.md), traitée dans la même continuation.

Les sources natives, les prompts et les reçus sont archivés par famille. Aucune retouche d’image active, normalisation d’alpha ou conversion n’est utilisée. Les dimensions et marges sont celles des PNG réellement reçus. Les essais navigateur et matériels restent distincts des contrôles Canvas.
''')
print(json.dumps({'status': result['status'], 'tests': qa['testSummary']['tests'],
                  'nativePngs': 47, 'offlineImages': counts['offlineImages']}))
