import { Viewer } from "../index.ts";
import { Sphere } from "./Sphere.ts";
import { AxesHelper } from "three";
import { Lights } from "./Lights.ts";

export class World {
  private viewer = new Viewer();

  private axes = new AxesHelper(10);
  private lights = new Lights();
  sphere = new Sphere();

  constructor() {
    this.viewer.scene.add(
      this.sphere,
      this.axes,
      this.lights.ambient,
      this.lights.directional,
    );
  }
}
