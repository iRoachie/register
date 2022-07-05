import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
