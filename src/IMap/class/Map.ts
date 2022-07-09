import * as Cesium from 'cesium';
// eslint-disable-next-line @typescript-eslint/no-namespace

type MapConstructorOptions = {
  xmin?: number;
  ymin?: number;
  xmax?: number;
  ymax?: number;
  result?: Cesium.Rectangle | undefined;
};
type screenSpaceEventMap = 'click'
export class Map extends Cesium.Viewer {
  // 绑定屏幕空间事件
  private handler3D = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);

  constructor(container: Element | string, options: MapConstructorOptions) {
    super(container, {
      terrainProvider: Cesium.createWorldTerrain(),
      infoBox: false,
      fullscreenButton: false,
      selectionIndicator: false,
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      shouldAnimate: false,
      // imageryProvider: null,
    });

    // @ts-ignore
    this._cesiumWidget._creditContainer.style.display = 'none';
    const scene = this.scene;
    // @ts-ignore
    scene.fxaa = true;
    scene.postProcessStages.fxaa.enabled = true;
    scene.skyBox.show = false; // 隐藏天空盒
    scene.skyAtmosphere.show = false; // 隐藏信息圈
    scene.backgroundColor = new Cesium.Color(0.039, 0.301, 0.423, 1); // 天空盒颜色
    scene.screenSpaceCameraController.minimumZoomDistance = 100;
    const rectangle = Cesium.Rectangle.fromDegrees(
      options.xmin,
      options.ymin,
      options.xmax,
      options.ymax,
      options.result
    );
    this.camera.flyTo({
      destination: rectangle,
    });

    this.handler3D.setInputAction(
      this.screenSpaceClick,
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    window.viewer = this;
  }

  screenSpaceClick(event) {
    //
    console.log(event);
  }

  // on(type: keyof WindowEventMap) {
  //   console.log(type);
  //   //
  // }
  on(type: screenSpaceEventMap) {
    console.log(type);
    //
  }
}
