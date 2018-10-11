import React from 'react';
import {
  Wrapper,
  Loading,
  Section,
  EmptyData,
  AttendeesList,
} from 'components';
import { firebase } from 'config';
import { Attendee, Category, pageTitle } from 'utils';
import styled from '@styled';
import {
  Form,
  Input,
  Icon,
  Button,
  message,
  Select,
  List,
  Card,
  Badge,
  Popconfirm,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'react-router';

import AttendeeEdit from './components/AtttendeeEdit';
import DocumentTitle from 'react-document-title';

interface State {
  fetched: number;
  loading: boolean;
  search: string;
  categories: Category[];
  filteredAttendees: Attendee[];
  attendees: Attendee[];
  editing: { id: string; updating: boolean }[];
}

interface Params {
  eventId: string;
}

type Props = FormComponentProps & RouteComponentProps<Params>;

class Attendees extends React.Component<Props, State> {
  categoriesSubscription: () => void;
  attendeesSubscription: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      fetched: 0,
      loading: false,
      categories: [],
      filteredAttendees: [],
      attendees: [],
      search: '',
      editing: [],
    };
  }

  componentDidMount() {
    const { eventId } = this.props.match.params;

    this.categoriesSubscription = firebase
      .firestore()
      .collection('events')
      .doc(eventId)
      .collection('categories')
      .orderBy('createdAt', 'desc')
      .onSnapshot(this.updateCategories, console.error);

    this.attendeesSubscription = firebase
      .firestore()
      .collection('events')
      .doc(eventId)
      .collection('attendees')
      .orderBy('createdAt', 'desc')
      .onSnapshot(this.updateAttendees, console.error);
  }

  componentWillUnmount() {
    this.categoriesSubscription();
    this.attendeesSubscription();
  }

  updateCategories = (snapshot: firebase.firestore.QuerySnapshot) => {
    const categories = snapshot.docs.map(
      a =>
        ({
          id: a.id,
          ...a.data(),
        } as Category)
    );

    this.setState(({ fetched }) => ({
      categories,
      fetched: fetched + 1,
    }));
  };

  updateAttendees = (snapshot: firebase.firestore.QuerySnapshot) => {
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
    }));
  };

  submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const { categories } = this.state;

    this.props.form!.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true }, () =>
          this.createAttendee(
            values.name,
            categories.find(a => a.id === values.category)!
          )
        );
      }
    });
  };

  createAttendee = async (name: string, category: Category) => {
    try {
      const { attendees } = this.state;
      const { eventId } = this.props.match.params;

      if (
        attendees &&
        attendees.find(a => a.name.toLowerCase() === name.toLowerCase())
      ) {
        message.error('Attendee already added');
        this.setState({ loading: false });
        return;
      }

      const attendee = {
        name,
        category,
        present: false,
        createdAt: Date.now(),
      };

      await firebase
        .firestore()
        .collection('events')
        .doc(eventId)
        .collection('attendees')
        .add(attendee);

      message.success(`Attendee "${name}" in "${category.name}" added.`, 3);

      this.props.form.setFields({ name: '' });
      this.setState({ loading: false });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  };

  updateSearch = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    const input = value.trim();

    this.setState(({ attendees, search }) => ({
      search: value,
      filteredAttendees:
        input === ''
          ? attendees
          : attendees.filter(a =>
              a.name.toLowerCase().includes(value.toLowerCase())
            ),
    }));
  };

  toggleAttendeeEdit = (attendeeId: string) => {
    this.setState(({ editing }) => ({
      editing: editing.find(a => a.id === attendeeId)
        ? editing.filter(a => a.id !== attendeeId)
        : [...editing, { id: attendeeId, updating: false }],
    }));
  };

  updateAttendee = (attendee: Attendee) => {
    this.setState(
      ({ editing }) => ({
        editing: editing.map(
          a => (a.id === attendee.id ? { ...a, updating: true } : a)
        ),
      }),
      async () => {
        const { eventId } = this.props.match.params;

        try {
          await firebase
            .firestore()
            .collection('events')
            .doc(eventId)
            .collection('attendees')
            .doc(attendee.id)
            .update(attendee);

          message.success(`Attendee "${attendee.name}" updated.`, 3);
          this.toggleAttendeeEdit(attendee.id);
        } catch (error) {
          console.error(error);
        }
      }
    );
  };

  deleteAttendee = ({ id, name, category }: Attendee) => {
    this.setState(
      ({ editing }) => ({
        editing: editing.map(a => (a.id === id ? { ...a, updating: true } : a)),
      }),
      async () => {
        const { eventId } = this.props.match.params;

        try {
          await firebase
            .firestore()
            .collection('events')
            .doc(eventId)
            .collection('attendees')
            .doc(id)
            .delete();

          const categoryName = category ? category.name : 'No Category';

          message.success(
            `Attendee "${name}" from "${categoryName}" deleted.`,
            3
          );

          this.setState(({ editing }) => ({
            editing: editing.filter(a => a.id !== id),
          }));
        } catch (error) {
          console.error(error);
        }
      }
    );
  };

  render() {
    const {
      loading,
      fetched,
      categories,
      filteredAttendees,
      attendees,
      search,
      editing,
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    if (fetched < 2) {
      return (
        <DocumentTitle title={pageTitle('Loading...')}>
          <Loading />
        </DocumentTitle>
      );
    }

    return (
      <DocumentTitle title={pageTitle('Attendees')}>
        <Container>
          <Wrapper>
            <Section
              title="New Attendee"
              description="Add a new attendee for this event."
            >
              <Form onSubmit={this.submitHandler}>
                <Form.Item>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input attendee name!',
                      },
                    ],
                  })(
                    <Input
                      type="text"
                      disabled={loading}
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: 'rgba(0,0,0,.25)' }}
                        />
                      }
                      placeholder="Attendee Name"
                    />
                  )}
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator('category', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select a category',
                      },
                    ],
                  })(
                    <Select disabled={loading} placeholder="Category">
                      {categories.map(a => (
                        <Select.Option value={a.id} key={a.id}>
                          {a.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>

                <Button htmlType="submit" type="primary" loading={loading}>
                  Add Attendee
                </Button>
              </Form>
            </Section>

            <Section
              title={
                <h3>
                  Attendees{' '}
                  <Badge count={attendees.length} overflowCount={9999} />
                </h3>
              }
              description="List of all attendees invited to this event."
            >
              {attendees.length === 0 ? (
                <EmptyData
                  title="No Attendees Added as Yet"
                  description="Fortunately, it’s very easy to create one."
                />
              ) : (
                <Card>
                  <Search
                    placeholder="Search attendees"
                    prefix={
                      <Icon
                        type="search"
                        style={{ color: 'rgba(0,0,0,.25)' }}
                      />
                    }
                    value={search}
                    onChange={this.updateSearch}
                  />

                  <AttendeesList>
                    <List
                      dataSource={filteredAttendees}
                      renderItem={(attendee: Attendee) =>
                        editing.some(a => a.id === attendee.id) ? (
                          <AttendeeEdit
                            attendee={attendee}
                            categories={categories}
                            cancelEditing={this.toggleAttendeeEdit}
                            updating={editing.some(
                              a => a.updating && a.id === attendee.id
                            )}
                            updateAttendee={this.updateAttendee}
                          />
                        ) : (
                          <List.Item
                            actions={[
                              <Button
                                key="edit"
                                type="dashed"
                                onClick={() =>
                                  this.toggleAttendeeEdit(attendee.id)
                                }
                              >
                                Edit
                              </Button>,
                              <Popconfirm
                                key="delete"
                                title="Are you sure want to delete this attendee?"
                                onConfirm={() => this.deleteAttendee(attendee)}
                                okText="Yes"
                                cancelText="No"
                                okType="danger"
                              >
                                <Button type="danger">Delete</Button>
                              </Popconfirm>,
                            ]}
                          >
                            <List.Item.Meta
                              title={attendee.name}
                              description={
                                attendee.category
                                  ? attendee.category.name
                                  : 'No Category'
                              }
                            />
                          </List.Item>
                        )
                      }
                    />
                  </AttendeesList>
                </Card>
              )}
            </Section>
          </Wrapper>
        </Container>
      </DocumentTitle>
    );
  }
}

const Container = styled.div`
  margin-top: 30px;
`;

// @ts-ignore
const Search = styled(Input)`
  margin-bottom: 20px;
`;

export default Form.create()(Attendees);
