import { CDN_URL } from '@/configs';
import Layout from '@/layouts';
import IdoTokenManage from '@/modules/IdoTokenManage';
import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';

const CreateIdo = () => {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Box bgColor={'rgb(28, 28, 28)'}>
        <Layout>
          <IdoTokenManage />
        </Layout>
      </Box>
    </>
  );
};

export default CreateIdo;
