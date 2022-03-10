import { Reach } from '../../types';
import { createContext, useContext } from 'react';

export type ReachContextData = {
  data?: Reach;
  loading: boolean;
  error: any;
  updateReach: (key: keyof Omit<Reach, 'id'>, value: any) => void;
};

export const ReachContext = createContext({} as ReachContextData);

export const useReachContext = () => {
  const context = useContext(ReachContext);

  if (context === undefined) {
    throw new Error('Must be used inside valid provider');
  }
  return context;
};
