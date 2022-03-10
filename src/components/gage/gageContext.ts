import { createContext, useContext } from 'react';
import { Gage } from '../../types';

export type GageContextData = {
  gagesUpdated?: Date;
  gage: Gage;
  loading: boolean;
  error: boolean;
};

export const GageContext = createContext({} as GageContextData);

export const useGageContext = () => useContext(GageContext);
