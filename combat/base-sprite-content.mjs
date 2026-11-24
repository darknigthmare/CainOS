/**
 * New portrait + stance families, explicitly requested as static bases.
 * No action PNGs, animation cells, collision bodies or move kits are invented.
 * Publication needs both a recorded native-file review and both offline paths.
 */
import { ART_FILES } from './offline-manifest.mjs';
const publishedArt = new Set(ART_FILES);

export const BASE_SPRITE_ART_SLOTS = Object.freeze(['selection', 'stance']);

// Filled only after the two native files have been checked. A planned family
// is never selectable merely because its directory or one PNG has appeared.
export const BASE_SPRITE_REVIEWS = Object.freeze({
  "contortionistzooble": {
    "status": "verified-base-files",
    "sha256": {
      "stance": "049c3321b85af39607750a96c44e59d51fcf5b36d6026797dea25f273e9e1d7f",
      "selection": "b10ef7764390e499d60a0c32f1284e08a6cd43147a72d595f4f661bcee82ac84"
    },
    "visibleTraits": [
      "Assemblage entièrement replié, bas et asymétrique ; masse rose triangulaire, grand œil jaune à spirale en haut à droite et petit œil blanc sous paupière violette en bas à droite.",
      "Étoile orange et anneau violet à gauche, aile bleue à membrane cyan, segments noirs et blancs pliés, griffe bleue sur articulation menthe et violette, anneau cyan et pointes vertes en bas.",
      "Boule jaune et orange à embouts blancs ; conservation des chevauchements et pièces visibles sans déplier le corps ni attribuer de nouvelles articulations cachées."
    ],
    "identityEvidence": "GLITCH — Digital Circus Animiniz Side Show Series, Contortionist Zooble. Aucun costume contortionistzooble dans le catalogue de 484 apparences de départ. La pose officielle repliée reste entière ; ce n’est pas une tenue normale de Zooble recolorée.",
    "framing": "Silhouette entière dans la garde ; sélection conforme au cadrage documenté. Aucun assemblage caché dévoilé.",
    "transparency": "PNG RGBA natifs ; pixels transparents et bornes alpha > 12 mesurés. Valeurs alpha faibles natives conservées sans retouche.",
    "proportions": "Proportions du PNG conservées. Une seule vue de référence ; aucune rotation ou pose d’action déduite.",
    "issues": [],
    "scope": "Deux dessins de base uniquement : sélection et garde statique. Les neuf poses d’action sont explicitement hors périmètre de cette passe, sans dette de livraison pour cette famille. Source officielle qualifiée et comparaison visuelle de face ; aucune certification de correspondance pixel à pixel ou de modèle complet à toutes les vues.",
    "captureId": "docs/art-generation/base-sprites-20261124/official-costumes/asset-audit.json"
  },
  "hotdogabel": {
    "status": "verified-base-files",
    "sha256": {
      "stance": "d7c0b13f9bdea51206b600e64c08112191de3fe460f58bc219b455a8d84ab205",
      "selection": "bd25d79ed10cfe2674e4072c8c8e2005d821f8406c855c66b6f0443e720390b5"
    },
    "visibleTraits": [
      "Abel orange à tête allongée, deux yeux points noirs, sourire noir, visière grise ; main gauche de l’image levée et hot-dog tenu à droite.",
      "Chariot turquoise à comptoir clair, trois récipients, flacons rouge et jaune, graphisme de hot-dogs et emblème Caine ; grande roue à rayons claire et petite roulette.",
      "Personnage et chariot forment un ensemble indivisible. Le chariot conserve les jambes masquées ; seule la petite portion orange déjà visible sous le chariot demeure."
    ],
    "identityEvidence": "GLITCH — Digital Circus Animiniz Beach Vacation Series, Hotdog Cart Abel. Aucun costume hotdogabel dans le catalogue de départ ; ensemble personnage et chariot complet, différent d’Abel standard.",
    "framing": "Silhouette entière dans la garde ; sélection conforme au cadrage documenté. Aucun assemblage caché dévoilé.",
    "transparency": "PNG RGBA natifs ; pixels transparents et bornes alpha > 12 mesurés. Valeurs alpha faibles natives conservées sans retouche.",
    "proportions": "Proportions du PNG conservées. Une seule vue de référence ; aucune rotation ou pose d’action déduite.",
    "issues": [],
    "scope": "Deux dessins de base uniquement : sélection et garde statique. Les neuf poses d’action sont explicitement hors périmètre de cette passe, sans dette de livraison pour cette famille. Source officielle qualifiée et comparaison visuelle de face ; aucune certification de correspondance pixel à pixel ou de modèle complet à toutes les vues.",
    "captureId": "docs/art-generation/base-sprites-20261124/official-costumes/asset-audit.json"
  },
  "cafejax": {
    "status": "verified-base-files",
    "sha256": {
      "stance": "399520cbd1dfb461682f0333b60afbb7a4c94c5eabb95ccfb5b59af00de65ac7",
      "selection": "5a76b310aec47ac24aeea1692134deabd4f79b22b1c0f519d9e7272335d80791"
    },
    "visibleTraits": [
      "Lapin violet très élancé, oreilles inclinées inégales, yeux et dents jaunes ; coiffe blanche à volants et grand nœud bleu nuit derrière la tête.",
      "Robe bleu nuit et col blanc, petit cœur violet au corsage, tablier blanc à deux grands nœuds bleu nuit latéraux et ourlet festonné.",
      "Longs bas blancs avec petits revers blancs, chaussures bleu nuit à plateformes et petits fermoirs jaunes ; plateau argenté et tasse rouge conservés dans la composition statique."
    ],
    "identityEvidence": "Animate Café × The Amazing Digital Circus — Jax en tenue de café. Comparé à maidjax publié : le tablier à deux grands nœuds latéraux, le gros nœud de coiffe et les fermoirs jaunes des chaussures sont distincts. Le visuel officiel isolé du panneau marchandises confirme l’assemblage visible.",
    "framing": "Silhouette entière dans la garde ; sélection conforme au cadrage documenté. Aucun assemblage caché dévoilé.",
    "transparency": "PNG RGBA natifs ; pixels transparents et bornes alpha > 12 mesurés. Valeurs alpha faibles natives conservées sans retouche.",
    "proportions": "Proportions du PNG conservées. Une seule vue de référence ; aucune rotation ou pose d’action déduite.",
    "issues": [],
    "scope": "Deux dessins de base uniquement : sélection et garde statique. Les neuf poses d’action sont explicitement hors périmètre de cette passe, sans dette de livraison pour cette famille. Source officielle qualifiée et comparaison visuelle de face ; aucune certification de correspondance pixel à pixel ou de modèle complet à toutes les vues.",
    "captureId": "docs/art-generation/base-sprites-20261124/official-costumes/asset-audit.json"
  },
  "cafecaine": {
    "status": "verified-base-files",
    "sha256": {
      "stance": "5cdb20466d705131ba74dda2d3df4bd692fc97887da88fc19eff5c2c4b9fc59c",
      "selection": "22b15aea61f1cbcf282cdf46fe8fc108154f0095acbddc78c2ecc27af431e8e3"
    },
    "visibleTraits": [
      "Tête dentier à gencives rouges et rangées de dents blanches, iris bleu à gauche de l’image et vert à droite ; grand nœud bleu nuit et partie claire derrière la tête, sans haut-de-forme.",
      "Habit de service sombre avec plastron clair et petit nœud papillon, gants blancs, jambes courtes repliées et petits souliers sombres selon la pose documentée.",
      "Petite théière blanche à visage tenue en hauteur et filet de thé courbe conservés avec le personnage. Aucun haut-de-forme ni canne."
    ],
    "identityEvidence": "Animate Café × The Amazing Digital Circus — Caine en tenue de café. Distinct de ringmastercaine : grand nœud derrière le dentier et service au thé au lieu du haut-de-forme et de la canne ; silhouette flottante aux jambes repliées. Le panneau marchandises montre le même personnage isolé. La rangée supérieure de dents blanches ne constitue pas une coiffe indépendante inventée.",
    "framing": "Silhouette entière dans la garde ; sélection conforme au cadrage documenté. Aucun assemblage caché dévoilé.",
    "transparency": "PNG RGBA natifs ; pixels transparents et bornes alpha > 12 mesurés. Valeurs alpha faibles natives conservées sans retouche.",
    "proportions": "Proportions du PNG conservées. Une seule vue de référence ; aucune rotation ou pose d’action déduite.",
    "issues": [],
    "scope": "Deux dessins de base uniquement : sélection et garde statique. Les neuf poses d’action sont explicitement hors périmètre de cette passe, sans dette de livraison pour cette famille. Source officielle qualifiée et comparaison visuelle de face ; aucune certification de correspondance pixel à pixel ou de modèle complet à toutes les vues.",
    "captureId": "docs/art-generation/base-sprites-20261124/official-costumes/asset-audit.json"
  },
  "ribbitsuitjax": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "51fcd4e1336e4d3a99e7ba24a7c31202339b4f57e142a440d81f7c640680b120",
      "stance": "c86f4a62c23e715a8c3d7b51e5cf1c5828521840f0a3d89ce7e423ce70d3d973"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/root-official/review.json",
    "visibleTraits": [
      "Jax's lavender worried face and drooping ears",
      "Turquoise frog suit, pale belly, frog hood with purple segmented lids",
      "Coral bow at upper viewer-right; no neck bow",
      "Compact source proportions retained"
    ],
    "identityEvidence": "https://glitchproductions.store/products/ribbit-suit-jax-plush",
    "framing": "Composition entière dans la garde ; portrait de sélection cadré séparément.",
    "transparency": "PNG RGBA natifs, transparence et contours mesurés ; aucune modification des pixels après génération.",
    "proportions": "Échelle uniforme de la composition documentée. Aucune anatomie cachée ou pose d’action déduite.",
    "issues": [],
    "scope": "Full-body base and selection portrait inspected. One failed selection candidate with stray white debris replaced with a targeted native image edit. Final alpha >32 has a single continuous component. Source is a merchandise design; not an episode-wide official pose certification."
  },
  "cocktailzooble": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "d8bb9f76fd17c975605d484d14bc2684948aa15dee15a93a5c69893ec39f3b4f",
      "stance": "ff5313afc976af86e1ab76f08aebad7d8483ae4dd4742802b7f05618c96f1331"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/root-official/review.json",
    "visibleTraits": [
      "Pink triangular head, spiral eye disk, T and lightning antennas",
      "Yellow torso with pink spots and orange star",
      "Three arms preserve their visible overlaps: gray shaker, red drink, coconut on tray",
      "Asymmetric legs and feet retained on stance"
    ],
    "identityEvidence": "https://glitchproductions.store/products/digital-circus-artbook",
    "framing": "Composition entière dans la garde ; portrait de sélection cadré séparément.",
    "transparency": "PNG RGBA natifs, transparence et contours mesurés ; aucune modification des pixels après génération.",
    "proportions": "Échelle uniforme de la composition documentée. Aucune anatomie cachée ou pose d’action déduite.",
    "issues": [],
    "scope": "Full-body composition retained from the exact public source sticker. Selection is an upper-body portrait preserving all three arms/accessories. No unfolded or hidden anatomy asserted. Native alpha inspected; no opaque background."
  },
  "glitch-gaslightdistrict-ribbit-hommage": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "e77915690564a96fabef85ecf7e25abca28c121e72c5c6a4d008e984f54224af",
      "stance": "66617518058f3156e41dd8f903da15e6c1f8eca47d5933bd65335f669b324046"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Gaslight District · Hommage · Melancholy Hill"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/gaslight-district",
      "https://glitchproductions.store/products/mel-animatez"
    ],
    "designDescription": "Clothing-only homage to Melancholy Hill's visible outfit in the official figurine reference: a snug rusty-brown segmented wrap suit, cream rolled cowl collar, oversized flared brown wrist cuffs, dark-brown ankle gaiters. Fit the suit to Ribbit's very long thin green limbs and slim torso, leaving four green fingers and three webbed toes exposed. His pale belly becomes a pale inset shirt panel, pink bow tie on the cowl. A small orange fabric crest tied behind the eye mounds echoes Mel's swept orange tuft without giving Ribbit a human face or hiding either huge white eye. Preserve bright lime frog skin, both black wedge pupils, rosy cheeks and frog smile. Use the historical Gummigoo reference only for the brown worn-leather palette and Encore ink style, not its cowboy hat, long coat, snout or tail. No weapon, no stitches on skin, no glowing eyes.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-gaslightdistrict-ribbit-resident": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "8f926ebc01cf560df105e155b4d2a520ea73e63f9aad4a41d948ac140a817902",
      "stance": "8a78162e34580917c8f73017ffbb127f8764c073555ca3fced1e27a8db71f716"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Gaslight District · Résident · Gardien des écluses"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/gaslight-district"
    ],
    "designDescription": "Original canal lock keeper in the Gaslight District. Keep Ribbit's natural lime frog body and very long slender legs. Worn dark petrol-green knee-length dock coat with ochre edging and rolled cuffs, rust-red neck scarf with pink bow tie pinned at front, brown leather belt with a large simple brass key and small warm-yellow glass lantern fixed to hip; small battered brown brim hat fitted between the eyes, with a brass band; dark slate cropped trousers. Bare green four-finger hands and three-toed webbed feet, brown ankle straps. Lantern yellow remains inside glass with no glow, no floating effects. Modest wear on clothing, no gore. Costume based on the second reference but no crocodile head, snout, tail, spines or cowboy anatomy.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-gaslightdistrict-ribbit-fusion": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "39a5be66e97bf085fa1f85a8c8674d0d013155e48a1504c194836911cbdd386a",
      "stance": "dd89be460f5ecb16df9f1c425978f4df4d939472676fd08cd9fc3638a8ab6929"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Gaslight District · Fusion · Têtard des brumes"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/gaslight-district"
    ],
    "designDescription": "Genuinely reimagined Ribbit as a supernatural brackish-canal amphibian, one solid opaque body. Olive/lime frog face with the same two enormous white wedge-pupil eyes, round pink cheeks and broad smile; longer low-backed teal-green tadpole torso, one broad finned tail curling behind him, slim long four-fingered arms and powerful folded hind legs with three wide webbed toes. Subtle mossy skin patches, cream rib-like belly plates shaped as a small vintage lantern cage with warm yellow opaque inset glass at center, copper rib collars around the torso as organic structural features. Two soft rose gill frills at throat reinterpret Ribbit's pink bow. Small ragged rust fabric waist sash and brass ankle rings. Body design itself changed, not a costume on standard Ribbit. Use second-reference patinated metals, ragged coastal detail and green/ochre palette, but no crocodile snout, claws, pirate hat or weapons. Tail entire inside frame, no mist or separate glow despite the name.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-knightsofguinevere-ribbit-hommage": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "a7fce57acd0152b4aa0d1e0b280530bbc74791e168189836cf2fbeb1cae66e33",
      "stance": "b6376f1ebece192ca6123520d096f877cbaabf0e4b36e3899e69acf9ccbe91cc"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Knights of Guinevere · Hommage · Guinevere"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/knights-of-guinevere"
    ],
    "designDescription": "Clothing-only homage to Guinevere: small golden crown between the eyes; a royal-blue headpiece with two round side buns carrying pale lavender four-point stars, fitted BEHIND the huge unobstructed frog eyes. Pale lavender puff sleeves, a light periwinkle/lavender princess dress with white pointed center panel, golden waist tabs and narrow gold edging. The split skirt ends above ankles and shows Ribbit's long green legs and bare three-toed webbed feet; golden ankle bands. Ribbit's pink bow at neckline, green four-fingered hands. No jester horns, human hair, bells, mechanical body or skin recoloring. The costume evokes the second reference while Ribbit stays a tall thin frog.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-knightsofguinevere-ribbit-resident": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "579dc415bb1ba8413b9b79a5ea51783ab291287c4e897578e9cb0c5dd14b68cd",
      "stance": "f8d5a53457dc2705ee3d1e79e79e8510602a9ec6c951bb74220d7529133763e3"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Knights of Guinevere · Résident · Réparateur des automates"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/knights-of-guinevere"
    ],
    "designDescription": "Original amusement-park automaton maintenance worker, retaining Ribbit's natural lime frog body and long thin limbs. Cream work cap between/behind the eyes, brass goggles resting on its top; short slate-blue work jacket with rolled cream cuffs, cream shirt open over belly, pink bow tie, navy knee-length overalls with brass fasteners, small brown utility belt with one winding key and cream pouch, tidy slate-blue ankle cuffs with bare frog toes. A small amber indicator on cap is solid glass, not a glowing effect. This is practical park-worker clothing, not princess dress and not robot anatomy. Adapt second-reference costume materials without copying Pomni's jester cap, bells, red/blue body or face.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-knightsofguinevere-ribbit-fusion": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "54dba5e300c525c27563ccf6dce703a8c3637be3ac6ebb66b5655515aaae9b34",
      "stance": "5a7f5d5ad70616fe88b8d5210b67ac9b06a490d3cc613c48a656a594a5fe0763"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Knights of Guinevere · Fusion · Automate des bassins"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/knights-of-guinevere"
    ],
    "designDescription": "A genuinely redesigned frog-shaped amusement-park automaton. Ribbit's recognizable two immense white eyes and wedge pupils sit in round lime enamel housings above an elegant lime porcelain frog face with pink cheek discs and wide smile. The body is built from cream and mint porcelain shell segments with royal-blue floral motifs, exposed brass ring joints at elbows/knees, dark inner mechanical links; slim curved arms, sturdy elongated spring-jointed frog legs and broad articulated three-toed paddle feet. Small wind-up key mounted behind torso, a cream oval belly hatch bordered brass, pink bow-shaped enamel collar. The two spring coils inside rear-leg joints are structural; no detached pieces. Rounded blue shoulder shells and tasteful brass trim. Reimagine the anatomy as one coherent frog machine, not a frog wearing armor. No human face, jester cap, bells or knight sword. Entire key and all toes in frame.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-gameoverse-ribbit-hommage": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "c4efcadd5ace1d0f2ab7573f3a018a2d13e3d00fb06f89431223f842eb2e1052",
      "stance": "dbb21ae1869e362c68db9bdf9636737557da4c6eefb97e905f461698c27e748d"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Gameoverse · Hommage · Kit"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/gameoverse"
    ],
    "designDescription": "Clothing-only homage to Kit in the official yellow adventurer ensemble. Brown fabric hood with two short triangular cat-ear points and a golden headband, fitted BEHIND Ribbit's two huge frog eyes so neither is hidden; yellow sleeveless tunic with narrow off-white angular center stripe over charcoal short sleeves; charcoal shorts with yellow hems, two large yellow gauntlet cuffs each with a magenta star-shaped crystal inset inside dark circular coral-red ring, green four-finger hands emerging from cuffs. Yellow ankle cuffs over bare green three-toed webbed feet, small pink bow at collar. Crystals are opaque decorative inserts, no glow. Keep long thin frog limbs, frog face, smooth green skin; no cat tail, human hair, human face or new biological cat ears. Adapt Kit's costume, not her body.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-gameoverse-ribbit-resident": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "19db0b8a135b8511e6c5af3a410f911801f1bffcab74f7078d69bdabb45d25e1",
      "stance": "818ca927d546defab35ecf16300c5047c00630567fc3210fef6301711e4df700"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Gameoverse · Résident · Cartographe des portails"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/gameoverse"
    ],
    "designDescription": "Original videogame-world portal cartographer, retaining Ribbit's normal long-limbed lime frog body. Teal short explorer hood-cape with crisp golden angular trim, hood resting behind the huge exposed eyes, small orange star clasp next to pink bow tie; navy short tunic, charcoal knee shorts, narrow brown belt, small brown map satchel with geometric star badge and rolled cream map secured at hip. A small gold lantern-shaped blue-violet opaque crystal case hangs from belt; no aura or glow. Green four-finger hands and bare three-toed webbed feet, teal ankle wraps. Practical scout clothing, no oversized yellow gauntlets, no crown or mechanical body. Use second-reference material/palette continuity without Pomni's human head, jester horns, bells or red-blue anatomy.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-gameoverse-ribbit-fusion": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "3b09dd7977cdabaebf9c72740f3857b09d4edb3d1c6ff1446ae54958c1428bb8",
      "stance": "2025c0a1cbe76d1bb0fc22c3dbcc0599371408797665949a907429e6ca870db7"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Gameoverse · Fusion · Grenouille de cartouche"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/gameoverse"
    ],
    "designDescription": "True body redesign as a coherent cartridge-world digital amphibian. Retain Ribbit's two gigantic white eye bulges, wedge-cut black pupils, pink cheeks and wide frog smile. Lime-green body formed from crisp beveled polygonal cartridge blocks with royal-blue seam rails, a compact broad torso and articulated angular arms; chunky elongated springless segmented hind legs, broad three-toed geometric feet, four rounded block fingers. Cream belly resembles an inset cartridge label with a simple pink bow-shaped emblem and a small magenta star gem; no words, digits or labels. Small connected square notches on silhouette, a few mint/cyan inset accents, opaque solid body with no floating pixel fragments. A small rectangular cartridge ridge built into the upper back, no real console branding. This is a transformed body rather than armor or an outfit; no jester hat, portals, energy clouds, human skin, cat ears or new weapon.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-lackadaisy-ribbit-hommage": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "f8c2187c0b931eb4c96791cdcce8d02d082ab994664648f17a47c576df150511",
      "stance": "5a8c0b84520d6b4e7b4a919eea51f63bcfdacbe5dc911c37f43faa544946e065"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Lackadaisy · Hommage · Rocky Rickaby"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/lackadaisy",
      "https://lackadaisy.com/characters.php",
      "https://lackadaisy.store/products/rocky-standee"
    ],
    "designDescription": "Clothing-only homage to Rocky Rickaby as shown in the official acrylic standee: a blue-teal 1920s long suit coat and matching tailored trousers, golden mustard waistcoat, pale cream shirt, broad dark teal fedora with a bright yellow hatband fitted behind the huge frog eyes. Ribbit's small bright pink bow replaces a necktie; tiny violin-shaped brass lapel pin, brown ankle gaiters above bare green three-toed webbed feet. Preserve Ribbit's smooth lime frog face and thin long limbs, four-finger green hands, wide white eyes, pink round cheeks. No biological cat ears, fur, whiskers, cat tail, human hair or human features. All clothes cleanly tailored to Ribbit. The official standee provides blue/teal and mustard costume colors; the older Jax image only supplies Encore linework and period tailoring. No large handheld violin, no lettering, no standee backdrop.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-lackadaisy-ribbit-resident": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "93a8a398e63e4b1893fe065fe04b1d4589e631439d2f8a671f2061285c828341",
      "stance": "ee784df7c15e7581620d5043ecd3a0726d6dff43c455fa18379c78688df81e67"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Lackadaisy · Résident · Coursier du Little Daisy"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/lackadaisy",
      "https://lackadaisy.com/characters.php"
    ],
    "designDescription": "Original 1920s neighborhood courier adaptation for Ribbit in the Little Daisy district: a soft brown herringbone flat cap behind the two frog eyes, pale cream shirt with rolled sleeves, olive waistcoat with brass buttons, cropped high-waisted navy trousers and brown suspenders, worn brown leather messenger satchel attached by a diagonal strap, one cream folded envelope tucked into its pocket, dark brown ankle straps above bare webbed toes. Pink bow at collar, lime smooth frog face and uncovered thin green forearms and lower legs, four green fingers on each hand and three toes on each foot. Warm brown/olive/navy palette and period materials from the resident reference. No fur, feline ears, tail, weapons, cigarette, alcohol, human face, words or labels. A single coherent still character.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-lackadaisy-ribbit-fusion": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "270ce93ddd2ef106f1de75a647f8f42231d735ca72d28e51ae28ec02b35d7998",
      "stance": "5434f2164688c15d5233c1e39658dcf9499225a99fcde36ea443832548835d28"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Lackadaisy · Fusion · Chat des bayous"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.glitchprod.com/lackadaisy",
      "https://lackadaisy.com/characters.php"
    ],
    "designDescription": "An ORIGINAL physical frog-and-cat fusion, not a frog wearing a cat costume. Keep unmistakable Ribbit identity with two enormous protruding white frog eyes with black wedge-cut pupils, round pink cheeks, friendly wide cream frog muzzle and small pink bow. Rebuild the body as a slim moss-green short-furred feline-amphibian with two small triangular cat ears BEHIND the frog eyes, a few neat whiskers, elongated digitigrade frog-cat hind legs, broad three-toed webbed paws, four-fingered pawlike hands, and one long attached curved green striped feline tail fully inside the frame. Green fur and cream belly; do not use Jax's purple skin, long rabbit ears, yellow eyes or rabbit muzzle. Dress this reimagined anatomy in a cream rolled-sleeve 1920s shirt, dark brown pinstriped trousers ending below the knees, dark suspenders, pink bow tie. The silhouette must visibly differ anatomically from standard tall thin Ribbit while retaining frog eyes, pink cheeks, mouth and bow. No floating effects, claws out, body horror or extra limbs.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-smg4-ribbit-hommage": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "001bd73c5685f9768981da76586f17f47465aa84888bcba07f3f421c6ab35faf",
      "stance": "2581b8ca8e4c3a07079d53615d13878ccd965aee2be32ff4e83817874d8c69fd"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "SMG4 · Hommage · SMG4"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://steamcommunity.com/sharedfiles/filedetails/?id=2949486881"
    ],
    "designDescription": "Clothing-only homage to the blue-and-white SMG4 outfit seen in the official model on the LEFT of the third reference. Royal-blue rounded cap with small white badge bearing one simple blue film-camera pictogram; cap behind and above both huge uncovered frog eyes. Royal-blue long-sleeved shirt with cuffs rolled to reveal green wrists, clean white bib overalls with two golden hexagonal fasteners and a simple front pocket. Long trousers end above ankles, brown low ankle gaiters leaving three green webbed toes visible. Ribbit's bright pink bow at collar. Green four-fingered hands remain bare. One small rectangular camera prop clipped to belt, no lettering or logo overlay. Preserve Ribbit's thin body and very long legs, no human hair, moustache, ears, facial proportions or short stocky human body. No purple clothes from the right-hand model.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-smg4-ribbit-resident": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "ea0a00587d30ba842f612e8be82a17e2a0ebfb818e6d02a51250079ba202c702",
      "stance": "bee9f3f1f300332743e12002f5849de6ffabb1011845464cd2afccf650f42159"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "SMG4 · Résident · Accessoiriste des Showgrounds"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://steamcommunity.com/sharedfiles/filedetails/?id=2756834379",
      "https://steamcommunity.com/sharedfiles/filedetails/?id=2992370946"
    ],
    "designDescription": "Original Showgrounds stage prop technician. Retain natural thin long-limbed Ribbit anatomy and lime skin. Royal-blue and cream baseball work cap with a simple clapperboard pictogram, huge eyes exposed; navy sleeveless utility vest with one orange star patch, white short-sleeve shirt and pink bow tie, cream cargo trousers with royal-blue outer stripes, blue knee patches and one large blue side pocket, brown utility belt carrying a short roll of tape and small tool pouch. Green four-finger hands, blue ankle straps leaving green three-toed webbed feet bare. Clean lively sitcom-stage palette, no brand words, no moustache, no rabbit ears or purple skin. Separate clothing pieces, not robot body. Both hands free, no clapperboard held across the face.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-smg4-ribbit-fusion": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "ddf3116799f0427915944dabaceb86479b739fead4e8df5c788bd82258cf252a",
      "stance": "2bcdc98cabe58de4566a6fea741ef980493563ef191f1b6899cfe7cf44f9eee1"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "SMG4 · Fusion · Amphibien élastique"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde et portrait de sélection en pied, avec leurs contours entièrement contenus.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://steamcommunity.com/sharedfiles/filedetails/?id=2756834379"
    ],
    "designDescription": "True body redesign into an original theatrical rubber-hose cartoon amphibian for the SMG4 world. Ribbit's unmistakable lime frog face, two huge white wedge-pupil eyes, round pink cheeks and broad curved smile. Elastic one-piece lime body with a compact bean-shaped torso and long smooth hose arms, comically oversized broad four-finger hands with pale cream glove-like natural skin surfaces and green wrists; long flexible green legs ending in oversized soft three-toed frog feet, bright blue natural ankle bands. The oval cream belly incorporates a pink bow-shaped patch. A small blue stage cap sits behind eyes, a navy waist band with two gold fasteners echoes show clothing. Visible physical remodeling: enlarged hands/feet, curved bendy limbs and broad belly, coherent connected anatomy, no robot joints, no detached gloves, no motion smear, no stretch attack or spring. Use second-reference playful geometric treatment but avoid rabbit ears, red overalls, joystick antennae or purple body.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-ultrajumpmania-ribbit-hommage": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "901e0cdaf31739b988532e254b453645f864af0e0dac35fd47d195993f9d4793",
      "stance": "eba5b6de206de44793ba4a1b666246b081e09b582f04501574bb9a577182096c"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Ultra Jump Mania · Hommage · Theo"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde entière ; portrait de sélection volontairement en buste.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.youtube.com/watch?v=HZoOzz1CrAk"
    ],
    "designDescription": "Clothing-only homage to Theo of Ultra Jump Mania. Yellow short-sleeve island shirt with simple cream tropical flower pattern worn open over Ribbit's natural cream belly, coral-red shorts with a braided tan rope belt; small palm-leaf headpiece with a short white coconut-palm stalk and two golden seed beads, perched BEHIND the eyes and shaped like Theo's green hair/palm tuft without human hair. Bright pink bow tied at neckline. Bare four-finger green hands, tan low sandal straps around the three-toed webbed feet. Normal long slender frog legs, lime skin, huge white wedge-pupil eyes unobstructed. Warm yellow, coral, palm-green palette; third official pilot thumbnail anchors Theo's shirt, head tuft and bright tropical mood. No cowboy hat, crocodile snout, new tail, background fruit, held weapon or text.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-ultrajumpmania-ribbit-resident": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "1e0d350342f8c3f64dc008f5f78eb877b57a41dd8745f954b962373c9bbb9b9c",
      "stance": "cd09f1ac7ceab57f263dc3571af644d604fca7673f86a700270e5a10b305dd4d"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Ultra Jump Mania · Résident · Éclaireur du lagon"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde entière ; portrait de sélection volontairement en buste.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.youtube.com/watch?v=HZoOzz1CrAk"
    ],
    "designDescription": "Original lagoon scout wearing simple island survival clothing on Ribbit's normal lime frog body. Olive-green woven leaf brim hat fitted behind the eye mounds, small orange shell compass badge and two green leaves in hatband; turquoise short sleeveless wrap vest, tan rope harness and compact cream shell canteen at hip, green knee-length wrap shorts with pale curling wave pattern, one coral-red neck scarf tied under the small pink bow. Green four-fingered hands and long thin legs, bare three-toed webbed feet with simple rope ankle loops. Use the existing lagoon resident's foliage/shell/rope materials but no crocodile snout or tail, pirate coat, giant sword or magic effect. Every accessory is attached and inside frame.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  },
  "glitch-ultrajumpmania-ribbit-fusion": {
    "status": "verified-base-files",
    "sha256": {
      "selection": "118936ca4f79272fe4f00fb4e13ea18782eba2e4e9f21a896846f0c25d248497",
      "stance": "714fb19b60bd1b561ca89490230533dfa3032c82fdce7cd86e0ac1cef7d4050b"
    },
    "captureId": "docs/art-generation/base-sprites-20261124/crossovers/manifest.json",
    "visibleTraits": [
      "Identité de Ribbit conservée dans une création originale pour Encore.",
      "Ultra Jump Mania · Fusion · Têtard des cocotiers"
    ],
    "identityEvidence": "Interprétation originale relue avec les références d’univers documentées ; aucune apparition canonique de Ribbit dans cet univers affirmée.",
    "framing": "Garde entière ; portrait de sélection volontairement en buste.",
    "transparency": "Deux PNG RGBA natifs distincts ; transparence et marges alpha 12 vérifiées, sans détourage ni modification des pixels.",
    "proportions": "Silhouette native conservée et rendue à échelle uniforme. Garde orientée à droite ; miroir gauche utilisé comme convention du jeu.",
    "issues": [],
    "sourceUrls": [
      "https://www.youtube.com/watch?v=HZoOzz1CrAk"
    ],
    "designDescription": "Genuinely transformed tropical platform-world frog: a compact spherical coconut-brown torso with textured but clean simple coconut-husk plates, cream oval coconut-flesh belly, lime-green frog face and huge white wedge-pupil eyes, pink cheeks and friendly frog smile. Large strong green frog thighs with golden-yellow underside, shorter springy lower legs ending in three broad webbed toes; slender green arms with four leaf-tipped rounded fingers, one green leaf-shaped tadpole tail attached at the back and curving behind body, all inside frame. A small palm-leaf crest sprouts between the eyes with two yellow coconut buds, and a pink two-leaf throat frill forms Ribbit's bow motif. No separate full outfit: anatomy is coconut and foliage, not a standard frog in a leaf skirt. Short red fabric waist sash with cream zigzag pattern, no cowboy hat, crocodile snout, gun or coconut projectile. Opaque solid connected anatomy, no floating leaves or glow.",
    "scope": "Deux bases statiques uniquement. La garde est volontairement réutilisée pour les états non dessinés ; aucune pose d’action ou animation ajoutée."
  }
});

