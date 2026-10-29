/** Presentation-only cues: no simulation value is changed by these readouts. */
const clamp = (value, low, high) => Math.max(low, Math.min(high, Number(value) || 0));

export function fighterReadout(actor) {
  const maximum = Math.max(1, Number(actor.max) || 1);
  const life = clamp(actor.life, 0, maximum), guard = clamp(actor.guard, 0, 100), meter = clamp(actor.meter, 0, 100);
  const move = actor.f?.combat?.moves?.super || actor.def?.combat?.moves?.super;
  const resource = actor.f?.combat?.resource || actor.def?.combat?.resource || {};
  const requiredMeter = Math.max(0, Number(move?.meter) || 0), cost = Math.max(0, Number(move?.cost) || 0);
  const resourceReady = ['heat', 'cost'].includes(resource.kind)
    ? actor.r + cost <= (resource.max || 100) + .001 : actor.r >= cost;
  const charged = !!move && meter >= requiredMeter;
  const ready = charged && resourceReady && !(actor.cooldowns?.super > 0) && life > 0;
  const critical = life > 0 && life / maximum <= .25;
  const status = [];
  if (life <= 0) status.push('KO');
  else {
    if (critical) status.push('VIE CRITIQUE');
    if (guard <= 25) status.push('GARDE FRAGILE');
    if (ready) status.push('FINALE PRÊTE');
    else if (charged && !resourceReady) status.push('RESSOURCE REQUISE');
    else if (charged && actor.cooldowns?.super > 0) status.push('FINALE EN RÉCUPÉRATION');
  }
  return { life, maximum, guard, meter, requiredMeter, ready, critical, status: status.join(' · ') };
}

/** Slot identity follows actors when they cross; close badges occupy separate rows. */
export function fighterMarkers(actors) {
  const markers = actors.slice(0, 2).map((actor, index) => {
    const fighter = actor.f || actor.def;
    const height = fighter?.visual?.height || fighter?.combat?.simulationBody?.height || 230;
    return { label: `J${index + 1}`, shape: index ? 'diamond' : 'circle', x: clamp(actor.x, 80, 1200), y: clamp((actor.y ?? 568) - height - 52, 42, 600) };
  });
  if (markers.length === 2 && Math.abs(markers[0].x - markers[1].x) < 180 && Math.abs(markers[0].y - markers[1].y) < 104) {
    if (markers[1].y >= 146) markers[1].y -= 104;
    else markers[0].y += 104;
  }
  return markers;
}
