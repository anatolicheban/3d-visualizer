import { AmbientLight, DirectionalLight } from "three";

export class Lights {
  ambient = new AmbientLight("#ffffff", 1);
  directional = new DirectionalLight("#818181", 5);

  constructor() {
    this.directional.position.set(4, 4, 1);
  }
}
