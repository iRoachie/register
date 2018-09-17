import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Input, Icon, Checkbox, List } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { Wrapper, Loading, AttendeesList } from 'components';
import { Category, Attendee } from 'utils';
import { firebase } from 'config';
import styled from '@styled';

interface State {
  search: string;
  fetched: number;
  categories: Category[];
  attendees: Attendee[];
  filteredAttendees: Attendee[];
}

interface Params {
  eventId: string;
}

type Props = RouteComponentProps<Params>;

export default class Register extends React.Component<Props, State> {
  attendeesSubscription: () => void;
  categoriesSubscription: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      search: '',
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
      .onSnapshot(this.updateAttendees, console.error);

    this.categoriesSubscription = firebase
      .firestore()
      .collection('events')
      .doc(eventId)
      .collection('categories')
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
        present: attendees.filter(b => b.category.id === a.id && b.present)
          .length,
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
          present: attendees.filter(b => b.category.id === a.id && b.present)
            .length,
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

  render() {
    const { fetched, categories, search, filteredAttendees } = this.state;

    if (fetched < 2) {
      return <Loading />;
    }

    return (
      <RegisterWrapper>
        <Items>
          {categories.map(a => (
            <Score key={a.id}>
              <Card.Meta title={`${a.present}`} description={a.name} />
            </Score>
          ))}
        </Items>

        <Search
          placeholder="Search attendees"
          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
          value={search}
          onChange={this.updateSearch}
        />

        <AttendeesList>
          <List
            dataSource={filteredAttendees}
            renderItem={(a: Attendee) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <AttendeeCheckbox
                      name={a.id}
                      checked={a.present}
                      onChange={this.toggleChecked}
                    />
                  }
                  title={a.name}
                  description={a.category.name}
                />
              </List.Item>
            )}
          />
        </AttendeesList>
      </RegisterWrapper>
    );
  }
}

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: ${({ theme }) => theme.border};
`;

// @ts-ignore
const Search = styled(Input)`
  margin-bottom: 20px;
`;

const Score = styled(Card)`
  margin: 10px;

  .ant-card-meta-title {
    font-size: 28px;
  }
`;

const RegisterWrapper = styled(Wrapper)`
  max-width: 800px;
`;

const AttendeeCheckbox = styled(Checkbox)`
  margin-top: 2px;
  font-size: 16px;
`;
