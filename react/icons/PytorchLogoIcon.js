const React = require("react");
function PyTorchLogoIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 20 20",
    "aria-hidden": "true",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React.createElement("path", {
    fill: "#EE4C2C",
    d: "M15.882 5.877L14.43 7.33a6.218 6.218 0 010 8.782 6.218 6.218 0 01-8.782 0 6.218 6.218 0 010-8.782L9.52 3.457l.484-.553V0L4.127 5.877a8.221 8.221 0 000 11.686 8.22 8.22 0 0011.685 0c3.32-3.25 3.32-8.505.07-11.686z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#EE4C2C",
    d: "M12.977 5.462a1.106 1.106 0 100-2.212 1.106 1.106 0 000 2.212z"
  }));
}
const ForwardRef = React.forwardRef(PyTorchLogoIcon);
module.exports = ForwardRef;