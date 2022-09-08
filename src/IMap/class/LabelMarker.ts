import * as Cesium from 'cesium'
import { Map } from '@/main'
import { ScreenSpaceEventMap } from '@/shims-ts'

export namespace LabelMarker {
    export declare type constructorOptions = {
        map: Map;
        typeName?: string
    };
    export declare type AddOptions = {
        position: Cesium.Entity.ConstructorOptions['position']
        icon: Cesium.Entity.ConstructorOptions['billboard']
        label: Cesium.Entity.ConstructorOptions['label']
        [key: string]: any
    }
}

export class LabelMarker {
    map: Map
    billboards?: any
    typeName: string

    constructor (options: LabelMarker.constructorOptions) {
        this.map = options.map
        this.typeName = options.typeName || 'labelMarker'

        if (this.map) {
            this.setBillboards()
        }
    }

    setMap (map: Map) {
        this.map = map
    }

    setBillboards () {
        if (this.map) {
            this.billboards = this.map.entities
        }
    }

    add (entity: LabelMarker.AddOptions) {
        return this.billboards.add({
            position: entity.position,
            billboard: entity.icon,
            label: {
                font: '14px 微软雅黑',
                pixelOffset: new Cesium.Cartesian2(0.0, 25),
                style: Cesium.LabelStyle.FILL,
                fillColor: Cesium.Color.BLACK,     //填充颜色
                outlineColor: Cesium.Color.BLACK,    //边框颜色
                ...entity.label
            },
            added: { name: this.typeName, ...entity }
        })

    }

    removeAll () {
        const entities: any[] = []
        this.billboards.values.forEach(item => {
            if (item.added.name === this.typeName) {
                entities.push(item)
            }
        })
        const length = entities.length
        this.map.entities.remove(entities[length - 1])
        if (length > 0) {
            this.removeAll()
        }
    }

    on (type: ScreenSpaceEventMap, listener: (this: Window, ev: any) => any) {
        switch (type) {
            case 'click':
                this.map.event(type, this.typeName, listener.bind(this.billboards))
        }
        //
    }

}

