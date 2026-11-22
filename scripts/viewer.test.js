/*
 * Copyright (c) 2023-2026 Datalayer, Inc.
 *
 * MIT License
 */

/**
 * The icons viewer ships as `@datalayer/icons-react/viewer` and nowhere else.
 *
 * Importing the icons must never load the viewer nor what it depends on
 * (`@primer/react`, `@primer/octicons-react`, `@datalayer/primer-addons`,
 * `html-to-image`), and importing the viewer must not load the icons: it
 * imports the sets when it mounts. Read from the built package
 * (`npm run build:react` first), bundled with esbuild to see the module graph
 * a consumer's bundler would.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const esbuild = require("esbuild");

const PACKAGE = path.join(__dirname, "..", "icons-react");
const FLAVORS = ["data1", "data2", "eggs", "aws"];
const VIEWER_PEERS = [
  "@primer/react",
  "@primer/octicons-react",
  "@datalayer/primer-addons",
  "html-to-image",
];

const read = (file) => fs.readFileSync(path.join(PACKAGE, file), "utf8");

/** Bundles one entry of the package, returning esbuild's metafile. */
async function bundle(entry, options = {}) {
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), "icons-viewer-"));
  try {
    const result = await esbuild.build({
      entryPoints: [path.join(PACKAGE, entry)],
      bundle: true,
      format: "esm",
      outdir,
      write: false,
      metafile: true,
      logLevel: "silent",
      external: ["react", "react/*", "react-dom", "react-dom/*"],
      ...options,
    });
    return result.metafile;
  } finally {
    fs.rmSync(outdir, { recursive: true, force: true });
  }
}

test("no barrel names the viewer", () => {
  const barrels = ["index.esm.js", "index.js", "index.d.ts"];
  for (const flavor of FLAVORS) {
    barrels.push(
      `${flavor}/index.js`,
      `${flavor}/index.d.ts`,
      `${flavor}/esm/index.js`,
    );
  }
  for (const barrel of barrels) {
    assert.doesNotMatch(read(barrel), /viewer/i, `${barrel} names the viewer`);
  }
});

test("the viewer is exported and packed by its subpath alone", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.deepEqual(pkg.exports["./viewer"], {
    types: "./viewer/index.d.ts",
    import: "./viewer/esm/index.js",
    require: "./viewer/index.js",
  });
  assert.ok(pkg.files.includes("viewer"));
  for (const [subpath, target] of Object.entries(pkg.exports)) {
    if (subpath !== "./viewer") {
      assert.doesNotMatch(JSON.stringify(target), /viewer/, subpath);
    }
  }
  for (const peer of VIEWER_PEERS) {
    assert.ok(pkg.peerDependencies[peer], `${peer} is a peer`);
    assert.equal(pkg.peerDependenciesMeta[peer].optional, true, peer);
  }
  for (const file of [
    "viewer/index.d.ts",
    "viewer/index.js",
    "viewer/esm/index.js",
  ]) {
    assert.match(read(file), /DatalayerIconsViewer/, file);
  }
});

test("importing the icons loads neither the viewer nor its dependencies", async () => {
  for (const entry of ["index.esm.js", "data1/esm/index.js", "data1/esm/A2AIcon.js"]) {
    const { inputs } = await bundle(entry);
    for (const input of Object.keys(inputs)) {
      assert.doesNotMatch(input, /(^|\/)viewer\//, `${entry} loads ${input}`);
      for (const peer of VIEWER_PEERS) {
        assert.ok(!input.includes(`node_modules/${peer}/`), `${entry} loads ${input}`);
      }
    }
  }
});

test("importing the viewer loads no icon until it mounts", async () => {
  const metafile = await bundle("viewer/esm/index.js", {
    splitting: true,
    external: ["react", "react/*", "react-dom", "react-dom/*", ...VIEWER_PEERS],
  });
  const [entryOutput] = Object.values(metafile.outputs).filter(
    (output) => output.entryPoint,
  );
  const iconInput = new RegExp(`/(${FLAVORS.join("|")})/esm/`);
  for (const input of Object.keys(entryOutput.inputs)) {
    assert.doesNotMatch(input, iconInput, `the viewer's own chunk holds ${input}`);
  }
  const lazy = entryOutput.imports.filter((i) => i.kind === "dynamic-import");
  assert.equal(lazy.length, FLAVORS.length, "one dynamic import per set");
  for (const chunk of lazy) {
    const inputs = Object.keys(metafile.outputs[chunk.path].inputs);
    assert.ok(inputs.some((input) => iconInput.test(input)), chunk.path);
  }
});
