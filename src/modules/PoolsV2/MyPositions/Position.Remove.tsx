/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import FiledButton from '@/components/Swap/button/filedButton';
import React, {useState} from 'react';
import {useAppDispatch} from "@/state/hooks";
import {requestReload, updateCurrentTransaction} from "@/state/pnftExchange";
import {logErrorToServer} from "@/services/swap";
import {toastError} from "@/constants/error";
import {showError} from "@/utils/toast";
import {useWeb3React} from "@web3-react/core";
import useRemovePositionV3, {IRemovePositionV3} from "@/hooks/contract-operations/pools/v3/useRemovePosition";
import {toast} from "react-hot-toast";
import {IDetailPositionBase} from "@/modules/PoolsV2/Detail/interface";

const PositionRemove: React.FC<IDetailPositionBase> = ({ positionDetail }) => {
  const dispatch = useAppDispatch();
  const { call: removePositionV3 } = useRemovePositionV3();
  const { account } = useWeb3React();
  const [submitting, setSubmitting] = useState(false);

  const handleCollectFee = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      setSubmitting(true);
      // dispatch(
      //   updateCurrentTransaction({
      //     id: transactionType.collectFee,
      //     status: TransactionStatus.info,
      //   }),
      // );

      const params: IRemovePositionV3 = {
        tokenId: positionDetail?.tokenId,
      };

      const response: any = await removePositionV3(params);
      toast.success('Remove position successfully.');
      // dispatch(
      //   updateCurrentTransaction({
      //     id: transactionType.collectFee,
      //     status: TransactionStatus.success,
      //     hash: response.hash,
      //     infoTexts: {
      //       success: `Remove position successfully.`
      //     },
      //   }),
      // );
      dispatch(requestReload());
    } catch (err) {
      dispatch(updateCurrentTransaction(null));
      const message =
        (err as Error).message || 'Something went wrong. Please try again later.';
      logErrorToServer({
        type: 'error',
        address: account,
        error: JSON.stringify(err),
        message: message,
      });
      toastError(showError, err, { address: account });
    } finally {
      setSubmitting(false);
    }
  }

  return Number(positionDetail?.liquidity || 0) <= 0 ?
    <FiledButton isLoading={submitting} isDisabled={!Boolean(positionDetail)} btnSize="l" onClick={handleCollectFee}>
      Remove
    </FiledButton> : null;
};

export default PositionRemove;
