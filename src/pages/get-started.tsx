import {CDN_URL} from '@/configs';
import Layout from '@/layouts';
import GetStarted from '@/modules/GetStarted';
import Head from 'next/head';
import {Box} from "@chakra-ui/react";

export default function Started() {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Box bgColor={"#0F0F0F"}>
        <Layout>
          <GetStarted />
        </Layout>
      </Box>
    </>
  );
}
