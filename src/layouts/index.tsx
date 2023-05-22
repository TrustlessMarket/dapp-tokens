import px2rem from '@/utils/px2rem';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Header from './Header';

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

interface LayoutProps extends PropsWithChildren {
  isHideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isHideFooter }) => {
  return (
    <>
      <Header />
      {children}
      <Footer isHide={isHideFooter} />
    </>
  );
};

export default Layout;
