import * as Cesium from 'cesium'
import { Map } from '@/main'
import { ScreenSpaceEventMap } from '@/shims-ts'

export namespace Model {
    export declare type constructorOptions = {
        map: Map;
    };

    export declare type AddOptions = Cesium.Entity.ConstructorOptions['polygon'] & {
        material?: string
        polygonPoint?: any
        url: string
        alpha: number
        [key: string]: any
    }

}

export class Model {
    map: Map
    billboards?: Cesium.EntityCollection
    position?: Cesium.Cartesian3
    orientation?: Cesium.Quaternion

    constructor (options: Model.constructorOptions) {
        this.map = options.map
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

    add (entity: Model.AddOptions) {
        const heading = Cesium.Math.toRadians(135);
        const pitch = 0;
        const roll = 0;
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

        this.orientation = Cesium.Transforms.headingPitchRollQuaternion(
            entity.position,
            hpr
        );
        return this.billboards?.add({
            position: entity.position,
            model: {
                uri: entity.url,
            },
            // @ts-ignore
            added: { name: 'model', ...entity },
        })
    }

    removeAll () {
        const entities: any[] = []
        this.billboards?.values.forEach((item: any) => {
            if (item.added.name === 'model') {
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
                this.map.event(type, 'polygon', listener.bind(<any>this.billboards))
        }
        //
    }

}

