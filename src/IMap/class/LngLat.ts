import * as Cesium from 'cesium'

export class LngLat {
    constructor(longitude, latitude, height = 0) {
        return Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
    }
}
