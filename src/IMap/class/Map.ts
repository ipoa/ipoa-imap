import { ScreenSpaceEventMap } from '@/shims-ts'
import * as Cesium from 'cesium'

export namespace Map {
  export declare type MapConstructorOptions = {
    west?: number
    south?: number
    east?: number
    north?: number
    result?: Cesium.Rectangle | undefined;
    center?: Array<number>
    height?: number
  };
}

export class Map extends Cesium.Viewer {
  // 绑定屏幕空间事件
  readonly handler3D = new Cesium.ScreenSpaceEventHandler(this.scene.canvas)
  private _listener: Record<ScreenSpaceEventMap, any>

  constructor(container: Element | string, options: Map.MapConstructorOptions) {
    super(container, {
      terrainProvider: Cesium.createWorldTerrain(),
      infoBox: false,
      fullscreenButton: false,
      selectionIndicator: false,
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      shouldAnimate: false,
      // imageryProvider: null,
    })

    // @ts-ignore
    this._cesiumWidget._creditContainer.style.display = 'none'
    const scene = this.scene
    // @ts-ignore
    scene.fxaa = true
    scene.postProcessStages.fxaa.enabled = true
    scene.skyBox.show = false // 隐藏天空盒
    scene.skyAtmosphere.show = false // 隐藏信息圈
    scene.backgroundColor = new Cesium.Color(0.039, 0.301, 0.423, 1) // 天空盒颜色
    scene.screenSpaceCameraController.minimumZoomDistance = 1000

    this._listener = {
      click: {},
    }
    // 通过转动的动画，三维球转到对应的视角和位置上
    this.setFitView(options)
    // 点击事件
    this.handler3D.setInputAction(this.screenSpaceClick.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK)
    window.viewer = this

  }

  screenSpaceClick(event) {
    this.screenSpaceEvent('click', event)
  }

  screenSpaceEvent(type: ScreenSpaceEventMap, event) {
    // 点击
    const pick = this.scene.pick(event.position)

    let lnglat = this.pixelToLngLat(event.position)
    /// 转换经纬度
    // const cartesian = this.camera.pickEllipsoid(event.position, this.scene.globe.ellipsoid)
    // if (cartesian === undefined) {
    //   console.log('没有获取到坐标')
    // } else {
    //   // 空间坐标转世界坐标(弧度)
    //   const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    //   // 弧度转为角度（经纬度）
    //
    //   const lng = Cesium.Math.toDegrees(cartographic.longitude)  // 经度值
    //   const lat = Cesium.Math.toDegrees(cartographic.latitude)   // 纬度值
    //   lnglat = { lng, lat }
    // }

    if (Cesium.defined(pick) && pick.id && pick.id.added && pick.id.added.name) {
      typeof this._listener[type][pick.id.added.name] === 'function' && this._listener[type][pick.id.added.name]({ pick: pick.id, event, position: event.position, lnglat })
    } else{
      typeof this._listener[type]['map'] === 'function' && this._listener[type]['map']({ pick: undefined, event, position: event.position, lnglat })
    }
  }

  event(type: ScreenSpaceEventMap, pickType, listener: (this: Window, ev: ScreenSpaceEventMap) => any) {
    // type 事件类类型，选中类型
    switch (type) {
      case 'click':
        this._listener[type][pickType] = listener
    }
  }

  on(type: ScreenSpaceEventMap, listener: (this: Window, ev: any) => any) {
    switch (type) {
      case 'click':
        // @ts-ignore
        this.event(type, 'map', listener.bind(this.entities))
    }
    //
  }

  // setView： 三维球立即转到对应的视角和位置上。（无延迟）
  setFitView(options) {
    let destination: Cesium.Rectangle | Cesium.Cartesian3 = Cesium.Rectangle.fromDegrees(
        options.west,
        options.south,
        options.east,
        options.north,
        options.result,
    )

    if (Array.isArray(options.center)) {
      destination = Cesium.Cartesian3.fromDegrees.apply(this, options.center.concat(options.height))

      if (options.zoom) {
        // this.scene.camera.zoomIn(options.zoom)
      }
    }
    this.camera.setView({
      destination: destination,
      orientation: {
      //  heading: Cesium.Math.toRadians(20.0),//方向
      //  pitch: Cesium.Math.toRadians(-90.0),// 亲斜角度
        roll: 0
      }
    })
  }

  // 飞到指定点和级别
  // flyTo： 通过转动的动画，三维球转到对应的视角和位置上。（有延迟）
  setFlyTo(options) {
    // Cesium.Rectangle.center(rectangle)
    let destination: Cesium.Rectangle | Cesium.Cartesian3 = Cesium.Rectangle.fromDegrees(
        options.west,
        options.south,
        options.east,
        options.north,
        options.result,
    )

    if (Array.isArray(options.center)) {
      destination = Cesium.Cartesian3.fromDegrees.apply(this, options.center.concat(options.height))

      if (options.zoom) {
        // this.scene.camera.zoomIn(options.zoom)
      }
    }
    this.camera.flyTo({
      destination: destination,
    })
  }

  // pixelToLngLat
  // 平面像素坐标转成经纬度坐标
  pixelToLngLat(position: Cesium.Cartesian2) {
    /// 转换经纬度
    const cartesian = this.camera.pickEllipsoid(position, this.scene.globe.ellipsoid)
    const lnglat = { lng: 0, lat: 0 }
    if (cartesian === undefined) {
      console.log('没有获取到坐标')
    } else {
      // 空间坐标转世界坐标(弧度)
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      // 弧度转为角度（经纬度）

      lnglat.lng = Cesium.Math.toDegrees(cartographic.longitude)  // 经度值
      lnglat.lat = Cesium.Math.toDegrees(cartographic.latitude)   // 纬度值
    }
    return lnglat
  }
}
