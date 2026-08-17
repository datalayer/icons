const fs = require("fs").promises;

const { rimraf } = require("rimraf");

const babel = require("@babel/core");
const camelcase = require("camelcase");
const cheerio = require("cheerio");
// `@svgr/core` v6+ exports its async converter as `default`; older v5 exposed
// `transform`. Handle both so the build works regardless of the installed
// version.
const svgrCore = require("@svgr/core");
const svgr = svgrCore.transform || svgrCore.default;

const { dirname } = require("path");

function parsePaintColor(paint) {
  const value = paint
    .trim()
    .replace(/\s*!important\s*$/i, "")
    .toLowerCase();
  const named = {
    black: [0, 0, 0],
    white: [255, 255, 255],
  };
  if (named[value]) {
    return named[value];
  }
  const hex = value.match(
    /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
  );
  if (hex) {
    let channels = hex[1];
    if (channels.length === 3 || channels.length === 4) {
      channels = channels
        .slice(0, 3)
        .split("")
        .map((channel) => channel + channel)
        .join("");
    }
    return [0, 2, 4].map((offset) =>
      parseInt(channels.slice(offset, offset + 2), 16),
    );
  }
  const rgb = value.match(
    /^rgba?\(\s*([\d.]+)%?[,\s]+([\d.]+)%?[,\s]+([\d.]+)%?/i,
  );
  if (rgb) {
    const usesPercent = value.slice(0, value.indexOf(")")).includes("%");
    return rgb.slice(1, 4).map((channel) => {
      const numeric = Number(channel);
      return usesPercent ? numeric * 2.55 : numeric;
    });
  }
  return null;
}

function extractGradientColors(svg) {
  const $ = cheerio.load(svg, { xmlMode: true });
  const gradients = new Map();
  $("linearGradient, radialGradient").each((_index, gradient) => {
    const element = $(gradient);
    const id = element.attr("id");
    if (!id) return;
    const colors = element
      .find("stop")
      .toArray()
      .flatMap((stop) => {
        const stopElement = $(stop);
        const direct = stopElement.attr("stop-color");
        const styled = stopElement
          .attr("style")
          ?.match(/(?:^|;)\s*stop-color\s*:\s*([^;]+)/i)?.[1];
        const parsed = parsePaintColor(direct || styled || "");
        return parsed ? [parsed] : [];
      });
    gradients.set(id, {
      colors,
      reference: (
        element.attr("href") ||
        element.attr("xlink:href") ||
        ""
      ).replace(/^#/, ""),
    });
  });

  const resolved = new Map();
  const resolve = (id, visited = new Set()) => {
    if (resolved.has(id)) return resolved.get(id);
    if (visited.has(id)) return null;
    visited.add(id);
    const gradient = gradients.get(id);
    if (!gradient) return null;
    const colors = gradient.colors.length
      ? gradient.colors
      : gradient.reference
        ? [resolve(gradient.reference, visited)].filter(Boolean)
        : [];
    if (!colors.length) return null;
    const average = [0, 1, 2].map(
      (index) =>
        colors.reduce((sum, color) => sum + color[index], 0) / colors.length,
    );
    resolved.set(id, average);
    return average;
  };
  for (const id of gradients.keys()) resolve(id);
  return resolved;
}

function resolvePaintColor(paint, gradientColors) {
  const direct = parsePaintColor(paint);
  if (direct) return direct;
  const gradient = paint.match(/url\(\s*["']?#([^"')\s]+)["']?\s*\)/i);
  if (!gradient) return null;
  const id = gradient[1].replace(/^prefix__/, "");
  return gradientColors.get(id) || null;
}

function paintStrength(paint, gradientColors) {
  const channels = resolvePaintColor(paint, gradientColors);
  if (!channels) {
    return 72;
  }
  const linear = channels.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  const luminance =
    0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  const chroma = (Math.max(...channels) - Math.min(...channels)) / 255;

  // Map native luminance into opaque shades of one hue. Mixing toward black
  // preserves the source's light-fill/dark-outline ordering without allowing
  // the swatch background to contaminate the requested theme or accent color.
  return Math.round(Math.min(96, 38 + 52 * luminance + 10 * chroma));
}

function tonalPaint(paint, baseColor, gradientColors) {
  const strength = paintStrength(paint, gradientColors);
  return `color-mix(in srgb, ${baseColor} ${strength}%, black)`;
}

function adaptiveTonalPaint(paint, baseColor, gradientColors) {
  const darkStrength = paintStrength(paint, gradientColors);
  const lightStrength = Math.max(38, Math.min(96, 134 - darkStrength));
  const canvas = "var(--bgColor-default, var(--color-canvas-default, Canvas))";
  return `light-dark(color-mix(in srgb, ${baseColor} ${lightStrength}%, ${canvas}), color-mix(in srgb, ${baseColor} ${darkStrength}%, ${canvas}))`;
}

function parseCssDeclarations(css) {
  return css.split(";").flatMap((declaration) => {
    const separator = declaration.indexOf(":");
    if (separator === -1) return [];
    const property = declaration.slice(0, separator).trim();
    const value = declaration.slice(separator + 1).trim();
    return property && value ? [[property, value]] : [];
  });
}

function inlineSvgStyles(svg) {
  const $ = cheerio.load(svg, { xmlMode: true });
  const inlineDeclarations = $("[style]")
    .toArray()
    .map((element) => ({
      element,
      declarations: parseCssDeclarations($(element).attr("style") || ""),
    }));
  const stylesByElement = new Map();
  const applyStyle = (element, declarations) => {
    const styles = stylesByElement.get(element) || new Map();
    for (const [property, value] of declarations) {
      styles.set(property, value);
    }
    stylesByElement.set(element, styles);
  };

  $("style").each((_index, style) => {
    const stylesheet = $(style).text();
    for (const rule of stylesheet.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      for (const selector of rule[1]
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)) {
        $(selector).each((_matchIndex, element) => {
          applyStyle(element, parseCssDeclarations(rule[2]));
        });
      }
    }
  });

  // Inline style attributes have higher precedence than stylesheet rules.
  for (const { element, declarations } of inlineDeclarations) {
    applyStyle(element, declarations);
  }
  for (const [element, styles] of stylesByElement) {
    $(element).attr(
      "style",
      [...styles].map(([property, value]) => `${property}:${value}`).join(";"),
    );
  }
  $("style").remove();
  return $.xml($("svg").first());
}

let transforms = {
  "icons-react": async (svg, componentName, format) => {
    const svgInlined = inlineSvgStyles(svg);
    const gradientColors = extractGradientColors(svgInlined);
    const hasNativePaints = [
      ...svgInlined.matchAll(
        /\b(?:fill|stroke)\s*(?:=\s*"([^"]+)"|:\s*([^;"]+))/gi,
      ),
    ].some(
      (match) =>
        !["none", "currentcolor"].includes(
          (match[1] || match[2]).trim().toLowerCase(),
        ),
    );

    // Strip fill="currentColor" from child SVG elements (path, circle, rect, etc.)
    // so they INHERIT from the <svg> root, which can be overridden by caller props.
    // Without this, child elements always resolve currentColor via CSS `color`,
    // ignoring any `fill` prop passed to the <svg>.
    const svgCleaned = svgInlined
      .replace(
        /<(path|circle|rect|polygon|polyline|ellipse|line|g)\b([^>]*?)\s+fill\s*=\s*"currentColor"/g,
        "<$1$2",
      )
      // Artwork must not introduce navigation, and currentColor inside an SVG
      // link would resolve from the host application's link styling.
      .replace(/<a\b[^>]*>/gi, "")
      .replace(/<\/a>/gi, "");

    let component;
    try {
      component = await svgr(
        svgCleaned,
        {
          ref: true,
          titleProp: true,
          plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        },
        { componentName },
      );
    } catch (error) {
      console.error(`Failed to transform ${componentName}`);
      throw error;
    }
    let { code } = await babel.transformAsync(component, {
      plugins: [
        [
          require("@babel/plugin-transform-react-jsx"),
          { useBuiltIns: true, throwIfNamespace: false },
        ],
      ],
    });

    const SIZE_MAP = {
      small: 16,
      medium: 32,
      large: 64,
    };

    const svgElement = cheerio.load(svg)("svg");
    const svgViewBox = svgElement.attr("viewBox").split(" ");

    const width = Number(svgViewBox[2]);
    const height = Number(svgViewBox[3]);

    let lines = code.split("\n");

    lines.splice(
      1,
      0,
      `\nconst sizeMap = ${JSON.stringify(SIZE_MAP, null, 2)};\n`,
    );
    lines.splice(5, 0, `  size,`);

    if (!componentName.endsWith("NoopIcon")) {
      lines.splice(6, 0, `  colored,`, `  themed,`);
    }

    lines.splice(
      14,
      0,
      `    ${width >= height ? "width" : "height"}: size ? typeof size === "string" ? sizeMap[size] : size : "16px",`,
    );
    code = lines.join("\n");

    if (!componentName.endsWith("NoopIcon")) {
      // Keep the source artwork for `colored`. Otherwise collapse every
      // visible fill and stroke to one inherited color. This applies equally
      // to data1 and data2, including gradients and white artwork. Paints set
      // to `none` remain transparent so outline icons keep their geometry.
      const themedPaint =
        "var(--datalayer-icon-color, var(--datalayer-icon-fg, currentColor))";
      const inheritedPaint = "var(--datalayer-icon-color, currentColor)";
      const monochromePaint = `(themed ? ${JSON.stringify(themedPaint)} : ${JSON.stringify(inheritedPaint)})`;
      const monochromeColor = `(themed ? 'var(--datalayer-icon-fg, currentColor)' : 'inherit')`;
      const flatTone = (originalPaint) =>
        `(props.color != null ? ${JSON.stringify(tonalPaint(originalPaint, inheritedPaint, gradientColors))} : (themed ? ${JSON.stringify(adaptiveTonalPaint(originalPaint, themedPaint, gradientColors))} : ${JSON.stringify(adaptiveTonalPaint(originalPaint, inheritedPaint, gradientColors))}))`;
      let canToneRootCurrentColor = hasNativePaints;
      code = code.replaceAll(
        /\b(fill|stroke|color): "([^"]+)"(,?)/g,
        (_match, attribute, originalPaint, comma) => {
          if (originalPaint.toLowerCase() === "none") {
            return `${attribute}: "none"${comma}`;
          }
          if (originalPaint === "currentColor") {
            if (canToneRootCurrentColor && attribute !== "color") {
              canToneRootCurrentColor = false;
              return `${attribute}: ${flatTone(originalPaint)}${comma}`;
            }
            return `${attribute}: ${attribute === "color" ? monochromeColor : monochromePaint}${comma}`;
          }
          const flatPaint =
            attribute === "color" ? monochromeColor : flatTone(originalPaint);
          return `${attribute}: colored ? ${JSON.stringify(originalPaint)} : ${flatPaint}${comma}`;
        },
      );
    }

    // Inject `colormode` prop support (opt-in, default false). When truthy,
    // the rendered SVG is wrapped in a <span> whose `data-color-mode` is the
    // inverse of the nearest ancestor's resolved color mode (or the explicit
    // value if passed as 'light' | 'dark'). This causes Primer's CSS variables
    // to resolve to the opposite theme inside the wrapper, effectively
    // rendering the icon in the inverted colormode without affecting siblings.
    const inverseHelper = `function _DlIconInverseColormode({\n  mode,\n  children\n}) {\n  const ref = React.useRef(null);\n  const [appearance, setAppearance] = React.useState({\n    mode: typeof mode === "string" ? mode : null,\n    lightTheme: null,\n    darkTheme: null\n  });\n  React.useLayoutEffect(() => {\n    if (typeof document === "undefined") return;\n    let currentMode = null;\n    let lightTheme = null;\n    let darkTheme = null;\n    let el = ref.current && ref.current.parentElement;\n    while (el && (!currentMode || !lightTheme || !darkTheme)) {\n      if (el.getAttribute) {\n        currentMode = currentMode || el.getAttribute("data-color-mode");\n        lightTheme = lightTheme || el.getAttribute("data-light-theme");\n        darkTheme = darkTheme || el.getAttribute("data-dark-theme");\n      }\n      el = el.parentElement;\n    }\n    if (!currentMode || currentMode === "auto") {\n      currentMode = (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";\n    }\n    setAppearance({\n      mode: typeof mode === "string" ? mode : (currentMode === "dark" ? "light" : "dark"),\n      lightTheme,\n      darkTheme\n    });\n  }, [mode]);\n  return /*#__PURE__*/React.createElement("span", {\n    ref: ref,\n    "data-color-mode": appearance.mode || "light",\n    "data-light-theme": appearance.lightTheme || undefined,\n    "data-dark-theme": appearance.darkTheme || undefined,\n    style: {\n      display: "inline-flex",\n      lineHeight: 0,\n      color: "var(--fgColor-default, var(--color-fg-default, currentColor))"\n    }\n  }, children);\n}\n\n`;

    // 1) Inject the helper before the icon component declaration.
    code = code.replace(/(function \w+\(\{)/, inverseHelper + "$1");

    // 2) Add `colormode` to the destructured props (just before `...props`).
    code = code.replace(/(  \.\.\.props\n\}, svgRef\) \{)/, "  colormode,\n$1");

    // 3) Wrap the returned svg element so it can be conditionally placed inside
    //    the inverse-colormode wrapper.
    code = code.replace(
      /  return (\/\*#__PURE__\*\/React\.createElement\("svg",[\s\S]*?\));\n\}\nconst ForwardRef/,
      '  const _svgEl = $1;\n  if (!colormode) return _svgEl;\n  return /*#__PURE__*/React.createElement(_DlIconInverseColormode, {\n    mode: typeof colormode === "string" ? colormode : undefined\n  }, _svgEl);\n}\nconst ForwardRef',
    );

    // Carry the explicit `color` prop in a dedicated variable used by every
    // generated paint. This remains authoritative even when consumer CSS sets
    // `color` on SVG descendants or links.
    code = code.replace(
      "  }, props),",
      '  }, props, {\n    "data-datalayer-icon": "",\n    style: props && props.color != null ? Object.assign({}, props.style, {\n      "--datalayer-icon-color": props.color,\n      color: props.color\n    }) : props && props.style\n  }),',
    );

    const colorModeCss =
      '[data-color-mode="light"]{--datalayer-icon-color-scheme:light}[data-color-mode="dark"]{--datalayer-icon-color-scheme:dark}svg[data-datalayer-icon]{color-scheme:var(--datalayer-icon-color-scheme, light dark)}';
    code = code.replace(
      "  }), title ?",
      `  }), /*#__PURE__*/React.createElement("style", null, ${JSON.stringify(colorModeCss)}), title ?`,
    );

    if (format === "esm") {
      return code;
    }

    return code
      .replace(
        'import * as React from "react"',
        'const React = require("react")',
      )
      .replace("export default", "module.exports =");
  },
};