const crossoverGroups = [
  ['knightsofguinevere', 'Knights of Guinevere', ['Hommage · Guinevere', 'Résident · Réparateur des automates', 'Fusion · Automate des bassins']],
  ['gaslightdistrict', 'The Gaslight District', ['Hommage · Melancholy Hill', 'Résident · Gardien des écluses', 'Fusion · Têtard des brumes']],
  ['gameoverse', 'Gameoverse', ['Hommage · Kit', 'Résident · Cartographe des portails', 'Fusion · Grenouille de cartouche']],
  ['lackadaisy', 'Lackadaisy', ['Hommage · Rocky Rickaby', 'Résident · Coursier du Little Daisy', 'Fusion · Chat des bayous']],
  ['smg4', 'SMG4', ['Hommage · SMG4', 'Résident · Accessoiriste des Showgrounds', 'Fusion · Amphibien élastique']],
  ['ultrajumpmania', 'Ultra Jump Mania', ['Hommage · Theo', 'Résident · Éclaireur du lagon', 'Fusion · Têtard des cocotiers']],
];
const crossoverDefinitions = crossoverGroups.flatMap(([series, title, names]) =>
  ['hommage', 'resident', 'fusion'].map((style, index) => ({
    id: `glitch-${series}-ribbit-${style}`, fighterId: 'ribbit',
    name: `${title} · ${names[index]}`,
    crossover: Object.freeze({ series, style }),
    directory: `../assets/encore/crossovers/${series}/ribbit/${style}`,
    sourceKind: 'Création originale pour Encore', canonicalCostumeClaim: false,
  })));
