import toDataView from "to-data-view"
import decodeBmp from "decode-bmp"
import * as PNG from "fast-png"

export function ico2pngs(data) {
  const icoView = toDataView(data)

  if (icoView.byteLength < 6) {
    throw new Error("Truncated header")
  }

  if (icoView.getUint16(0, true) !== 0) {
    throw new Error("Invalid magic bytes")
  }

  const type = icoView.getUint16(2, true)

  if (type !== 1 && type !== 2) {
    throw new Error("Invalid image type")
  }

  const length = icoView.getUint16(4, true)

  if (icoView.byteLength < 6 + 16 * length) {
    throw new Error("Truncated image list")
  }

  const pngs = []

  for (let i = 0; i < length; i++) {
    const size = icoView.getUint32(6 + 16 * i + 8, true)
    const offset = icoView.getUint32(6 + 16 * i + 12, true)
    const bmp = decodeBmp(
      new Uint8Array(icoView.buffer, icoView.byteOffset + offset, size),
      { icon: true }
    )

    pngs.push({
      pngData: PNG.encode({
        data: bmp.data,
        width: bmp.width,
        height: bmp.height,
        channels: bmp.colorDepth / 8,
      }),
      width: bmp.width,
      height: bmp.height,
      bitsPerPixel: bmp.colorDepth,
    })
  }

  return pngs
}