async function getIcons(flavor) {
  let files = await fs.readdir(`./optimized/${flavor}`);
  return Promise.all(
    files.map(async (file) => ({
      svg: await fs.readFile(`./optimized/${flavor}/${file}`, "utf8"),
      svgName: file.replace(/\.svg$/, ""),
      componentInstance: `${camelcase(file.replace(/\.svg$/, ""), {
        pascalCase: false,
      })}Icon`,
      componentName: `${camelcase(file.replace(/\.svg$/, ""), {
        pascalCase: true,
      })}Icon`,
    })),
  );
}

function exportAll(icons, format, includeExtension = true) {
  return icons
    .map(({ componentInstance, componentName }) => {
      let extension = includeExtension ? ".js" : "";
      if (format === "esm") {
        return `export { default as ${componentName} } from './${componentName}${extension}'
// export { default as ${componentInstance}LabIcon } from './${componentName}LabIcon${extension}'`;
      }
      return `module.exports.${componentName} = require("./${componentName}${extension}")
// module.exports.${componentInstance}LabIcon = require("./${componentName}LabIcon${extension}")`;
    })
    .join("\n");
}

async function ensureWrite(file, text) {
  await fs.mkdir(dirname(file), { recursive: true });
  await fs.writeFile(file, text, "utf8");
}

