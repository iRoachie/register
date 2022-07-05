import { useEffect, useState } from 'react';

export const usePageTitle = (title: string) => {
  const [pageTitle, stePageTitle] = useState(title);

  useEffect(() => {
    document.title = `${pageTitle} | Register`;
  }, [pageTitle]);

  return [pageTitle, stePageTitle];
};
