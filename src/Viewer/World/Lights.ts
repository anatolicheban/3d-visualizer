import { AmbientLight, DirectionalLight } from "three";

export class Lights {
  ambient = new AmbientLight("#ffffff", 1);
  directional = new DirectionalLight("#fff", 3);
  directional2 = new DirectionalLight("#fff", 2);

  constructor() {
    this.directional.position.set(3, 3, 1);
    this.directional2.position.set(-3, 4, -2);
  }
}
