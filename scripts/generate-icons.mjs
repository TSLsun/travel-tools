import { readFileSync, writeFileSync } from 'fs'
import { Resvg } from '@resvg/resvg-js'

const svg = readFileSync(new URL('../public/icon.svg', import.meta.url), 'utf8')

for (const size of [192, 512]) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
  })
  const png = resvg.render().asPng()
  writeFileSync(new URL(`../public/icon-${size}.png`, import.meta.url), png)
  console.log(`icon-${size}.png`)
}
