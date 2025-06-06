const fs = require('fs').promises;

const { rimraf } = require('rimraf');

const babel = require('@babel/core');
const camelcase = require('camelcase');
const cheerio = require('cheerio');
const svgr = require('@svgr/core').default;

const { compile: compileVue } = require('@vue/compiler-dom')

const { dirname } = require('path')

let transforms = {

  'icons-react': async (svg, componentName, format, style) => {

    let component = await svgr(svg, { ref: true, titleProp: true }, { componentName })
    let { code } = await babel.transformAsync(component, {
      plugins: [[require('@babel/plugin-transform-react-jsx'), { useBuiltIns: true }]],
    })

    const SIZE_MAP = {
      small: 16,
      medium: 32,
      large: 64,
    };

    const svgElement = cheerio.load(svg)('svg')
    const svgViewBox = svgElement.attr('viewBox').split(" ")

    const width = Number(svgViewBox[2]);
    const height = Number(svgViewBox[3]);

    let lines = code.split('\n');

    lines.splice(1, 0, `\nconst sizeMap = ${JSON.stringify(SIZE_MAP, null, 2)};\n`);
    lines.splice(5, 0, `  size,`);

    if (!componentName.endsWith('NoopIcon')) {
      if (style !== 'data2') {
        lines.splice(6, 0, `  colored,`);
      }
    }

    lines.splice(14, 0, `    ${width >= height ? 'width' : 'height'}: size ? typeof size === "string" ? sizeMap[size] : size : "16px",`);
    code = lines.join('\n');

    if (!componentName.endsWith('NoopIcon')) {
      if (style !== 'data2') {
        code = code.replaceAll(/fill: "([#a-zA-Z0-9]+)",/g, `fill: colored ? '$1' : (['#fff', '#fffff', 'white', '#FFF', '#FFFFFF'].includes('$1') ? 'white' : 'currentColor'),`);
      }
    }

    if (format === 'esm') {
      return code
    }

    return code
      .replace('import * as React from "react"', 'const React = require("react")')
      .replace('export default', 'module.exports =')
  },

  'icons-vue': (svg, componentName, format) => {
    let { code } = compileVue(svg, {
      mode: 'module',
    })
    if (format === 'esm') {
      return code.replace('export function', 'export default function')
    }
    return code
      .replace(
        /import\s+\{\s*([^}]+)\s*\}\s+from\s+(['"])(.*?)\2/,
        (_match, imports, _quote, mod) => {
          let newImports = imports
            .split(',')
            .map((i) => i.trim().replace(/\s+as\s+/, ': '))
            .join(', ')

          return `const { ${newImports} } = require("${mod}")`
        }
      )
      .replace('export function render', 'module.exports = function render')
  },

}

async function getIcons(flavor) {
  let files = await fs.readdir(`./optimized/${flavor}`)
  return Promise.all(
    files.map(async (file) => ({
      svg: await fs.readFile(`./optimized/${flavor}/${file}`, 'utf8'),
      svgName: file.replace(/\.svg$/, ''),
      componentInstance: `${camelcase(file.replace(/\.svg$/, ''), {
        pascalCase: false,
      })}Icon`,
      componentName: `${camelcase(file.replace(/\.svg$/, ''), {
        pascalCase: true,
      })}Icon`,
    }))
  )
}

function exportAll(icons, format, includeExtension = true) {

  return icons
    .map(({ componentInstance, componentName }) => {
      let extension = includeExtension ? '.js' : ''
      if (format === 'esm') {
        return `export { default as ${componentName} } from './${componentName}${extension}'
// export { default as ${componentInstance}LabIcon } from './${componentName}LabIcon${extension}'`
      }
      return `module.exports.${componentName} = require("./${componentName}${extension}")
// module.exports.${componentInstance}LabIcon = require("./${componentName}LabIcon${extension}")`
    })
    .join('\n')
  }

async function ensureWrite(file, text) {
  await fs.mkdir(dirname(file), { recursive: true })
  await fs.writeFile(file, text, 'utf8')
}

async function ensureWriteJson(file, json) {
  await ensureWrite(file, JSON.stringify(json, null, 2) + '\n')
}

async function buildIcons(package, flavor, format) {

  let outDir = `./${package}/${flavor}`
  if (format === 'esm') {
    outDir += '/esm'
  };

  let icons = await getIcons(flavor);

  await Promise.all(

    icons.flatMap(async ({ componentName, componentInstance, svgName, svg }) => {

      let content = await transforms[package](svg, componentName, format, flavor)

      let types = package === 'icons-react'
          ? `import * as React from 'react';
declare const ${componentName}: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string, size?: "small" | "medium" | "large" | number, colored?: boolean } & React.RefAttributes<SVGSVGElement>>;
export default ${componentName};`
          : `import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';
declare const ${componentName}: FunctionalComponent<HTMLAttributes & VNodeProps>;
export default ${componentName};`
      ensureWrite(`${outDir}/${componentName}.svg`, svg);

      labComponentName = componentName.replace('Icon', 'IconJupyterLab');
      labComponentInstance = componentInstance.replace('Icon', 'IconJupyterLab');
      const labIconType = `import { LabIcon } from "@jupyterlab/ui-components/lib/icon/labicon";
declare const ${labComponentInstance}: LabIcon;
export default ${labComponentInstance};`
      ensureWrite(`${outDir}/${labComponentName}.d.ts`, labIconType);
      const labIcon = `import { LabIcon } from '@jupyterlab/ui-components/lib/icon/labicon';
import ${componentName}SvgStr from './${componentName}.svg';
const ${labComponentInstance} = new LabIcon({
    name: '@datalayer/icons:${svgName}',
    svgstr: ${componentName}SvgStr,
});
export default ${labComponentInstance};`
      ensureWrite(`${outDir}/${labComponentName}.js`, labIcon);

      return [
          ensureWrite(`${outDir}/${componentName}.js`, content),
          ...(types ? [ensureWrite(`${outDir}/${componentName}.d.ts`, types)] : []),
        ];

      }
    )
  );

  await ensureWrite(`${outDir}/index.js`, exportAll(icons, format))

  await ensureWrite(`${outDir}/index.d.ts`, exportAll(icons, 'esm', false))

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
  pkg[`./package.json`] = { default: './package.json' };

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

  };

  return pkg;

}

