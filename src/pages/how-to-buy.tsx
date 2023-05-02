import { CDN_URL } from '@/configs';
import Layout from '@/layouts';
import HowToBuyMain from '@/modules/HowToBuy';
import { useColorMode } from '@chakra-ui/react';
import Head from 'next/head';
import React, { useEffect } from 'react';

const HowToBuy = () => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode('dark');
    return () => {
      setColorMode('light');
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Layout>
        <HowToBuyMain />
      </Layout>
    </>
  );
};

export default HowToBuy;
