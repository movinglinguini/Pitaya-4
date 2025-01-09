const piOver180 = Math.PI / 180;
const one80OverPi = 180 / Math.PI;

export function copyObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function toRad(deg : number) : number {
  return deg * piOver180;
}

export function toDeg(rad : number) : number {
  return rad * one80OverPi; 
}

export function getDistance(x1 : number, y1 : number, x2 : number, y2 : number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function lerp(from: number, to: number, interval: number) {
  return from + (to - from) * interval;
}

export function getRandom(from : number, to : number) {
  return Math.random() * (to - from) + from;
}

export function chooseRandom(arr: any[]) {
  const idx = Math.floor(getRandom(0, arr.length));
  return arr[idx];
}