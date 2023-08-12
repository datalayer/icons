[![Datalayer](https://assets.datalayer.tech/datalayer-25.svg)](https://datalayer.io)

[![Become a Sponsor](https://img.shields.io/static/v1?label=Become%20a%20Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat&color=1ABC9C)](https://github.com/sponsors/datalayer)
 
# Ξ 🎉 Datalayer Icons

> React.js and JupyterLab icons for data products.

This repository contains a collection of [React.js](https://react.dev) icons useful at [Datalayer](https://datalayer.tech), covering [Jupyter](https://jupyter.org), [Kubernetes](https://kubernetes.io) and other ecosystems.

The icons are also shipped as [LabIcon](https://github.com/jupyterlab/jupyterlab/blob/main/packages/ui-components/README.md#labicon---set-up-and-render-icons) objects, ready-to use icons in [JupyterLab](https://github.com/jupyterlab/jupyterlab).

You are welcome to use those icons in your own data product. A preview is available on https://icons.datalayer.tech, give us [a star](https://github.com/datalayer/icons/stargazers) ⭐ if you like it.

The package is published on [NPM.js @datalayer/icons-react](https://www.npmjs.com/package/@datalayer/icons-react) and can be added as dependency on any JavaScript or TypeScript project.

<div align="center" style="text-align: center">
  <img alt="Datalayer Icons" src="https://assets.datalayer.tech/datalayer-icons-react.gif" />
</div>

Please open an [issue](https://github.com/datalayer/icons/issues) or a [pull request](https://github.com/datalayer/icons/pulls) to update, add... your icons or for any suggestion, question about this repository content.

We are looking to connect with existing data developers community, like the [Jupyter community](https://github.com/datalayer/icons/issues/31).

## For React.js developers

Add `@datalayer/icons-react` as dependency, import an icon and render it.

```typescript
import { DatalayerGreenIcon } from "@datalayer/icons-react";

render(
  <DatalayerGreenIcon/>
  <DatalayerGreenIcon size="large" colored/>
)
```

## For JupyterLab developers

[JupyterLab](https://github.com/jupyterlab/jupyterlab) icons need to be created with the [LabIcon](https://github.com/jupyterlab/jupyterlab/blob/main/packages/ui-components/README.md#labicon---set-up-and-render-icons) class. JupyterLab machinary are some restrictions as not being able to create a `LabIcon` from a React.js component (though being able to export a React.js component from a LabIcon), or not being able to load a SVG from a remote location (like a HTTP or S3 server).

For ease of use, we expose all the icons as `LabIcon` you can import and directly use.

```ts
import { scientistIconLabIcon } from '@datalayer/icons-react/data2/ScientistIconLabIcon';
```

If you need to create you own React component from a SVG, just import the optimized SVG artifact and reuse it in your application.

```ts
import satelliteIconSvg from '@datalayer/icons-react/data2/SatelliteIcon.svg';
```

To load SVG from TypeScript, you will need to create a type declaration file.

```ts
// svg.d.ts
declare module "*.svg" {
  const value: any;
  export default value;
}
```

## For Data Products designers

Designers will create a SVG and add it in one of the `svg` subfolder of this repository.

To add an icon to this repository, add the SVG (preferably of viewBox `0 0 20 20`) of the icon one of the `svg` sub-folder. Then run the following commands:

```bash
yarn
yarn run build-icons
```

You should see your icon in the `optimized` folder and also as a component in the `react` folder.

TODO: Describe the difference between `data1` and `data2`.

We will work to [create stencils for drawing tools](https://github.com/datalayer/icons/issues/2).

## Theming

We aim to support [Primer React](https://primer.style/react/theming), [JupyterLab](https://github.com/jupyterlab/jupyterlab/blob/main/packages/ui-components/README.md#labicon---set-up-and-render-icons) as [Docusaurus](https://docusaurus.io) themings.

## For users

You can download a `PNG` or `SVG` version of the icon from https://icons.datalayer.tech.

## Icons Gallery

To view an gallery of available icons, run the following commands.

```bash
yarn
yarn build
yarn vite
```

## Icon Properties

- `colored` - Display a colored version of the Icon (if available).
- `size`: `"small"` | `"medium"` | `"large"` | `number` - Specify the size of your icon - `"small"` by default.

```typescript
// For example.
<DatalayerIcon colored size="large"/>
```

## SVG Open Sources

These are useful places for open-source SVGs.

- Bootstrap Icons https://github.com/twbs/icons https://icons.getbootstrap.com
- Feather Icons https://github.com/feathericons/feather https://feathericons.com
- HeroIcons https://github.com/tailwindlabs/heroicons https://heroicons.com
- Iconify https://github.com/iconify/iconify https://icon-sets.iconify.design
- Icons.js https://github.com/antfu/icones https://icones.js.org
- Lucide https://github.com/lucide-icons/lucide https://lucide.dev
- OpenMoji https://github.com/hfg-gmuend/openmoji https://openmoji.org
- Radix UI Icons https://github.com/radix-ui/icons https://icons.radix-ui.com
- React Icons https://github.com/react-icons/react-icons https://react-icons.github.io/react-icons
- Science Icons https://github.com/curvenote/scienceicons
- Simple Icons https://github.com/simple-icons/simple-icons https://simpleicons.org
- Styled Icons https://github.com/styled-icons/styled-icons https://styled-icons.dev
- SVG Repo https://www.svgrepo.com

## Releases

Datalayer Icons is released in [Npm.js](https://www.npmjs.com/package/@datalayer/icons-react).

## ⚖️ License

Copyright (c) 2022 Datalayer, Inc.

The icons are released under the terms of the MIT license (see [LICENSE](./LICENSE)).

The 3rd party icons are redistributed for convenience under their respective license.