const circusDefinitions = [
  {
    "id": "contortionistzooble",
    "fighterId": "zooble",
    "name": "Zooble — Contorsionniste",
    "sourceId": "glitch-side-show-contortionist-zooble",
    "sourceTitle": "GLITCH — Digital Circus Animiniz Side Show Series, Contortionist Zooble",
    "sourceUrl": "https://glitchproductions.store/products/digital-circus-animiniz-side-show-series",
    "imageUrl": "https://cdn.shopify.com/s/files/1/0786/4903/3026/files/Animiniz_SideShow_contortionistZooble.png?v=1773977710",
    "sourceKind": "Rendu officiel de figurine GLITCH",
    "sourceScope": "Apparence commerciale officielle ; aucune nouvelle apparition en épisode affirmée.",
    "traits": [
      "Assemblage entièrement replié, bas et asymétrique ; masse rose triangulaire, grand œil jaune à spirale en haut à droite et petit œil blanc sous paupière violette en bas à droite.",
      "Étoile orange et anneau violet à gauche, aile bleue à membrane cyan, segments noirs et blancs pliés, griffe bleue sur articulation menthe et violette, anneau cyan et pointes vertes en bas.",
      "Boule jaune et orange à embouts blancs ; conservation des chevauchements et pièces visibles sans déplier le corps ni attribuer de nouvelles articulations cachées."
    ],
    "staticConstraint": "Conserver l’amas complet dans une seule pose. Ne jamais produire une version debout ni une action à partir de l’amas.",
    "scope": "Deux dessins de base uniquement : sélection et garde statique. Les neuf poses d’action sont explicitement hors périmètre de cette passe, sans dette de livraison pour cette famille. Source officielle qualifiée et comparaison visuelle de face ; aucune certification de correspondance pixel à pixel ou de modèle complet à toutes les vues.",
    "visual": {
      "maxIllustratedWidth": 240
    }
  },
  {
    "id": "hotdogabel",
    "fighterId": "abel",
    "name": "Abel — Chariot à hot-dogs",
    "sourceId": "glitch-beach-hotdog-cart-abel",
    "sourceTitle": "GLITCH — Digital Circus Animiniz Beach Vacation Series, Hotdog Cart Abel",
    "sourceUrl": "https://glitchproductions.store/products/digital-circus-animiniz-beach-vacation-series",
    "imageUrl": "https://glitchproductions.store/cdn/shop/files/Beach_Series_Render_07.png?v=1765572441&width=1600",
    "sourceKind": "Rendu officiel de figurine GLITCH",
    "sourceScope": "Apparence commerciale officielle ; aucune nouvelle apparition en épisode affirmée.",
    "traits": [
      "Abel orange à tête allongée, deux yeux points noirs, sourire noir, visière grise ; main gauche de l’image levée et hot-dog tenu à droite.",
      "Chariot turquoise à comptoir clair, trois récipients, flacons rouge et jaune, graphisme de hot-dogs et emblème Caine ; grande roue à rayons claire et petite roulette.",
      "Personnage et chariot forment un ensemble indivisible. Le chariot conserve les jambes masquées ; seule la petite portion orange déjà visible sous le chariot demeure."
    ],
    "staticConstraint": "Ne pas retirer le chariot pour montrer ou inventer les jambes. Maintenir les accessoires et les roues dans chaque base.",
    "scope": "Deux dessins de base uniquement : sélection et garde statique. Les neuf poses d’action sont explicitement hors périmètre de cette passe, sans dette de livraison pour cette famille. Source officielle qualifiée et comparaison visuelle de face ; aucune certification de correspondance pixel à pixel ou de modèle complet à toutes les vues.",
    "visual": {
      "maxIllustratedWidth": 240
    }
  },
  {
    "id": "cafejax",
    "fighterId": "jax",
    "name": "Jax — Café",
    "sourceId": "animate-cafe-jax",
    "sourceTitle": "Animate Café × The Amazing Digital Circus — Jax en tenue de café",
    "sourceUrl": "https://prtimes.jp/main/html/rd/p/000008857.000016756.html",
    "imageUrl": "https://prcdn.freetls.fastly.net/release_image/16756/8857/16756-8857-67383ec049776a79e04eea0c153d49e4-1000x707.jpg?auto=webp&bg-color=fff&fit=bounds&format=jpeg&height=1350&quality=85,75&width=1950",
    "sourceKind": "Illustration officielle de collaboration commerciale",
    "sourceScope": "Collaboration officielle DECOTTO ; aucune tenue en épisode affirmée.",
    "traits": [
      "Lapin violet très élancé, oreilles inclinées inégales, yeux et dents jaunes ; coiffe blanche à volants et grand nœud bleu nuit derrière la tête.",
      "Robe bleu nuit et col blanc, petit cœur violet au corsage, tablier blanc à deux grands nœuds bleu nuit latéraux et ourlet festonné.",
      "Longs bas blancs avec petits revers blancs, chaussures bleu nuit à plateformes et petits fermoirs jaunes ; plateau argenté et tasse rouge conservés dans la composition statique."
    ],
    "staticConstraint": "Reprendre la pose documentée et le plateau. Ne pas générer d’actions ; ne pas emprunter les membres de Ragatha superposés dans l’affiche.",
    "scope": "Deux dessins de base uniquement : sélection et garde statique. Les neuf poses d’action sont explicitement hors périmètre de cette passe, sans dette de livraison pour cette famille. Source officielle qualifiée et comparaison visuelle de face ; aucune certification de correspondance pixel à pixel ou de modèle complet à toutes les vues.",
    "visual": {
      "maxIllustratedWidth": 180
    }
  },
  {
    "id": "cafecaine",
    "fighterId": "caine",
    "name": "Caine — Café",
    "sourceId": "animate-cafe-caine",
    "sourceTitle": "Animate Café × The Amazing Digital Circus — Caine en tenue de café",
    "sourceUrl": "https://prtimes.jp/main/html/rd/p/000008857.000016756.html",
    "imageUrl": "https://prcdn.freetls.fastly.net/release_image/16756/8857/16756-8857-67383ec049776a79e04eea0c153d49e4-1000x707.jpg?auto=webp&bg-color=fff&fit=bounds&format=jpeg&height=1350&quality=85,75&width=1950",
    "sourceKind": "Illustration officielle de collaboration commerciale",
    "sourceScope": "Collaboration officielle DECOTTO ; aucune tenue en épisode affirmée.",
    "traits": [
      "Tête dentier à gencives rouges et rangées de dents blanches, iris bleu à gauche de l’image et vert à droite ; grand nœud bleu nuit et partie claire derrière la tête, sans haut-de-forme.",
      "Habit de service sombre avec plastron clair et petit nœud papillon, gants blancs, jambes courtes repliées et petits souliers sombres selon la pose documentée.",
      "Petite théière blanche à visage tenue en hauteur et filet de thé courbe conservés avec le personnage. Aucun haut-de-forme ni canne."
    ],
    "staticConstraint": "Garder Caine et ses objets de service comme une composition statique. Ne pas reprendre le gâteau, Gangle ou Ribbit voisins ; pas de jambes rallongées ou d’angle arrière inventé.",
    "scope": "Deux dessins de base uniquement : sélection et garde statique. Les neuf poses d’action sont explicitement hors périmètre de cette passe, sans dette de livraison pour cette famille. Source officielle qualifiée et comparaison visuelle de face ; aucune certification de correspondance pixel à pixel ou de modèle complet à toutes les vues.",
    "visual": {
      "maxIllustratedWidth": 220
    }
  },
  {
    "id": "ribbitsuitjax",
    "fighterId": "jax",
    "name": "Jax — costume de Ribbit",
    "sourceId": "glitch-ribbit-suit-jax",
    "sourceTitle": "GLITCH — Ribbit Suit Jax Plush",
    "sourceUrl": "https://glitchproductions.store/products/ribbit-suit-jax-plush",
    "sourceKind": "Produit dérivé officiel",
    "sourceScope": "Apparence commerciale officielle ; aucune nouvelle apparition en épisode affirmée.",
    "traits": [
      "Visage inquiet de Jax violet lavande et oreilles tombantes.",
      "Combinaison de grenouille turquoise à ventre clair et capuche aux paupières violettes segmentées.",
      "Nœud corail en haut à droite de l’image ; aucun nœud au cou. Proportions compactes du produit conservées."
    ],
    "scope": "Apparence officielle de peluche distincte de Ribbit en costume de Jax. Les deux images sont des bases statiques pour Encore ; aucun événement en épisode ni neuf poses d’action affirmés."
  },
  {
    "id": "cocktailzooble",
    "fighterId": "zooble",
    "name": "Zooble — cocktail",
    "sourceId": "glitch-artbook-cocktail-zooble",
    "sourceTitle": "GLITCH — Digital Circus Artbook, sticker cocktail Zooble",
    "sourceUrl": "https://glitchproductions.store/products/digital-circus-artbook",
    "imageUrl": "https://glitchproductions.store/cdn/shop/files/Tier2_3_Stickers_1.webp?v=1789097565&width=1600",
    "sourceKind": "Illustration officielle de sticker GLITCH",
    "sourceScope": "Sticker promotionnel officiel de l’artbook ; aucune apparition en épisode affirmée.",
    "traits": [
      "Tête triangulaire rose, disque à œil spiralé, antennes en T et en éclair.",
      "Torse jaune à taches roses et étoile orange.",
      "Trois bras dans leurs chevauchements visibles : shaker gris, boisson rouge et noix de coco sur un plateau.",
      "Jambes et pieds asymétriques conservés dans la garde."
    ],
    "scope": "Composition statique de personnage et accessoires reproduite depuis le sticker public indiqué. Les deux bases préservent les trois bras et objets ; aucune anatomie cachée ni pose d’action extrapolée."
  }
].map(definition => ({ ...definition,
  directory: `../assets/encore/base-costumes/${definition.id}`,
  sourceKind: definition.sourceKind || 'Apparence officielle référencée ; illustration pour Encore',
  canonicalCostumeClaim: false,
}));

