import React, { useEffect, useState, useContext } from "react";
import { fsrs, FSRSParameters, generatorParameters, FSRS } from "ts-fsrs";

interface IFSRSContext {
  params?: FSRSParameters;
  setParams?: React.Dispatch<React.SetStateAction<FSRSParameters>>;
  f?: FSRS;
  setF?: React.Dispatch<React.SetStateAction<FSRS>>;
}

const FSRSContext = React.createContext<IFSRSContext>({});

export default FSRSContext;

export function FSRSProvider({
  children,
  p = generatorParameters(),
}: {
  children: React.ReactNode;
  p?: FSRSParameters;
}) {
  const [params, setParams] = useState<FSRSParameters>(p);
  const [f, setF] = useState<FSRS>(fsrs(p));
  const value = {
    params,
    setParams,
    f,
    setF,
  };
  useEffect(() => {
    setF(fsrs(params));
  }, [params]);

  return <FSRSContext.Provider value={value}>{children}</FSRSContext.Provider>;
}

export const useFSRSContext = () => useContext<IFSRSContext>(FSRSContext);
