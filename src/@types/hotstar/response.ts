import type { AssetItem } from './item'
import type { Trays } from './trays'

export type HotstarResponse<T> = {
  body: HotstarResponseBody<T>
  statusCode: string
  statusCodeValue: number
}

export type HotstarResponseBody<T> = {
  results: T
}

export type ResponseMeta = {
  totalResults: number
  offset: number
  size: number
  totalPageResults: number
  totalPages: number
  nextOffsetURL?: string
}

export type SearchResult = ResponseMeta &{
  items: AssetItem[]
  responseType: string
}

export type DetailResult = {
  uri: string
  pageType: string
  responseType: string
  item: AssetItem
  trays: Trays
}
