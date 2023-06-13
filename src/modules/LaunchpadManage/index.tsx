/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Faq from '@/components/Swap/faq';
import { toastError } from '@/constants/error';
import { ROUTE_PATH } from '@/constants/route-path';
import { LAUNCHPAD_FORM_STEP } from '@/constants/storage-key';
import { WalletContext } from '@/contexts/wallet-context';
import useCreateLaunchpad from '@/hooks/contract-operations/launchpad/useCreate';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { ILaunchpad } from '@/interfaces/launchpad';
import {
  createLaunchpad,
  getDetailLaunchpad,
  importBoost,
} from '@/services/launchpad';
import { useAppSelector } from '@/state/hooks';
import { selectPnftExchange } from '@/state/pnftExchange';
import { colors } from '@/theme/colors';
import { showError } from '@/utils/toast';
import {
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { filter } from 'lodash';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { toast } from 'react-hot-toast';
import { BiHelpCircle } from 'react-icons/bi';
import LaunchpadManageFormContainer from './LauchpadManage.FormContainer';
import {
  BtnNeedHelpStyled,
  FAQStyled,
  PopoverNeedHelp,
  StyledLaunchpadManage,
} from './LaunchpadManage.styled';

const LaunchpadManage = () => {
  const { getSignature } = useContext(WalletContext);
  const { account } = useWeb3React();

  const { run: createProposalLaunchpad } = useContractOperation({
    operation: useCreateLaunchpad,
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [detail, setDetail] = useState<ILaunchpad | undefined>(undefined);
  const [error, setMessageError] = useState('');
  const { isOpen, onToggle, onClose } = useDisclosure();
  const needReload = useAppSelector(selectPnftExchange).needReload;

  const router = useRouter();
  const id = router.query?.id;

  useEffect(() => {
    getData();
  }, [id, needReload]);

  const getData = async () => {
    if (!id) {
      return;
    }

    try {
      const response: any = await Promise.all([getDetailLaunchpad({ id: id })]);
      setDetail(response[0]);
    } catch (error) {}
  };

  const onSubmit = async (values: any) => {
    console.log('values', values);
    setMessageError('');

    try {
      if (!values.liquidityTokenArg?.address) {
        return toast.error(`Select Funding token, please.`);
      }

      if (!detail) {
        localStorage.setItem(
          LAUNCHPAD_FORM_STEP,
          JSON.stringify({
            step,
            values,
          }),
        );
      }

      if ((values?.isLastStep || step > 1) && account) {
        if (!values.isApprove && !detail) {
          return;
        }

        setLoading(true);
        const tokenAddress = values?.launchpadTokenArg?.address;
        const liquidAddress = values?.liquidityTokenArg?.address;

        const seconds = new BigNumber(values.duration)
          .multipliedBy(24)
          .multipliedBy(3600)
          .toFixed(0);

        const faqs = filter(Object.keys(values), (v) => v?.includes('faq_q')).map(
          (v, i) => ({
            value: values?.[v],
            label: values?.[`faq_a_${i + 1}`],
          }),
        );

        console.log('faqs', faqs);

        if (values.isLastStep) {
          const signature = await getSignature(account);
          const res = await createLaunchpad({
            user_address: account,
            video: values?.video,
            image: values?.image,
            description: values?.description,
            signature,
            qand_a: JSON.stringify(faqs),
            id: detail?.id,
            launchpad_token: tokenAddress,
            liquidity_token: liquidAddress,
            launchpad_balance: values.launchpadBalance,
            liquidity_balance: values.liquidityBalance,
            liquidity_ratio: values.liquidityRatioArg,
            goal_balance: values.goalBalance,
            twitter_post_url: values.twitterPostUrl,
            threshold_balance: values.thresholdBalance || '0',
            duration: Number(seconds),
          });
          if (values.boost_url && step === 3 && detail?.launchpad) {
            await importBoost(
              {
                pool_address: detail?.launchpad,
                address: account,
              },
              {
                signature,
                file_url: values.boost_url,
              },
            );
          }
          if (values.isCreateProposal && !detail?.launchpad) {
            await createProposalLaunchpad({
              launchpadTokenArg: tokenAddress,
              liquidityTokenArg: liquidAddress,
              liquidityRatioArg: values.liquidityRatioArg,
              durationArg: seconds,
              launchpadBalance: values.launchpadBalance,
              liquidityBalance: values.liquidityBalance,
              goalBalance: values.goalBalance,
              thresholdBalance: values.thresholdBalance || '0',
            });
          }
          let messageSuccess = 'Submitted launchpad successfully.';
          if (!detail?.launchpad && detail) {
            messageSuccess = `Transaction confirmed. Please wait for it to be processed on the Bitcoin.`;
          } else if (detail) {
            messageSuccess = `Updated launchpad successfully.`;
          }
          toast.success(messageSuccess);
        }

        if (!detail) {
          localStorage.removeItem(LAUNCHPAD_FORM_STEP);
          router.replace(ROUTE_PATH.LAUNCHPAD);
        }
      }

      if (step < values.steps.length - 1) {
        setStep((n) => n + 1);
      }
    } catch (error) {
      console.log('error', error);
      toastError(showError, error, { address: account });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledLaunchpadManage>
        <Form onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <LaunchpadManageFormContainer
              loading={loading}
              setLoading={setLoading}
              onSubmit={handleSubmit}
              step={step}
              setStep={setStep}
              detail={detail}
              error={error}
            />
          )}
        </Form>
        <FAQStyled>
          <Text as={'h3'}>FAQs</Text>
          <Faq
            data={[
              {
                q: 'What amount should I put in the Reward Pool?',
                a: `It depends on your tokenomics. Think of how many % from the total token supply you would like to distribute to those who contribute to your crowdfunding.\n\nBy the end of the crowdfunding campaign, this Reward Pool amount will be distributed proportionally to all contributors based on the amount they contributed.`,
              },
              {
                q: 'What are Initial Liquidity and Initial Liquidity with token?',
                a: `In order to create a liquidity pool, you need to deposit an equal value of two different assets into the pool.\n    - <b>Initial Liquidity In Token</b> refers to the amount of your project’s token you deposit into the liquidity pool\n    - <b>Initial Liquidity</b> refers to the percentage of the total crowdfunded amount (in ETH or BTC) you deposit into the liquidity pool.\n\nFor example:\nYour project’s token name is ABC with total supply = 100,000\nYou allocate 80,000 ABC (80% supply) to Reward Pool\n\nYou’d dedicate <b>5,000 ABC (5% supply)</b> for <b>initial liquidity in token</b>\n\nAt the same time, your crowdfunding successfully raises 100 ETH\nYou’d dedicate <b>50% of the total crowdfunded amount</b> for <b>initial liquidity</b> (= 50 ETH)\n\nThis means that after the crowdfunding, an amount of (5,000 ABC / 50 ETH) will be automatically deposited into the liquidity pool.\n\nThis will make the initial price eight times greater than your crowdfunding price.`,
              },
              {
                q: 'What is Funding Goal?',
                a: `The Funding Goal acts as the Soft Cap for your crowdfunding campaign. Funding Goal represents the minimum amount that the project would like to raise.\n\nIf the crowdfunding does not reach the Funding Goal, the contributed funds will be returned to the contributors\n\nThe funding goal also serves to protect the project creators. Even in case the crowdfund amount falls short of expectations, creators wouldn't lose the token amount put in the Reward Pool
            `,
              },
              {
                q: 'What are the fees to be on Trustless Launchpad?',
                a: `There are no upfront fees, but a launchpad fee of 10% on the total amount you raise through crowdfunding.\n\nThis fee is divided as follows:\n\n    - 5% (in btc/eth) will serve as the platform fee\n    - The remaining 5% (in your project’s token) will be distributed proportionally among all TM governance users who supported your project during the voting round. This will be locked in the smart contract for 30 days
            `,
              },
              {
                q: 'When does the crowdfunding campaign start after a project submission on Trustless Launchpad?',
                a: `After submitting, a project will appear on the launchpad page and will go through 3 phases:\n\n    - <b>Preparing to Vote phase:</b>\n            - When?: right after project submission\n            - Duration: 1 day\n            - The project can cancel the campaign if needed within this phase.\n    - <b>Voting phase:</b>\n            - When?: right after Preparing to Vote phase ends\n            - Duration: 3 days\n            - The project's campaign proceeds if it receives a minimum of 100 TM votes\n    - <b>Funding phase:</b>\n            - When?: right after Voting phase ends with at least 100 TM votes\n            - Duration: decided by the project
              `,
              },
            ]}
          />
        </FAQStyled>
      </StyledLaunchpadManage>
      <PopoverNeedHelp isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <BtnNeedHelpStyled
            className={isOpen ? 'is-active' : ''}
            onClick={onToggle}
          >
            <Text>Need help</Text>
            <BiHelpCircle />
          </BtnNeedHelpStyled>
        </PopoverTrigger>

        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            We are happy to support with your launchpad submission process. Join our
            Discord and create a collab{' '}
            <a
              style={{ color: colors.bluePrimary }}
              href="https://discord.com/channels/1052411011036090458/1114142004213981294"
              target="_blank"
            >
              ticket here
            </a>
          </PopoverBody>
        </PopoverContent>
      </PopoverNeedHelp>
    </>
  );
};

export default LaunchpadManage;
