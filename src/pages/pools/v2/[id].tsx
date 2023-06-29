/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '@/layouts';
import PoolsV2Detail from '@/modules/PoolsV2/Detail';

const PoolV2Detail = () => {
  return (
    <>
      <Layout>
        <PoolsV2Detail />
      </Layout>
    </>
  );
};

export async function getServerSideProps({ params }: any) {
  return {
    props: {
      id: params?.id || undefined,
    },
  };
}

export default PoolV2Detail;
