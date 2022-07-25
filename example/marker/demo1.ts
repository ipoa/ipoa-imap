import { Map, Marker, LngLat, LabelMarker } from '@/main'

const app = <HTMLElement>document.getElementById('app')
// demo1
const map = new Map(app, {
  west: 114.336967,
  south: 23.124984,
  east: 114.569664,
  north: 23.133226,
})
const marker = new Marker({
  map: map,
})

marker.add({
  image: '/imgs/peak-result.png',
  position: new LngLat(114.41244423873408, 23.1080994799963),
  scale: 0.2,
})

marker.add({
  name: '12131',
  image: '/imgs/peak-result.png',
  position: new LngLat(114.45244423, 23.1080994),
  scale: 0.2,
})

marker.on('click', function (e) {
  console.log(e)
  /** position   界面上的位置
   * event: {position: Cartesian2}   界面上的位置
   * lnglat: {lng: 114.42180179586047, lat: 23.105022954796773}  经纬度
   * pick: {image: '/imgs/peak-result.png', position: Cartesian3, scale: 0.2, type: 'marker'}   marker.add 传什么参这里显示什么参数
   */
})
console.log('^marker=>',marker,'$') // #! Debug log


setTimeout(()=>{
  // 飞到指定点和级别
  map.setFlyTo({
    west: 114.226967,
    south: 23.124984,
    east: 114.459664,
    north: 23.133226,
  })
},5000)

// 三维球立即转到对应的视角和位置上
setTimeout(()=>{
  // map.setFitView({
  //   west: 114.226967,
  //   south: 23.124984,
  //   east: 114.459664,
  //   north: 23.133226,
  // })
  // 隐藏所有的 marker
 // marker.billboards.show =false
},10000)

 // end demo1
