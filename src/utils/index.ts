import dayjs from 'dayjs'
import type { AttachmentImg } from '../@types/airtableHotstar'
import type { IMAGE_PAIR } from '../@types/file'

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const isObjectEqual = (a: any, b: any, except: string[] = []) => {
  if (!a || !b) return false
  // Ignore properties that are undefined in both objects
  const aProps = Object.keys(a).filter((key) => a[key] !== undefined)
  const bProps = Object.keys(b).filter((key) => b[key] !== undefined)

  // console.log(aProps, bProps)

  if (aProps.length !== bProps.length) return false

  for (const prop of aProps) {
    // console.log(prop)
    if (except.includes(prop)) continue
    // Array Compare
    if (Array.isArray(a[prop]) && Array.isArray(b[prop])) {
      if (a[prop].length !== b[prop].length) return false
      for (let i = 0; i < a[prop].length; i++) {
        if (typeof a[prop][i] === 'object' || typeof b[prop][i] === 'object') continue
        if (!a[prop].includes(b[prop][i])) return false
        if (!b[prop].includes(a[prop][i])) return false
      }
    } else

    // Date Compare
    if (a[prop] instanceof Date || b[prop] instanceof Date) {
      if (!dayjs(a[prop]).isSame(dayjs(b[prop]))) return false
    } else

    // Object Compare
    if (typeof a[prop] === 'object' && typeof b[prop] === 'object') {
      if (!isObjectEqual(a[prop], b[prop])) return false
    } else

    // Simple value compare
    if (a[prop] !== b[prop]) {
      return false
    }
  }
  return true
}

export const ImagePairing = (pair: IMAGE_PAIR, img: Partial<AttachmentImg>[]) => {
  return img.reduce((acc, curr) => {
    // console.log(curr)
    if (pair[curr.filename])
      acc[curr.filename] = ({ id: pair[curr.filename], filename: curr.filename })
    else
      acc[curr.filename] = curr
    return acc
  }, {} as { [key: string]: Partial<AttachmentImg>})
}
