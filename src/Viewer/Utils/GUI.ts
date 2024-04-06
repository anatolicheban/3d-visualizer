//@ts-ignore
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import { Viewer } from "../index.ts";

const params = {
  color: "#223843",
};
export class DebugUI {
  instance = new GUI();
  viewer = new Viewer();
  constructor() {
    this.instance
      .addColor(params, "color")
      .name("Renderer color")
      .onChange((value: string) => {
        this.viewer.renderer.instance.setClearColor(value);
      });
  }
}
