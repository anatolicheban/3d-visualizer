import "./style.scss";
import { MeshColumnData } from "../../models";
import { FC, useEffect, useState } from "react";
import cn from "classnames";
type Props = {
  items: MeshColumnData[];
  selected: MeshColumnData | null;
  onSelect(el: MeshColumnData): void;
  onDelete(el: MeshColumnData): void;
  onEdit(el: MeshColumnData): void;
};
export const DataList: FC<Props> = ({
  items,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(
      items.reduce((prev, curr) => {
        return prev + curr.value;
      }, 0),
    );
  }, [items]);

  return (
    <div className={"data-list"}>
      <h2>Countries GBP in 2019 (billion $)</h2>
      {items.length ? (
        <ul>
          {items.map((el, i) => (
            <li key={i} className={cn(selected === el && "active")}>
              <div className={"wrap"} onClick={() => onSelect(el)}>
                <div style={{ background: el.color }}></div>{" "}
                <span>{el.title}</span>
                <span className={"val"}>
                  {el.value}
                  <span>({((el.value / total) * 100).toFixed(2)}%)</span>
                </span>
              </div>
              <div className={"controls"}>
                <button onClick={() => onEdit(el)}>Edit</button>
                <button onClick={() => onDelete(el)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={"empty"}>No Items</p>
      )}
    </div>
  );
};
