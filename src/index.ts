import axios from 'axios'
import { readFileSync, readJSONSync, writeFileSync } from 'fs-extra'
import dayjs from './utils/dayjs'
import type { ATHotstar, AttachmentImg, Records } from './@types/airtableHotstar'
import type { HotstarSearch } from './@types/hotstarSearch'
import { AirtableAPI } from './utils/airtable'
import { hotstarAPIInstance } from './utils/hotstar'
import { delay, ImagePairing, isObjectEqual } from './utils'
import type { ASSETS_AIRTABLE_PAIR_JSON, ASSETS_JSON, IMAGE_PAIR } from './@types/file'

const DATA_DIR = './data'
const ASSETS_FILE = `${DATA_DIR}/assets.json`
const ASSETS_PAIR_FILE = `${DATA_DIR}/assetsAirtable.json`

let OLD_ASSET: ASSETS_JSON = {}
const ASSETS: ASSETS_JSON = {}
let ASSETS_PAIR: ASSETS_AIRTABLE_PAIR_JSON = {}

const getAssetsAirtable = async () => {
  const assets: ASSETS_JSON = {}
  let offset: string | undefined
  do {
    const options: { [key: string]: any } = { pageSize: 100 }
    if (offset) options.offset = offset
    const { data } = await AirtableAPI('All Assets').listRecords<Records<ATHotstar>>(options)
    for (const rec of data.records) {
      assets[rec.fields.ContentID] = {
        ContentID: `${rec.fields.ContentID}`,
        Description: rec.fields.Description,
        Title: rec.fields.Title,
        EngTitle: rec.fields.EngTitle,
        EntityType: rec.fields.EntityType,
        Encrypted: rec.fields.Encrypted,
        StartDate: rec.fields.StartDate ? dayjs(rec.fields.StartDate).toDate() : undefined,
        EndDate: rec.fields.EndDate ? dayjs(rec.fields.EndDate).toDate() : undefined,
        Duration: rec.fields.Duration,
        Genre: rec.fields.Genre,
        Language: rec.fields.Language,
        Year: rec.fields.Year,
        Images: rec.fields.Images,
        Studio: rec.fields.Studio,
        ContentProvider: rec.fields.ContentProvider,
        Parent: rec.fields.Parent,
        EpisodeCount: rec.fields.EpisodeCount,
        LiveStartTime: rec.fields.LiveStartTime ? dayjs(rec.fields.LiveStartTime).toDate() : undefined,
        BroadcastDate: rec.fields.BroadcastDate ? dayjs(rec.fields.BroadcastDate).toDate() : undefined,
        ParentalRating: rec.fields.ParentalRating,
      }

      ASSETS_PAIR[rec.fields.ContentID] = {
        recordId: rec.id,
        images: rec.fields.Images.reduce((acc, img) => {
          acc[img.filename] = img.id
          return acc
        }, {} as IMAGE_PAIR),
      }
    }

    offset = data.offset || undefined
    await delay(300)
  } while (offset)

  return assets
}

const createPoststoAirtable = async (assets: ATHotstar[]) => {
  const airtableFormatted = assets.map((p) => ({ fields: p }))
  if (airtableFormatted.length > 0) {
    do {
      try {
        const { data } = await AirtableAPI('All Assets').createRecords<Records<ATHotstar>>(airtableFormatted.splice(0, 10))
        for (const record of data.records) {
          ASSETS_PAIR[record.fields.ContentID] = {
            recordId: record.id,
            images: record.fields.Images.reduce((acc, img) => {
              acc[img.filename] = img.id
              return acc
            }, {} as IMAGE_PAIR),
          }
        }
      } catch (err) {
        if (axios.isAxiosError(err)) console.error(err.response.data)
      }
      console.log(`    - Success ${assets.length - airtableFormatted.length}/${assets.length}`)

      await delay(250)
    } while (airtableFormatted.length > 0)

    writeFileSync(ASSETS_PAIR_FILE, JSON.stringify(ASSETS_PAIR, null, 2))
  }
}

