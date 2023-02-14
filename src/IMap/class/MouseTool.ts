import { Map } from '@/main'
import { Measure } from './Measure'
import Cesium from 'cesium'
namespace MouseTool {
    export declare type constructorOptions = {
        map: Map;
    };
}

export class MouseTool {
    map: Map
    entity: Measure | null = null
    entityCollection: any[]
    entityLines: any[]
    entityPoints: any[]
    listener:any = {}
    positions:any[]

    constructor (options: MouseTool.constructorOptions) {
        this.map = options.map
        this.entityCollection = []
        this.entityLines = []
        this.entityPoints = []
        this.listener = {}
        this.positions = []
    }
    setMap (map: Map) {
        this.map = map
    }
    /**
     * 清除
     */
    destroy(callback) {
        for (var i = 0; i < this.entityCollection.length; i++) {
            this.map.entities.remove(this.entityCollection[i]);
        }
        this.map.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.map.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.map.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this.entityCollection = [];

        if (callback) {
            callback()
        }
    }

    polygon(options,callback){
        options.map = options.map || this.map
        var positions:any[] = [];
        var clickStatus = false;
        var labelEntity:any = null;
        this.map.scene.globe.depthTestAgainstTerrain = false;

        this.map.screenSpaceEventHandler.setInputAction((clickEvent) => {

            clickStatus = true;
            // var cartesian = this.map.scene.pickPosition(clickEvent.position);
            var cartesian = this.map.scene.globe.pick(this.map.camera.getPickRay(clickEvent.position), this.map.scene);
            // console.log(cartesian);

            if (!cartesian) {
                return
            }
            if (positions.length == 0) {
                positions.push(cartesian.clone()); //鼠标左击 添加第1个点
                this.addPoint(cartesian);

                this.map.screenSpaceEventHandler.setInputAction((moveEvent) => {
                    // var movePosition = this.map.scene.pickPosition(moveEvent.endPosition);
                    var movePosition = this.map.scene.globe.pick(this.map.camera.getPickRay(moveEvent.endPosition), this.map.scene);
                    // console.log(movePosition);
                    if (!movePosition) {
                        return;
                    }
                    if (positions.length == 1) {
                        positions.push(movePosition);
                        this.addLine(positions);
                    } else {
                        if (clickStatus) {
                            positions.push(movePosition);
                        } else {
                            positions.pop();
                            positions.push(movePosition);
                        }
                    }

                    if (positions.length >= 3) {
                        // 绘制label
                        if (labelEntity) {
                            this.map.entities.remove(labelEntity);
                            this.entityCollection.splice(this.entityCollection.indexOf(labelEntity), 1);
                        }

                        var text = '面积：' + this.getArea(positions);
                        var centerPoint = this.getCenterOfGravityPoint(positions);
                        labelEntity = this.addLabel(centerPoint, text);

                        this.entityCollection.push(labelEntity);
                    }


                    clickStatus = false;
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


            } else if (positions.length == 2) {
                if (!cartesian) {
                    return
                }
                positions.pop();
                positions.push(cartesian.clone()); // 鼠标左击 添加第2个点

                this.addPoint(cartesian);

                this.addPolyGon(positions);

                // 右击结束
                this.map.screenSpaceEventHandler.setInputAction((clickEvent) => {

                    // var clickPosition = this.map.scene.pickPosition(clickEvent.position);
                    var clickPosition = this.map.scene.globe.pick(this.map.camera.getPickRay(clickEvent.position), this.map.scene);
                    // console.log(clickPosition);
                    if (!clickPosition) {
                        return false;
                    }
                    positions.pop();
                    positions.push(clickPosition);
                    positions.push(positions[0]); // 闭合
                    this.addPoint(clickPosition);

                    this.map.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    this.map.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    this.map.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);

                    this.positions = positions
                    if (callback) {
                        callback(positions)
                    }

                }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);


            } else if (positions.length >= 3) {
                if (!cartesian) {
                    return
                }
                positions.pop();
                positions.push(cartesian.clone()); // 鼠标左击 添加第3个点
                this.addPoint(cartesian);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    /**
     * 添加点
     * @param position
     */
    addPoint(position) {
        console.log('position',position)
        this.entityCollection.push(this.map.entities.add(new Cesium.Entity({
            position: position,
            point: {
                color: Cesium.Color.WHITE,
                pixelSize: 5,
                heightReference: Cesium.HeightReference.NONE
            }
        })));
    };

    /**
     * 添加线
     * @param positions
     */
    addLine(positions) {
        var dynamicPositions = new Cesium.CallbackProperty(() => {
            return positions;
        }, false);
        this.entityCollection.push(this.map.entities.add(new Cesium.Entity({
            polyline: {
                positions: dynamicPositions,
                width: 2,
                arcType: Cesium.ArcType.RHUMB,
                clampToGround: false,
                material: Cesium.Color.RED.withAlpha(0.9), //获取或设置折线的表面外观
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            }
        })));
    };

    /**
     * 添加面
     * @param positions
     */
    addPolyGon(positions) {
        var dynamicPositions = new Cesium.CallbackProperty(() => {
            return new Cesium.PolygonHierarchy(positions);
        }, false);
        this.entityCollection.push(this.map.entities.add(new Cesium.Entity({
            polygon: {
                hierarchy: dynamicPositions,
                material: Cesium.Color.WHITE.withAlpha(0.6),
                classificationType: Cesium.ClassificationType.BOTH // 贴地表和贴模型,如果设置了，这不能使用挤出高度
            }
        })));
    };
    /**
     * 添加标签
     * @param position
     * @param text
     */
    addLabel(centerPoint, text) {
        return this.map.entities.add(new Cesium.Entity({
            position: centerPoint,
            label: {
                text: text,
                font: '14px sans-serif',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE, //FILL  FILL_AND_OUTLINE OUTLINE
                fillColor: Cesium.Color.WHITE,
                showBackground: true, //指定标签后面背景的可见性
                backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8), // 背景颜色
                backgroundPadding: new Cesium.Cartesian2(6, 6), //指定以像素为单位的水平和垂直背景填充padding
                pixelOffset: new Cesium.Cartesian2(0, -25),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        }));
    };

    /**
     * 计算两点距离
     * @param firstPoint
     * @param secondPoint
     */
    getLengthText(firstPoint, secondPoint) {
        // 计算距离
        var length:number | string = Cesium.Cartesian3.distance(firstPoint, secondPoint);
        if (length > 1000) {
            length = (length / 1000).toFixed(2) + " 公里";
        } else {
            length = length.toFixed(2) + " 米";
        }
        return length;
    };

    getArea(points) {
        var ps = []
        for (var i = 0; i < points.length; i++) {
            var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(points[i]);
            var height = this.map.scene.globe.getHeight(cartographic);
            var point = Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180, height);
            ps.push(point)
        }
        var s = 0;
        for (var i = 0; i < ps.length; i++) {
            var p1 = ps[i];
            var p2;
            if (i < ps.length - 1)
                p2 = ps[i + 1];
            else
                p2 = ps[0];
            s += p1.x * p2.y - p2.x * p1.y;
        }
        var res

        if (s < 1000) {
            res = Math.abs(s).toFixed(4) + " 平方米";
        } else {
            res = Math.abs((s / 1000).toFixed(4)) + " 平方公里";
        }

        return res;
    }


    /**
     * 计算多边形的中心（简单的处理）
     * @param mPoints
     * @returns {*[]}
     */
    getCenterOfGravityPoint(mPoints) {
        var centerPoint = mPoints[0];
        for (var i = 1; i < mPoints.length; i++) {
            centerPoint = Cesium.Cartesian3.midpoint(centerPoint, mPoints[i], new Cesium.Cartesian3());
        }
        return centerPoint;
    }
}