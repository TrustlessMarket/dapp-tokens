/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionStatus } from '@/components/Swap/alertInfoProcessing/interface';
import { transactionType } from '@/components/Swap/alertInfoProcessing/types';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { logErrorToServer } from '@/services/swap';
import { scanTrx } from '@/services/swap-v3';
import store from '@/state';
import { updateCurrentTransaction } from '@/state/pnftExchange';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import {executeTradeSlippage,TokenTrade} from "trustless-swap-sdk"

export interface ISwapERC20TokenParams {
    trade: TokenTrade;
    slippage: number;
}

const useSwapERC20Token: ContractOperationHook<
    ISwapERC20TokenParams,
    boolean | any
    > = () => {
    const { account, provider } = useWeb3React();
    const call = useCallback(
        async (params: ISwapERC20TokenParams): Promise<boolean | any> => {
            const { trade, slippage } = params;
            console.log(trade)

            if (account && provider) {
                const rs =  await executeTradeSlippage(trade,slippage*100);
                logErrorToServer({
                    type: 'logs',
                    address: account,
                    error: JSON.stringify(rs),
                    // message: `gasLimit: '${gasLimit}'`,
                });
                console.log("rs",rs)
                if(rs[1]== undefined) {
                    store.dispatch(
                        updateCurrentTransaction({
                            status: TransactionStatus.error,
                            id: transactionType.createPoolApprove,
                            hash: "",
                            infoTexts: {
                                error: `User cancel transactions`,
                            },
                        }),
                    );
                    return false
                } else {
                    console.log("vao day 1")
                    store.dispatch(
                        updateCurrentTransaction({
                            status: TransactionStatus.pending,
                            id: transactionType.createPoolApprove,
                            hash: rs[1].toString(),
                            infoTexts: {
                                pending: `Transaction confirmed. Please wait for it to be processed.`,
                            },
                        }),
                    );
                    let receipt = await provider.getTransactionReceipt(rs[1].toString())
                    const countTime = 0
                    while (!receipt && countTime < 25) {
                        await new Promise(f => setTimeout(f, 1000))
                        receipt = await provider.getTransactionReceipt(rs[1].toString())
                        console.log("count receipt", countTime, receipt)
                    }
                    console.log("vao day 2")

                    await scanTrx({
                        tx_hash: rs[1].toString(),
                    });

                    store.dispatch(
                        updateCurrentTransaction({
                            status: TransactionStatus.success,
                            id: transactionType.createPoolApprove,
                            hash: rs[1].toString(),
                            infoTexts: {
                                pending: `Transaction sucess`,
                            },
                        }),
                    );
                    console.log("vao day 3")
                    return rs;
                }
            }

            return true;
        },
        [account, provider],
    );

    return {
        call: call,
        dAppType: DAppType.ERC20,
        transactionType: TransactionEventType.CREATE,
    };
};

export default useSwapERC20Token;
