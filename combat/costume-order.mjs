/** Published Circus and NPC additions retain their shared append order. */
export const COSTUME_EXTENSION_ORDER = Object.freeze([
  "beachpomni",
  "noirragatha",
  "presidentpomni",
  "noirzooble",
  "beachragatha",
  "beachzooble",
  "beachjax",
  "sandcastlekinger",
  "noirpomni",
  "noirjax",
  "noirkinger",
  "badendcaine",
  "bodyguardragatha",
  "bodyguardzooble",
  "smilingtragedygangle",
  "abstractingpomni",
  "abstractingjax",
  "abstractingragatha",
  "abstractingkinger",
  "abstractinggangle",
  "abstractingzooble",
  "abstractingqueenie",
  "zoobleep5",
  "jaxsuitpomni",
  "noirribbit",
  "kaufmosuitribbit",
  "intermissioncaine",
  "showtimepomni",
  "bowlingpinragatha",
  "ringmastercaine",
  "strongmanorbsman",
  "stagehandbubble",
  "bugtamerkinger",
  "animeribbit",
  "jaxsuitribbit",
  "watermelongangle",
  "aquablasterpomni",
  "ptocaine",
  "freakjax",
  "caferibbit",
  "glitch-murderdrones-ribbit-hommage",
  "glitch-murderdrones-ribbit-resident",
  "glitch-murderdrones-ribbit-fusion",
  "cafekinger",
  "cafepomni",
  "glitch-metarunner-ribbit-hommage",
  "glitch-metarunner-ribbit-resident",
  "glitch-metarunner-ribbit-fusion",
  "caferagatha",
  "cafegangle",
  "cafezooble",
  "glitch-sunsetparadise-ribbit-hommage",
  "glitch-sunsetparadise-ribbit-resident",
  "glitch-sunsetparadise-ribbit-fusion"
]);

/** Resolve the explicit order without cloning or changing any costume record. */
export function orderCostumeExtensions(candidates, order = COSTUME_EXTENSION_ORDER) {
  const byId = new Map();
  for (const costume of candidates) {
    const id = costume?.id;
    if (typeof id !== 'string' || !id) throw new Error('Costume order: a costume requires a non-empty id');
    if (byId.has(id)) throw new Error('Costume order: duplicate costume id ' + id);
    byId.set(id, costume);
  }
  const seen = new Set();
  const ordered = order.map(id => {
    if (seen.has(id)) throw new Error('Costume order: duplicate order id ' + id);
    if (!byId.has(id)) throw new Error('Costume order: missing costume id ' + id);
    seen.add(id);
    return byId.get(id);
  });
  const unlisted = [...byId.keys()].filter(id => !seen.has(id));
  if (unlisted.length) throw new Error('Costume order: unlisted costume ids ' + unlisted.join(', '));
  return ordered;
}
