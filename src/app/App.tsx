import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AppProvider } from '@app/AppProvider';
import { User } from '../components/user/User';
import { AuthLogin } from '../components/auth';
import { Navigation } from '../components/common/Navigation';
import { ReachTable, ReachDetail, ReachProvider } from '../components/reach';
import { GageDetail, GageTable } from '../components/gage';
import { GuardedRoute } from '../components/common/GuardedRoute';
import { GageProvider } from '../components/gage/GageProvider';

function App() {
  return (
    <AppProvider>
      <Router>
        <Navigation>
          <div className={'App'}>
            <Switch>
              <Route
                exact
                path={'/'}
                render={() => (
                  <div>
                    <h1>HOME</h1>
                  </div>
                )}
              />
              {/* @ts-ignore */}
              <GuardedRoute exact path={'/user'} component={User} authenticated={true} />
              <Route exact path={'/login'} component={AuthLogin} />
              <Route exact path={'/reach'} component={ReachTable} />
              <Route
                exact
                path={'/gage'}
                render={() => (
                  <GageProvider>
                    <GageTable />
                  </GageProvider>
                )}
              />
              <Route
                exact
                path={'/gage/:id'}
                render={() => (
                  <GageProvider>
                    <GageDetail />
                  </GageProvider>
                )}
              />
              <Route
                exact
                path={'/reach/:id'}
                render={() => (
                  <ReachProvider>
                    <ReachDetail />
                  </ReachProvider>
                )}
              />
            </Switch>
          </div>
        </Navigation>
      </Router>
    </AppProvider>
  );
}

export default App;
