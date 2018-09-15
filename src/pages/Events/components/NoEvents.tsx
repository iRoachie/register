import React from 'react';
import styled from '@styled';
import { Card, Button } from 'antd';

interface Props {
  newEvent(): void;
}

const NoEvents: React.SFC<Props> = ({ newEvent }) => (
  <Content>
    <EmptyCard>
      <h2>No Events Added as yet</h2>
      <p>Fortunately, it’s very easy to create one.</p>

      <Button size="large" type="primary" onClick={newEvent}>
        Create Event
      </Button>
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

export default NoEvents;
