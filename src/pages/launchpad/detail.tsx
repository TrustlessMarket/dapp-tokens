import {CDN_URL} from '@/configs';
import Layout from '@/layouts';
import Head from 'next/head';
import React from 'react';
import IdoDetailContainer from "@/modules/LaunchPadDetail";

const IdoToken = () => {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Layout>
        <IdoDetailContainer />
      </Layout>
    </>
  );
};

export default IdoToken;
