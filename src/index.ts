// By its package name: "../icons-react" is a folder of this repository, not of the
// published @datalayer/icons-all, and Node refuses to import a directory.
import * as icons from "@datalayer/icons-react";

// With its extension: Node resolves an ES module's relative import only so.
export { DatalayerIcons } from "./DatalayerIcons.js";

export default icons;
