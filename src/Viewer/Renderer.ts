import { Viewer } from "./index.ts";
import { WebGLRenderer } from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";

export class Renderer {
  private viewer = new Viewer();
  instance = new WebGLRenderer({
    canvas: this.viewer.canvas,
    preserveDrawingBuffer: true,
    antialias: true, // Включение антиалиасинга для сглаживания краев объектов
    // alpha: true, // Включение прозрачности (если требуется)
  });
  private stats = new Stats();

  constructor() {
    document.body.appendChild(this.stats.dom);

    this.instance.setClearColor(0x223843);
    this.instance.setSize(this.viewer.sizes.width, this.viewer.sizes.height);
    this.instance.setPixelRatio(this.viewer.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.viewer.sizes.width, this.viewer.sizes.height);
  }

  update() {
    this.instance.render(this.viewer.scene, this.viewer.camera.instance);
    this.stats.update();
  }
}
