import { Viewer } from "../index.ts";
// import { AxesHelper } from "three";
import { Lights } from "./Lights.ts";
import { Board } from "./Board.ts";

export const CELL_SIZE = 0.18;
export const CELL_HEIGHT = 0.005;
export const CELLS_GAP = 0.02;
export const MAX_COL_HEIGHT = 2;

export class World {
  private viewer = new Viewer();

  // private axes = new AxesHelper(10);
  private lights = new Lights();
  board = new Board({
    w: 5,
    l: 5,
  });
  constructor() {
    this.viewer.scene.add(
      // this.axes,
      this.lights.ambient,
      this.lights.directional,
      this.lights.directional2,
    );
  }
}
