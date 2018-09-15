import React from 'react';
import styled from '@styled';
import { RouteComponentProps, Switch, Route, Link } from 'react-router-dom';
import { firebase } from 'config';
import { Card, Button } from 'antd';
import { distanceInWordsToNow } from 'date-fns';

import { Header, Loading } from 'components';
import { Event } from 'utils';
import NoEvents from './components/NoEvents';
import NewEvent from './components/NewEvent';

interface State {
  loading: boolean;
  events: Event[];
}

class Events extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      loading: true,
      events: [],
    };
  }

  componentDidMount = async () => {
    try {
      const { docs: events } = await firebase
        .firestore()
        .collection('events')
        .get();

      this.setState({
        events: events.map(
          a =>
            ({
              id: a.id,
              ...a.data(),
            } as Event)
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
      return <NoEvents newEvent={this.newEvent} />;
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

        <Switch>
          <Route exact path="/events/new" component={NewEvent} />
          <Route component={this.renderContent} />
        </Switch>
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
