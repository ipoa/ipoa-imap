import Cesium from 'cesium'
import { Map } from '@/IMap/class/Map'

export declare namespace ArcGisMap {
    export interface ConstructorOptions {
        map: Map
    }

    export interface AddImageryProviderOptions extends Cesium.ArcGisMapServerImageryProvider.ConstructorOptions {

    }
}

export class ArcGisMap {
    map: Map

    constructor(options: ArcGisMap.ConstructorOptions) {
        this.map = options.map
        if (this.map) {
            //
        }
    }

    addImageryProvider(options: ArcGisMap.AddImageryProviderOptions): Cesium.ImageryLayer {
        const imageryProvider = new Cesium.ArcGisMapServerImageryProvider(options)
        return this.map.imageryLayers.addImageryProvider(imageryProvider)
    }
}
