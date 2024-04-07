//@ts-ignore
import GUI from "three/examples/jsm/libs/lil-gui.module.min";
import { Viewer } from "../index.ts";
import { Color } from "three";

type GUIParams = {
  color: string;
};

export class DebugUI {
  instance = new GUI();
  viewer = new Viewer();

  params: GUIParams;
  constructor() {
    const col = new Color();
    this.viewer.renderer.instance.getClearColor(col);
    this.params = {
      color: col.getHexString(),
    };

    this.instance
      .addColor(this.params, "color")
      .name("Renderer color")
      .onChange((value: string) => {
        this.viewer.renderer.instance.setClearColor(value);
      });
  }
}
