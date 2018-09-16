import React from 'react';
import styled from '@styled';
import { Button } from 'antd';
import { firebase } from 'config';

interface Props {
  title?: string;
  titleLink?: string;
  inset?: boolean;
  fixed?: boolean;
  headerRight?(): React.ReactElement<any> | null;
}

class Header extends React.Component<Props> {
  signOut = () => {
    firebase.auth().signOut();
  };

  render() {
    const { title, titleLink, headerRight, inset, fixed } = this.props;

    return (
      <Content inset={inset} fixed={fixed}>
        <Title href={titleLink}>
          <h1>{title}</h1>
        </Title>

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
const Title = styled.a`
  margin-bottom: 0;

  h1 {
    margin-bottom: 0;
  }
`;

const Content = styled.header`
  height: ${({ theme }) => theme.headerHeight};
  border-bottom: 1px solid #f1f1f1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #fff;
  z-index: 2;
  align-items: center;
  padding: ${(props: Partial<Props>) => (props.inset ? '0 15px' : 0)};
  position: ${({ fixed }) => (fixed ? 'fixed' : 'static')};
  left: ${({ inset, theme }) => (inset ? theme.sidebarWidth : 0)};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const Separator = styled.div`
  height: 30px;
  width: 1px;
  border-right: ${({ theme }) => theme.border};
  margin: 0 20px;
`;

export default Header;