function staticFidelity(definition) {
  return Object.freeze({
    sourceIds: Object.freeze(definition.sourceId ? [definition.sourceId] : []),
    observedTraits: Object.freeze(definition.traits || (definition.crossover ? [
      'Identité de Ribbit conservée dans une interprétation originale pour Encore.', definition.name,
    ] : [definition.name, 'Composition statique limitée aux éléments visibles dans la référence.'])),
    combatAdaptation: 'Deux dessins de base : portrait et garde statique. Tous les états sans dessin dédié utilisent cette même garde intacte. Les techniques, statistiques et collisions restent celles du personnage.',
    reviewStatus: BASE_SPRITE_REVIEWS[definition.id]
      ? 'Deux fichiers de base vérifiés ; présentation statique déclarée'
      : 'Référence qualifiée ; dessins de base en attente de vérification',
    reviewScope: definition.scope || (definition.crossover
      ? 'Costume crossover original créé pour Encore. Deux bases seulement ; aucune pose d’action ni animation image par image annoncée. Cette création ne représente pas une apparition officielle de Ribbit dans cet univers.'
      : 'Apparence issue d’un visuel officiel ; les deux illustrations pour Encore demandent leur propre comparaison. Les neuf poses d’action ne font pas partie de cette famille statique. Aucune fidélité pixel à pixel ou vue cachée n’est certifiée.'),
    ...(BASE_SPRITE_REVIEWS[definition.id]?.visibleTraits ? { assetReview: Object.freeze({
      ...BASE_SPRITE_REVIEWS[definition.id], status: 'Portrait et garde statiques vérifiés',
      visibleTraits: definition.traits || BASE_SPRITE_REVIEWS[definition.id].visibleTraits,
      identityEvidence: definition.sourceTitle || BASE_SPRITE_REVIEWS[definition.id].identityEvidence,
    }) } : {}),
  });
}