async function ensureWriteJson(file, json) {
  await ensureWrite(file, JSON.stringify(json, null, 2) + "\n");
}

async function buildIcons(package, flavor, format) {
  let outDir = `./${package}/${flavor}`;
  if (format === "esm") {
    outDir += "/esm";
  }

  let icons = await getIcons(flavor);

  await Promise.all(
    icons.flatMap(
      async ({ componentName, componentInstance, svgName, svg }) => {
        let content = await transforms[package](
          svg,
          componentName,
          format,
          flavor,
        );

        const types = `import * as React from 'react';
declare const ${componentName}: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string, size?: "small" | "medium" | "large" | number, colored?: boolean, themed?: boolean, colormode?: boolean | "light" | "dark" } & React.RefAttributes<SVGSVGElement>>;
export default ${componentName};`;
        // Strip the `class` attribute from the ROOT <svg> element before writing
        // the .svg that LabIcon imports as its `svgstr`. JupyterLab's
        // LabIcon.getReactAttrs() renders the root svg as a React element and
        // camelCases attribute names — but camelCase('class') === 'class', so a
        // root `class` becomes an invalid React DOM prop and triggers: "Invalid
        // DOM property `class`. Did you mean `className`?". Only the root class is
        // removed (leftover design-tool marker like `cls-1`/`feather`/`lucide`);
        // child element classes and any <style> blocks are preserved. This .svg
        // file is consumed ONLY by the LabIcon variant — the React/JSX variant is
        // generated in-memory via svgr (which converts class -> className).
        let svgForLabIcon = svg.replace(
          /(<svg\b[^>]*?)\s+class\s*=\s*(?:"[^"]*"|'[^']*')/i,
          "$1",
        );
        // Give the root <svg> an intrinsic size when it has none. LabIcon
        // inlines the markup as it is, and an inline svg without width and
        // height falls back to the replaced-element default of 300×150 —
        // a sidebar tab icon the size of the sidebar. JupyterLab's own
        // icons carry `width="16"` for exactly this reason.
        if (!/<svg\b[^>]*\bwidth\s*=/i.test(svgForLabIcon)) {
          svgForLabIcon = svgForLabIcon.replace(
            /<svg\b/i,
            '<svg width="16" height="16"',
          );
        }
        ensureWrite(`${outDir}/${componentName}.svg`, svgForLabIcon);

        labComponentName = componentName.replace("Icon", "IconJupyterLab");
        labComponentInstance = componentInstance.replace(
          "Icon",
          "IconJupyterLab",
        );
        const labIconType = `import { LabIcon } from "@jupyterlab/ui-components";
declare const ${labComponentInstance}: LabIcon;
export default ${labComponentInstance};`;
        ensureWrite(`${outDir}/${labComponentName}.d.ts`, labIconType);
        const labIcon = `// The root import, not lib/icon/labicon: inside JupyterLab the root is a
// federation singleton, so this LabIcon is the class the host recognises
// with instanceof — a deep import bundles a private copy the host would
// not style (the icon then renders unstyled, at its intrinsic size).
import { LabIcon } from '@jupyterlab/ui-components';
import ${componentName}SvgStr from './${componentName}.svg';
const ${labComponentInstance} = new LabIcon({
    name: '@datalayer/icons:${svgName}',
    svgstr: ${componentName}SvgStr,
});
export default ${labComponentInstance};`;
        ensureWrite(`${outDir}/${labComponentName}.js`, labIcon);

        return [
          ensureWrite(`${outDir}/${componentName}.js`, content),
          ensureWrite(`${outDir}/${componentName}.d.ts`, types),
        ];
      },
    ),
  );

  await ensureWrite(`${outDir}/index.js`, exportAll(icons, format));

  await ensureWrite(`${outDir}/index.d.ts`, exportAll(icons, "esm", false));
}

