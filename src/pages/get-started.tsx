import { CDN_URL } from '@/configs';
import Layout from '@/layouts';
import GetStarted from '@/modules/GetStarted';
import Head from 'next/head';
import { Box } from '@chakra-ui/react';
import { colors } from '@/theme/colors';

export default function Started() {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Box bgColor={colors.dark}>
        <Layout>
          <GetStarted />
        </Layout>
      </Box>
    </>
  );
}
