import styled from '@styled';

export const Wrapper = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
`;

export const Hr = styled.hr`
  border: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

export const AttendeesList = styled.div`
  border-top: ${({ theme }) => theme.border};
  padding-top: 20px;
  max-height: 400px;
  overflow-y: scroll;
`;