/** Fixed append order after the complete 484-costume published prefix. */
export const BASE_SPRITE_DEFINITIONS = Object.freeze([...crossoverDefinitions, ...circusDefinitions].map(definition => Object.freeze({
  ...definition, introducedOn: '2026-11-24', nativeFacing: 1,
  baseOnly: true, presentation: 'static', authoredSlots: BASE_SPRITE_ART_SLOTS,
  assetReview: BASE_SPRITE_REVIEWS[definition.id] || null,
  fidelity: staticFidelity(definition),
})));

export const BASE_SPRITE_SOURCES = Object.freeze(BASE_SPRITE_DEFINITIONS.filter(definition => definition.sourceId && definition.sourceUrl).map(definition => Object.freeze({
  id: definition.sourceId, title: definition.sourceTitle || definition.name,
  url: definition.sourceUrl, ...(definition.imageUrl ? { imageUrl: definition.imageUrl } : {}),
  kind: definition.sourceKind, scope: definition.sourceScope || definition.scope,
})));

export function baseSpriteFiles(definition) {
  if (!definition || typeof definition.directory !== 'string'
    || !/^\.\.\/assets\/encore\/(?:base-costumes\/[a-z0-9-]+|crossovers\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+)$/.test(definition.directory)) {
    throw new Error('Static base requires its own declared Encore directory');
  }
  return BASE_SPRITE_ART_SLOTS.map(slot => `${definition.directory}/${slot}.png`);
}

