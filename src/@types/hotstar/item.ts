export type AssetItem = {
  title: string
  engTitle?: string
  contentId: number
  uri: string
  id: number
  description: string
  duration?: number
  entityType: string
  contentType?: string
  contentProvider?: string
  cpDisplayName?: string
  cpLogoUrl?: string
  assetType: string
  genre?: string[]
  lang: string[]
  premium: boolean
  live?: boolean
  hboContent?: boolean
  vip: boolean
  encrypted?: boolean
  startDate?: number
  endDate?: number
  year?: number
  playbackUri?: string
  images: Images
  imageSets: ImageSets
  studioId?: number
  studioName?: string
  contentDownloadable?: boolean
  offlineStorageTime?: number
  offlinePlaybackTime?: number
  playbackType?: string
  monetisable?: boolean
  langObjs: LangObj[]
  genreObjs?: Obj[]
  languageSelector?: number
  drmClass?: string
  downloadDrmClass?: string
  contentStartPointSeconds?: number
  badges?: string[]
  labels?: string[]
  clipType?: string
  trailers?: string[]
  parentalRating: number
  parentalRatingName?: string
  isSocialEnabled: boolean
  loginNudgeStatus: string
  orientation?: string
  autoplayObjs?: AutoplayObj[]
  isSubTagged: boolean
  collections?: Collection[]
  crisp?: string
  detail?: string
  categoryId?: number
  channelName?: string
  episodeCnt?: number
  channelObj?: Obj
  archived?: boolean
  liveStartTime?: number
  trailerParents?: string[]
  broadCastDate?: number
  seasonCnt?: number
  clipCnt?: number
  seasonNo?: number
  episodeNo?: number
  showName?: string
  showId?: number
  showContentId?: string
  showShortTitle?: string
  seasonName?: string
}

export type AutoplayObj = {
  contentId: string
  playbackType: string
  orientation: string
}

export type Obj = {
  id: number
  name: string
  detailUrl: string
}

export type Collection = {
  name: string
}

export type ImageSets = {
  DEFAULT: Images
}

export type Images = {
  v?: string
  h: string
  t?: string
  i?: string
  m?: string
}

export type LangObj = {
  hide: boolean
  id: number
  name: string
  iso3code: string
  detailUrl: string
  displayName?: string
}
