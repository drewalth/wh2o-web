import React, {ReactNode} from 'react';
import {ApolloProvider} from "../apollo/ApolloProvider";
import {UserProvider} from '../user/UserProvider';
import {GageProvider} from "../gage/GageProvider";
import {Navigation} from "../common/Navigation";

type AppProviderProps = {
    children: ReactNode;
};

export const AppProvider = ({children}: AppProviderProps) => {
    return (
        <ApolloProvider>
            <UserProvider>
                <GageProvider>
                    {/* keep navigation here. new providers wrap nav. */}
                    <Navigation>
                        {children}
                    </Navigation>
                </GageProvider>
            </UserProvider>
        </ApolloProvider>
    );
};
