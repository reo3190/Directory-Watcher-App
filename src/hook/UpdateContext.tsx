import {
  createContext,
  useCallback,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
// ---------------------------------------------------------

interface DataContext {
  currWatcher: Watcher | null;
  setCurrWatcher: (e: Watcher | null) => void;
  watchers: Watcher[];
  setWatchers: (e: Watcher) => void;
  chatRooms: Room[];
  setChatRooms: (e: Room[]) => void;
  //
  registerWatch: (e: Watcher) => void;
  unregisterWatch: (e: Watcher) => void;
}

const defaultContext: DataContext = {
  currWatcher: null,
  setCurrWatcher: () => {},
  watchers: [],
  setWatchers: () => {},
  chatRooms: [],
  setChatRooms: () => {},
  //
  registerWatch: () => {},
  unregisterWatch: () => {},
};

const datactx = createContext<DataContext>(defaultContext);

export const useDataContext = () => useContext(datactx);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [currWatcher, setCurrWatcher] = useState<Watcher | null>(
    defaultContext.currWatcher
  );

  const [watchers, setWatchers] = useState<Watcher[]>(defaultContext.watchers);

  const [chatRooms, setChatRooms] = useState<Room[]>(defaultContext.chatRooms);

  const UpdateCurrWatch = useCallback((e: Watcher | null): void => {
    setCurrWatcher(e);
  }, []);

  const UpdateWatchers = useCallback((e: Watcher): void => {
    setWatchers((prev) => {
      const index = prev.findIndex((w) => w.name === e.name);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = e;
        return updated;
      } else {
        return [...prev, e];
      }
    });
  }, []);

  const UpdateChatRooms = useCallback((e: Room[]): void => {
    setChatRooms(e);
  }, []);

  const registerWatch = (info: Watcher) => {
    window.electron.AddWatch(info);
    setWatchers((pre) => [...pre, info]);
  };

  const unregisterWatch = (info: Watcher) => {
    window.electron.RemoveWatch(info);
    setWatchers((pre) =>
      pre.filter((e) => {
        return e != info;
      })
    );
  };

  return (
    <datactx.Provider
      value={{
        currWatcher,
        setCurrWatcher: UpdateCurrWatch,
        watchers,
        setWatchers: UpdateWatchers,
        chatRooms,
        setChatRooms: UpdateChatRooms,
        //
        registerWatch,
        unregisterWatch,
      }}
    >
      {children}
    </datactx.Provider>
  );
};

//----------------------------------------------------------------------------------------------------
