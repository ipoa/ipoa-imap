import * as Cesium from 'cesium'
import { Map } from '@/main'
import { ScreenSpaceEventMap } from '@/shims-ts'

export namespace Label {
    export declare type constructorOptions = {
        map: Map;
    };
    export declare type AddOptions = {
        position: Cesium.Entity.ConstructorOptions['position']
        label: Cesium.Entity.ConstructorOptions['label']
        [key: string]: any
    }
}

export class Label {
    map: Map
    billboards?: any

    constructor(options: Label.constructorOptions) {
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

    add(entity: Label.AddOptions) {
        return this.billboards.add({
            position: entity.position,
            label: {
                font: '14px 微软雅黑',
                pixelOffset: new Cesium.Cartesian2(0.0, 25),
                style: Cesium.LabelStyle.FILL,
                fillColor: Cesium.Color.BLACK,     //填充颜色
                outlineColor: Cesium.Color.BLACK,    //边框颜色
                ...entity.label,
            },
            added: { name: 'label', ...entity },
        })

    }

    removeAll() {
        const entities: any[] = []
        this.billboards.values.forEach(item => {
            try {
                if (item.added.name === 'label') {
                    entities.push(item)
                }
            }catch (e) {
                console.warn(e)
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
                this.map.event(type, 'label', listener.bind(this.billboards))
        }
        //
    }

}

