import moment from "moment"

export function getDataLocal(data: string) {
  return moment(data).format('DD-MM-YYYY')
}


export function getDataUTC(data: string) {
  return moment(data).format('YYYY-MM-DD')
}