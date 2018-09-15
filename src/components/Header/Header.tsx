import React from 'react';
import styled from '@styled';
import { Button } from 'antd';
import { firebase } from 'config';

interface Props {
  title?: string;
  titleLink?: string;
  headerRight?(): React.ReactElement<any> | null;
}

class Header extends React.Component<Props> {
  signOut = () => {
    firebase.auth().signOut();
  };

  render() {
    const { title, titleLink, headerRight } = this.props;

    return (
      <Content>
        <a href={titleLink}>
          <Title>{title}</Title>
        </a>

        <HeaderRight>
          {!!headerRight && headerRight()}
          <Separator />
          <Button onClick={this.signOut} type="dashed">
            Sign Out
          </Button>
        </HeaderRight>
      </Content>
    );
  }
}

const Title = styled.h1`
  margin-bottom: 0;
`;

const Content = styled.header`
  height: 67px;
  border-bottom: 1px solid #f1f1f1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const Separator = styled.div`
  height: 30px;
  width: 0.5px;
  background-color: rgba(0, 0, 0, 0.2);
  margin: 0 20px;
`;

export default Header;
