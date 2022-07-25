import { Map, LngLat, LabelMarker } from '@/main'
import * as Cesium from 'cesium'
const app = <HTMLElement>document.getElementById('app')
// demo1
const map = new Map(app, {
  west: 114.336967,
  south: 23.124984,
  east: 114.569664,
  north: 23.133226,
})
const labelMarker = new LabelMarker({
  map: map,
})

labelMarker.add({
  id: 'ddf',
  position: new LngLat(114.41244423873408, 23.1080994799963),
  icon:{
    image: '/imgs/peak-result.png',
    scale: 0.2,
  },
  label:{
    text: '百度',
    font: "14px 微软雅黑",
    pixelOffset: new Cesium.Cartesian2(0.0, 20),
  }
})


// labelMarker.on('click', function (e) {
//   console.log(e)
//   /** position   界面上的位置
//    * event: {position: Cartesian2}   界面上的位置
//    * lnglat: {lng: 114.42180179586047, lat: 23.105022954796773}  经纬度
//    * pick: {image: '/imgs/peak-result.png', position: Cartesian3, scale: 0.2, type: 'marker'}   marker.add 传什么参这里显示什么参数
//    */
// })

