// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useContext, useEffect, useState } from 'react';
// import { StyledLaunchpadManage } from './LaunchpadManage.styled';
// import useCreateLaunchpad from '@/hooks/contract-operations/launchpad/useCreate';
// import useContractOperation from '@/hooks/contract-operations/useContractOperation';
// import { ROUTE_PATH } from '@/constants/route-path';
// import useTCWallet from '@/hooks/useTCWallet';
// import BigNumber from 'bignumber.js';
// import { toastError } from '@/constants/error';
// import { WalletContext } from '@/contexts/wallet-context';
// import detail from '@/pages/launchpad/detail';
// import { getDetailLaunchpad, createLaunchpad } from '@/services/launchpad';
// import { requestReload, updateCurrentTransaction } from '@/state/pnftExchange';
// import { showError } from '@/utils/toast';
// import { filter } from 'lodash';
// import { useRouter } from 'next/router';
// import toast from 'react-hot-toast';
// import LaunchpadManageHeader from './header';

// const LaunchpadManage = () => {
//   const [step, setStep] = useState(0);

//   const { getSignature } = useContext(WalletContext);

//   const { run: createProposalLaunchpad } = useContractOperation({
//     operation: useCreateLaunchpad,
//   });

//   const router = useRouter();

//   const id = router.query?.id;

//   useEffect(() => {
//     getData();
//   }, [id]);

//   const getData = async () => {
//     if (!id) {
//       return;
//     }

//     try {
//       const response: any = await Promise.all([getDetailLaunchpad({ id: id })]);
//       setDetail(response[0]);
//     } catch (error) {}
//   };

//   const onSubmit = async (values: any) => {
//     if (!account) {
//       return;
//     }

//     try {
//       setLoading(true);

//       const tokenAddress = values?.launchpadTokenArg?.address;
//       const liquidAddress = values?.liquidityTokenArg?.address;

//       // dispatch(
//       //   updateCurrentTransaction({
//       //     id: transactionType.createLaunchpad,
//       //     status: TransactionStatus.info,
//       //   }),
//       // );

//       const faqs = filter(Object.keys(values), (v) => v?.includes('faq_q')).map(
//         (v, i) => ({
//           value: values?.[v],
//           label: values?.[`faq_a_${i + 1}`],
//         }),
//       );

//       const signature = await getSignature({
//         message: account,
//         account,
//       });

//       const seconds = new BigNumber(values.duration)
//         .multipliedBy(24)
//         .multipliedBy(3600)
//         .toFixed(0);

//       const res = await createLaunchpad({
//         user_address: account,
//         video: values?.video,
//         image: values?.image,
//         description: values?.description,
//         signature,
//         qand_a: JSON.stringify(faqs),
//         id: detail?.id,
//         launchpad_token: tokenAddress,
//         liquidity_token: liquidAddress,
//         launchpad_balance: values.launchpadBalance,
//         liquidity_balance: values.liquidityBalance,
//         liquidity_ratio: values.liquidityRatioArg,
//         goal_balance: values.goalBalance,
//         duration: Number(seconds),
//       });

//       if (!id) {
//         router.replace(`${ROUTE_PATH.LAUNCHPAD_MANAGE}?id=${res?.id}`);
//       }

//       if (values.isCreateProposal) {
//         await createProposalLaunchpad({
//           launchpadTokenArg: tokenAddress,
//           liquidityTokenArg: liquidAddress,
//           liquidityRatioArg: values.liquidityRatioArg,
//           durationArg: seconds,
//           launchpadBalance: values.launchpadBalance,
//           goalBalance: values.goalBalance,
//         });
//       }

//       toast.success(`Submitted proposals successfully.`);

//       dispatch(requestReload());
//     } catch (err) {
//       toastError(showError, err, { address: account });
//       dispatch(updateCurrentTransaction(null));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <StyledLaunchpadManage>
//       <LaunchpadManageHeader step={step} />
//     </StyledLaunchpadManage>
//   );
// };

// export default LaunchpadManage;
