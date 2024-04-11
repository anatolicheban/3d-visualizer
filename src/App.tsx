import { useEffect, useState } from "react";
import { Viewer } from "./Viewer";
import { DataList } from "./components/DataList";
import { ColumnInfo } from "./components/ColumnInfo";
import { ColumnData, MeshColumnData } from "./models";
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { CELL_SIZE, CELLS_GAP } from "./Viewer/World";

function App() {
  const [viewer, setViewer] = useState<Viewer | null>(null);

  useEffect(() => {
    setViewer(
      new Viewer(
        document.getElementById("viewer")! as HTMLCanvasElement,
        document.getElementById("viewer-wrap")!,
      ),
    );
  }, []);

  const [columns, setColumns] = useState<MeshColumnData[]>([]);

  const [infoOpen, setInfoOpen] = useState(false);

  const [columnData, setColumnData] = useState<ColumnData>({
    color: "#ffdc00",
    title: "",
    value: 0,
    coords: { x: 1, y: 1 },
    cell: null,
  });

  useEffect(() => {
    const listener = viewer?.world.board.addColumn.on((e) => {
      setColumnData((prev) => ({ ...prev, coords: e.coords, cell: e.mesh }));
      setInfoOpen(true);
    });
    return () => listener && listener.dispose();
  }, [viewer]);

  const columnInfoSubmit = () => {
    if (!columnData.cell) return;

    const column = new Group();

    const mesh = new Mesh(
      new BoxGeometry(
        CELL_SIZE - CELLS_GAP / 2,
        0.5,
        CELL_SIZE - CELLS_GAP / 2,
      ),
      new MeshStandardMaterial({
        color: columnData.color,
      }),
    );
    mesh.userData.isColumn = true;

    mesh.position.y += 0.25;
    column.add(mesh);

    setColumns((prev) => [...prev, { ...columnData, column }]);

    viewer?.world.board.addNewColumn({
      value: columnData.value,
      cell: columnData.cell,
      column,
    });

    setColumnData((prev) => ({
      ...prev,
      title: "",
      cell: null,
      value: 0,
    }));

    setInfoOpen(false);
  };

  return (
    <>
      <DataList items={columns} />
      <div id="viewer-wrap">
        <canvas id="viewer"></canvas>
      </div>
      <ColumnInfo
        open={infoOpen}
        onClose={() => {
          viewer?.world.board.clearHovers(true);
          setInfoOpen(false);
        }}
        data={columnData}
        onSubmit={columnInfoSubmit}
        onDataChange={(prop, value) => {
          setColumnData((prev) => ({ ...prev, [prop]: value }));
        }}
      />
    </>
  );
}

export default App;
