import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Sidebar, Header, Loading } from '../../components';

import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../config';
import { SolutionOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import { IEvent } from '../../utils/types';
import { useGetCategories } from '../../hooks/useGetCategories';
import { useGetAttendees } from '../../hooks/useGetAttendees';
import { useGetTotals } from '../../hooks/useGetTotals';

export const ViewEvent = () => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<IEvent | null>(null);

  const { categories, status: categoriesStatus } = useGetCategories(eventId!);
  const { attendees, status: attendeesStatus } = useGetAttendees(eventId!);
  const { totals, status: totalsStatus } = useGetTotals(eventId!);

  useEffect(() => {
    const getEvent = async () => {
      try {
        const event = await getDoc(doc(firestore, `events/${eventId}`));
        setEvent(event.data() as IEvent);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getEvent();
  }, [eventId]);

  if (!loading && !!event) {
    return (
      <Container>
        <Sidebar>
          <MenuLink to="attendance">
            <SolutionOutlined /> &nbsp; Attendance
          </MenuLink>
          <MenuLink to="categories">
            <TagOutlined /> &nbsp; Categories
          </MenuLink>
          <MenuLink to="attendees">
            <UserOutlined /> &nbsp; Attendees
          </MenuLink>
        </Sidebar>

        <Content>
          <Header title={event.name} inset fixed />

          <ContentWrapper>
            <Outlet
              context={{
                categories,
                attendees,
                categoriesStatus,
                attendeesStatus,
                totals,
                totalsStatus,
              }}
            />
          </ContentWrapper>
        </Content>
      </Container>
    );
  }

  return <Loading />;
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
`;

const ContentWrapper = styled.div`
  position: relative;
  top: ${({ theme }) => theme.headerHeight};
`;

const Content = styled.main`
  flex: 1;
  margin-left: ${({ theme }) => theme.sidebarWidth};
`;

const MenuLink = styled(NavLink)`
  padding-left: 24px;
  font-size: 16px;
  color: #fff;
  display: flex;
  align-items: center;
  height: 50px;
  transition: 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  text-decoration: none;

  i {
    margin-right: 8px;
  }

  &:hover {
    color: #fff;
    background-color: hsl(207, 100%, 58%);
  }

  &.active {
    color: #fff;
    background-color: hsl(207, 100%, 43%);
    text-decoration: none;
  }
`;
