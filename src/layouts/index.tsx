/* eslint-disable @typescript-eslint/no-empty-interface */
import { colors } from '@/theme/colors';
import px2rem from '@/utils/px2rem';
import { useColorMode } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import Footer from './Footer';
import Header from './Header';

const HEADER_HEIGHT = 80;
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

const ContentWrapper = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-self: center;
  width: 100%;

  > div {
    width: 100%;
  }
`;

interface LayoutProps extends PropsWithChildren {}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode } = useColorMode();

  const bgColor = colorMode === 'dark' ? colors.dark : colors.white;

  return (
    <Container style={{ backgroundColor: bgColor }}>
      <div className="container">
        <Header height={HEADER_HEIGHT} />
        <ContentWrapper>{children}</ContentWrapper>
        <Footer height={FO0TER_HEIGHT} />
      </div>
    </Container>
  );
};

Layout.defaultProps = {};

export default Layout;
