import { Viewer } from "./index.ts";
import { Mesh, PerspectiveCamera } from "three";
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
  lettersToUpdate: Mesh[] = [];
  constructor() {
    //Instance
    this.instance.position.set(-1, 1.5, 3);
    this.viewer.scene.add(this.instance);

    //Controls
    this.controls.enableDamping = true;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 10;
    this.controls.target.set(0, 0.4, 0);

    this.updateLetters();

    this.controls.addEventListener("change", () => {
      this.updateLetters();
    });
  }

  updateLetters() {
    this.lettersToUpdate.forEach((el) =>
      el.lookAt(this.controls.object.position),
    );
  }

  resize() {
    this.instance.aspect = this.viewer.sizes.width / this.viewer.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
