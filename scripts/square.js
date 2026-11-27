/*
 * Copyright (c) 2023-2026 Datalayer, Inc.
 *
 * MIT License
 */

/**
 * square.js <folder>...: fits the viewBox of every SVG in each folder to the
 * square around what it draws, so an icon fills its square with no margin
 * (OpenMoji's, in data2, draw within 72x72 with about 10 units around).
 *
 * The drawing is measured on its rendering by resvg (1024 pixels wide), so
 * strokes, transforms, clips and masks all count as they show: the box of the
 * pixels that are not transparent, mapped back to the viewBox. The square is
 * centred on it, its side the larger of the two. Run after svgo, on the
 * optimized folders.
 */
const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");

const round = (value) => Math.round(value * 1000) / 1000;

const RENDER_WIDTH = 1024;

/** The box, in the viewBox's units, of what the SVG draws. */
function drawnBox(file, svg) {
  const open = svg.match(/<svg\b[^>]*>/);
  const viewBox = open && open[0].match(/\sviewBox="([^"]*)"/);
  if (!viewBox) {
    throw new Error(`${file}: no viewBox`);
  }
  const [vx, vy, vw, vh] = viewBox[1].trim().split(/[\s,]+/).map(Number);
  const image = new Resvg(svg, { fitTo: { mode: "width", value: RENDER_WIDTH } }).render();
  const { width, height, pixels } = image;
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[(y * width + x) * 4 + 3] > 0) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < 0) {
    throw new Error(`${file}: draws nothing to fit`);
  }
  const sx = vw / width;
  const sy = vh / height;
  return { x: vx + left * sx, y: vy + top * sy, width: (right + 1 - left) * sx, height: (bottom + 1 - top) * sy };
}

function square(file) {
  const svg = fs.readFileSync(file, "utf8");
  const box = drawnBox(file, svg);
  const side = Math.max(box.width, box.height);
  const x = box.x - (side - box.width) / 2;
  const y = box.y - (side - box.height) / 2;
  const viewBox = [x, y, side, side].map(round).join(" ");
  const open = svg.match(/<svg\b[^>]*>/);
  if (!open) {
    throw new Error(`${file}: no <svg> element`);
  }
  const tag = open[0]
    .replace(/\s(viewBox|width|height)="[^"]*"/g, "")
    .replace(/^<svg\b/, `<svg viewBox="${viewBox}"`);
  fs.writeFileSync(file, svg.replace(open[0], tag));
}

const folders = process.argv.slice(2);
if (!folders.length) {
  throw new Error("usage: node scripts/square.js <folder>...");
}
let count = 0;
for (const folder of folders) {
  for (const name of fs.readdirSync(folder)) {
    if (name.endsWith(".svg")) {
      square(path.join(folder, name));
      count += 1;
    }
  }
}
console.log(`square: ${count} icons fitted to their square`);
