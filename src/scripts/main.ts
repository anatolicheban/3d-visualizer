import "../styles/index.scss";
import { Viewer } from "../Viewer";

declare global {
  interface Window {
    viewer?: Viewer;
  }
}

const wrapper = document.getElementById("viewer-wrap")!;
const canvas = document.getElementById("viewer")! as HTMLCanvasElement;

window.viewer = new Viewer(canvas, wrapper);
