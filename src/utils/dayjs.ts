import dayjs from 'dayjs'
import 'dayjs/locale/th'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.locale('th')
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)

export const getDateTimeFormat = (datetime: number) => dayjs(datetime).format('DD/MM/YYYY HH:mm:ss')

export const getDurationFormat = (duration: number) => dayjs.duration(duration).format('HH:mm:ss')

export default dayjs
