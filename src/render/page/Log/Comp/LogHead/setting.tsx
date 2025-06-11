import React, { FC, useEffect, useState, useRef, forwardRef } from "react";
import { useDataContext } from "../../../../../hook/UpdateContext";
import { useNavigate } from "react-router-dom";

import { LogHeadCSS } from "../../../../_css/Log/index.css";
const { SettingPopCSS } = LogHeadCSS;
import { vars } from "../../../../_css/Comp/_theme.css";
import clsx from "clsx";
import { IoIosArrowBack, IoMdSettings } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";

interface Props {
  watcher: Watcher;
  handleMute: (e: boolean) => void;
  pop: boolean;
  setPop: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.RefObject<HTMLDivElement | null>;
}

const SettingPop: FC<Props> = ({
  watcher,
  handleMute,
  pop,
  setPop,
  buttonRef,
}) => {
  const { unregisterWatch } = useDataContext();

  const [gage, setGage] = useState<number>(0);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setPop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/");
  };

  const handleOnDown = (e: React.MouseEvent) => {
    if (e.button != 0) return;
    if (!interval.current) {
      interval.current = setInterval(() => {
        setGage((pre) => {
          if (pre > 100) {
            handleRemove();
            return 0;
          } else {
            return (pre += 1);
          }
        });
      }, 10);
    }
  };

  const handleOnUp = (e: React.MouseEvent) => {
    if (e.button != 0) return;
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
      setGage(0);
    }
  };

  const handleRemove = () => {
    Promise.resolve().then(() => {
      unregisterWatch(watcher);
      navigate("/");
    });
  };

  return (
    <>
      {pop && (
        <div className={SettingPopCSS.Pop} ref={ref}>
          <div className={SettingPopCSS.content}>
            <div className={SettingPopCSS.label}>　階層　</div>
            <div className={SettingPopCSS.depth}>{watcher.depth}</div>
          </div>
          <div className={SettingPopCSS.content}>
            <div className={SettingPopCSS.label}>一時停止</div>
            <label className={SettingPopCSS.mute.toggle}>
              <input
                className={SettingPopCSS.mute.input}
                type="checkbox"
                checked={watcher.mute}
                onChange={(e) => handleMute(e.target.checked)}
              />
              <span
                className={clsx(
                  SettingPopCSS.mute.slider,
                  watcher.mute && SettingPopCSS.mute.onSlider
                )}
              ></span>
            </label>
          </div>
          <div className={SettingPopCSS.content}>
            <div className={SettingPopCSS.label}>監視削除</div>
            <button
              className={SettingPopCSS.delete}
              onMouseDown={(e) => handleOnDown(e)}
              onMouseUp={(e) => handleOnUp(e)}
              onMouseLeave={(e) => handleOnUp(e)}
              style={{
                backgroundImage: `linear-gradient(90deg, ${vars.color.red} 0% ${gage}%, #00000000 0% 100%)`,
              }}
            >
              <MdDelete className={SettingPopCSS.deleteIcon} size={"1.5rem"} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default SettingPop;
