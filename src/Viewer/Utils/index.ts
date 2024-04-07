import { Vector2 } from "three";

export class Utils {
  static getPointer(e: MouseEvent): Vector2 {
    return new Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
    );
  }
}
