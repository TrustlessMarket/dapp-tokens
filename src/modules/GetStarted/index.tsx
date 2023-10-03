import {useEffect} from "react";
import {ROUTE_PATH} from "@/constants/route-path";
import {useRouter} from "next/router";
import {IResourceChain} from "@/interfaces/chain";
import {useAppSelector} from "@/state/hooks";
import { currentChainSelector } from '@/state/pnftExchange';
import {compareString} from "@/utils";
import {L2_CHAIN_INFO} from "@/constants/chains";
import GetStartedNos from './nos';
import GetStartedTC from './tc';

const GetStarted = () => {
  const router = useRouter();
  const currentChain: IResourceChain = useAppSelector(currentChainSelector);

  useEffect(() => {
    if(currentChain?.chain) {
      router.replace(`${ROUTE_PATH.GET_STARTED}?network=${currentChain?.chain?.toLowerCase()}`)
    }
  }, [currentChain?.chain]);

  return compareString(router?.query?.network, L2_CHAIN_INFO.chain) ?  (
    <GetStartedNos />
  ) : (
    <GetStartedTC />
  );
};

export default GetStarted;
