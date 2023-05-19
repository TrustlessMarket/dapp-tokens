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
              src={`${CDN_URL}/upload/1683706234267465749-1683706234-swap_step1_2.png`}
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
              Go to <Link href={"https://trustlessfaucet.io/"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlessfaucet.io/</Link> to claim $TC for free.
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/upload/1683709871148485312-1683709871-swap_step2_0.png`}
              />
            </ListItem>
            <ListItem>
              Send $BTC to your newly generated BTC wallet address for the network fee.<br/>
              You can check your $BTC balance here:
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/upload/1683706377431650464-1683706377-swap_step2.png`}
              />
            </ListItem>
          </UnorderedList>
        </Box>
      )
  },
  {
    step: '3',
    title: 'Wrap your ETH, BTC, or USDC',
    desc: (
        <Box>
          <UnorderedList>
            <ListItem>
              Go to <Link href={"https://trustlessbridge.io"} target={"_blank"} style={{textDecoration: 'underline'}}>https://trustlessbridge.io/</Link>, and connect your wallet.
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/upload/1683706461623422665-1683706461-swap_step3_1.png`}
              />
            </ListItem>
            <ListItem>
              Choose your preferred cryptocurrency (4 options: BTC, ETH, USDC, PEPE).
            </ListItem>
            <ListItem>
              Send the amount of the chosen crypto you want to trade to this wallet, and your crypto will be automatically wrapped.
              <img
                alt="swap_step1_1"
                className={styles.introImg}
                src={`${CDN_URL}/upload/1683706545509754577-1683706545-swap_step3_2.png`}
              />
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