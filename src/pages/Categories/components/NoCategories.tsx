import React from 'react';
import styled from '@styled';
import { Card } from 'antd';

const NoCategories = () => (
  <article>
    <EmptyCard>
      <h2>No Categories Added as Yet</h2>
      <p>Fortunately, it’s very easy to create one.</p>
    </EmptyCard>
  </article>
);

const EmptyCard = styled(Card)`
  padding: 15px;
  text-align: center;

  button {
    margin-top: 15px;
  }
`;

export default NoCategories;
