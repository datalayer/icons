const React = require("react");
function WebrtcLogoIcon({
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
  }, title) : null, /*#__PURE__*/React.createElement("path", {
    fill: "#F60",
    d: "M11.1 15.08c0 2.428-2.014 4.396-4.5 4.396-2.484 0-4.499-1.968-4.499-4.395 0-2.427 2.014-4.395 4.5-4.395 2.485 0 4.499 1.968 4.499 4.395z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FC0",
    d: "M19.998 8.929c0 2.426-2.014 4.394-4.499 4.394S11 11.355 11 8.93c0-2.427 2.014-4.395 4.5-4.395 2.484 0 4.498 1.968 4.498 4.395z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#0089CC",
    d: "M9 8.831c0 2.427-2.014 4.395-4.5 4.395-2.484 0-4.498-1.968-4.498-4.395 0-2.427 2.014-4.395 4.499-4.395S9 6.404 9 8.831z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#009939",
    d: "M17.999 15.08c0 2.428-2.014 4.396-4.5 4.396C11.015 19.476 9 17.508 9 15.08c0-2.427 2.015-4.395 4.5-4.395s4.499 1.968 4.499 4.395z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#BF0000",
    d: "M14.5 4.925c0 2.427-2.015 4.394-4.5 4.394S5.5 7.352 5.5 4.925 7.516.53 10 .53s4.5 1.968 4.5 4.395z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#FC0007",
    d: "M11 8.929c0 .092.008.182.014.274 1.996-.45 3.485-2.193 3.485-4.279 0-.092-.008-.183-.014-.274C12.49 5.1 11 6.843 11 8.929z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#1CD306",
    d: "M11.594 11.104a4.515 4.515 0 003.905 2.22c.683 0 1.327-.154 1.906-.42a4.514 4.514 0 00-3.906-2.218c-.682 0-1.326.153-1.905.418z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#0F7504",
    d: "M9 15.08a4.31 4.31 0 001.05 2.82 4.315 4.315 0 000-5.638A4.312 4.312 0 009 15.08z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#0C5E87",
    d: "M2.72 12.866a4.57 4.57 0 001.78.36 4.515 4.515 0 003.882-2.18 4.57 4.57 0 00-1.781-.36 4.516 4.516 0 00-3.882 2.18z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#6B0001",
    d: "M5.52 4.554a4.27 4.27 0 00-.02.37c0 2.085 1.488 3.826 3.481 4.278.01-.123.02-.246.02-.37C9 6.746 7.512 5.004 5.52 4.553z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M5.94 14.537h-.704c-.621 0-1.127-.492-1.127-1.097V7.218c0-.606.506-1.098 1.127-1.098h8.826c.621 0 1.126.492 1.126 1.098v6.222c0 .605-.505 1.097-1.126 1.097h-3.007l-6.032 2.888.917-2.888z"
  }));
}
const ForwardRef = React.forwardRef(WebrtcLogoIcon);
module.exports = ForwardRef;