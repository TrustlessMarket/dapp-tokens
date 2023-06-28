/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {transactionType} from '@/components/Swap/alertInfoProcessing/types';
import FiledButton from '@/components/Swap/button/filedButton';
import WrapperConnected from '@/components/WrapperConnected';
import {WalletContext} from '@/contexts/wallet-context';
import {IResourceChain} from '@/interfaces/chain';
import {IPoolV2AddPair} from '@/pages/pools/v2/add/[[...id]]';
import {Box, Flex} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import {forwardRef, useContext,} from 'react';
import {useForm, useFormState} from 'react-final-form';
import s from './styles.module.scss';
import RemoveHeader from "@/modules/PoolsV2/Remove/Remove.Header";
import {IPosition} from "@/interfaces/position";
import RemoveAmount from "@/modules/PoolsV2/Remove/Remove.Amount";

interface IFormRemovePoolsV2Container extends IPoolV2AddPair {
  handleSubmit: (_: any) => void;
  submitting?: boolean;
  positionDetail?: IPosition
}

const FormRemovePoolsV2Container = forwardRef<any, IFormRemovePoolsV2Container>(
  (props, ref) => {
    const { handleSubmit, ids, submitting } = props;
    const paramBaseTokenAddress = ids?.[0];
    const paramQuoteTokenAddress = ids?.[1];

    const { getConnectedChainInfo } = useContext(WalletContext);
    const connectInfo: IResourceChain = getConnectedChainInfo();

    const router = useRouter();

    const { values } = useFormState();
    const { restart, change } = useForm();

    return (
      <form onSubmit={handleSubmit}>
        <RemoveHeader />
        <Box className={s.container__content_body}>
          <Flex direction={"column"} gap={12} className={s.formContainer}>
            <RemoveAmount />
            <WrapperConnected>
              <FiledButton
                isDisabled={submitting}
                isLoading={submitting}
                type="submit"
                btnSize="h"
                processInfo={{
                  id: transactionType.createPool,
                }}
                containerConfig={{
                  w: '100%'
                }}
              >
                Remove
              </FiledButton>
            </WrapperConnected>
          </Flex>
        </Box>
      </form>
    );
  },
);

export default FormRemovePoolsV2Container;
