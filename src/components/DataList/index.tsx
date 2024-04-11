import "./style.scss";
import { ColumnData } from "../../models";
import { FC, useEffect, useState } from "react";
type Props = {
  items: ColumnData[];
};
export const DataList: FC<Props> = ({ items }) => {
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
            <li key={i}>
              <div style={{ background: el.color }}></div>{" "}
              <span>{el.title}</span>
              <span className={"val"}>
                {el.value}
                <span>({((el.value / total) * 100).toFixed(2)}%)</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={"empty"}>No Items</p>
      )}
    </div>
  );
};
