/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '@/layouts';
import PoolsV2AddPage from '@/modules/PoolsV2/Add';
import React from 'react';

export interface IPoolV2AddPair {
  ids: string[];
}

const PoolV2AddPair: React.FC<IPoolV2AddPair> = (props) => {
  const ids = props.ids;

  return (
    <>
      <Layout>
        <PoolsV2AddPage ids={ids} />
      </Layout>
    </>
  );
};

// export async function getStaticPaths() {
//   // Return a list of possible value for id
//   return {
//     paths: [],
//     fallback: false,
//   };
// }

// export async function getStaticProps({ params }: any) {
//   // Fetch necessary data for the blog post using params.id

//   return {
//     props: {
//       ids: params?.id,
//     } as IPoolV2AddPair,
//   };
// }

export async function getServerSideProps({ params }: any) {
  return {
    props: {
      ids: params?.id,
    } as IPoolV2AddPair,
  };
}

export default PoolV2AddPair;
