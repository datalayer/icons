/*
 * Copyright (c) 2023-2026 Datalayer, Inc.
 *
 * MIT License
 */

/**
 * Every icon is drawn at the size it is asked for.
 *
 * Read from the built package (`npm run build:icons` first): each component
 * sizes its root <svg> by the `size` prop among the root's own props, and each
 * optimized source has a viewBox and no fixed width or height. CodexColorIcon
 * once carried its size inside the root's `style` object, which the component
 * replaced, and drew unsized, far larger than the others.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const FLAVORS = ["data1", "data2", "eggs", "aws"];
const SIZE_LINE =
  /^ {4}(width|height): size \? typeof size === "string" \? sizeMap\[size\] : size : "16px",$/;

for (const flavor of FLAVORS) {
  test(`${flavor}: every icon sizes its root <svg>`, () => {
    const folder = path.join(ROOT, "icons-react", flavor, "esm");
    const icons = fs
      .readdirSync(folder)
      .filter((file) => /Icon\.js$/.test(file) && !/JupyterLab/.test(file));
    assert.ok(icons.length > 0);
    for (const file of icons) {
      const lines = fs.readFileSync(path.join(folder, file), "utf8").split("\n");
      const open = lines.findIndex((line) =>
        line.includes('React.createElement("svg", Object.assign({'),
      );
      assert.ok(open >= 0, `${file}: no root <svg>`);
      assert.match(lines[open + 1], SIZE_LINE, `${file}: size not on the root`);
    }
  });

  test(`${flavor}: every source has a viewBox and no fixed size`, () => {
    const folder = path.join(ROOT, "optimized", flavor);
    for (const file of fs.readdirSync(folder).filter((f) => f.endsWith(".svg"))) {
      const root = fs.readFileSync(path.join(folder, file), "utf8").match(/<svg\b[^>]*>/);
      assert.ok(root, `${file}: no <svg>`);
      assert.match(root[0], /\sviewBox="[^"]+"/, `${file}: no viewBox`);
      assert.doesNotMatch(root[0], /\s(width|height|style)="/, `${file}: fixed size`);
    }
  });
}
