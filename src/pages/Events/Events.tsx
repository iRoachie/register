import React, { useEffect, useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';
import { firestore } from '../../config';
import { Button } from 'antd';

import { Header, Loading, Wrapper, EmptyData } from '../../components';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from 'firebase/firestore';
import { usePageTitle } from '../../utils/usePageTitle';
import { IEvent } from '../../utils/types';

export const Events = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<IEvent[]>([]);
  const navigate = useNavigate();

  usePageTitle('Events');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, 'events'), orderBy('createdAt', 'desc')),
      updateEvents
    );

    document.body.style.height = 'auto';

    return unsubscribe;
  }, []);

  const updateEvents = (snapshot: QuerySnapshot<DocumentData>) => {
    const events = snapshot.docs.map(
      (a) => ({ id: a.id, ...a.data() } as IEvent)
    );

    setEvents(events);
    setLoading(false);
  };

  const onNewEvent = () => {
    navigate('/events/new');
  };

  return (
    <>
      <Header
        title="Events"
        titleLink="/"
        fixed
        insetFlow
        headerRight={() => (
          <Button type="primary" onClick={onNewEvent}>
            New Event
          </Button>
        )}
      />

      <Wrapper header>
        {loading && <Loading />}

        {events.length === 0 && (
          <EmptyData
            title="No Events Added as yet"
            description="Fortunately, it’s very easy to create one."
          >
            <Button size="large" type="primary" onClick={onNewEvent}>
              Create Event
            </Button>
          </EmptyData>
        )}

        {!loading && events.length > 0 && <Outlet context={events} />}
      </Wrapper>
    </>
  );
};
