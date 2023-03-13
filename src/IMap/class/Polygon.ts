import * as Cesium from 'cesium'
import { Map } from '@/main'
import { ScreenSpaceEventMap } from '@/shims-ts'

export namespace Polygon {
    export declare type constructorOptions = {
        map: Map
        typeName?: string
    };

    export declare type AddOptions = Cesium.Entity.ConstructorOptions['polygon'] & {
        material?: string
        polygonPoint?: any
        alpha: number
        options: any
        zIndex?: number
        height?: number
        [key: string]: any
    }

}

export class Polygon {
    map: Map
    billboards?: any
    typeName: string

    constructor(options: Polygon.constructorOptions) {
        this.map = options.map
        this.typeName =  'polygon-' + (options.typeName || 'default')
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
    updatePolygon(polygonOption:any){
        this.getEntities().forEach(item=>{
            Object.keys(polygonOption).forEach(key=>{
                item.polygon[key] = polygonOption[key]
            })
        })
    }

    add(entity: Polygon.AddOptions) {
        return this.billboards.add({
            ...entity.options,
            position: entity.position,
            label: {
                font: '14px 微软雅黑',
                style: Cesium.LabelStyle.FILL,
                fillColor: Cesium.Color.WHITE,     //填充颜色
                outlineColor: Cesium.Color.WHITE,    //边框颜色
                ...entity.label,
                zIndex: entity.zIndex || 1,
            },
            polygon: {
                hierarchy: entity.hierarchy ? Cesium.Cartesian3.fromDegreesArray(<any>entity.hierarchy) : entity.polygonPoint,
                material: Cesium.Color.fromCssColorString(entity.material || '#ff0000').withAlpha(entity.alpha || 0.5),
                zIndex: entity.zIndex || 1,
                outline:true,
                outlineColor: Cesium.Color.YELLOW.withAlpha(1)
            },
            added: { name: this.typeName, ...entity },
        })
    }
    getEntities(){
        const entities: any[] = []
        this.billboards.values.forEach(item => {
            try {
                if (item.added.name === this.typeName) {
                    entities.push(item)
                }
            }catch (e) {
                console.warn(e)
            }

        })
        return entities
    }
    removeAll() {
        const entities: any[] = this.getEntities()
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
            case 'draw':
                this.map.event(type, 'draw', listener.bind(this.billboards))
                break
        }
        //
    }

}

