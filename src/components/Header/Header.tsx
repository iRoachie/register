import React from 'react';
import styled from '@styled';
import { Button } from 'antd';
import { firebase } from 'config';

interface Props {
  title?: string;
  titleLink?: string;
  inset?: boolean;
  headerRight?(): React.ReactElement<any> | null;
}

class Header extends React.Component<Props> {
  signOut = () => {
    firebase.auth().signOut();
  };

  render() {
    const { title, titleLink, headerRight, inset } = this.props;

    return (
      <Content inset={inset}>
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
  height: 67px;
  border-bottom: 1px solid #f1f1f1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props: Partial<Props>) => (props.inset ? '0 15px' : 0)};
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
