import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Card,
  Input,
  Icon,
  Checkbox,
  List,
  Button,
  Popconfirm,
  message,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { Wrapper, Loading, AttendeesList, EmptyData } from 'components';
import { Category, Attendee, pageTitle } from 'utils';
import { firebase, Theme } from 'config';
import styled from '@styled';
import DocumentTitle from 'react-document-title';

interface State {
  search: string;
  loading: boolean;
  fetched: number;
  categories: Category[];
  attendees: Attendee[];
  filteredAttendees: Attendee[];
}

interface Params {
  eventId: string;
}

type Props = RouteComponentProps<Params>;

export default class Attendance extends React.Component<Props, State> {
  attendeesSubscription: () => void;
  categoriesSubscription: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      search: '',
      loading: false,
      fetched: 0,
      categories: [],
      attendees: [],
      filteredAttendees: [],
    };
  }

  componentDidMount() {
    const { eventId } = this.props.match.params;

    this.attendeesSubscription = firebase
      .firestore()
      .collection('events')
      .doc(eventId)
      .collection('attendees')
      .orderBy('createdAt', 'desc')
      .onSnapshot(this.updateAttendees, console.error);

    this.categoriesSubscription = firebase
      .firestore()
      .collection('events')
      .doc(eventId)
      .collection('categories')
      .orderBy('createdAt', 'desc')
      .onSnapshot(this.updateCategories, console.error);
  }

  componentWillUnmount() {
    this.attendeesSubscription();
    this.categoriesSubscription();
  }

  updateAttendees = (snapshot: firebase.firestore.QuerySnapshot) => {
    const { categories } = this.state;
    const attendees = snapshot.docs.map(
      a =>
        ({
          id: a.id,
          ...a.data(),
        } as Attendee)
    );

    this.setState(({ fetched }) => ({
      attendees,
      filteredAttendees: attendees,
      fetched: fetched + 1,
      categories: categories.map(a => ({
        ...a,
        present: attendees.filter(
          b => b.category && b.category.id === a.id && b.present
        ).length,
      })),
    }));
  };

  updateCategories = (snapshot: firebase.firestore.QuerySnapshot) => {
    const { attendees } = this.state;

    const categories = snapshot.docs.map(
      a =>
        ({
          id: a.id,
          ...a.data(),
          present: attendees.filter(
            b => b.category && b.category.id === a.id && b.present
          ).length,
        } as Category)
    );

    this.setState(({ fetched }) => ({
      categories,
      fetched: fetched + 1,
    }));
  };

  updateSearch = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    const input = value.trim();

    this.setState(({ attendees }) => ({
      search: value,
      filteredAttendees:
        input === ''
          ? attendees
          : attendees.filter(a =>
              a.name.toLowerCase().includes(value.toLowerCase())
            ),
    }));
  };

  toggleChecked = async (event: CheckboxChangeEvent) => {
    const { checked, name: attendeeId } = event.target;
    const { eventId } = this.props.match.params;

    try {
      await firebase
        .firestore()
        .collection('events')
        .doc(eventId)
        .collection('attendees')
        .doc(attendeeId)
        .update({
          present: checked,
        });
    } catch (error) {
      console.log(error);
    }
  };

  clearAttendance = () => {
    const { eventId } = this.props.match.params;
    const { attendees } = this.state;

    this.setState({ loading: true }, async () => {
      try {
        const batch = firebase.firestore().batch();

        attendees.forEach(({ id }) => {
          const ref = firebase
            .firestore()
            .collection('events')
            .doc(eventId)
            .collection('attendees')
            .doc(id);

          batch.update(ref, { present: false });
        });

        await batch.commit();

        this.setState({ loading: false });
        message.success('Attendence cleared.', 2);
      } catch (error) {
        console.log(error);
      }
    });
  };

  render() {
    const {
      fetched,
      categories,
      search,
      filteredAttendees,
      loading,
    } = this.state;

    if (fetched < 2) {
      return (
        <DocumentTitle title={pageTitle('Loading...')}>
          <Loading />
        </DocumentTitle>
      );
    }

    return (
      <DocumentTitle title={pageTitle('Attendance')}>
        <RegisterWrapper>
          {categories.length === 0 ? (
            <EmptyData
              title="No Tallies as Yet"
              description="Add Attendees to see the tallies here"
            />
          ) : (
            <Items>
              {categories.map(a => (
                <Score key={a.id}>
                  <Card.Meta title={`${a.present}`} description={a.name} />
                </Score>
              ))}
            </Items>
          )}

          <Search
            placeholder="Search attendees"
            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={search}
            onChange={this.updateSearch}
            disabled={loading}
          />

          <AttendancePanel>
            <ListActions>
              <ListActionsTitle>Attendance Actions</ListActionsTitle>

              <Popconfirm
                title="Are you sure you want to clear the attendance?"
                onConfirm={this.clearAttendance}
                okText="Yes"
                cancelText="No"
              >
                <Button loading={loading} disabled={loading}>
                  Clear Attendance
                </Button>
              </Popconfirm>
            </ListActions>

            <AttendanceList>
              <List
                dataSource={filteredAttendees}
                renderItem={(a: Attendee) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <AttendeeCheckbox
                          name={a.id}
                          disabled={loading}
                          checked={a.present}
                          onChange={this.toggleChecked}
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
      </DocumentTitle>
    );
  }
}

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
