import * as Cesium from 'cesium'
import { Map } from '@/main'
import { ScreenSpaceEventMap } from '@/shims-ts'

export namespace Polygon {
    export declare type constructorOptions = {
        map: Map;
    };

    export declare type AddOptions = Cesium.Entity.ConstructorOptions['polygon'] & {
        hierarchy: any[]
        material: string
        alpha: number
        [key: string]: any
    }

}

export class Polygon {
    map: Map
    billboards?: any

    constructor(options: Polygon.constructorOptions) {
        this.map = options.map
        if (this.map) {
            this.setBillboards()
        }
    }

    setMap(map: Map) {
        this.map = map
    }

    setBillboards() {
        if (this.map) {
            this.billboards = this.map.entities

        }
    }

    add(entity: Polygon.AddOptions) {
        if (entity.hierarchy.length <= 1) {
            return false
        }
        return this.billboards.add({
            position: entity.position,
            label: {
                font: '14px 微软雅黑',
                style: Cesium.LabelStyle.FILL,
                fillColor: Cesium.Color.WHITE,     //填充颜色
                outlineColor: Cesium.Color.WHITE,    //边框颜色
                ...entity.label,
            },
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(entity.hierarchy),
                material: Cesium.Color.fromCssColorString(entity.material || '#ff0000').withAlpha(entity.alpha || 0.5),
            },
            added: { name: 'polygon', ...entity },
        })
    }

    removeAll() {
        const entities: any[] = []
        this.billboards.values.forEach(item => {
            if (item.added.name === 'polygon') {
                entities.push(item)
            }
        })
        const length = entities.length
        this.map.entities.remove(entities[length - 1])
        if (length > 0) {
            this.removeAll()
        }
    }

    on(type: ScreenSpaceEventMap, listener: (this: Window, ev: any) => any) {
        switch (type) {
            case 'click':
                this.map.event(type, 'polygon', listener.bind(this.billboards))
        }
        //
    }

}

