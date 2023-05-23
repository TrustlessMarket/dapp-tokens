import {Box} from '@chakra-ui/react';

const Post = ({ content }) => {
  return <Box>{content}</Box>;
};

export const getStaticPaths = async () => {
  // const paths = getAllPosts().map(({ slug }) => ({ params: { slug } }));
  console.log('paramsbbbb', params);
  const paths = ['abc', 'def'];

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  // const post = await getSinglePost(params.slug);
  console.log('paramsaaaa', params);
  const post = {a: 'b'}

  return {
    props: { ...post },
  };
};

export default Post;