/**
 * @param {string[]} flavors
 */
async function buildExports(flavors) {
  let pkg = {};

  // To appease Vite's optimizeDeps feature which requires a root-level import
  pkg[`.`] = {
    types: `./index.d.ts`,
    import: `./index.esm.js`,
    require: `./index.js`,
  };

  // For those that want to read the version from package.json
  pkg[`./package.json`] = { default: "./package.json" };

  // Explicit exports for each flavor:
  for (let flavor of flavors) {
    pkg[`./${flavor}`] = {
      types: `./${flavor}/index.d.ts`,
      import: `./${flavor}/esm/index.js`,
      require: `./${flavor}/index.js`,
    };
    pkg[`./${flavor}/*`] = {
      types: `./${flavor}/*.d.ts`,
      import: `./${flavor}/esm/*.js`,
      require: `./${flavor}/*.js`,
    };
    pkg[`./${flavor}/*.js`] = {
      types: `./${flavor}/*.d.ts`,
      import: `./${flavor}/esm/*.js`,
      require: `./${flavor}/*.js`,
    };
    pkg[`./${flavor}/*.svg`] = {
      types: `./${flavor}/*.d.ts`,
      import: `./${flavor}/esm/*.svg`,
      require: `./${flavor}/*.svg`,
    };

    // This dir is basically an implementation detail, but it's needed for
    // backwards compatibility in case people were importing from it directly.
    pkg[`./${flavor}/esm/*`] = {
      types: `./${flavor}/*.d.ts`,
      import: `./${flavor}/esm/*.js`,
    };
    pkg[`./${flavor}/esm/*.js`] = {
      types: `./${flavor}/*.d.ts`,
      import: `./${flavor}/esm/*.js`,
    };
    pkg[`./${flavor}/esm/*.svg`] = {
      types: `./${flavor}/*.d.ts`,
      import: `./${flavor}/esm/*.svg`,
    };
  }

  return pkg;
}

