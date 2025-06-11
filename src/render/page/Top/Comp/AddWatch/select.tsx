import React, { useEffect, useState, useRef, FC } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";
import { isErr } from "../../../../../hook/api";

import { AddWatchCSS } from "../../../../_css/Top/index.css";
const { SelectCSS } = AddWatchCSS.PopupCSS;

interface Props {
  rooms: Room[];
  selected: Room | null;
  setWatch: React.Dispatch<React.SetStateAction<Watcher>>;
}

const SelectRoom: FC<Props> = ({ rooms, selected, setWatch }) => {
  const [open, setOpen] = useState<Boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (e: Room) => {
    setWatch((pre) => ({ ...pre, room: e }));
    setOpen(false);
  };

  return (
    <>
      <div className={SelectCSS.wrapper} ref={ref}>
        <div
          className={SelectCSS.select}
          onClick={() => setOpen((pre) => !pre)}
        >
          {selected ? (
            <>
              <img className={SelectCSS.img} src={selected.icon} />
              <div>{selected.name}</div>
            </>
          ) : (
            <div>No selected</div>
          )}
        </div>
        {open && (
          <div className={SelectCSS.dropdown}>
            {rooms.map((e, i) => (
              <div
                key={e.id + i}
                className={SelectCSS.option}
                onClick={() => handleSelect(e)}
              >
                <img className={SelectCSS.img} src={e.icon} />
                <div>{e.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SelectRoom;
