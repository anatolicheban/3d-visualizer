import { Viewer } from "../index.ts";
import { TypedEvent } from "./TypedEvent.ts";

export class Sizes extends TypedEvent<void> {
  private viewer = new Viewer();
  width: number = 0;
  height: number = 0;
  pixelRatio: number = 0;

  constructor() {
    super();
    this.setSizes();

    window.addEventListener("resize", () => {
      this.setSizes();
      this.emit();
    });
  }
  private setSizes() {
    this.width = this.viewer.wrapper?.clientWidth || window.innerWidth;
    this.height = this.viewer.wrapper?.clientHeight || window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }
}
