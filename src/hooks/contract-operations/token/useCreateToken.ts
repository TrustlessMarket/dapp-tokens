import ERC20ABIJson from '@/abis/erc20.json';
import {TransactionEventType} from '@/enums/transaction';
import {ContractOperationHook, DAppType, DeployContractResponse,} from '@/interfaces/contract-operation';
import {useWeb3React} from '@web3-react/core';
import {ContractFactory} from 'ethers';
import {useCallback} from 'react';
import store from "@/state";
import {updateCurrentTransaction} from "@/state/pnftExchange";
import {TransactionStatus} from "@/interfaces/walletTransaction";
import {transactionType} from "@/components/Swap/alertInfoProcessing/types";
import {colors} from "@/theme/colors";
import {WALLET_URL} from "@/configs";
import useCheckTxsBitcoin from "@/hooks/useCheckTxsBitcoin";

export interface ICreateTokenParams {
  name: string;
  symbol: string;
  maxSupply: number;
}

const useCreateToken: ContractOperationHook<
  ICreateTokenParams,
  DeployContractResponse | null
> = () => {
  const { account, provider } = useWeb3React();
  const { call: checkTxsBitcoin } = useCheckTxsBitcoin();

  const call = useCallback(
    async (params: ICreateTokenParams): Promise<DeployContractResponse | null> => {
      if (account && provider) {
        const { name, symbol, maxSupply } = params;

        const factory = new ContractFactory(
          ERC20ABIJson.abi,
          ERC20ABIJson.bytecode,
          provider.getSigner(),
        );
        const contract = await factory.deploy(name, symbol, maxSupply);

        store.dispatch(
          updateCurrentTransaction({
            status: TransactionStatus.pending,
            id: transactionType.createToken,
            hash: contract.deployTransaction.hash,
            infoTexts: {
              pending: `Please go to the trustless wallet and click on <a style="color: ${colors.bluePrimary}" href="${WALLET_URL}" target="_blank" >"Process Transaction"</a> for Bitcoin to complete this process.`,
            },
          }),
        );

        checkTxsBitcoin({
          txHash: contract.deployTransaction.hash,
          fnAction: () =>
            store.dispatch(
              updateCurrentTransaction({
                id: transactionType.createToken,
                status: TransactionStatus.pending,
                hash: contract.deployTransaction.hash,
                infoTexts: {
                  pending: `Transaction confirmed. Please wait for it to be processed on the Bitcoin. Note that it may take up to 10 minutes for a block confirmation on the Bitcoin blockchain.`,
                },
              }),
            ),
        });

        console.log('contract', contract);

        return {
          hash: contract.deployTransaction.hash,
          contractAddress: contract.address,
          deployTransaction: contract.deployTransaction,
        };
      }

      return null;
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useCreateToken;
