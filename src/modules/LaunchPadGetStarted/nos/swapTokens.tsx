import { Box, Flex, Link, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { CDN_URL } from '@/configs';
import React from 'react';
import Step from '@/modules/GetStarted/step';
import styles from '../styles.module.scss';
import {getTMAddress} from "@/utils";
import {ROUTE_PATH} from "@/constants/route-path";

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
        </UnorderedList>
      </Box>
    ),
  },
  {
    step: '4',
    title: 'Voting',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Select the project with the “Voting” status. Then click “Support this Project” and put in the amount of $TM you want to vote.
            <img
              alt="launchpad_step_4_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad/nos/launchpad_step_4_1.png`}
            />
          </ListItem>
          <ListItem>
            Click “Confirm" to Approve use of $TM at MetaMask pop-up. Once tx is confirmed, click “Vote” again to finish.
            <img
              alt="swap_step_3_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/launchpad/nos/launchpad_step_4_2.png`}
            />
          </ListItem>
          <ListItem>
            You can get $TM to cast a vote <a href={`${ROUTE_PATH.TOKEN}?address=${getTMAddress()}`} style={{textDecoration: 'underline'}}>here</a>
            <br/>
          </ListItem>
        </UnorderedList>
        <Text>*Note: If a project is listed on the launchpad, voters will receive 5% of the project's total crowdfunding amount proportionally in project’s tokens.</Text>
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
