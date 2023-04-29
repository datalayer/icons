const React = require("react");
function KubernetesPodIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 18.035 17.5",
    fill: "currentColor",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React.createElement("path", {
    fill: "#326ce5",
    d: "M8.958.463a1.136 1.126 0 00-.435.11l-5.94 2.838a1.136 1.126 0 00-.614.764L.504 10.55a1.136 1.126 0 00.154.864 1.136 1.126 0 00.064.09l4.112 5.111a1.136 1.126 0 00.888.424l6.592-.001a1.136 1.126 0 00.888-.424l4.11-5.112a1.136 1.126 0 00.22-.953l-1.468-6.375a1.136 1.126 0 00-.615-.764L9.51.573a1.136 1.126 0 00-.55-.11z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.955.002a1.199 1.19 0 00-.459.117l-6.27 2.995a1.199 1.19 0 00-.65.806L.03 10.65a1.199 1.19 0 00.163.912 1.199 1.19 0 00.068.095l4.34 5.396a1.199 1.19 0 00.937.447l6.96-.001a1.199 1.19 0 00.937-.447l4.339-5.397a1.199 1.19 0 00.231-1.006l-1.549-6.73a1.199 1.19 0 00-.648-.806L9.537.118a1.199 1.19 0 00-.582-.116zm.003.461a1.136 1.126 0 01.55.11L15.45 3.41a1.136 1.126 0 01.615.764l1.467 6.375a1.136 1.126 0 01-.22.953l-4.109 5.113a1.136 1.126 0 01-.888.423l-6.593.001a1.136 1.126 0 01-.888-.424l-4.11-5.111a1.136 1.126 0 01-.065-.09 1.136 1.126 0 01-.154-.863l1.465-6.375a1.136 1.126 0 01.614-.764L8.523.574a1.136 1.126 0 01.435-.11z",
    style: {
      lineHeight: "normal",
      InkscapeFontSpecification: "Sans",
      textIndent: 0,
      textAlign: "start",
      textDecorationLine: "none",
      textTransform: "none",
      marker: "none"
    },
    fill: "#fff",
    color: "#000",
    fontFamily: "Sans",
    fontWeight: 400,
    overflow: "visible"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "#fff",
    fillRule: "evenodd"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5.397 6.213l3.62-1.05 3.622 1.05-3.621 1.05zM5.397 6.615v3.853l3.373 1.869.017-4.713zM12.639 6.615v3.853l-3.374 1.869-.017-4.713z"
  })));
}
const ForwardRef = React.forwardRef(KubernetesPodIcon);
module.exports = ForwardRef;