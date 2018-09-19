import React from 'react';
import styled from '@styled';
import { RouteComponentProps, Switch, Route, Link } from 'react-router-dom';
import { firebase, Theme } from 'config';
import { Card, Button, Input, List, Icon, Popconfirm, message } from 'antd';
import { distanceInWordsToNow } from 'date-fns';

import { Header, Loading, Wrapper, EmptyData } from 'components';
import { IEvent, pageTitle } from 'utils';
import NewEvent from './components/NewEvent';
import DocumentTitle from 'react-document-title';

interface State {
  search: string;
  loading: boolean;
  events: IEvent[];
  filteredEvents: IEvent[];
  disabled: string; // Disabled event
}

class Events extends React.Component<RouteComponentProps, State> {
  eventsSubscription: () => void;

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      search: '',
      loading: true,
      events: [],
      filteredEvents: [],
      disabled: '',
    };
  }

  componentDidMount() {
    this.eventsSubscription = firebase
      .firestore()
      .collection('events')
      .orderBy('createdAt', 'desc')
      .onSnapshot(this.updateEvents);

    document.body.style.height = 'auto';
  }

  componentWillUnmount() {
    this.eventsSubscription();
  }

  updateEvents = (snapshot: firebase.firestore.QuerySnapshot) => {
    const events = snapshot.docs.map(
      a =>
        ({
          id: a.id,
          ...a.data(),
        } as IEvent)
    );

    this.setState({
      events,
      filteredEvents: events,
      loading: false,
    });
  };

  newEvent = () => {
    this.props.history.push('/events/new');
  };

  updateSearch = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { value: search } = event.currentTarget;
    const { events } = this.state;

    const filteredEvents = events.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );

    this.setState({ filteredEvents, search });
  };

  deleteEvent = async (event: IEvent) => {
    this.setState({ disabled: event.id });

    try {
      await firebase
        .firestore()
        .collection('events')
        .doc(event.id)
        .delete();

      message.success(`Event "${event.name}" deleted`, 3, () => {
        this.setState({ disabled: '' });
      });
    } catch (event) {
      console.error(event);
    }
  };

  renderContent = () => {
    const { loading, events, search, filteredEvents, disabled } = this.state;

    if (loading) {
      return <Loading />;
    }

    if (events.length === 0) {
      return (
        <EmptyData
          title="No Events Added as yet"
          description="Fortunately, it’s very easy to create one."
        >
          <Button size="large" type="primary" onClick={this.newEvent}>
            Create Event
          </Button>
        </EmptyData>
      );
    }

    return (
      <main>
        <Search
          placeholder="Search events"
          size="large"
          value={search}
          onChange={this.updateSearch}
          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
                    onConfirm={() => this.deleteEvent(a)}
                    okText="Yes"
                    cancelText="No"
                    okType="danger"
                  >
                    <Button disabled={isDisabled} loading={isDisabled}>
                      {!isDisabled && (
                        <Icon
                          type="delete"
                          theme="twoTone"
                          twoToneColor={Theme.colors.error}
                        />
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

  render() {
    return (
      <DocumentTitle title={pageTitle('Events')}>
        <React.Fragment>
          <Header
            title="Events"
            titleLink="/"
            fixed
            insetFlow
            headerRight={() => (
              <Route
                exact
                path="/"
                component={() => (
                  <Button type="primary" onClick={this.newEvent}>
                    New Event
                  </Button>
                )}
              />
            )}
          />

          <Wrapper header>
            <Switch>
              <Route exact path="/events/new" component={NewEvent} />
              <Route component={this.renderContent} />
            </Switch>
          </Wrapper>
        </React.Fragment>
      </DocumentTitle>
    );
  }
}

const EventCard = styled(Card)`
  margin-bottom: 15px;
`;

// @ts-ignore
const Search = styled(Input)`
  margin-bottom: 15px;
`;

export default Events;
