const app = document.getElementById('app')
// demo1
const map = new IMap.Map(app, {
  west: 114.336967, // 西
  south: 23.124984, // 南
  east: 114.569664, // 东
  north: 23.133226, // 北
})
const marker = new IMap.Marker({
  map: map,
})
// 添加 marker
marker.add({
  image: '/dist/imgs/peak-result.png',
  position: new IMap.LngLat(114.41244423873408, 23.1080994799963),
  scale: 0.2,
})

 // 添加 marker
/**
 * Creates and adds a billboard with the specified initial properties to the collection.
 * The added billboard is returned so it can be modified or removed from the collection later.
 * @example
 * // Example 1:  Add a billboard, specifying all the default values.
 * const b = marker.add({
 *   show : true,
 *   position : Cesium.Cartesian3.ZERO,
 *   pixelOffset : Cesium.Cartesian2.ZERO,
 *   eyeOffset : Cesium.Cartesian3.ZERO,
 *   heightReference : Cesium.HeightReference.NONE,
 *   horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
 *   verticalOrigin : Cesium.VerticalOrigin.CENTER,
 *   scale : 1.0,
 *   image : 'url/to/image',
 *   imageSubRegion : undefined,
 *   color : Cesium.Color.WHITE,
 *   id : undefined,
 *   rotation : 0.0,
 *   alignedAxis : Cesium.Cartesian3.ZERO,
 *   width : undefined,
 *   height : undefined,
 *   scaleByDistance : undefined,
 *   translucencyByDistance : undefined,
 *   pixelOffsetScaleByDistance : undefined,
 *   sizeInMeters : false,
 *   distanceDisplayCondition : undefined
 * });
 * @example
 * // Example 2:  Specify only the billboard's cartographic position.
 * const b = marker.add({
 *   position : Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
 * });
 * @param [options] - A template describing the billboard's properties as shown in Example 1.
 * @returns The billboard that was added to the collection.
 */
let mark = marker.add({
  name: '12131',
  image: '/dist/imgs/peak-result.png',
  position: new IMap.LngLat(114.45244423, 23.1080994),
  scale: 0.2,
  label:  {
    // This callback updates the length to print each frame.
    text: new Cesium.CallbackProperty(getLength, false),
    font: "20px sans-serif",
    pixelOffset: new Cesium.Cartesian2(0.0, 20),
  },
})
// 隐藏单个图标
// mark.show = false
// 隐藏所有的 marker
// marker.billboards.show =false

marker.on('click', function (e) {
  /**
   * event: {position: Cartesian2}   界面上的位置
   * lnglat: {lng: 114.42180179586047, lat: 23.105022954796773}  经纬度
   * pick: {image: '/imgs/peak-result.png', position: Cartesian3, scale: 0.2, type: 'marker'}   marker.add 传什么参这里显示什么参数
   */
  console.log(e)
})
// end demo 1

// demo 2
setTimeout(()=>{
  // 三维球立即转到对应的视角和位置上 有动画郊果
  map.setFlyTo({
    west: 114.226967,
    south: 23.124984,
    east: 114.459664,
    north: 23.133226,
  })

},5000)

// 三维球立即转到对应的视角和位置上
setTimeout(()=>{
  map.setFitView({
    west: 114.226967,
    south: 23.124984,
    east: 114.459664,
    north: 23.133226,
  })
},10000)
// end demo 2
