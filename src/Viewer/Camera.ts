import { Viewer } from "./index.ts";
import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Camera {
  private viewer = new Viewer();
  instance = new PerspectiveCamera(
    35,
    this.viewer.sizes.width / this.viewer.sizes.height,
    0.1,
    100,
  );
  controls = new OrbitControls(this.instance, this.viewer.canvas);

  constructor() {
    //Instance
    this.instance.position.set(-1, 1, 5);
    this.viewer.scene.add(this.instance);

    //Controls
    this.controls.enableDamping = true;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 10;
  }

  resize() {
    this.instance.aspect = this.viewer.sizes.width / this.viewer.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
