import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './Auth';
import { usePageTitle } from '../utils/usePageTitle';
import { RequireAuth } from '../utils/RequireAuth';

import { Login } from '../pages/Login/Login';
import { Page404 } from '../pages/404/Page404';
import { Attendance } from '../pages/Attendance/Attendance';
import { Attendees } from '../pages/Attendees/Attendees';
import { Categories } from '../pages/Categories/Categories';
import { EventList } from '../pages/Events/components/EventList';
import { NewEvent } from '../pages/Events/components/NewEvent';
import { Events } from '../pages/Events/Events';
import { ViewEvent } from '../pages/ViewEvent/ViewEvent';

export const Shell = () => {
  usePageTitle('Loading...');

  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AuthProvider>
  );
};
