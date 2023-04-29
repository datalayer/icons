const React = require("react");
function DatalayerLogoGreenIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "aria-hidden": "true",
    viewBox: "0 0 20 20",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React.createElement("path", {
    fill: "#2ECC71",
    d: "M0 0h20v4H0zm0 0"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#1ABC9C",
    d: "M0 8h20v4H0zm0 0"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#16A085",
    d: "M0 16h20v4H0zm0 0"
  }));
}
const ForwardRef = React.forwardRef(DatalayerLogoGreenIcon);
module.exports = ForwardRef;