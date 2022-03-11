import { createContext, useContext } from 'react';
import { AuthLoginResponse, CreateNotificationInput, User } from '../../types';
import { FetchResult, LazyQueryResult } from '@apollo/client';

export type UpdateUser = keyof Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'reaches' | 'notifications'>;

export type UserContextData = {
  jwt?: AuthLoginResponse;
  data?: User;
  loading: boolean;
  error: any;
  updateUser: (key: UpdateUser, value: any) => void;
  loadUser: () => Promise<LazyQueryResult<any, { email: any }>>;
  decodeJwt: () => Promise<LazyQueryResult<any, { email: any }>>;
  addUserGage: (gageId: number) => Promise<void>;
  createNotification: (
    input: CreateNotificationInput
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  removeNotification: (notificationId: number) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
};

export const UserContext = createContext({} as UserContextData);

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('must be used inside valid provider');
  }

  return context;
};
