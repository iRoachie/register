import React from 'react';
import styled from '@styled';
import { Card } from 'antd';

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const EmptyData: React.SFC<Props> = ({ title, description, children }) => (
  <article>
    <EmptyCard>
      <h2>{title}</h2>
      <p>{description}</p>

      {children}
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

export default EmptyData;