export function publishedBaseSpriteDefinitions(definitions = BASE_SPRITE_DEFINITIONS, files = publishedArt) {
  const published = files instanceof Set ? files : new Set(files);
  const seen = new Set();
  return definitions.filter(definition => {
    if (!definition?.id || seen.has(definition.id)) throw new Error('Static base has a missing or duplicate ID: ' + definition?.id);
    seen.add(definition.id);
    const paths = baseSpriteFiles(definition), review = definition.assetReview;
    return definition.baseOnly === true && definition.presentation === 'static'
      && review?.status === 'verified-base-files'
      && BASE_SPRITE_ART_SLOTS.every(slot => /^[a-f0-9]{64}$/.test(review.sha256?.[slot] || ''))
      && paths.every(file => published.has(file));
  });
}

export function createBaseSpriteCostumes(fighters, definitions = BASE_SPRITE_DEFINITIONS, files = publishedArt) {
  const owners = new Set(fighters.map(fighter => fighter.id));
  return publishedBaseSpriteDefinitions(definitions, files).filter(definition => owners.has(definition.fighterId)).map(definition => {
    const { directory, nativeFacing, ...metadata } = definition;
    return {
      ...metadata, baseFighterId: definition.fighterId,
      sprite: { src: `${directory}/stance.png`, crossoverDirectory: directory,
        nativeFacing: nativeFacing === -1 ? -1 : 1, matteMode: 'native-alpha', baseOnly: true },
      animation: null,
    };
  });
}
