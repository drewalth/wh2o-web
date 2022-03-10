import React, { ReactNode, useEffect, useState } from 'react';
import { ReachContext } from './reachContext';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Reach, UpdateReachInput } from '../../types';
import { REACH } from './queries';
import { UPDATE_REACH } from './mutations';

type ReachProviderProps = {
  children: ReactNode;
};

export const ReachProvider = ({ children }: ReachProviderProps) => {
  const { id } = useParams<{ id?: string }>();
  const { data, loading, error } = useQuery<{ reach: Reach }, { id: number }>(REACH, {
    variables: {
      id: parseInt(id || '', 10)
    },
    skip: !id
  });

  const [handleUpdateReach] = useMutation<Reach, { updateReachInput: UpdateReachInput }>(UPDATE_REACH);

  const updateReach = async (key: keyof Omit<Reach, 'id'>, value: any) => {
    if (data?.reach) {
      const val = { ...data.reach, [key]: value };

      // @ts-ignore
      delete val.__typename;
      // @ts-ignore
      delete val.features;
      // @ts-ignore
      delete val.media;
      // @ts-ignore
      delete val.users;

      await handleUpdateReach({
        variables: {
          updateReachInput: val
        }
      });
    }
  };

  return (
    <ReachContext.Provider
      value={{
        data: data?.reach,
        loading,
        error,
        updateReach
      }}
    >
      {children}
    </ReachContext.Provider>
  );
};
