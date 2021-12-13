export type Record<T> = {
  id: string
  fields: T
  createdTime: string
}

export type Records<T> = {
  records: Record<T>[]
  offset?: string
}

export type AttachmentImg = {
  id: string
  width: number
  height: number
  url: string
  filename: string
  size: number
  type: string
  thumbnails: {
    [key: string]: {
      url: string
      width: number
      height: number
    }
  }
}

export type ATHotstar = {
  ContentID: string
  Title: string
  EngTitle: string
  EntityType: string
  Encrypted: boolean
  StartDate: Date
  EndDate: Date
  Duration: number
  Genre: string[]
  Language: string[]
  Year: number
  Images: Partial<AttachmentImg>[]
  Studio: string
  ContentProvider: string
  TrailerParent: string[]
  EpisodeCount: number
  SeasonCount: number
  ClipCount: number
  SeasonNo: number
  EpisodeNo: number
  ShowParent: string[]
  SeasonName: string
  LiveStartTime: Date
  BroadcastDate: Date
  Description: string
  ParentalRating: string
}
