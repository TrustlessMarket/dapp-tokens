import { CDN_URL } from '@/configs';
import { TRUSTLESS_COMPUTER_CHAIN_INFO } from '@/constants/chains';
import { TRUSTLESS_COMPUTER } from '@/constants/common';
import { WalletContext } from '@/contexts/wallet-context';
import { compareString, isSupportedChain } from '@/utils';
import { Button, Spinner, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { useContext, useState } from 'react';
import { IoWarningSharp } from 'react-icons/io5';
import styles from './styles.module.scss';
import { IResourceChain } from '@/interfaces/chain';
import { useAppSelector } from '@/state/hooks';
import { currentChainSelector } from '@/state/pnftExchange';

const SelectedNetwork = ({}) => {
  const { chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const { onConnect, requestBtcAddress } = useContext(WalletContext);
  const currentChain: IResourceChain = useAppSelector(currentChainSelector);

  const onHandleSwitchChain = async () => {
    try {
      setLoading(true);
      await onConnect();
      await requestBtcAddress();
      location.reload()
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const goToTrustlessComputer = () => {
    window.open(TRUSTLESS_COMPUTER, '_blank');
  };

  if (
    !isSupportedChain(chainId) ||
    !compareString(currentChain?.chainId, chainId)
  ) {
    return (
      <Button
        className={styles.btnButton}
        onClick={onHandleSwitchChain}
        style={{ backgroundColor: '#bc175680' }}
      >
        <div className="img" style={{ backgroundColor: '#bc175680' }}>
          {loading ? <Spinner color={'#fff'} /> : <IoWarningSharp color={'#fff'} />}
        </div>

        <Text style={{ color: '#fff', fontWeight: 600 }}>
          {loading ? 'Requesting' : 'Switch network'}
        </Text>
      </Button>
    );
  }

  return (
    <Button
      className={styles.btnButton}
      style={{ cursor: 'pointer' }}
      onClick={goToTrustlessComputer}
    >
      <div className="img">
        <img
          src={`${CDN_URL}/icons/wallet_logo.svg`}
          alt={TRUSTLESS_COMPUTER_CHAIN_INFO.name}
          width={32}
          height={32}
        />
      </div>

      <Text style={{ fontWeight: 600 }}>{TRUSTLESS_COMPUTER_CHAIN_INFO.name}</Text>
    </Button>
  );
};

export default SelectedNetwork;
