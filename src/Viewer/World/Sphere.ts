import { Mesh, MeshStandardMaterial, SphereGeometry } from "three";

export class Sphere extends Mesh<SphereGeometry, MeshStandardMaterial> {
  constructor() {
    super(
      new SphereGeometry(1, 32, 32),
      new MeshStandardMaterial({
        color: "$fff",
      }),
    );
  }
}
