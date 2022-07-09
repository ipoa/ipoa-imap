import * as Cesium from 'cesium';
export namespace Marker {
  export type constructorOptions = {
    map: Cesium.Viewer;
  };
}

export class Marker {
  map: Cesium.Viewer;
  billboards?: any;
  constructor(options: Marker.constructorOptions) {
    this.map = options.map;
    if (this.map) {
      this.setBillboards();
    }
  }
  setMap(map: Cesium.Viewer) {
    this.map = map;
  }
  setBillboards() {
    if (this.map) {
      this.billboards = this.map.scene.primitives.add(
        new Cesium.BillboardCollection()
      );
    }
  }
  add(
    entity: Cesium.Entity.ConstructorOptions['billboard'] & { position: unknown }
  ) {
    this.billboards.add(entity);
  }
}
