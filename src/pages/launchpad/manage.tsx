import { CDN_URL } from '@/configs';
import Layout from '@/layouts';
import LaunchManage from '@/modules/LaunchpadManage';
import Head from 'next/head';
import React from 'react';

const ManageLaunchPad = () => {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Layout>
        <LaunchManage />
      </Layout>
    </>
  );
};

export default ManageLaunchPad;
