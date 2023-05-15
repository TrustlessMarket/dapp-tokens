import {CDN_URL} from '@/configs';
import Layout from '@/layouts';
import UpdateTokenInfo from '@/modules/UpdateTokenInfo';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <link rel="icon" href={`${CDN_URL}/icons/logo-tc-market.svg`} />
      </Head>
      <Layout>
        <UpdateTokenInfo />
      </Layout>
    </>
  );
}
