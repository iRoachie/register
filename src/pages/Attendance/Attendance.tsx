import React, { useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { Card, Input, Checkbox, List, Button, Popconfirm, message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { Wrapper, Loading, AttendeesList, EmptyData } from '../../components';
import { firestore, Theme } from '../../config';
import styled from 'styled-components';
import { doc, runTransaction, updateDoc } from 'firebase/firestore';
import { MinusSquareTwoTone, SearchOutlined } from '@ant-design/icons';
import { usePageTitle } from '../../utils/usePageTitle';
import { ViewEventContext } from '../../utils/types';

export const Attendance = () => {
  const { eventId } = useParams();
  usePageTitle('Attendance');

  const {
    attendees,
    categories,
    categoriesStatus,
    attendeesStatus,
    totals,
    totalsStatus,
  } = useOutletContext<ViewEventContext>();

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const onUpdateSearch = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value.trim());
  };

  const onToggleChecked = async (event: CheckboxChangeEvent) => {
    const { checked, name: attendeeId } = event.target;

    try {
      await updateDoc(
        doc(firestore, `events/${eventId}/attendees/${attendeeId}`),
        {
          present: checked,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onClearAttendance = async () => {
    setLoading(true);

    try {
      await runTransaction(firestore, async (batch) => {
        attendees.forEach(({ id }) => {
          batch.update(doc(firestore, `/events/${eventId}/attendees/${id}`), {
            present: false,
          });
        });
      });

      setLoading(false);
      message.success('Attendence cleared.', 2);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredAttendees =
    search === ''
      ? attendees
      : attendees.filter((a) =>
          a.name.toLowerCase().includes(search.toLowerCase())
        );

  if (
    attendeesStatus !== 'success' &&
    categoriesStatus !== 'success' &&
    totalsStatus !== 'success'
  ) {
    return <Loading />;
  }

  const scores = categories.map((category) => {
    const attendeesForCategory = attendees.filter(
      (a) => a.category?.id === category.id && a.present
    );

    return {
      ...category,
      present: attendeesForCategory.length,
    };
  });

  const totalScores = totals.map((total) => {
    const totalSum = total.categories.reduce((acc, curr) => {
      acc += scores.find((a) => a.id === curr)?.present || 0;
      return acc;
    }, 0);

    return {
      ...total,
      present: totalSum,
    };
  });

  return (
    <RegisterWrapper>
      {categories.length === 0 ? (
        <EmptyData
          title="No Tallies as Yet"
          description="Add Attendees to see the tallies here"
        />
      ) : (
        <Items>
          <>
            {totalScores.map((a) => (
              <Score key={a.id}>
                <Card.Meta title={`${a.present}`} description={a.name} />
              </Score>
            ))}

            {scores.map((a) => (
              <Score key={a.id}>
                <Card.Meta title={`${a.present}`} description={a.name} />
              </Score>
            ))}
          </>
        </Items>
      )}

      <Search
        placeholder="Search attendees"
        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
        value={search}
        onChange={onUpdateSearch}
        disabled={loading}
      />

      <AttendancePanel>
        <ListActions>
          <ListActionsTitle>Attendance Actions</ListActionsTitle>

          <Popconfirm
            title="Are you sure you want to clear the attendance?"
            onConfirm={onClearAttendance}
            okText="Yes"
            cancelText="No"
          >
            <Button loading={loading} disabled={loading}>
              <MinusSquareTwoTone />
              Clear Attendance
            </Button>
          </Popconfirm>
        </ListActions>

        <AttendanceList>
          <List
            dataSource={filteredAttendees}
            renderItem={(a) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <AttendeeCheckbox
                      name={a.id}
                      disabled={loading}
                      checked={a.present}
                      onChange={onToggleChecked}
                    />
                  }
                  title={a.name}
                  description={a.category ? a.category.name : 'No Category'}
                />
              </List.Item>
            )}
          />
        </AttendanceList>
      </AttendancePanel>
    </RegisterWrapper>
  );
};

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-bottom: 15px;
  border-bottom: ${({ theme }) => theme.border};
`;

// @ts-ignore
const Search = styled(Input)`
  margin-bottom: 20px;
  margin-top: 20px;
`;

const Score = styled(Card)`
  margin: 10px;

  .ant-card-meta-title {
    font-size: 28px;
  }
`;

const RegisterWrapper = styled(Wrapper)`
  max-width: 800px;
  padding-top: 30px;
`;

const AttendeeCheckbox = styled(Checkbox)`
  margin-top: 2px;
  font-size: 16px;
`;

const ListActions = styled.aside`
  background-color: ${Theme.colors.primary};
  padding: 1rem;
  width: 200px;

  button {
    width: 100%;
  }
`;

const ListActionsTitle = styled.h3`
  color: hsl(0, 0%, 100%);
  margin-bottom: 1rem;
`;

const AttendancePanel = styled.section`
  display: flex;
  min-height
`;

const AttendanceList = styled(AttendeesList)`
  flex: 1;
  padding-left: 1rem;
  padding-top: 0;
`;
