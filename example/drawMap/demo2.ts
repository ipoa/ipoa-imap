import { Map, LngLat, LabelMarker, DrawPolygon } from '@/main'

const app = <HTMLElement>document.getElementById('map')
// demo1
const map = new Map(app, {
  west: 114.336967,
  south: 23.124984,
  east: 114.569664,
  north: 23.133226,
})

const drawTool =new DrawPolygon({
  map
})

drawTool.start()
