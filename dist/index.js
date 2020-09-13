"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ico2pngs = ico2pngs;

var _toDataView = _interopRequireDefault(require("to-data-view"));

var _decodeBmp = _interopRequireDefault(require("decode-bmp"));

var PNG = _interopRequireWildcard(require("fast-png"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ico2pngs(data) {
  const icoView = (0, _toDataView.default)(data);

  if (icoView.byteLength < 6) {
    throw new Error("Truncated header");
  }

  if (icoView.getUint16(0, true) !== 0) {
    throw new Error("Invalid magic bytes");
  }

  const type = icoView.getUint16(2, true);

  if (type !== 1 && type !== 2) {
    throw new Error("Invalid image type");
  }

  const length = icoView.getUint16(4, true);

  if (icoView.byteLength < 6 + 16 * length) {
    throw new Error("Truncated image list");
  }

  const pngs = [];

  for (let i = 0; i < length; i++) {
    const size = icoView.getUint32(6 + 16 * i + 8, true);
    const offset = icoView.getUint32(6 + 16 * i + 12, true);
    const bmp = (0, _decodeBmp.default)(new Uint8Array(icoView.buffer, icoView.byteOffset + offset, size), {
      icon: true
    });
    pngs.push({
      pngData: PNG.encode({
        data: bmp.data,
        width: bmp.width,
        height: bmp.height,
        channels: bmp.colorDepth / 8
      }),
      width: bmp.width,
      height: bmp.height,
      bitsPerPixel: bmp.colorDepth
    });
  }

  return pngs;
}
//# sourceMappingURL=index.js.map