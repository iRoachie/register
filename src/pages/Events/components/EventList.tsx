import { deleteDoc, doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { firestore } from '../../../config/firebase';
import { Button, Card, Input, List, message, Popconfirm } from 'antd';
import { DeleteTwoTone, SearchOutlined } from '@ant-design/icons';
import { distanceInWordsToNow } from 'date-fns';
import { Link, useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../../config';
import { IEvent } from '../../../utils/types';

export const EventList = () => {
  const [search, setSearch] = useState('');
  const [disabled, setDisabled] = useState('');
  const events = useOutletContext<IEvent[]>();

  const onUpdateSearch = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { value: search } = event.currentTarget;
    setSearch(search);
  };

  const onDeleteEvent = async (event: IEvent) => {
    setDisabled(event.id);

    try {
      await deleteDoc(doc(firestore, 'events', event.id));

      message.success(`Event "${event.name}" deleted`, 3, () => {
        setDisabled('');
      });
    } catch (event) {
      console.error(event);
    }
  };

  const filteredEvents = events.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <Search
        placeholder="Search events"
        size="large"
        value={search}
        onChange={onUpdateSearch}
        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
      />

      <List
        dataSource={filteredEvents}
        renderItem={(a: IEvent) => {
          const isDisabled = a.id === disabled;

          return (
            <EventCard
              key={a.id}
              actions={[
                <Popconfirm
                  key="delete"
                  title="Are you sure want to delete this event?"
                  onConfirm={() => onDeleteEvent(a)}
                  okText="Yes"
                  cancelText="No"
                  okType="danger"
                >
                  <Button disabled={isDisabled} loading={isDisabled}>
                    {!isDisabled && (
                      <DeleteTwoTone twoToneColor={Theme.colors.error} />
                    )}
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Link to={isDisabled ? '' : `/events/${a.id}`}>
                <Card.Meta
                  title={a.name}
                  description={`Created ${distanceInWordsToNow(
                    new Date(a.createdAt),
                    { addSuffix: true }
                  )}`}
                />
              </Link>
            </EventCard>
          );
        }}
      />
    </main>
  );
};

const EventCard = styled(Card)`
  margin-bottom: 15px;
`;

const Search = styled(Input)`
  margin-bottom: 15px;
`;
