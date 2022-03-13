import {createContext, useContext} from 'react';
import {Gage} from '../../types';
import {LazyQueryResult, OperationVariables} from "@apollo/client";

export type GageContextData = {
    gagesUpdated?: Date;
    gage: Gage;
    loading: boolean;
    error: boolean;
    loadGageDetail: (id: number) => Promise<LazyQueryResult<any, OperationVariables>>
};

export const GageContext = createContext({} as GageContextData);

export const useGageContext = () => useContext(GageContext);
