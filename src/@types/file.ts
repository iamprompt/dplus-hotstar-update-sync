import type { ATHotstar } from './airtableHotstar'

export type SYNC_CONFIG = {
  AIRTABLE?: {
    API_KEY?: string
    BASE_ID?: string
  }
}

export type ASSETS_JSON = {
  // ContentID: AssetFields
  [key: string]: ATHotstar
}

export type ASSETS_AIRTABLE_PAIR_JSON = {
  // ContentID: Fields
  [key: string]: {
    recordId: string
    images: IMAGE_PAIR
  }}

export type IMAGE_PAIR = {
  // FileName: AirtableID
  [key: string]: string
}
