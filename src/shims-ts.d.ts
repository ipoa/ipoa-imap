/// <reference types="vite/client" />
import {Map} from '@/main'
// @ts-ignore

declare global {
  // 定义window上实例方法
  interface Window {
    CESIUM_BASE_URL: string | unknown;
     viewer: Map;
    //  Cesium: Cesium;
  }
}
export declare type ScreenSpaceEventMap = 'close' |'draw' | 'click' | 'MOUSE_MOVE' | 'LEFT_CLICK'
