import React from 'react';
import { RouteComponentProps, NavLink, Switch, Route } from 'react-router-dom';
import styled from '@styled';
import { Sidebar, Header, Loading } from 'components';
import { IEvent, pageTitle } from 'utils';
import { firebase } from 'config';

import { Icon } from 'antd';
import Categories from '../Categories';
import Attendees from '../Attendees';
import Attendance from '../Attendance';
import DocumentTitle from 'react-document-title';

interface Params {
  eventId: string;
}

type Props = RouteComponentProps<Params>;

interface State {
  loading: boolean;
  event: IEvent | null;
}

class ViewEvent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      event: null,
      loading: true,
    };
  }

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
            <MenuLink to={`${baseURL}/attendance`}>
              <Icon type="solution" theme="outlined" /> Attendance
            </MenuLink>
            <MenuLink to={`${baseURL}/categories`}>
              <Icon type="tag" theme="outlined" /> Categories
            </MenuLink>
            <MenuLink to={`${baseURL}/attendees`}>
              <Icon type="user" theme="outlined" /> Attendees
            </MenuLink>
          </Sidebar>

          <Content>
            <Header title={event.name} inset fixed />

            <ContentWrapper>
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
                <Route
                  exact
                  path="/events/:eventId/attendance"
                  component={Attendance}
                />
              </Switch>
            </ContentWrapper>
          </Content>
        </Container>
      );
    }

    return (
      <DocumentTitle title={pageTitle('Loading...')}>
        <Loading />
      </DocumentTitle>
    );
  }
}

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

export default ViewEvent;
