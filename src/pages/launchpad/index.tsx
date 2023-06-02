import { CDN_URL } from '@/configs';
import Layout from '@/layouts';
import LaunchpadContainer from '@/modules/Launchpad';
import { colors } from '@/theme/colors';
import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';

const IdoToken = () => {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Box bgColor={colors.dark}>
        <Layout>
          <LaunchpadContainer />
        </Layout>
      </Box>
    </>
  );
};

export default IdoToken;
