import {
  BoxGeometry,
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import { Viewer } from "../index.ts";
import { CELL_HEIGHT, CELL_SIZE, CELLS_GAP, MAX_COL_HEIGHT } from "./index.ts";
import { TypedEvent } from "../Utils/TypedEvent.ts";
import { ColumnCreate, Coords, MeshColumnData } from "../../models";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import gsap from "gsap";
import { Utils } from "../Utils";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";

const m = new MeshBasicMaterial({
  color: "#707070",
});

type BoardArgs = {
  l: number; // x
  w: number; // z
};

const line = new Line2(
  new LineGeometry(),
  new LineMaterial({
    color: "#969696",
    linewidth: 0.0015,
    // alphaToCoverage: true,
    // transparent: true,
  }),
);

const events = ["mousemove", "click"];
export class Board {
  private viewer = new Viewer();
  raycaster = new Raycaster();
  pointer = new Vector2();

  font: Font | null = null;

  plane = new Mesh<PlaneGeometry, MeshBasicMaterial>(
    new PlaneGeometry(1, 1),
    new MeshBasicMaterial({
      color: "#000",
      transparent: true,
      opacity: 0.1,
    }),
  );

  disabled = false;

  cells: Mesh<BoxGeometry, MeshStandardMaterial>[] = [];
  columns: { col: Group; value: number; text: Mesh }[] = [];

  length: number;
  width: number;

  maxValue = 0;

  //For perfomances
  objectsToRaycast: (Group | Mesh<BufferGeometry, MeshStandardMaterial>)[] = [];

  //Events
  addColumn = new TypedEvent<{ coords: Coords; mesh: Mesh }>();
  createColumn = new TypedEvent<ColumnCreate>();

  //Lines
  xLine = line.clone();
  zLine = line.clone();
  yLine = line.clone();

  //Marks
  xMarks: Mesh[] = [];
  yMarks: Mesh[] = [];

  //Mouse helpers
  canClick = true;
  mouseDown = false;

  constructor({ l, w }: BoardArgs) {
    this.length = l;
    this.width = w;

    this.plane.rotation.x = -Math.PI / 2;
    this.plane.scale.set(0, 0, 1);
    this.viewer.scene.add(this.plane);
    this.setCellsPosition();
    this.setRaycaster();
    this.setLines();
    this.loadFont().then(() => this.setMarks());
    this.viewer.scene.add(...this.cells, this.xLine, this.zLine, this.yLine);

    this.objectsToRaycast.push(...this.cells);

    this.createColumn.on((e) => {
      this.addNewColumn(e);
    });

    this.setMouseListeners();
  }

  async loadFont() {
    this.font = (await new FontLoader().loadAsync("/font.json")) || null;
  }

  setCellsPosition() {
    this.cells = new Array(this.width * this.length).fill(null).map(() => {
      return new Mesh(
        new BoxGeometry(
          CELL_SIZE - CELLS_GAP / 2,
          CELL_HEIGHT,
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
      el.scale.set(0, 1, 0);

      const c = Utils.getCoordsFromIndex(this.length, i);

      gsap.to(el.scale, {
        z: 1,
        x: 1,
        delay: c.x * c.y * 0.02,
        duration: 1,
        // ease: "elastic.inOut",
      });
    });
    gsap.to(this.plane.scale, {
      x: this.length * CELL_SIZE + CELLS_GAP / 2,
      y: this.width * CELL_SIZE + CELLS_GAP / 2,
      delay: this.length * this.width * 0.02 + 0.5,
      onComplete: () => {
        this.disabled = false;
      },
    });
  }

  async setMarks() {
    if (!this.font) return;
    for (let i = 1; i <= this.length; i++) {
      const mesh = Utils.getLetterMesh(i.toString(), this.font, m);
      mesh.position.x = (-CELL_SIZE * this.length) / 2 + i * CELL_SIZE - 0.01;
      mesh.position.z = (-CELL_SIZE * this.width) / 2 - 0.01;
      mesh.position.y += 0.006;
      this.xMarks.push(mesh);
    }
    for (let i = 1; i <= this.width; i++) {
      const mesh = Utils.getLetterMesh(i.toString(), this.font, m);
      mesh.position.x = (-CELL_SIZE * this.length) / 2 - 0.01;
      mesh.position.z = (-CELL_SIZE * this.width) / 2 + i * CELL_SIZE;
      mesh.position.y += 0.006;
      this.yMarks.push(mesh);
    }
    this.viewer.scene.add(...this.xMarks, ...this.yMarks);
    this.viewer.camera.lettersToUpdate.push(...this.xMarks, ...this.yMarks);
  }

  setLines() {
    const xs = new Vector3(
      (-CELL_SIZE * this.length - CELLS_GAP / 2) / 2,
      0,
      (-CELL_SIZE * this.width - CELLS_GAP / 2) / 2,
    );
    const xe = xs.clone();
    xe.x = (CELL_SIZE * this.length + CELLS_GAP / 2) / 2;

    const zs = xs.clone();
    const ze = xs.clone();
    ze.z = (CELL_SIZE * this.width + CELLS_GAP / 2) / 2;

    const ys = xs.clone();
    const ye = xs.clone();
    ye.y = MAX_COL_HEIGHT + 0.05;

    this.xLine.geometry = new LineGeometry().setPositions(
      Utils.vectors3ToArray(xs, xe),
    );
    this.zLine.geometry = new LineGeometry().setPositions(
      Utils.vectors3ToArray(zs, ze),
    );
    this.yLine.geometry = new LineGeometry().setPositions(
      Utils.vectors3ToArray(ys, ye),
    );
  }

  setRaycaster() {
    events.forEach((el) => {
      this.viewer.canvas.addEventListener(el, (e) => {
        if (this.disabled) return;
        const event = e as MouseEvent;

        this.pointer = Utils.get2DPointer(
          event.clientX,
          event.clientY,
          this.viewer.canvas,
        );

        this.raycaster.setFromCamera(this.pointer, this.viewer.camera.instance);

        this.clearHovers();
        const cells = this.raycaster.intersectObjects<
          Mesh<BufferGeometry, MeshStandardMaterial> | Group
        >(this.objectsToRaycast);
        // document.body.style.cursor =
        // cells.length && (cells[0] instanceof Mesh) ? "pointer" : "default";
        if (cells.length) {
          const cell = cells[0].object;
          if (cell instanceof Group) return; // Which means its column
          if (
            cell.userData.disabled ||
            cell.userData.isColumn ||
            cell.userData.selected
          )
            return;
          cell.material.color.setStyle("#676DFF");
          if (el === "click" && this.canClick) {
            this.clearHovers(true);
            cell.material.color.setStyle("#a20000");
            cell.userData.selected = true;
            let cellIndex = 0;

            this.cells.forEach((el, i) => {
              if (el === cell) cellIndex = i;
            });

            this.addColumn.emit({
              coords: Utils.getCoordsFromIndex(this.length, cellIndex),
              mesh: cell,
            });
          }
        }
      });
    });

    this.viewer.canvas.addEventListener("mouseleave", () => this.clearHovers());
  }

  clearHovers(clearSelected?: boolean) {
    this.cells.forEach((el) => {
      if (clearSelected) {
        el.userData.selected = false;
      }
      if (el.userData.selected) return;
      el.material.color.setStyle("#fff");
    });
  }

  addNewColumn({ value, column, cell }: ColumnCreate) {
    this.maxValue = Math.max(this.maxValue, value);
    cell.userData.disabled = true;

    this.clearHovers(true);

    column.position.copy(cell.position);
    column.position.x += CELL_HEIGHT / 2;
    column.scale.y = 0;
    if (!this.font) return;
    const text = Utils.getLetterMesh("—" + value.toString(), this.font, m);
    text.position.set(
      (-CELL_SIZE * this.length) / 2,
      0,
      (-CELL_SIZE * this.length) / 2,
    );

    this.columns.push({
      col: column,
      value: value,
      text,
    });
    this.viewer.camera.lettersToUpdate.push(text);

    this.objectsToRaycast.push(column);
    this.viewer.scene.add(text);
    this.viewer.scene.add(column);

    this.updateColumns();
  }

  deleteCol(col: Group) {
    const c = this.columns.find((el) => el.col === col);
    if (!c) return;
    gsap
      .to([c.col.scale, c.text.position], {
        y: 0,
        duration: 1,
      })
      .then(() => {
        this.viewer.scene.remove(c.col, c.text);
        this.viewer.camera.lettersToUpdate =
          this.viewer.camera.lettersToUpdate.filter((el) => el !== c.text);
      });
    this.columns = this.columns.filter((el) => el !== c);
    this.updateColumns();
  }

  editCol(data: MeshColumnData) {
    if (!this.font) return;
    const c = this.columns.find((el) => el.col === data.column);
    if (!c) return;

    c.value = data.value;
    this.maxValue = Math.max(...this.columns.map((el) => el.value));

    this.viewer.scene.remove(c.text);
    this.viewer.camera.lettersToUpdate.filter((el) => el !== c.text);
    const pos = c.text.position;
    c.text = Utils.getLetterMesh("—" + data.value.toString(), this.font, m);
    this.viewer.camera.lettersToUpdate.push(c.text);
    c.text.lookAt(this.viewer.camera.instance.position);
    c.text.position.copy(pos);
    this.viewer.scene.add(c.text);

    this.updateColumns();
  }

  updateColumns() {
    this.maxValue = Math.max(...this.columns.map((el) => el.value));
    this.columns.forEach((el) => {
      gsap.to([el.col.scale, el.text.position], {
        y: (el.value / this.maxValue) * MAX_COL_HEIGHT,
        duration: 1,
      });
    });
  }

  setMouseListeners() {
    let s = {
      x: 0,
      y: 0,
    };
    let en = {
      x: 0,
      y: 0,
    };
    window.addEventListener("mousedown", (e) => {
      this.mouseDown = true;
      this.canClick = true;
      s = {
        x: e.clientX,
        y: e.clientY,
      };
    });
    window.addEventListener("mousemove", (e) => {
      en = {
        x: e.clientX,
        y: e.clientY,
      };
      if (this.mouseDown && Utils.distance(s.x, s.y, en.x, en.y) > 10)
        this.canClick = false;
    });
  }
}
