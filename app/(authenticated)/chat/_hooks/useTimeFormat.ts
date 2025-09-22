import dayjs from 'dayjs'

import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ko')

dayjs.extend(timezone)

export const timeFormat = (utcSeconds: number) => {
  return dayjs(utcSeconds).tz('Asia/Seoul').format('YYYY. MM. DD. A hh:mm')
}
