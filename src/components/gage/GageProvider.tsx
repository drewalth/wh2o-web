import { GageContext } from './gageContext';
import React, { ReactNode, useEffect, useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GAGES_UPDATED_SUB } from './subscriptions';
import { notification } from 'antd';
import { useParams } from 'react-router-dom';
import { GAGE } from './queries';
import { useUserContext } from '../user/userContext';

export type GageProviderProps = {
  children: ReactNode;
};

export const GageProvider = ({ children }: GageProviderProps) => {
  const { loadUser } = useUserContext();
  const { id } = useParams<{ id?: string }>();
  const [gagesUpdated, setGagesUpdated] = useState<Date>();
  const { data, loading, error } = useQuery(GAGE, {
    variables: {
      id: parseInt(id || '', 10)
    },
    skip: !id
  });
  const val = useSubscription(GAGES_UPDATED_SUB, {
    onSubscriptionData: () => {
      setGagesUpdated(new Date());
      loadUser();
      notification.info({
        message: 'Gages Updated',
        placement: 'bottomRight'
      });
    }
  });

  return (
    <GageContext.Provider value={{ gagesUpdated, gage: data?.gage, loading, error: !!error }}>
      {children}
    </GageContext.Provider>
  );
};
