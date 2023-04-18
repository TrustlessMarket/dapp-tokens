import { NextPage } from 'next';
import Layout from '@/layouts';
import Page404 from '@/containers/404';

const ErrorPage: NextPage = () => {
  return (
    <Layout>
      <Page404 />
    </Layout>
  );
};

export default ErrorPage;
