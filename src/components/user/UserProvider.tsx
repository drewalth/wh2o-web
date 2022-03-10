import React, { ReactNode, useEffect } from 'react';
import { UpdateUser, UserContext } from './userContext';
import { useLazyQuery, useMutation } from '@apollo/client';
import { USER, WHO_AM_I } from './queries';
import { CREATE_NOTIFICATION, REMOVE_NOTIFICATION, UPDATE_USER } from './mutations';
import { CreateNotificationInput, User } from '../../types';

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [decodeJwt, { data, loading, error }] = useLazyQuery<{ whoAmI: any }>(WHO_AM_I);
  const [loadUser, { data: userData }] = useLazyQuery<{ user: User }>(USER, {
    variables: {
      email: data?.whoAmI?.email
    }
  });
  const [handleUpdate] = useMutation<User>(UPDATE_USER);
  const [handleRemoveNotification] = useMutation(REMOVE_NOTIFICATION);
  const [handleCreateNotification] = useMutation(CREATE_NOTIFICATION);

  const jwt = data?.whoAmI || {};

  const createNotification = (createNotificationInput: CreateNotificationInput) =>
    handleCreateNotification({
      variables: { createNotificationInput },
      refetchQueries: [USER]
    });

  const removeNotification = (id: number) =>
    handleRemoveNotification({
      variables: {
        id
      },
      refetchQueries: [USER]
    });

  async function updateUser<V>(key: UpdateUser, value: V) {
    const val = { ...userData?.user, [key]: value };
    // @ts-ignore
    delete val.__typename;
    delete val.reaches;
    delete val.createdAt;
    delete val.updatedAt;
    delete val.deletedAt;

    await handleUpdate({
      variables: {
        updateUserInput: {
          ...val,
          gages: val?.gages?.some((v) => v.id) ? val.gages.map((g) => g.id) : val.gages,
          notifications: val.notifications ? val.notifications.map((n) => n.id) : null
        }
      },
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch({
          variables: {
            email: data?.whoAmI?.email
          }
        });
      }
    });
  }

  useEffect(() => {
    (async () => {
      // this is not so clean...
      await decodeJwt();
      await loadUser();
    })();
  }, []);

  // const addUserGage = async (gageId: number) => {
  //   await handleUpdate({
  //     ...userData,
  //     gages: [...userData.gages.map((g) => g.id), gageId]
  //   });
  // };
  //
  // const removeUserGage = async (gageId: number) => {
  //   await handleUpdate({
  //     ...userData,
  //     gages: userData.gages.map((g) => g.id).filter((el) => el !== gageId)
  //   });
  // };

  return (
    <UserContext.Provider
      value={{
        jwt,
        data: userData?.user,
        loading,
        error,
        updateUser,
        loadUser,
        removeNotification,
        createNotification,
        decodeJwt
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
