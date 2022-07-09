/// <reference types="vite/client" />

declare global {
  // 定义window上实例方法
  interface Window {
    CESIUM_BASE_URL: string | unknown;
     viewer: any;
    //  Cesium: Cesium;
  }
}
