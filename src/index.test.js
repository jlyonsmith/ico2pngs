import { ico2pngs } from "."
import fsPromise from "fs/promises"

test("ico2pngs", async () => {
  const buf = await fsPromise.readFile("test/favicon.ico")
  const pngs = ico2pngs(buf.buffer)

  expect(pngs).toHaveLength(3)
  expect(pngs[0]).toMatchObject({ width: 48, height: 48, bitsPerPixel: 32 })
  expect(pngs[1]).toMatchObject({ width: 32, height: 32, bitsPerPixel: 32 })
  expect(pngs[2]).toMatchObject({ width: 16, height: 16, bitsPerPixel: 32 })
})
