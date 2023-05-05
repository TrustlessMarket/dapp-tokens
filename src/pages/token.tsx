import { CDN_URL } from '@/configs';
import Layout from '@/layouts';
import TokenDetail from '@/modules/Token';
import Head from 'next/head';
import React from 'react';

const Token = () => {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Layout>
        <TokenDetail />
      </Layout>
    </>
  );
};

export default Token;
