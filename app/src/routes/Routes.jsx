import React from 'react';
import { Route, Switch } from 'react-router-dom';

import DesktopIndex from './desktop/Index';
import MobileIndex from './mobile/Index';

const Router = () => (
  <Switch>
    <Route path="/desktop" exact component={ DesktopIndex } />
    <Route path="/mobile" exact component={ MobileIndex } />
    <Route component={ DesktopIndex } />
  </Switch>
);

export default Router;
