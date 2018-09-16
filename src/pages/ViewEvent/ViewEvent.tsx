import React from 'react';
import { RouteComponentProps, NavLink, Switch, Route } from 'react-router-dom';
import styled from '@styled';
import { Sidebar, Header, Loading } from 'components';
import { IEvent } from 'utils';
import { firebase } from 'config';

import { Icon } from 'antd';
import Categories from '../Categories';
import Attendees from '../Attendees';

interface Params {
  eventId: string;
}

type Props = RouteComponentProps<Params>;

interface State {
  loading: boolean;
  event: IEvent | null;
}

class ViewEvent extends React.Component<Props, State> {
  state = {
    event: { id: 'as', name: 'aea', createdAt: 'as' },
    loading: true,
  };

  componentDidMount() {
    this.getEvent();
  }

  getEvent = async () => {
    const { eventId } = this.props.match.params;

    try {
      const event = await firebase
        .firestore()
        .collection('events')
        .doc(eventId)
        .get();

      this.setState({ loading: false, event: event.data() as IEvent });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  };

  render() {
    const { eventId } = this.props.match.params;
    const { loading, event } = this.state;

    const baseURL = `/events/${eventId}`;

    if (!loading && !!event) {
      return (
        <Container>
          <Sidebar>
            <MenuLink to={`${baseURL}/register`}>
              <Icon type="solution" theme="outlined" /> Register
            </MenuLink>
            <MenuLink to={`${baseURL}/categories`}>
              <Icon type="tag" theme="outlined" /> Categories
            </MenuLink>
            <MenuLink to={`${baseURL}/attendees`}>
              <Icon type="user" theme="outlined" /> Attendees
            </MenuLink>
          </Sidebar>

          <Content>
            <Header title={event.name} inset />

            <Switch>
              <Route
                exact
                path="/events/:eventId/categories"
                component={Categories}
              />
              <Route
                exact
                path="/events/:eventId/attendees"
                component={Attendees}
              />
            </Switch>
          </Content>
        </Container>
      );
    }

    return <Loading />;
  }
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
`;

const Content = styled.main`
  flex: 1;
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

export default ViewEvent;
