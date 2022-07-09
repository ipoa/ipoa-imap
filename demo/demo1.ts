import { Map, Marker } from '@/main';
import * as Cesium from 'cesium';
const app = <HTMLElement>document.getElementById('app');
const map = new Map(app, {
  xmin: 114.336967,
  ymin: 23.124984,
  xmax: 114.569664,
  ymax: 23.133226,
});
const marker = new Marker({
  map: map,
});
marker.add({
  image:
    'https://gd-hbimg.huaban.com/a984209da4c5fa95ddfddce21e21d2a5584287c344d0-XPwmIt',
  position: Cesium.Cartesian3.fromDegrees(114.41244423873408, 23.1080994799963),
  translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.2),
});
