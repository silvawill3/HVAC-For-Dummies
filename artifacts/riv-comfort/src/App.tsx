import { Route, Switch, Router as WouterRouter } from 'wouter';
import HvacGuide from '@/pages/HvacGuide';
import SalesRepPortal from '@/pages/SalesRepPortal';
import LeadsRouteSheet from '@/pages/LeadsRouteSheet';

function Router() {
  return (
    <Switch>
      <Route path="/" component={HvacGuide} />
      <Route path="/portal" component={SalesRepPortal} />
      <Route path="/leads" component={LeadsRouteSheet} />
      <Route>
        <HvacGuide />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
