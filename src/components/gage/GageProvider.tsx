import {GageContext} from './gageContext';
import React, {ReactNode, useState} from 'react';
import {useLazyQuery, useSubscription} from '@apollo/client';
import {GAGES_UPDATED_SUB} from './subscriptions';
import {notification} from 'antd';
import {GAGE} from './queries';
import {useUserContext} from '../user/userContext';

export type GageProviderProps = {
    children: ReactNode;
};

export const GageProvider = ({children}: GageProviderProps) => {
    const {loadUser} = useUserContext();


    console.log()

    const id = 1

    const [gagesUpdated, setGagesUpdated] = useState<Date>();
    const [loadGageDetail, {data, loading, error}] = useLazyQuery(GAGE);
    const gagesSubscription = useSubscription(GAGES_UPDATED_SUB, {
        onSubscriptionData: () => {
            // pass gage data / ids?
            setGagesUpdated(new Date());
            // loadUser();
            notification.info({
                message: 'Gages Updated',
                placement: 'bottomRight'
            });
        }
    });


    return (
        <GageContext.Provider value={{
            gagesUpdated, gage: data?.gage, loading, error: !!error, loadGageDetail: async (id: number) => {
                return await loadGageDetail({
                    variables: {
                        id
                    }
                })
            }
        }}>
            {children}
        </GageContext.Provider>
    );
};
