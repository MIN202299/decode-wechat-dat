import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import async from 'async'

// 值是多少自己算。
const base = 0xFF
const next = 0xD8
const gifA = 0x47
const gifB = 0x49
const pngA = 0x89
const pngB = 0x50

const scanDir = 'C:\\Users\\20385\\Documents\\WeChat Files\\wxid_0awwi88sxah222\\FileStorage\\MsgAttach\\4e9ba30dd2e5c39c506f3eeacc92ac7b\\Image\\2023-10'
const imgDir = scanDir

const files = fs.readdirSync(scanDir)
const arr = []
files.forEach((item) => {
  if (path.extname(item) === '.dat')
    arr.push(item)
})
async.mapLimit(arr, 50, (item, cb) => {
  convert(item, cb)
}, () => {
  process.exit(0)
})
// convert
function convert(item, cb) {
  const absPath = path.join(scanDir, item)
  const imgPath = path.join(imgDir, `${item}.jpg`)
  fs.readFile(absPath, (err, content) => {
    if (err) {
      console.log(err)
      cb(err)
    }
    const firstV = content[0]
    const nextV = content[1]
    const jT = firstV ^ base
    const jB = nextV ^ next
    const gT = firstV ^ gifA
    const gB = nextV ^ gifB
    const pT = firstV ^ pngA
    const pB = nextV ^ pngB
    let v = firstV ^ base
    if (jT == jB)
      v = jT

    else if (gT == gB)
      v = gT

    else if (pT == pB)
      v = pT

    const bb = content.map((br) => {
      return br ^ v
    })
    fs.writeFileSync(imgPath, bb)
    cb(null)
  })
}
