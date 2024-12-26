import React from 'react';
import { UserAgentProvider } from './userAgentProvider';
import { userAgent } from 'next/server';
import { headers } from 'next/headers';

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { ua } = userAgent({ headers: headers() });
  return <UserAgentProvider userAgent={ua}>{children}</UserAgentProvider>;
};
