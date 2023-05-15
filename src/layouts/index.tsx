import React, { PropsWithChildren } from 'react';
import Footer from './Footer';
import Header from './Header';
import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const FO0TER_HEIGHT = 80;

export const Container = styled.div`
  min-height: 100vh;
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;

  .container {
    padding: 0 ${px2rem(32)};
  }

  /* padding: 0 ${px2rem(32)}; */
  /* padding-left: 6%;
  padding-right: 6%; */
`;

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer height={FO0TER_HEIGHT} />
    </>
  );
};

export default Layout;
