/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '@/layouts';
import React from 'react';
import PoolsV2RemovePage from "@/modules/PoolsV2/Remove";

export interface IPoolV2Detail {
  ids: string[];
}

const PoolV2Remove: React.FC<IPoolV2Detail> = (props) => {
  const ids = props.ids;

  return (
    <>
      <Layout>
        <PoolsV2RemovePage ids={ids} />
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
    } as IPoolV2Detail,
  };
}

export default PoolV2Remove;