const updatePoststoAirtable = async (assets: ATHotstar[]) => {
  const airtableFormatted = assets.map((p) => ({ id: ASSETS_PAIR[p.ContentID].recordId, fields: p }))
  if (airtableFormatted.length > 0) {
    do {
      await AirtableAPI('All Assets').updateRecords(airtableFormatted.splice(0, 10))
      console.log(`    - Success ${Object.keys(assets).length - airtableFormatted.length}/${Object.keys(assets).length}`)
      await delay(250)
    } while (airtableFormatted.length > 0)
  }
}

;(async () => {
  // STEP 1: Get assets cache file from disk
  try {
    OLD_ASSET = readJSONSync(ASSETS_FILE, { encoding: 'utf8' })
    ASSETS_PAIR = readJSONSync(ASSETS_PAIR_FILE, { encoding: 'utf8' })
  } catch (error) {
    // TODO: Handle error by fetching assets from Airtable
    OLD_ASSET = await getAssetsAirtable()
    writeFileSync(ASSETS_FILE, JSON.stringify(OLD_ASSET, null, 2))
    writeFileSync(ASSETS_PAIR_FILE, JSON.stringify(ASSETS_PAIR, null, 2))
  }

  // console.log(OLD_ASSET, ASSETS_PAIR)

  // STEP 2: Get search assets from Hotstar
  const {
    data: {
      body: {
        results: { items },
      },
    },
  } = await hotstarAPIInstance.get<HotstarSearch>('/s/v1/scout?q=*&size=5000')

  // STEP 3: Format assets from Hotstar to Airtable format
  for (const item of items) {
    const ImagesUrl: Set<string> = new Set()
    const Images: Partial<AttachmentImg>[] = []

    // Unique image urls
    for (const image of [...Object.values(item.images), ...Object.values(item.imageSets.DEFAULT)]) {
      const url = `https://img1.hotstarext.com/image/upload/f_auto/${image}`
      ImagesUrl.add(url)
    }

    // Create image objects
    for (const url of Array.from(ImagesUrl)) {
      Images.push({
        url,
        filename: url.split('/').pop(),
      })
    }

    const r: ATHotstar = {
      ContentID: `${item.contentId}`,
      Description: item.description,
      Title: item.title,
      EngTitle: item.engTitle,
      EntityType: item.entityType,
      Encrypted: item.encrypted,
      StartDate: item.startDate ? dayjs(item.startDate * 1000).toDate() : undefined,
      EndDate: item.endDate ? dayjs(item.endDate * 1000).toDate() : undefined,
      Duration: item.duration,
      Genre: item.genre,
      Language: item.lang,
      Year: item.year,
      Images,
      Studio: item.studioName,
      ContentProvider: item.contentProvider,
      Parent: item.trailerParents?.join(','),
      EpisodeCount: item.episodeCnt,
      LiveStartTime: item.liveStartTime ? dayjs(item.liveStartTime * 1000).toDate() : undefined,
      BroadcastDate: item.broadCastDate ? dayjs(item.broadCastDate * 1000).toDate() : undefined,
      ParentalRating: item.parentalRatingName,
    }

    ASSETS[r.ContentID] = r
  }

  writeFileSync(ASSETS_FILE, JSON.stringify(ASSETS, null, 2), { encoding: 'utf8' })

  // STEP 4: Compare assets cache file with new assets
  const AssetsToCreate = Object.entries(ASSETS).reduce((acc, [key, value]) => {
    // Basic Compare
    if (!OLD_ASSET[key]) {
      acc[key] = value
      return acc
    }
    return acc
  }, {} as ASSETS_JSON)

  console.log(`New assets: ${Object.keys(AssetsToCreate).length}`)
  // console.log(AssetsToCreate)

  await createPoststoAirtable(Object.values(AssetsToCreate))

  // console.log(ASSETS)

  if (Object.keys(ASSETS_PAIR).length > 0) {
    const UpdatedAssets = Object.entries(ASSETS).reduce((acc, [key, value]) => {
      if (OLD_ASSET[key] && !isObjectEqual(OLD_ASSET[key], value)) {
        value.Images = ImagePairing(ASSETS_PAIR[key].images, value.Images)
        acc[key] = value
      }
      return acc
    }, {} as ASSETS_JSON)

    console.log(`Updated assets: ${Object.keys(UpdatedAssets).length}`)
    // console.log(UpdatedAssets)

    await updatePoststoAirtable(Object.values(UpdatedAssets))
  }
})()
