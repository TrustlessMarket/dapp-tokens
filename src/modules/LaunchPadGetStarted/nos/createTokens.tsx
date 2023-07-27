import { Box, Flex, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import Step from '@/modules/GetStarted/step';
import styles from '@/modules/GetStarted/styles.module.scss';
import { CDN_URL } from '@/configs';
import React from 'react';
import px2rem from "@/utils/px2rem";

const STEPS_CONTRIBUTE_DIRECT = [
  {
    step: '1',
    title: 'Connect MetaMask wallet',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            At{' '}
            <Link
              href={'https://newbitcoindex.com/launchpad'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >https://newbitcoindex.com/launchpad</Link>, choose your favorite project in “FUNDING” status.
          </ListItem>
          <ListItem>
            Choose “Bitcoin Wallet”/“Ethereum Wallet” as your contribution method
            <img
              alt="swap_step_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad/nos/launchpad_contribute_direct_step_1.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '2',
    title: ' ',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Transfer your BTC/ETH to this newly generated Wallet address.
            <br/>
            Note that it will cost a small BTC/ETH amount as gas fee
            <img
              alt="swap_step_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad/nos/launchpad_contribute_direct_step_2.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
];

const STEPS_CONTRIBUTE_FROM_METAMASK = [
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
            Go to{' '}
            <Link
              href={'https://newbitcoincity.com/topup?tab=buy-tc&address='}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              https://newbitcoincity.com/topup?tab=buy-tc
            </Link>{' '}to buy $TC.
          </ListItem>
          <ListItem>
            <Text as="span" fontStyle={'italic'}>Note:</Text> 0.1 $TC should be sufficient to cover gas fee for more than 100 transactions!
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
            At{' '}
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
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '4',
    title: 'Contribute',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Select the project with the “Funding” status. Then choose to contribute from your MetaMask wallet.
            <img
              alt="swap_step_3_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad/nos/launchpad_contribute_metamask_step_4_1.png`}
            />
          </ListItem>
          <ListItem>
            Put in the amount you want to contribute (in WETH or WBTC). Then click “Contribute to this project” {"=>"} Click “Confirm” at MetaMask wallet to complete
            <img
              alt="swap_step_3_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad/nos/launchpad_contribute_metamask_step_4_2.png`}
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
      <Text fontSize={px2rem(32)} color={'#FFFFFF'} fontWeight={700}>
        A. Contribute from Bitcoin/Ethereum wallet or directly from an exchange
      </Text>
      {STEPS_CONTRIBUTE_DIRECT.map((s) => {
        return <Step data={s} key={s.step} />;
      })}
      <Text fontSize={px2rem(32)} color={'#FFFFFF'} fontWeight={700}>
        B. Contribute from MetaMask wallet
      </Text>
      {STEPS_CONTRIBUTE_FROM_METAMASK.map((s) => {
        return <Step data={s} key={s.step} />;
      })}
    </Flex>
  );
};

export default CreateTokens;