async function main(package) {
  const cjsPackageJson = { module: "./esm/index.js", sideEffects: false };
  const esmPackageJson = {
    type: "module",
    sideEffects: false,
    peerDependencies: { react: "*" },
  };

  console.log(`Building ${package} package...`);

  await Promise.all([
    rimraf(`./${package}/data1/*`),
    rimraf(`./${package}/data2/*`),
    rimraf(`./${package}/eggs/*`),
  ]);

  await Promise.all([
    //
    buildIcons(package, "data1", "cjs"),
    buildIcons(package, "data1", "esm"),
    ensureWriteJson(`./${package}/data1/esm/package.json`, esmPackageJson),
    ensureWriteJson(`./${package}/data1/package.json`, cjsPackageJson),
    //
    buildIcons(package, "data2", "cjs"),
    buildIcons(package, "data2", "esm"),
    ensureWriteJson(`./${package}/data2/esm/package.json`, esmPackageJson),
    ensureWriteJson(`./${package}/data2/package.json`, cjsPackageJson),
    //
    buildIcons(package, "eggs", "cjs"),
    buildIcons(package, "eggs", "esm"),
    ensureWriteJson(`./${package}/eggs/esm/package.json`, esmPackageJson),
    ensureWriteJson(`./${package}/eggs/package.json`, cjsPackageJson),
  ]);

  let packageJson = JSON.parse(
    await fs.readFile(`./${package}/package.json`, "utf8"),
  );

  packageJson.exports = await buildExports(["data1", "data2", "eggs"]);

  await ensureWriteJson(`./${package}/package.json`, packageJson);

  return console.log(`Finished building ${package} package.`);
}

let [package] = process.argv.slice(2);

if (!package) {
  throw new Error("Please specify a package");
}

main(package);
