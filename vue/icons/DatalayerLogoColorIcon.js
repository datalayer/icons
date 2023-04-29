const { createElementVNode: _createElementVNode, openBlock: _openBlock, createElementBlock: _createElementBlock } = require("vue")

module.exports = function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "aria-hidden": "true",
    viewBox: "0 0 20 20"
  }, [
    _createElementVNode("path", {
      fill: "#E26D6D",
      d: "M0 0h20v4H0zm0 0"
    }),
    _createElementVNode("path", {
      fill: "#F9CB07",
      d: "M0 8h20v4H0zm0 0"
    }),
    _createElementVNode("path", {
      fill: "#49B3D9",
      d: "M0 16h20v4H0zm0 0"
    })
  ]))
}