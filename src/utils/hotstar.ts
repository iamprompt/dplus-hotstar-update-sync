import axios from 'axios'

export const hotstarAPIInstance = axios.create({
  baseURL: 'https://api.hotstar.com',
  headers: {
    'accept-language': 'tha',
    'x-client-code': 'LR',
    'x-country-code': 'TH',
    'x-platform-code': 'PCTV',
  },
})
