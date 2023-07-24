import { Box, Flex, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { CDN_URL } from '@/configs';
import React from 'react';
import Step from '@/modules/GetStarted/step';
import styles from '../styles.module.scss';

const STEPS = [
  {
    step: '1',
    title: 'Connect MetaMask wallet',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to{' '}
            <Link
              href={'https://newbitcoindex.com/'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              newbitcoindex.com
            </Link>{' '}
            and click{' '}
            <Text as="span" fontStyle={'italic'}>
              “Connect wallet”
            </Text>{' '}
            <img
              alt="swap_step_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/nos/swap_step_1.png`}
            />
          </ListItem>
          <ListItem>
            <Text as="span" fontStyle={'italic'}>Note:</Text> Only MetaMask wallet is needed for all transactions on the NOS network.
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '2',
    title: 'Get $TC to cover gas fee',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            At{' '}
            <Link
              href={'https://newbitcoincity.com/topup?tab=buy-tc&address='}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              https://newbitcoincity.com/topup?tab=buy-tc
            </Link>{' '}to buy $TC.
          </ListItem>
          <ListItem>
            <Text as="span" fontStyle={'italic'}>Note:</Text> 0.1 $TC should be sufficient to cover gas fee for more than 100 swap transactions!
            <img
              alt="swap_step_2"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/nos/swap_step_2.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '3',
    title: 'Deposit your assets to NOS',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to{' '}
            <Link
              href={'https://trustlessbridge.io'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              https://trustlessbridge.io/
            </Link>
            , choose your preferred cryptocurrency from Bitcoin and Ethereum Network. Choose NOS network as destination. Then click “Transfer".
            <img
              alt="swap_step_3_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/nos/swap_step_3_1.png`}
            />
          </ListItem>
          <ListItem>
            Once the transaction is completed, go to Meta Mask wallet and click <Text as="span" fontStyle={'italic'}>“Import tokens”</Text> to view your assets.
          </ListItem>
          <ListItem>
            You can find the token contract address at{' '}
            <Link
              href={'https://explorer.l2.trustless.computer/tokens'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              https://explorer.l2.trustless.computer/tokens
            </Link>.
            <img
              alt="swap_step_3_2"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/nos/swap_step_3_2.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '4',
    title: 'Swap',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to{' '}
            <Link
              href={'https://newbitcoindex.com/'}
              style={{ textDecoration: 'underline' }}
            >
              https://newbitcoindex.com
            </Link>{' '}
            and select the token you want to swap.
          </ListItem>
          <ListItem>
            After choosing a token and the amount you want to trade, click{' '}
            <Text as="span" fontStyle={'italic'}>
              "Swap"
            </Text>
            , then click{' '}
            <Text as="span" fontStyle={'italic'}>
              "Confirm"
            </Text>
            .
            <img
              alt="swap_step_4"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/nos/swap_step_4.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
];

const SwapTokens = () => {
  return (
    <Flex direction={'column'} gap={6}>
      {STEPS.map((s) => {
        return <Step data={s} key={s.step} />;
      })}
    </Flex>
  );
};

export default SwapTokens;
