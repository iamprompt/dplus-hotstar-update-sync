import axios from 'axios'
import { config as dotenv } from 'dotenv'

dotenv()

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || ''
const AIRTABLE_WORKING_BASE = process.env.AIRTABLE_WORKING_BASE || ''

const AirtableInstance = axios.create({
  baseURL: `https://api.airtable.com/v0/${AIRTABLE_WORKING_BASE}`,
  headers: {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
  },
})

export const AirtableAPI = (table: string) => {
  const tableUrl = `/${table}`
  return {
    listRecords<T>(option: { [key: string]: any }) {
      return AirtableInstance.get<T>(tableUrl, {
        params: {
          ...option,
        },
      })
    },
    retrieveRecord: (recordId: string) => AirtableInstance.get(`${tableUrl}/${recordId}`),
    createRecords<T = any>(records: any) {
      return AirtableInstance.post<T>(
        tableUrl,
        { records, typecast: true },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    },
    updateRecords<T>(records: any) {
      return AirtableInstance.patch<T>(
        tableUrl,
        { records, typecast: true },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }
}
