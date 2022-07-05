import React from 'react';
import styled from 'styled-components';

interface Props {
  title: string | React.ReactNode;
  description: string;
  content?: React.ReactNode;
  children: React.ReactNode;
}

const Section = ({ title, description, children, content }: Props) => {
  return (
    <Container>
      <Meta>
        {typeof title !== 'string' ? title : <h3>{title}</h3>}
        <p>{description}</p>

        {content && <MetaContent>{content}</MetaContent>}
      </Meta>

      <Content>{children}</Content>
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

const MetaContent = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: ${({ theme }) => theme.border};

  button {
    width: 100%;
  }
`;

const Content = styled.div`
  padding-left: 30px;
  flex: 7;
`;

export default Section;
