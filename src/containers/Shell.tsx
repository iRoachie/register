import React, { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './Auth';
import { usePageTitle } from '../utils/usePageTitle';
import { RequireAuth } from '../utils/RequireAuth';

import { Login } from '../pages/Login/Login';
import { Page404 } from '../pages/404/Page404';
import { Loading } from '../components';

const Events = React.lazy(() =>
  import('../pages/Events/Events').then((module) => ({
    default: module.Events,
  }))
);

const ViewEvent = React.lazy(() =>
  import('../pages/ViewEvent/ViewEvent').then((module) => ({
    default: module.ViewEvent,
  }))
);

const EventList = React.lazy(() =>
  import('../pages/Events/components/EventList').then((module) => ({
    default: module.EventList,
  }))
);

const NewEvent = React.lazy(() =>
  import('../pages/Events/components/NewEvent').then((module) => ({
    default: module.NewEvent,
  }))
);

const Attendance = React.lazy(() =>
  import('../pages/Attendance/Attendance').then((module) => ({
    default: module.Attendance,
  }))
);

const Categories = React.lazy(() =>
  import('../pages/Categories/Categories').then((module) => ({
    default: module.Categories,
  }))
);

const Attendees = React.lazy(() =>
  import('../pages/Attendees/Attendees').then((module) => ({
    default: module.Attendees,
  }))
);

export const Shell = () => {
  usePageTitle('Loading...');

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="login" element={<Login />} />

            <Route
              path="/"
              element={
                <RequireAuth>
                  <Events />
                </RequireAuth>
              }
            >
              <Route index element={<EventList />} />
            </Route>

            <Route
              path="/events"
              element={
                <RequireAuth>
                  <Events />
                </RequireAuth>
              }
            >
              <Route path="new" element={<NewEvent />} />
            </Route>

            <Route
              path="/events/:eventId"
              element={
                <RequireAuth>
                  <ViewEvent />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="attendance" />} />
              <Route path="categories" element={<Categories />} />
              <Route path="attendees" element={<Attendees />} />
              <Route path="attendance" element={<Attendance />} />
            </Route>

            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};
