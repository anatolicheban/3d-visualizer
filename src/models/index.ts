import { Group, Mesh } from "three";

export type Coords = {
  x: number;
  y: number;
};

export type ColumnData = {
  title: string;
  value: number;
  color: string;
  cell: Mesh | null;
  coords: Coords;
};

export type MeshColumnData = ColumnData & { column: Group };

export type ColumnCreate = {
  cell: Mesh;
  column: Group;
  value: number;
};
