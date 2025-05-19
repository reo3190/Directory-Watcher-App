import {
  createContext,
  useCallback,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
// ---------------------------------------------------------

interface DataContext {}

const defaultContext: DataContext = {};

const datactx = createContext<DataContext>(defaultContext);

export const useDataContext = () => useContext(datactx);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  return <datactx.Provider value={{}}>{children}</datactx.Provider>;
};

//----------------------------------------------------------------------------------------------------
