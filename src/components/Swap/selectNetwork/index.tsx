import { Button, Spinner, Text } from '@chakra-ui/react';
import { compareString } from '@/utils';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { IoWarningSharp } from 'react-icons/io5';
import styles from './styles.module.scss';
import { useWeb3React } from '@web3-react/core';
import { SupportedChainId, TRUSTLESS_COMPUTER_CHAIN_INFO } from '@/constants/chains';
import { WalletContext } from '@/contexts/wallet-context';
import imgLogo from '@/assets/img/wallet_logo.svg';

const SelectedNetwork = ({}) => {
  const { chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const { onConnect, requestBtcAddress } = useContext(WalletContext);

  const onHandleSwitchChain = async () => {
    try {
      setLoading(true);
      await onConnect();
      await requestBtcAddress();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (!compareString(chainId, SupportedChainId.TRUSTLESS_COMPUTER)) {
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
    <Button className={styles.btnButton} style={{ cursor: 'default' }}>
      <div className="img">
        <Image
          src={imgLogo}
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
