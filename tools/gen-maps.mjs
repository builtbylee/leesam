// Generates the dot-matrix land paths and projected city positions used by index.html.
// Run from a folder with: npm i d3-geo topojson-client world-atlas ; node gen-maps.mjs  -> maps.json
import { geoMercator, geoNaturalEarth1, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import fs from 'fs';
const load = f => JSON.parse(fs.readFileSync(new URL('./node_modules/world-atlas/' + f, import.meta.url)));
const land50 = feature(load('land-50m.json'), load('land-50m.json').objects.land);
const land110 = feature(load('land-110m.json'), load('land-110m.json').objects.land);
const r1 = n => Math.round(n * 10) / 10;

function dots(proj, land, w, h, step, keep = () => true) {
  let d = '', n = 0;
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      const ll = proj.invert([x, y]);
      if (!ll || !keep(ll)) continue;
      if (geoContains(land, ll)) { d += `M${r1(x)} ${r1(y)}h0`; n++; }
    }
  }
  return { d, n };
}

// ---- EMEA: Mercator over the markets (Portugal to the UAE, Sweden to the Gulf)
const bbox = { type: 'Feature', geometry: { type: 'MultiPoint', coordinates: [[-11, 22.5], [58.5, 63.5]] } };
const W1 = 600;
const emeaProj = geoMercator().fitWidth(W1, bbox);
const [[, y0], [, y1]] = [emeaProj([-11, 63.5]), emeaProj([58.5, 22.5])];
const H1 = Math.round(y1 + y0 * 0 + 0); // top is ~0 after fitWidth
const emea = dots(emeaProj, land50, W1, H1, 8);
const markets = {
  uk: ['UK', -0.13, 51.51], de: ['Germany', 13.40, 52.52], fr: ['France', 2.35, 48.86], pt: ['Portugal', -9.14, 38.72],
  be: ['Belgium', 4.35, 50.85], nl: ['Netherlands', 4.90, 52.37], se: ['Sweden', 18.07, 59.33], ch: ['Switzerland', 7.45, 46.95],
  it: ['Italy', 12.50, 41.90], es: ['Spain', -3.70, 40.42], ae: ['UAE', 54.37, 24.45]
};
const emeaNodes = Object.fromEntries(Object.entries(markets).map(([k, [name, lon, lat]]) => { const [x, y] = emeaProj([lon, lat]); return [k, { name, x: r1(x), y: r1(y) }]; }));

// ---- World: Natural Earth, Antarctica trimmed
const W2 = 720;
const worldProj = geoNaturalEarth1().fitWidth(W2, { type: 'Sphere' });
const top = worldProj([0, 84])[1], bottom = worldProj([0, -57])[1];
worldProj.translate([worldProj.translate()[0], worldProj.translate()[1] - top + 4]);
const H2 = Math.round(bottom - top + 8);
const world = dots(worldProj, land110, W2, H2, 7, ([, lat]) => lat > -57);
const places = {
  london: ['London', -0.13, 51.51], busan: ['Busan', 129.08, 35.18], bali: ['Bali', 115.19, -8.41], petra: ['Petra', 35.44, 30.33],
  rio: ['Rio de Janeiro', -43.17, -22.91], machu: ['Machu Picchu', -72.55, -13.16], milwaukee: ['Milwaukee', -87.91, 43.04]
};
const worldNodes = Object.fromEntries(Object.entries(places).map(([k, [name, lon, lat]]) => { const [x, y] = worldProj([lon, lat]); return [k, { name, x: r1(x), y: r1(y) }]; }));

fs.writeFileSync(new URL('./maps.json', import.meta.url), JSON.stringify({ emea: { w: W1, h: H1, dots: emea.n, d: emea.d, nodes: emeaNodes }, world: { w: W2, h: H2, dots: world.n, d: world.d, nodes: worldNodes } }));
console.log('EMEA', W1 + 'x' + H1, 'dots', emea.n, 'bytes', emea.d.length, JSON.stringify(emeaNodes));
console.log('WORLD', W2 + 'x' + H2, 'dots', world.n, 'bytes', world.d.length, JSON.stringify(worldNodes));
