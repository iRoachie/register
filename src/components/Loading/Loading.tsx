import React from 'react';
import { Spin, Icon } from 'antd';
import styled from '@styled';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Loading = () => (
  <Content>
    <Spin indicator={antIcon} />
  </Content>
);

const Content = styled.main`
  background: hsl(0, 0%, 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  padding-top: 30px;
`;

export default Loading;
