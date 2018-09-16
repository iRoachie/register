import React from 'react';
import styled from '@styled';
import { Card } from 'antd';

const NoCategories = () => (
  <Content>
    <EmptyCard>
      <h2>No Categories Added as yet</h2>
      <p>Fortunately, it’s very easy to create one.</p>
    </EmptyCard>
  </Content>
);

const Content = styled.div`
  margin-top: 30px;
`;

const EmptyCard = styled(Card)`
  padding: 15px;
  text-align: center;

  button {
    margin-top: 15px;
  }
`;

export default NoCategories;
