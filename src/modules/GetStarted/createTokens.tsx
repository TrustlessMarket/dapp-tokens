import { Box, Flex, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import Step from '@/modules/GetStarted/step';
import styles from '@/modules/GetStarted/styles.module.scss';
import { CDN_URL } from '@/configs';
import React from 'react';

const STEPS_CREATE_TOKEN = [
  {
    step: '1',
    title: 'Create a TC Wallet',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to{' '}
            <Link
              href={'https://trustlesswallet.io/'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              trustlesswallet.io
            </Link>{' '}
            and create a TC Wallet by clicking{' '}
            <Text as="span" fontStyle={'italic'}>
              "Connect wallet"
            </Text>{' '}
            to connect your Metamask wallet.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/step_1.1_2023_06_08.png`}
            />
          </ListItem>
          <ListItem>
            After connecting, you will have a TC wallet address and a BTC wallet
            address to cover the network fee.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/step_1.2_2023_06_08.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '2',
    title: 'Get $TC and $BTC for network fee',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to{' '}
            <Link
              href={'https://tcgasstation.com/'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              https://tcgasstation.com/
            </Link>{' '}
            to buy $TC (1 TC = 0.0069 ETH). 0.1 TC should be sufficient for about 10
            normal transactions.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/step_2.1_2023_06_08.png`}
            />
          </ListItem>
          <ListItem>
            Send $BTC to your newly generated BTC wallet address for the network fee.
            Please send $BTC from a wallet/platform that supports taproot type.
            <br />
            Then you can check your $BTC balance to cover gas fee here:
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/step_2.2_2023_06_08.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '3',
    title: 'Wrap your cryptocurrencies',
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
            , choose your preferred cryptocurrency from Bitcoin and Ethereum Network.
          </ListItem>
          <ListItem>
            Once the transaction is completed, check your wrapped crypto balance
            under the Tokens tab in your Trustless Wallet:{' '}
            <Link
              href={'https://trustlesswallet.io/'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              https://trustlesswallet.io/
            </Link>
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/upload/1683706594179996670-1683706594-swap_step3_3.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '4',
    title: (
      <Text as="span">
        Go to{' '}
        <Link
          href={'https://newbitcoindex.com/'}
          style={{ textDecoration: 'underline' }}
        >
          https://newbitcoindex.com
        </Link>
      </Text>
    ),
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Click{' '}
            <Text as="span" fontStyle={'italic'}>
              "Issue Smart BRC-20"
            </Text>
            .
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/upload/1683707095296094931-1683707095-createtoken_step4_1.png`}
            />
          </ListItem>
          <ListItem>
            A window titled{' '}
            <Text as="span" fontStyle={'italic'}>
              "Create BRC-20"
            </Text>{' '}
            will pop up.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/upload/1683707114403419317-1683707114-createtoken_step4_2.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '5',
    title: 'Enter token details.',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>Token name, symbol, and max supply are required.</ListItem>
          <ListItem>
            Select the network fee and click{' '}
            <Text as="span" fontStyle={'italic'}>
              "Create"
            </Text>{' '}
            (Some $BTC and $TC are required to pay the network fees.)
          </ListItem>
          <ListItem>
            Wait for the confirmation on the mempool.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/upload/1683707128705153325-1683707128-createtoken_step5.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
];

const STEPS_IMPORT_POOL = [
  {
    step: '1',
    title: (
      <Text as="span">
        Go to{' '}
        <Link
          href={'https://newbitcoindex.com/'}
          style={{ textDecoration: 'underline' }}
        >
          https://newbitcoindex.com
        </Link>
        , and click{' '}
        <Text as="span" fontStyle={'italic'}>
          "POOLS"
        </Text>
        .
      </Text>
    ),
    desc: (
      <Box>
        <img
          alt="swap_step1_1"
          className={styles.introImg}
          src={`${CDN_URL}/upload/1683707483395446993-1683707483-importpool_step1.png`}
        />
      </Box>
    ),
  },
  {
    step: '2',
    title: (
      <Text as="span">
        Click{' '}
        <Text as="span" fontStyle={'italic'}>
          "Import Pool"
        </Text>
      </Text>
    ),

    desc: (
      <Box>
        <img
          alt="swap_step1_1"
          className={styles.introImg}
          src={`${CDN_URL}/upload/1683707499380779074-1683707499-importpool_step2.png`}
        />
      </Box>
    ),
  },
  {
    step: '3',
    title: (
      <Text as="span">
        Select the tokens you want to import, then click{' '}
        <Text as="span" fontStyle={'italic'}>
          "Import pool"
        </Text>{' '}
        and sign.
      </Text>
    ),
    desc: (
      <Box>
        <img
          alt="swap_step1_1"
          className={styles.introImg}
          src={`${CDN_URL}/upload/1683707511246195294-1683707511-importpool_step3.png`}
        />
      </Box>
    ),
  },
  {
    step: '4',
    title: <Text as="span">Process the transactions</Text>,
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to{' '}
            <Link
              href={'https://trustlesswallet.io/'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              https://trustlesswallet.io/
            </Link>
            , click{' '}
            <Text as="span" fontStyle={'italic'}>
              "Process"
            </Text>{' '}
            your transaction on the transactions tab and wait for the confirmation on
            the mempool.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/upload/1683707522239002638-1683707522-importpool_step4.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
];

const STEPS_ADD_LIQUIDITY = [
  {
    step: '1',
    title: (
      <Text as="span">
        Click{' '}
        <Text as="span" fontStyle={'italic'}>
          "+Add liquidity"
        </Text>
      </Text>
    ),
    desc: (
      <Box>
        <img
          alt="swap_step1_1"
          className={styles.introImg}
          src={`${CDN_URL}/upload/1683707685320295626-1683707685-addliquidity_step1.png`}
        />
      </Box>
    ),
  },
  {
    step: '2',
    title: (
      <Text as="span">
        Select the tokens and the amount you want to add, then click{' '}
        <Text as="span" fontStyle={'italic'}>
          "Supply"
        </Text>
      </Text>
    ),
    desc: (
      <Box>
        <img
          alt="swap_step1_1"
          className={styles.introImg}
          src={`${CDN_URL}/upload/1683707704628878878-1683707704-addliquidity_step2.png`}
        />
      </Box>
    ),
  },
  {
    step: '3',
    title: <Text as="span">Process the transactions</Text>,
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to{' '}
            <Link
              href={'https://trustlesswallet.io/'}
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
            >
              https://trustlesswallet.io/
            </Link>
            , click{' '}
            <Text as="span" fontStyle={'italic'}>
              "Process"
            </Text>{' '}
            your transaction on the transactions tab and wait for the confirmation on
            the mempool.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/upload/1683707717560327063-1683707717-addliquidity_step3.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    ),
  },
];

const CreateTokens = () => {
  return (
    <>
      <Text fontSize={'28px'} color={'#FFFFFF'} fontWeight={'medium'}>
        1. Issue a new SBRC-20 token.
      </Text>
      <Flex direction={'column'} gap={6} mt={6}>
        {STEPS_CREATE_TOKEN.map((s) => {
          return <Step data={s} key={s.step} />;
        })}
      </Flex>
      <Text fontSize={'28px'} color={'#FFFFFF'} fontWeight={'medium'} mt={24}>
        2. Create a liquidity pool.
      </Text>
      <Text fontSize={'20'} color={'#FFFFFF'} fontWeight={'normal'}>
        A. Import pool
      </Text>
      <Flex direction={'column'} gap={6} mt={6}>
        {STEPS_IMPORT_POOL.map((s) => {
          return <Step data={s} key={s.step} />;
        })}
      </Flex>
      <Text fontSize={'20px'} color={'#FFFFFF'} fontWeight={'normal'} mt={12}>
        B. Add liquidity to existing pools
      </Text>
      <Flex direction={'column'} gap={6} mt={6}>
        {STEPS_ADD_LIQUIDITY.map((s) => {
          return <Step data={s} key={s.step} />;
        })}
      </Flex>
    </>
  );
};

export default CreateTokens;
