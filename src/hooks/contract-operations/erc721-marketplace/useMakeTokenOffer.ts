import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { useContract } from '@/hooks/useContract';
import ERC721MarketplaceABIJson from '@/abis/erc721-marketplace.json';
import { ERC721_MARKETPLACE_ADDRESS, TRANSFER_TX_SIZE } from '@/configs';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';
import { Transaction } from 'ethers';
import * as TC_SDK from 'trustless-computer-sdk';
import { AssetsContext } from '@/contexts/assets-context';
import BigNumber from 'bignumber.js';
import { formatBTCPrice } from '@/utils/format';
import { TransactionEventType } from '@/enums/transaction';
import Web3 from 'web3';
import { ROOT_ADDRESS } from '@/constants/common';

export interface IMakeTokenOfferParams {
  collectionAddress: string;
  tokenID: string;
  price: string;
  erc20Token?: string;
  durationTime: number;
}

const useMakeTokenOffer: ContractOperationHook<IMakeTokenOfferParams, Transaction | null> = () => {
  const { account, provider } = useWeb3React();
  const contract = useContract(ERC721_MARKETPLACE_ADDRESS, ERC721MarketplaceABIJson.abi, true);
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IMakeTokenOfferParams): Promise<Transaction | null> => {
      if (account && provider && contract) {
        const {
          collectionAddress,
          tokenID,
          erc20Token,
          durationTime,
          price,
        } = params;
        console.log({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
        });
        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
        });
        const balanceInBN = new BigNumber(btcBalance);
        if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
          throw Error(
            `Your balance is insufficient. Please top up at least ${formatBTCPrice(
              estimatedFee.totalFee.toString(),
            )} BTC to pay network fee.`,
          );
        }

        // Transform data shape
        const makeOfferData = JSON.parse(
          JSON.stringify({
            _collectionContract: collectionAddress,
            _tokenId: Web3.utils.toHex(tokenID),
            _price: Web3.utils.toWei(price),
            _erc20Token: erc20Token ?? ROOT_ADDRESS,
            _closed: false,
            _seller: account,
            _durationTime: durationTime,
          })
        )

        // Call contract 
        const transaction = await contract.connect(provider.getSigner()).makeOffer(makeOfferData);
        return transaction;
      }

      return null;
    },
    [account, provider, contract, btcBalance, feeRate],
  );

  return {
    call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.MAKE_TOKEN_OFFER,
  };
};

export default useMakeTokenOffer;
