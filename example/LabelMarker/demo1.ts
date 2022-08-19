import { Map, LngLat, LabelMarker } from '@/main'

const app = <HTMLElement>document.getElementById('app')
// demo1
const map = new Map(app, {
  west: 114.336967,
  south: 23.124984,
  east: 114.569664,
  north: 23.133226,
})
