import type { AssetItem } from './item'
import type { ResponseMeta } from './response'

export type Trays = ResponseMeta & {
  items: Array<TrayItem>
}

export type TrayItem = {
  title: string
  engTitle: string
  uri: string
  id: number
  traySource: string
  addIdentifier: string
  assets: TrayAssets
  trayTypeId: number
  traySourceId: number
  uqId: string
  globalId: string
}

export type TrayAssets = ResponseMeta & {
  items: Array<AssetItem>
}
