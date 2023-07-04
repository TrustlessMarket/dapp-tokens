/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Layout from '@/layouts';
import IncreaseLiquidity from '@/modules/PoolsV2/Increase';
import React from 'react';

export interface IPoolV2IncreaseLiquidity {
  ids: string[];
}

const PoolV2IncreaseLiquidity: React.FC<IPoolV2IncreaseLiquidity> = (props) => {
  return (
    <>
      <Layout>
        <IncreaseLiquidity />
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
//     } as IPoolV2IncreaseLiquidity,
//   };
// }

export async function getServerSideProps({ params }: any) {
  return {
    props: {
      ids: params?.id || [],
    } as IPoolV2IncreaseLiquidity,
  };
}

export default PoolV2IncreaseLiquidity;
