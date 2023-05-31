import { WalletContext } from '@/contexts/wallet-context';
import useTCWallet from '@/hooks/useTCWallet';
import { IAccount } from '@/state/wallets/types';
import { colors } from '@/theme/colors';
import {
  compareString,
  formatCurrency,
  getDefaultProvider,
  shortCryptoAddress,
} from '@/utils';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { BsCheck } from 'react-icons/bs';
import { jsNumberForAddress } from 'react-jazzicon';
import Jazzicon from 'react-jazzicon/dist/Jazzicon';
import web3 from 'web3';

const ChangeAccountWalletItem = ({ account }: { account: IAccount }) => {
  const [tcBalance, setTCBalance] = useState('0');
  const provider = getDefaultProvider();
  const { tcWalletAddress } = useTCWallet();
  const { onChangeAccount } = useContext(WalletContext);

  useEffect(() => {
    getTCBalance();
  }, []);

  const getTCBalance = async () => {
    try {
      const response = await provider.getBalance(account.tcAddress);
      setTCBalance(response.toString());
    } catch (error) {}
  };

  const onSelectAccount = () => {
    onChangeAccount(account);
  };

  return (
    <Flex
      onClick={onSelectAccount}
      className={`tc-item-container ${
        compareString(tcWalletAddress, account.tcAddress)
          ? 'tc-item-container-active'
          : ''
      }`}
    >
      <Flex gap={`8px`}>
        <Jazzicon diameter={32} seed={jsNumberForAddress(account.tcAddress)} />
        <Box>
          <Text className="tc-account-name">
            {account.name} <span>({shortCryptoAddress(account.tcAddress, 8)})</span>
          </Text>
          <Text className="tc-account-balance">
            {formatCurrency(web3.utils.fromWei(tcBalance))} TC
          </Text>
        </Box>
      </Flex>

      {compareString(tcWalletAddress, account.tcAddress) && (
        <Box className="check-circle">
          <BsCheck color={colors.white} />
        </Box>
      )}
    </Flex>
  );
};

export default ChangeAccountWalletItem;
