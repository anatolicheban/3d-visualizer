import { Vector2, Vector3 } from "three";
import { Coords } from "../../models";

export class Utils {
  static vectors3ToArray(...v: Vector3[]): number[] {
    const array: number[] = [];

    v.forEach((el) => {
      array.push(el.x, el.y, el.z);
    });
    return array;
  }

  static get2DPointer(x: number, y: number, element?: HTMLElement): Vector2 {
    const bounds = element?.getBoundingClientRect();

    const h = element ? element.clientHeight : window.innerHeight;
    const w = element ? element.clientWidth : window.innerWidth;

    return new Vector2(
      ((x - (bounds?.x || 0)) / w) * 2 - 1,
      -((y - (bounds?.y || 0)) / h) * 2 + 1,
    );
  }

  static getCoordsFromIndex(l: number, i: number): Coords {
    const x = (i % l) + 1;
    let y = 1;
    for (let i = 0; i < l; i++) {
      const j = i + 1;
      if (j % l === 0) y++;
    }
    return { x, y };
  }
}
