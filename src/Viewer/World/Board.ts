import {
  BoxGeometry,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Raycaster,
  Vector2,
} from "three";
import { Viewer } from "../index.ts";
import { CELL_SIZE, CELLS_GAP } from "./index.ts";
import { Utils } from "../Utils";

type BoardArgs = {
  l: number; // x
  w: number; // z
};

const events = ["mousemove", "click"];
export class Board {
  private viewer = new Viewer();
  raycaster = new Raycaster();
  pointer = new Vector2();

  plane = new Mesh<PlaneGeometry, MeshBasicMaterial>(
    new PlaneGeometry(1, 1),
    new MeshBasicMaterial({
      color: "#000",
      transparent: true,
      opacity: 0.2,
    }),
  );

  cells: Mesh<BoxGeometry, MeshStandardMaterial>[] = [];

  length: number;
  width: number;

  constructor({ l, w }: BoardArgs) {
    this.length = l;
    this.width = w;

    this.plane.rotation.x = -Math.PI / 2;
    this.plane.scale.set(
      l * CELL_SIZE + CELLS_GAP / 2,
      w * CELL_SIZE + CELLS_GAP / 2,
      1,
    );
    this.viewer.scene.add(this.plane);
    this.setCellsPosition();
    this.setRaycaster();
    this.viewer.scene.add(...this.cells);
  }

  setCellsPosition() {
    this.cells = new Array(this.width * this.length).fill(null).map(() => {
      return new Mesh(
        new BoxGeometry(
          CELL_SIZE - CELLS_GAP / 2,
          0.005,
          CELL_SIZE - CELLS_GAP / 2,
        ),
        new MeshStandardMaterial({
          color: "#ffffff",
        }),
      );
    });
    let row = 0;
    this.cells.forEach((el, i) => {
      const xPos = i % this.length;

      if (i !== 0 && i % this.length === 0) row++;

      el.position.x = (xPos + 0.5) * CELL_SIZE - (this.length * CELL_SIZE) / 2;
      el.position.z = (row + 0.5) * CELL_SIZE - (this.width * CELL_SIZE) / 2;
    });
  }

  setRaycaster() {
    events.forEach((el) => {
      window.addEventListener(el, (e) => {
        this.pointer = Utils.getPointer(e as MouseEvent);
        this.raycaster.setFromCamera(this.pointer, this.viewer.camera.instance);

        this.clearHovers();
        const cells = this.raycaster.intersectObjects<
          Mesh<BufferGeometry, MeshStandardMaterial>
        >(this.cells);
        if (cells.length) {
          const cell = cells[0].object;
          cell.material.color.setStyle("rgba(103,109,255,0.66)");
        }
      });
    });
  }

  clearHovers() {
    this.cells.forEach((el) => el.material.color.setStyle("#fff"));
  }
}
