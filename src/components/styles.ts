import styled from '@styled';

interface Props {
  header?: boolean;
}

export const Wrapper = styled.div<Props>`
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
  margin-top: ${({ header, theme }) => (header ? theme.headerHeight : 0)};
  padding-top: ${({ header }) => (header ? '10px' : 0)};
`;

export const Hr = styled.hr`
  border: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

export const AttendeesList = styled.div`
  border-top: ${({ theme }) => theme.border};
  padding-top: 20px;
  max-height: 530px;
  overflow-y: scroll;
`;
