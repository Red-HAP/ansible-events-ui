import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { accessibleRouteChangeHandler } from '@app/utils/utils';
import { Login } from '@app/Login/Login';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Projects } from '@app/Projects/Projects';
import { Project } from '@app/Project/Project';
import { NewProject } from '@app/NewProject/NewProject';
import { Activations } from '@app/Activations/Activations';
import { Activation } from '@app/Activation/Activation';
import { NewActivation } from '@app/NewActivation/NewActivation';
import { Jobs } from '@app/Jobs/Jobs';
import { Job } from '@app/Job/Job';
import { RuleSetFiles } from '@app/RuleSetFiles/RuleSetFiles';
import { RuleSetFile } from '@app/RuleSetFile/RuleSetFile';
import { Inventories } from '@app/Inventories/Inventories';
import { Inventory } from '@app/Inventory/Inventory';
import { Vars } from '@app/Vars/Vars';
import { Var } from '@app/Var/Var';
import { Playbooks } from '@app/Playbooks/Playbooks';
import { Playbook } from '@app/Playbook/Playbook';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { LastLocationProvider, useLastLocation } from 'react-router-last-location';

let routeFocusTimer: number;
export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    component: Dashboard,
    exact: true,
    label: 'Dashboard',
    path: '/dashboard',
    title: 'Main Dashboard',
  },
  {
    component: Projects,
    exact: true,
    label: 'Projects',
    path: '/projects',
    title: 'Projects',
  },
  {
    component: Project,
    path: '/project/:id',
    title: 'Project',
  },
  {
    component: NewProject,
    path: '/new-project/',
    title: 'NewProject',
  },
  {
    component: Activations,
    exact: true,
    label: 'Activations',
    path: '/activations',
    title: 'Activations',
  },
  {
    component: Activation,
    exact: true,
    path: '/activation/:id',
    title: 'Activation',
  },
  {
    component: NewActivation,
    path: '/new-activation/',
    title: 'NewActivation',
  },
  {
    component: Jobs,
    exact: true,
    label: 'Jobs',
    path: '/jobs',
    title: 'Jobs',
  },
  {
    component: Job,
    exact: true,
    path: '/job/:id',
    title: 'Job',
  },
  {
    component: RuleSetFiles,
    exact: true,
    label: 'Rules Files',
    path: '/rulesetfiles',
    title: 'Rules Files',
  },
  {
    component: RuleSetFile,
    exact: true,
    path: '/rulesetfile/:id',
    title: 'RuleSetFile',
  },
  {
    component: Inventories,
    exact: true,
    label: 'Inventories',
    path: '/inventories',
    title: 'Inventories',
  },
  {
    component: Inventory,
    exact: true,
    path: '/inventory/:id',
    title: 'Inventory',
  },
  {
    component: Vars,
    exact: true,
    label: 'Extra Vars',
    path: '/vars',
    title: 'Extra Vars',
  },
  {
    component: Var,
    exact: true,
    path: '/var/:id',
    title: 'Var',
  },
  {
    component: Playbooks,
    exact: true,
    label: 'Playbooks',
    path: '/playbooks',
    title: 'Playbooks',
  },
  {
    component: Playbook,
    exact: true,
    path: '/playbook/:id',
    title: 'Playbook',
  }
];

// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
const useA11yRouteChange = (isAsync: boolean) => {
  const lastNavigation = useLastLocation();
  React.useEffect(() => {
    if (!isAsync && lastNavigation !== null) {
      routeFocusTimer = accessibleRouteChangeHandler();
    }
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [isAsync, lastNavigation]);
};

const RouteWithTitleUpdates = ({ component: Component, isAsync = false, title, ...rest }: IAppRoute) => {
  useA11yRouteChange(isAsync);
  useDocumentTitle(title);

  function routeWithTitle(routeProps: RouteComponentProps) {
    return <Component {...rest} {...routeProps} />;
  }

  return <Route render={routeWithTitle} {...rest}/>;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFound} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[]
);

const AppRoutes = (): React.ReactElement => (
  <LastLocationProvider>
    <Switch>
      {flattenedRoutes.map(({ path, exact, component, title, isAsync }, idx) => (
        <RouteWithTitleUpdates
          path={path}
          exact={exact}
          component={component}
          key={idx}
          title={title}
          isAsync={isAsync}
        />
      ))}
      <PageNotFound title="404 Page Not Found" />
    </Switch>
  </LastLocationProvider>
);

export { AppRoutes, routes };
