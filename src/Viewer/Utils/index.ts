import { Material, Mesh, Vector2, Vector3 } from "three";
import { Coords } from "../../models";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Font } from "three/examples/jsm/loaders/FontLoader";

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

  static getCoordsFromIndex(l: number, index: number): Coords {
    const x = (index % l) + 1;
    let y = 1;
    for (let i = 0; i < index; i++) {
      const j = i + 1;
      if (j % l === 0) y++;
    }
    return { x, y };
  }

  static getLetterMesh(t: string, font: Font, m: Material) {
    return new Mesh(
      new TextGeometry(t.toString(), {
        size: 0.02,
        font,
        depth: 0.0001,
      }),
      m,
    );
  }
  static distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}
