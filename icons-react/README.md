[![Datalayer](https://images.datalayer.io/legacy/datalayer-25.svg)](https://datalayer.ai)

[![Become a Sponsor](https://img.shields.io/static/v1?label=Become%20a%20Sponsor&message=%E2%9D%A4&logo=GitHub&style=flat&color=1ABC9C)](https://github.com/sponsors/datalayer)
 
# ☰ 🎉 Datalayer Icons

> React.js and JupyterLab icons for data products.

The development is taking place in the [Icons](https://github.com/datalayer/icons) GitHub repository which contains a collection of React.js icons useful at [Datalayer](https://datalayer.tech), covering [Jupyter](https://jupyter.org), [Kubernetes](https://kubernetes.io) and other data ecosystems.

You can preview the icons on https://datalayer.design.

<div style={{textAlign: "center"}}>
  <img alt="Datalayer Icons" src="https://assets.datalayer.tech/datalayer-icons-react.gif" />
</div>

Please open an [issue](https://github.com/datalayer/icons/issues) or a [pull request](https://github.com/datalayer/icons/pulls) to update, add... your icons or for any suggestion, question about this repository content.

## The icons viewer

The searchable viewer of datalayer.design ships with the package, by its own
subpath only, so importing the icons never loads it:

```tsx
import { lazy } from "react";

const DatalayerIconsViewer = lazy(() => import("@datalayer/icons-react/viewer"));
```

It needs `@primer/react`, `@primer/octicons-react`, `@datalayer/primer-addons`
and `html-to-image` (optional peer dependencies, needed by the viewer alone),
under the `ThemedProvider` of `@datalayer/primer-addons`. The icon sets load
when the viewer mounts.
