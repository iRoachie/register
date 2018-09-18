import React from 'react';
import styled from '@styled';
import { RouteComponentProps, Switch, Route, Link } from 'react-router-dom';
import { firebase } from 'config';
import { Card, Button } from 'antd';
import { distanceInWordsToNow } from 'date-fns';

import { Header, Loading, Wrapper, EmptyData } from 'components';
import { IEvent } from 'utils';
import NewEvent from './components/NewEvent';

interface State {
  loading: boolean;
  events: IEvent[];
}

class Events extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      loading: true,
      events: [],
    };
  }

  componentDidMount() {
    this.getEvents();
  }

  getEvents = async () => {
    try {
      const { docs: events } = await firebase
        .firestore()
        .collection('events')
        .orderBy('createdAt', 'desc')
        .get();

      this.setState({
        events: events.map(
          a =>
            ({
              id: a.id,
              ...a.data(),
            } as IEvent)
        ),
        loading: false,
      });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };

  viewEvent = () => {};

  newEvent = () => {
    this.props.history.push('/events/new');
  };

  renderContent = () => {
    const { loading, events } = this.state;

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
      <Content>
        {events.map(a => (
          <Link to={`/events/${a.id}`} key={a.id}>
            <EventCard>
              <Card.Meta
                title={a.name}
                description={`Created ${distanceInWordsToNow(
                  new Date(a.createdAt),
                  { addSuffix: true }
                )}`}
              />
            </EventCard>
          </Link>
        ))}
      </Content>
    );
  };

  render() {
    return (
      <Container>
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
      </Container>
    );
  }
}

const Container = styled.div`
  min-height: 100vh;
`;

const Content = styled.div`
  margin-top: 30px;
`;

const EventCard = styled(Card)`
  margin-bottom: 15px;
`;

export default Events;
