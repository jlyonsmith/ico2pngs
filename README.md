# ico2pngs

Extract the bitmaps from a `.ico` file and convert them to `.png` files. 

## Highlights

- Converts each image in the `.ico` file into `.png` data
- Returns png data in a buffer, width, height & bits per pixel
- Works in Node.js and in a browser

## Install 

```sh
npm install @johnls/ico2pngs
```

## Usage

In Node.js:

```js
import { ico2pngs } from "../src"
import fsPromise from "fs/promises"

;(async function () {
  var buf = await fsPromise.readFile("test/favicon.ico")
  var pngs = ico2pngs(buf.buffer)

  console.log(
    `width: ${pngs[0].width}, height: ${pngs[0].height}, bitsPerPixel: ${pngs[0].bitsPerPixel}`
  )
  await fsPromise.writeFile("scratch/favicon0.png", pngs[0].pngData)
})()
```
