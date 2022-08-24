import { Map } from '@/IMap/class/Map'
import * as Cesium from 'cesium'
import {Polygon} from './Polygon'
export namespace DrawPolygon {
    export declare type constructorOptions = {
        map: Map;
    };
    export declare type AddOptions = {

        [key: string]: any
    }
}

export class DrawPolygon extends Polygon{
    drawTool?: any
    position?: any = []
    polygonPoint: Cesium.Cartesian3[] = []
    temporaryPolygonEntity: any
    polygonEntities?: any

    constructor(opt: DrawPolygon.constructorOptions) {
        super(opt)
    }

    drawDynamicPolygon() {
        this.temporaryPolygonEntity = this.map.entities.add({
            polygon: {
                // 这个方法上面有重点说明
                hierarchy: new Cesium.CallbackProperty(() => {
                    // PolygonHierarchy 定义多边形及其孔的线性环的层次结构（空间坐标数组）
                    return new Cesium.PolygonHierarchy(this.polygonPoint)
                }, false),
                extrudedHeight: 0,  // 多边体的高度（多边形拉伸高度）
                height: 10,  // 多边形离地高度
                material: Cesium.Color.RED.withAlpha(0.5),
            },
        })
    }

    start() {
        // 清除可能会用到的监听事件
        let handler = this.map.handler3D
        if (handler) {
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
            handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        }
        handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas)

        //鼠标左键--确定选中点
        handler.setInputAction((event) => {
            // 屏幕坐标转为空间坐标
            let cartesian = <Cesium.Cartesian3>this.map.camera.pickEllipsoid(event.position, this.map.scene.globe.ellipsoid)
            // 判断是否定义（是否可以获取到空间坐标）
            if (Cesium.defined(cartesian)) {
                // 将点添加进保存多边形点的数组中，鼠标停止移动的时添加的点和，点击时候添加的点，坐标一样
                this.polygonPoint.push(cartesian)
                // 判断是否开始绘制动态多边形，没有的话则开始绘制
                if (this.temporaryPolygonEntity == null) {
                    // 绘制动态多边形
                    this.drawDynamicPolygon()
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        //鼠标移动--实时绘制多边形
        handler.setInputAction((event) => {
            // 屏幕坐标转为空间坐标
            let cartesian = <Cesium.Cartesian3>this.map.camera.pickEllipsoid(event.endPosition, this.map.scene.globe.ellipsoid)
            // 判断是否定义（是否可以获取到空间坐标）
            if (Cesium.defined(cartesian)) {
                // 判断是否已经开始绘制动态多边形，已经开始的话，则可以动态拾取鼠标移动的点，修改点的坐标
                if (this.temporaryPolygonEntity) {
                    // 只要元素点大于一，每次就删除一个点，因为实时动态的点是添加上去的
                    if (this.polygonPoint.length > 1) {
                        // 删除数组最后一个元素（鼠标移动添加进去的点）
                        this.polygonPoint.pop()
                    }
                    // 将新的点添加进动态多边形点的数组中，用于实时变化，注意：这里是先添加了一个点，然后再删除点，再添加，这样重复的
                    this.polygonPoint.push(cartesian)
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

        //鼠标右键--结束绘制
        handler.setInputAction(() => {
            // 取消鼠标移动监听
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
            // 清除动态绘制的多边形
            this.map.entities.remove(this.temporaryPolygonEntity)
            // 删除保存的临时多边形的entity
            this.temporaryPolygonEntity = null
            // 绘制结果多边形
             this.addPolygon()
            // 清空多边形点数组，用于下次绘制
            this.polygonPoint = []
            // 清除所有事件
            if (handler) {
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
                handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
                handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
            }
            this.start()
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    }
    end(){
        let handler = this.map.handler3D
        if (handler) {
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
            handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        }
    }
    addPolygon() {
        // 删除最后一个动态添加的点，如果鼠标没移动，最后一个和倒数第二个是一样的，所以也要删除
        this.polygonPoint.pop()
        // 三个点以上才能绘制成多边形
        if (this.polygonPoint.length >= 3) {
          return  this.add({
                polygonPoint: this.polygonPoint,
                alpha: 0.5,
                label:{
                    text: '地块',
                    outlineWidth: 2,
                }
            })
            // this.polygonEntities = this.map.entities.add({
            //     polygon: {
            //         hierarchy: <any>this.polygonPoint,
            //         extrudedHeight: 0,  // 多边体的高度（多边形拉伸高度）
            //         height: 10,  // 多边形离地高度
            //         material: Cesium.Color.BLUE.withAlpha(0.5),
            //         outlineColor: Cesium.Color.BLUE.withAlpha(0.5),
            //         outlineWidth: 2,
            //     },
            // })
            // 坐标转换--这里可以输出所有点位坐标，不需要就删除了
        }
    }
    getPolygonPoint(){
        const pointArr: Array<any> = []
        this.polygonPoint.forEach(val => {
            let polyObj = { lon: 0, lat: 0 }
            let cartographic = this.map.scene.globe.ellipsoid.cartesianToCartographic(val)
            polyObj.lon = Cesium.Math.toDegrees(cartographic.longitude)
            polyObj.lat = Cesium.Math.toDegrees(cartographic.latitude)
            pointArr.push([polyObj.lon, polyObj.lat])
        })
        return pointArr
    }
}
