import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { auth } from '../../config';

interface Props {
  title?: string;
  titleLink?: string;
  /**
   * Offset the left for the sidebar
   */
  inset?: boolean;
  /**
   * Offset both sides to fit in the max-width wrapper
   */
  insetFlow?: boolean;
  /**
   * Fixed header to the top
   */
  fixed?: boolean;
  headerRight?(): React.ReactElement<any> | null;
}

class Header extends React.Component<Props> {
  signOut = () => {
    auth.signOut();
  };

  render() {
    const { title, titleLink, headerRight, inset, fixed, insetFlow } =
      this.props;

    return (
      <Content inset={inset} fixed={fixed} insetFlow={insetFlow}>
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
  padding: ${(props: Partial<Props>) => (props.inset ? '0 20px' : 0)};
  position: ${({ fixed }) => (fixed ? 'fixed' : 'static')};
  left: ${({ inset, theme }) => (inset ? theme.sidebarWidth : 0)};
  top: 0;

  ${({ insetFlow }) =>
    insetFlow &&
    `
    max-width: 1040px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 40px);
  `};
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
