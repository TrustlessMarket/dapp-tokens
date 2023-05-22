import {CDN_URL} from '@/configs';
import Layout from '@/layouts';
import SwapHistory from '@/modules/SwapHistory';
import Head from 'next/head';
import {Box} from "@chakra-ui/react";

export default function SwapHistoryPage() {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Box bgColor={"#0F0F0F"}>
        <Layout>
          <SwapHistory />
        </Layout>
      </Box>
    </>
  );
}
