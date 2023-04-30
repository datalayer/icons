[![Datalayer](https://assets.datalayer.design/datalayer-25.svg)](https://datalayer.io)

[![Become a Sponsor](https://img.shields.io/static/v1?label=Become%20a%20Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat&color=1ABC9C)](https://github.com/sponsors/datalayer)

# 💡 🎉 Icons for Datalayer

> A collection of React.js icons to document your data architectures https://icons.datalayer.design

This is a collection of React.js icons to document your data architectures, focused on the [Jupyter](https://jupyter.org) and [Kubernetes](https://kubernetes.io) ecosystems.

Please open an [issue](https://github.com/datalayer/icons/issues) or a [pull request](https://github.com/datalayer/icons/pulls) to update, add... your icons or for any suggestion, question or claim about this repository content.

To preview the icons, run the following commands.

```bash
yarn
yarn vite
```

You can see more content around design on the [Datalayer Design](https://datalayer.design) website.

## Adding an Icon

To add an icon to this repository:

- Add the SVG (preferably of viewBox `0 0 20 20`) of the icon in `svg/outline` or `svg/solid`
- To build the IconComponent, run:
```
yarn
yarn run build-icons
```
- You should see your icon in the `optimized` folder and also as a component in both `react` and `vue` folders
- Import the IconComponent in `src/index.ts`
- Build the vite application by running:
```
yarn vite
```

## ⚖️ License

Copyright (c) 2022 Datalayer, Inc.

The icons are released under the terms of the MIT license (see [LICENSE](./LICENSE)).

The Jupyter and 3rd party icons are redistributed for convenience under their respective license.

This repository contains source code taken from https://github.com/tailwindlabs/heroicons