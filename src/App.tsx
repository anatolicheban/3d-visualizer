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

  const [selected, setSelected] = useState<null | MeshColumnData>(null);

  useEffect(() => {
    const listener = viewer?.world.board.addColumn.on((e) => {
      setColumnData((prev) => ({
        ...prev,
        value: 0,
        title: "",
        coords: e.coords,
        cell: e.mesh,
      }));
      setInfoOpen(true);
    });
    return () => listener && listener.dispose();
  }, [viewer]);

  const columnInfoSubmit = () => {
    if (!columnData.cell) return;

    if (selected) {
      const data = {
        ...selected,
        color: columnData.color,
        value: columnData.value,
        title: columnData.title,
      };

      setColumns((prev) => prev.map((el) => (el === selected ? data : el)));
      setSelected(null);
      viewer?.world.board.editCol(data);
      return;
    }

    const column = new Group();

    const mesh = new Mesh(
      new BoxGeometry(CELL_SIZE - CELLS_GAP / 2, 1, CELL_SIZE - CELLS_GAP / 2),
      new MeshStandardMaterial({
        color: columnData.color,
      }),
    );
    mesh.userData.isColumn = true;

    mesh.position.y += 0.5;
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

  const deleteHandler = (item: MeshColumnData) => {
    setColumns((prev) => prev.filter((el) => el !== item));
    viewer?.world.board.deleteCol(item.column);
  };

  const editHandler = (item: MeshColumnData) => {
    setColumnData(item);
    setInfoOpen(true);
  };

  useEffect(() => {
    if (!selected) setInfoOpen(false);
  }, [selected]);

  return (
    <>
      <DataList
        onSelect={(el) => {
          setInfoOpen(false);
          setSelected((prev) => (prev === el ? null : el));
        }}
        items={columns}
        selected={selected}
        onEdit={editHandler}
        onDelete={deleteHandler}
      />
      <div id="viewer-wrap">
        <canvas id="viewer"></canvas>
      </div>
      <ColumnInfo
        selected={selected}
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
