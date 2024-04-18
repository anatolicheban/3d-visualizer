import "./style.scss";
import { FC, FormEvent, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import cn from "classnames";
import { ColumnData, MeshColumnData } from "../../models";

type Props = {
  open: boolean;
  onClose(): void;
  onSubmit(): void;
  data: ColumnData;
  onDataChange(prop: keyof ColumnData, value: number | string): void;
  selected: MeshColumnData | null;
};
export const ColumnInfo: FC<Props> = ({
  open,
  onClose,
  onSubmit,
  data,
  onDataChange,
  selected,
}) => {
  const [colorOpen, setColorOpen] = useState(false);
  const formSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!btnActive) return;
    onSubmit();
    onClose();
  };

  const [btnActive, setBtnActive] = useState(
    !!data.title && !!data.value && !!data.color,
  );

  useEffect(() => {
    setBtnActive(!!data.title && !!data.value && !!data.color);
  }, [data]);

  return (
    <div className={cn("column-info", open && "open")}>
      <header>
        <h2>
          {selected ? "Edit" : "Add"} column ({data.coords.x}:{data.coords.y})
        </h2>
        <button onClick={onClose}>
          <img src="/close.svg" alt="close" />
        </button>
      </header>
      <form onSubmit={formSubmitHandler}>
        <label>
          <span>Title</span>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onDataChange("title", e.target.value)}
          />
        </label>
        <label>
          <span>Value</span>
          <input
            type="number"
            value={data.value || ""}
            onChange={(e) => onDataChange("value", +e.target.value)}
          />
        </label>
        <label
          onFocus={() => setColorOpen(true)}
          onBlur={() => setColorOpen(false)}
        >
          <span>Color</span>
          <input type="text" value={data.color} readOnly />
          {colorOpen && (
            <HexColorPicker
              color={data.color}
              className={"color-pick"}
              onChange={(color) => onDataChange("color", color)}
            />
          )}
        </label>
        <button disabled={!btnActive} type={"submit"}>
          {selected ? "Save" : "Add"}
        </button>
      </form>
    </div>
  );
};
