import fs from 'fs'
import path from 'path'

export const writeFileSync = (
  dirPath: string,
  fileName: string,
  data: any,
) => {
  fs.mkdirSync(dirPath, { recursive: true })
  fs.writeFileSync(path.join(dirPath, fileName), data, 'utf8')
}

export const readFileSync = (
  dirPath: string,
  fileName: string,
) => {
  return fs.readFileSync(path.join(dirPath, fileName), 'utf8')
}
