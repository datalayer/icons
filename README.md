[![Datalayer](https://assets.datalayer.design/datalayer-25.svg)](https://datalayer.io)

[![Become a Sponsor](https://img.shields.io/static/v1?label=Become%20a%20Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat&color=1ABC9C)](https://github.com/sponsors/datalayer)
 
# Ξ 🎉 Datalayer Icons

> Icons for Datalayer (React.js and Vue.js).

This repository contains a collection of React.js icons useful at [Datalayer](https://datalayer.tech), covering [Jupyter](https://jupyter.org), [Kubernetes](https://kubernetes.io) and other ecosystems.

Preview the icons on https://icons.datalayer.design.

<div align="center" style="text-align: center">
  <img alt="Datalayer Icons" src="https://datalayer-jupyter-examples.s3.amazonaws.com/datalayer-icons.png" />
</div>

Please open an [issue](https://github.com/datalayer/icons/issues) or a [pull request](https://github.com/datalayer/icons/pulls) to update, add... your icons or for any suggestion, question about this repository content.

## Gallery of Icons

To view an gallery of available icons, run the following commands.

```bash
yarn
yarn build
yarn vite
```

## Add an Icon

To add an icon to this repository, add the SVG (preferably of viewBox `0 0 20 20`) of the icon in `svg/outline` or `svg/solid`. Then run the following commands:

```bash
yarn
yarn run build-icons
```

You should see your icon in the `optimized` folder and also as a component in both `react` and `vue` folders

## Use the Icons

Add `@datalayer/icons-react` as dependency, import an icon and display it.

```typescript
import { DatalayerIcon } from "@datalayer/icons-react/solid";
// ...
render(
  <DatalayerIcon/>
)
```

Options

- `colored` - Display a colored version of the Icon (if available).
- `size`: `"small"` | `"medium"` | `"large"` | `number` - Specify the size of your icon - `"small"` by default.

```typescript
// For example
<DatalayerIcon colored size="large"/>
```

## ⚖️ License

Copyright (c) 2022 Datalayer, Inc.

The icons are released under the terms of the MIT license (see [LICENSE](./LICENSE)).

The 3rd party icons are redistributed for convenience under their respective license.
