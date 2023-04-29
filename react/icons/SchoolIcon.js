const React = require("react");
function SchoolIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    "aria-hidden": "true",
    viewBox: "0 0 20 20",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.364
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinejoin: "round",
    d: "M.91 14.09a.91.91 0 01.908-.908h2.727V10L10 6.364 15.454 10v3.182h2.728a.909.909 0 01.909.909v4.09a.909.909 0 01-.91.91H.91v-5z"
  }), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    d: "M10 1.818v4.546"
  }), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M11.818 19.09v-5.908H8.182v5.909m-.91 0h5.455m2.727-14.546V1.818s-.681 1.364-2.727 0c-2.045-1.363-2.727 0-2.727 0v2.727s.682-1.363 2.727 0c2.046 1.364 2.727 0 2.727 0z"
  })));
}
const ForwardRef = React.forwardRef(SchoolIcon);
module.exports = ForwardRef;