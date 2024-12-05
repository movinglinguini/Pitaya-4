export function copyObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function toRad(deg : number) : number {
  return deg * (Math.PI / 180);
}