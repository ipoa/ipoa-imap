import * as Cesium from 'cesium'
import { Map } from '@/main'
import { ScreenSpaceEventMap } from '@/shims-ts'

export namespace Marker {
  export declare type constructorOptions = {
    map: Map;
  };
  export declare type BillboardOptions = Cesium.Entity.ConstructorOptions['billboard'] & {
    position: unknown
    [key: string]: any
  }
}

export class Marker {
  map: Map
  billboards?: any

  constructor(options: Marker.constructorOptions) {
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
      this.billboards = this.map.scene.primitives.add(
          /**
           * A renderable collection of billboards.  Billboards are viewport-aligned
           * images positioned in the 3D scene.
           * <br /><br />
           * <div align='center'>
           * <img src='Images/Billboard.png' width='400' height='300' /><br />
           * Example billboards
           * </div>
           * <br /><br />
           * Billboards are added and removed from the collection using {@link BillboardCollection#add}
           * and {@link BillboardCollection#remove}.  Billboards in a collection automatically share textures
           * for images with the same identifier.
           * @example
           * // Create a billboard collection with two billboards
           * const billboards = scene.primitives.add(new Cesium.BillboardCollection());
           * billboards.add({
           *   position : new Cesium.Cartesian3(1.0, 2.0, 3.0),
           *   image : 'url/to/image'
           * });
           * billboards.add({
           *   position : new Cesium.Cartesian3(4.0, 5.0, 6.0),
           *   image : 'url/to/another/image'
           * });
           * @param [options] - Object with the following properties:
           * @param [options.modelMatrix = Matrix4.IDENTITY] - The 4x4 transformation matrix that transforms each billboard from model to world coordinates.
           * @param [options.debugShowBoundingVolume = false] - For debugging only. Determines if this primitive's commands' bounding spheres are shown.
           * @param [options.scene] - Must be passed in for billboards that use the height reference property or will be depth tested against the globe.
           * @param [options.blendOption = BlendOption.OPAQUE_AND_TRANSLUCENT] - The billboard blending option. The default
           * is used for rendering both opaque and translucent billboards. However, if either all of the billboards are completely opaque or all are completely translucent,
           * setting the technique to BlendOption.OPAQUE or BlendOption.TRANSLUCENT can improve performance by up to 2x.
           * @param [options.show = true] - Determines if the billboards in the collection will be shown.
           */
          new Cesium.BillboardCollection(),
      )
    }
  }

  add(entity: Marker.BillboardOptions) {
    const id = { ...entity, type: 'marker' }
    return this.billboards.add({ id, ...entity })
  }

  on(type: ScreenSpaceEventMap, listener: (this: Window, ev: any) => any) {
    switch (type) {
      case 'click':
        this.map.event(type, 'marker', listener.bind(this.billboards))
    }
    //
  }

}

