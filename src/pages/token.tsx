import { CDN_URL } from '@/configs';
import Layout from '@/layouts';
import TokenDetail from '@/modules/Token';
import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';

const Token = () => {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Box bgColor={'rgb(28, 28, 28)'}>
        <Layout>
          <TokenDetail />
        </Layout>
      </Box>
    </>
  );
};

export default Token;
