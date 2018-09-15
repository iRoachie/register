import React from 'react';
import styled from '@styled';
import { Button } from 'antd';
import { firebase } from 'config';

interface Props {
  title?: string;
  titleLink?: string;
}

class Header extends React.Component<Props> {
  signOut = () => {
    firebase.auth().signOut();
  };

  render() {
    const { title, titleLink } = this.props;

    return (
      <Content>
        <a href={titleLink}>
          <Title>{title}</Title>
        </a>
        <Button onClick={this.signOut} type="dashed">
          Sign Out
        </Button>
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

export default Header;
