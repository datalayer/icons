const { createElementVNode: _createElementVNode, openBlock: _openBlock, createElementBlock: _createElementBlock } = require("vue")

module.exports = function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "#1DA1F2",
    "aria-hidden": "true",
    viewBox: "0 0 20 20"
  }, [
    _createElementVNode("path", { d: "M19.96 3.808a8.333 8.333 0 01-2.353.646 4.132 4.132 0 001.802-2.269 8.47 8.47 0 01-2.606.987 4.1 4.1 0 00-6.986 3.735c-3.409-.161-6.428-1.799-8.45-4.272a4.018 4.018 0 00-.555 2.063A4.1 4.1 0 002.635 8.11a4.087 4.087 0 01-1.857-.513v.05a4.102 4.102 0 003.289 4.022 4.162 4.162 0 01-1.844.07 4.114 4.114 0 003.837 2.848 8.223 8.223 0 01-5.085 1.755c-.325 0-.65-.02-.975-.056a11.662 11.662 0 006.298 1.84c7.544 0 11.665-6.246 11.665-11.654 0-.175 0-.35-.013-.525A8.278 8.278 0 0020 3.825l-.04-.017z" })
  ]))
}