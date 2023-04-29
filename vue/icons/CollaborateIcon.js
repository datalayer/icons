const { createElementVNode: _createElementVNode, openBlock: _openBlock, createElementBlock: _createElementBlock } = require("vue")

module.exports = function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "aria-hidden": "true",
    viewBox: "0 0 20 20"
  }, [
    _createElementVNode("path", {
      fill: "#000",
      "fill-rule": "evenodd",
      d: "M2.855 13.57v-.715H1.43v.715a5 5 0 005 5h2.14v-1.425H6.43a3.576 3.576 0 01-3.575-3.575zm12.86-7.14v.715h1.43V6.43c0-2.762-2.243-5-5-5H10v1.425h2.145a3.573 3.573 0 013.57 3.575zm-9.285 0H2.145A2.142 2.142 0 000 8.57V10h1.43V8.57c0-.394.32-.715.715-.715H6.43c.394 0 .715.32.715.715V10H8.57V8.57c0-1.183-.957-2.14-2.14-2.14zm-2.145-.715A2.857 2.857 0 104.29 0a2.857 2.857 0 00-.004 5.715zm0-4.285a1.427 1.427 0 110 2.855 1.427 1.427 0 110-2.855zm13.57 15H13.57c-1.183 0-2.14.957-2.14 2.14V20h1.425v-1.43c0-.394.32-.715.715-.715h4.285c.395 0 .715.32.715.715V20H20v-1.43c0-1.183-.96-2.14-2.145-2.14zm-5-3.575a2.857 2.857 0 105.715.004 2.857 2.857 0 00-5.715-.004zm4.29 0a1.43 1.43 0 01-2.86 0c0-.789.64-1.425 1.43-1.425.789 0 1.43.636 1.43 1.425zm0 0",
      "clip-rule": "evenodd"
    })
  ]))
}