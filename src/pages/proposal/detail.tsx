import {CDN_URL} from '@/configs';
import Layout from '@/layouts';
import Head from 'next/head';
import React from 'react';
import ProposalDetailContainer from "@/modules/Proposal/detail";

const IdoToken = () => {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Layout>
        <ProposalDetailContainer />
      </Layout>
    </>
  );
};

export default IdoToken;
