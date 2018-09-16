import React from 'react';
import styled from '@styled';

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
}

const Section: React.SFC<Props> = props => {
  return (
    <Container>
      <Meta>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </Meta>

      <Content>{props.children}</Content>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  padding-bottom: 40px;
  margin-bottom: 40px;
  align-items: flex-start;
  border-bottom: ${({ theme }) => theme.border};
`;

const Meta = styled.div`
  flex: 3;
`;

const Content = styled.div`
  padding-left: 30px;
  flex: 7;
`;

export default Section;
