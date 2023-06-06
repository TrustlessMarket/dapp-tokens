import {Box, Flex, Link, ListItem, Text, UnorderedList} from "@chakra-ui/react";
import {CDN_URL} from "@/configs";
import React from "react";
import Step from "@/modules/GetStarted/step";
import styles from './styles.module.scss';

const STEPS = [
  {
    step: '1',
    title: 'Create a TC Wallet',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>trustlesswallet.io</Link> and create a TC Wallet by clicking <Text as="span" fontStyle={"italic"}>"Connect wallet"</Text> to connect your Metamask wallet.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/upload/1683705812924381070-1683705812-swap_step1_1.png`}
            />
          </ListItem>
          <ListItem>
            After connecting, you will have a TC wallet address and a BTC wallet address to cover the network fee.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/swap_step_1.2_v1.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    )
  },
  {
    step: '2',
    title: 'Get $TC and $BTC for network fee',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to <Link href={"https://tcgasstation.com/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://tcgasstation.com/</Link> to buy $TC (1 TC = 0.0069 ETH). 0.1 TC should be sufficient for about 10 normal transactions.
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/swap_step_2.1_v1.png`}
            />
          </ListItem>
          <ListItem>
            Send $BTC to your newly generated BTC wallet address for the network fee. Please send $BTC from a wallet/platform that supports taproot type.<br/>
            Then you can check your $BTC balance to cover gas fee here:
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/pages/trustlessmarket/get_started/swap_step_2.2_v1.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    )
  },
  {
    step: '3',
    title: 'Wrap your cryptocurrencies',
    desc: (
      <Box>
        <UnorderedList>
          <ListItem>
            Go to <Link href={"https://trustlessbridge.io"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlessbridge.io/</Link>, choose your preferred cryptocurrency from Bitcoin and Ethereum Network.
          </ListItem>
          <ListItem>
            Once the transaction is completed, check your wrapped crypto balance under the Tokens tab in your Trustless Wallet: <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlesswallet.io/</Link>
            <img
              alt="swap_step1_1"
              className={styles.introImg}
              src={`${CDN_URL}/upload/1683706594179996670-1683706594-swap_step3_3.png`}
            />
          </ListItem>
        </UnorderedList>
      </Box>
    )
  },
  {
    step: '4',
    title: 'Start trading Smart BRC-20 tokens with Trustless Market',
    desc: (
        <Box>
          <UnorderedList>
            <ListItem>
              You are now ready to swap SBRC-20 tokens using Wrapped Crypto (i.e WBTC).
            </ListItem>
            <ListItem>
              Go to <Link href={"https://trustless.market/"} style={{textDecoration: 'underline'}}>https://trustless.market</Link> and select the token you want to swap.
            </ListItem>
            <ListItem>
              After choosing a token and the amount you want to trade, click <Text as="span" fontStyle={"italic"}>"Approve use of WBTC"</Text>, then click <Text as="span" fontStyle={"italic"}>"Swap"</Text>.
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/upload/1683709832008265887-1683709832-swap_step4.png`}
              />
            </ListItem>
          </UnorderedList>
        </Box>
      )
  },
  {
    step: '5',
    title: 'Process the transactions',
    desc: (
        <Box>
          <UnorderedList>
            <ListItem>
              Go to <Link href={"https://trustlesswallet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlesswallet.io/</Link>, click <Text as="span" fontStyle={"italic"}>"Process"</Text> your transaction on the transactions tab and wait for the confirmation on the mempool.
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/upload/1683706671933624328-1683706671-swap_step5.png`}
              />
            </ListItem>
          </UnorderedList>
        </Box>
      )
  },
];

const SwapTokens = () => {
  return (
    <Flex direction={"column"} gap={6}>
      {
        STEPS.map(s => {
          return (
            <Step data={s} key={s.step}/>
          )
        })
      }
    </Flex>
  )
};

export default SwapTokens;