async function main(package) {

  const cjsPackageJson = { module: './esm/index.js', sideEffects: false };
  const esmPackageJson = { type: 'module', sideEffects: false };

  console.log(`Building ${package} package...`);

  await Promise.all([
    rimraf(`./${package}/data1/*`),
    rimraf(`./${package}/data2/*`),
    rimraf(`./${package}/eggs/*`),
  ]);

  await Promise.all([
    //
    buildIcons(package, 'data1', 'cjs'),
    buildIcons(package, 'data1', 'esm'),
    ensureWriteJson(`./${package}/data1/esm/package.json`, esmPackageJson),
    ensureWriteJson(`./${package}/data1/package.json`, cjsPackageJson),
    //
    buildIcons(package, 'data2', 'cjs'),
    buildIcons(package, 'data2', 'esm'),
    ensureWriteJson(`./${package}/data2/esm/package.json`, esmPackageJson),
    ensureWriteJson(`./${package}/data2/package.json`, cjsPackageJson),
    //
    buildIcons(package, 'eggs', 'cjs'),
    buildIcons(package, 'eggs', 'esm'),
    ensureWriteJson(`./${package}/eggs/esm/package.json`, esmPackageJson),
    ensureWriteJson(`./${package}/eggs/package.json`, cjsPackageJson),

  ]);

  let packageJson = JSON.parse(await fs.readFile(`./${package}/package.json`, 'utf8'));

  packageJson.exports = await buildExports([
    'data1',
    'data2',
    'eggs',
  ]);

  await ensureWriteJson(`./${package}/package.json`, packageJson);

  return console.log(`Finished building ${package} package.`);

}

let [package] = process.argv.slice(2);

if (!package) {
  throw new Error('Please specify a package')
}

main(package);
