import { Box, Flex, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import Step from '@/modules/GetStarted/step';
import styles from '@/modules/GetStarted/styles.module.scss';
import { CDN_URL } from '@/configs';
import React from 'react';

const STEPS_ADD_LIQUIDITY = [
  {
    step: '1',
    title: (
      <Text as="span">

      </Text>
    ),
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to{' '}
            <Link
              href={'https://newbitcoindex.com/pools/nos'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              https://newbitcoindex.com/pools/nos
            </Link>
            , click on <Text as="span" fontStyle={'italic'}>“New Position”</Text>.
          </ListItem>
          <ListItem>
            Select your preferred pair to add liquidity and choose <Text as="span" fontStyle={'italic'}>“Fee Tier”</Text> as you want.
            <img
              alt="liquidity_step_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/nos/liquidity_step_1.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '2',
    title: (
      <Text as="span">
      </Text>
    ),
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Set price range for your fee tier, note that the <Text as="span" fontStyle={'italic'}>Current Price</Text> value needs to be within the range from <Text as="span" fontStyle={'italic'}>Min Price</Text> to <Text as="span" fontStyle={'italic'}>Max Price</Text>. Then put in the token amount you want to deposit.
          </ListItem>
          <ListItem>
            To finish, click “Preview” {'->'} click “Add" {'->'} click “Confirm” at the Meta Mask pop-up
            <img
              alt="liquidity_step_2_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/nos/liquidity_step_2_1.png`}
            />
          </ListItem>
          <ListItem>
            To track the fee you earned after providing liquidity, go to{' '}
            <Link
              href={'https://newbitcoindex.com/pools/nos'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              https://newbitcoindex.com/pools/nos
            </Link>{' '}
            and click on the pair you provided
          </ListItem>
          <ListItem>
            Choose “Collect Fees” to claim, or “Increase Liquidity” to add more liquidity with same Fee Tiers and Price Range
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/nos/liquidity_step_2_2.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
];

const CreateTokens = () => {
  return (
    <Flex direction={'column'} gap={6} mt={6}>
      {STEPS_ADD_LIQUIDITY.map((s) => {
        return <Step data={s} key={s.step} />;
      })}
    </Flex>
  );
};

export default CreateTokens;
