import { CDN_URL } from '@/configs';
import Layout from '@/layouts';
import LaunchPadGetStarted from '@/modules/LaunchPadGetStarted';
import Head from 'next/head';

export default function Started() {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Layout>
        <LaunchPadGetStarted />
      </Layout>
    </>
  );
}
