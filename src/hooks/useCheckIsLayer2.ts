import {useMemo} from "react";
import {isLayer2Chain} from "@/utils";
import {IResourceChain} from "@/interfaces/chain";
import {useSelector} from "react-redux";
import { currentChainSelector } from '@/state/pnftExchange';

const useCheckIsLayer2 = () => {
    const currentChain: IResourceChain = useSelector(currentChainSelector);
    return useMemo(() => {
        return isLayer2Chain(currentChain?.chainId || -1);
    }, [currentChain?.chain]);
}

export default useCheckIsLayer2;