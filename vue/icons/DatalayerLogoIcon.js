const { createElementVNode: _createElementVNode, openBlock: _openBlock, createElementBlock: _createElementBlock } = require("vue")

module.exports = function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "aria-hidden": "true",
    viewBox: "0 0 20 20"
  }, [
    _createElementVNode("path", {
      fill: "#FFC11E",
      d: "M0 0h20v4H0zm0 0"
    }),
    _createElementVNode("path", {
      fill: "#FC6E6B",
      d: "M0 8h20v4H0zm0 0"
    }),
    _createElementVNode("path", {
      fill: "#EF1161",
      d: "M0 16h20v4H0zm0 0"
    })
  ]))
}