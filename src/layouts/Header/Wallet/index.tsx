/* eslint-disable @typescript-eslint/no-explicit-any */
import IconSVG from '@/components/IconSVG';
import {CDN_URL, TM_ADDRESS, WALLET_URL} from '@/configs';
// import { ROUTE_PATH } from '@/constants/route-path';
import { getUserSelector } from '@/state/user/selector';
import { formatBTCPrice } from '@/utils/format';
import copy from 'copy-to-clipboard';
// import { useRouter } from 'next/router';
import Text from '@/components/Text';
import { TRUSTLESS_BRIDGE, TRUSTLESS_FAUCET } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { WalletContext } from '@/contexts/wallet-context';
import useBalanceERC20Token from '@/hooks/contract-operations/token/useBalanceERC20Token';
import useTCWallet from '@/hooks/useTCWallet';
import { getWalletSelector } from '@/state/wallets/selector';
import { IAccount } from '@/state/wallets/types';
import { formatCurrency, shortCryptoAddress } from '@/utils';
import { showError } from '@/utils/toast';
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spinner,
} from '@chakra-ui/react';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useSelector } from 'react-redux';
import web3 from 'web3';
import { isScreenDarkMode } from '..';
import { ConnectWalletButton, WalletBalance } from '../Header.styled';
import ChangeAccountWalletItem from './ChangeAccountWalletItem';
import { WalletPopover } from './Wallet.styled';

const WalletHeader = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    tcWalletAddress,
    tcBalance: juiceBalance,
    btcBalance,
    loading,
  } = useTCWallet();
  const user = useSelector(getUserSelector);
  const { onDisconnect, onConnect } = useContext(WalletContext);
  const { mobileScreen } = useWindowSize();

  const { call: getBalanceErc20 } = useBalanceERC20Token();
  const [balanceTM, setBalanceTM] = useState('0');
  const walletSelector = useSelector(getWalletSelector);

  const accounts = walletSelector?.accounts || [];

  const isTokenPage = useMemo(() => {
    return isScreenDarkMode();
  }, [router?.pathname]);

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await onConnect();
    } catch (err) {
      showError({
        message: (err as Error).message,
      });
      console.log(err);
      onDisconnect();
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    getBalanceTM();
  }, [user?.walletAddress, isAuthenticated]);

  const getBalanceTM = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response: any = await getBalanceErc20({
        erc20TokenAddress: TM_ADDRESS,
      });
      console.log('response', response);

      setBalanceTM(response);
    } catch (error) {
      console.log('error', error);
    }
  };

  const [show, setShow] = useState(false);
  const handleOnMouseEnter = () => {
    setShow(true);
  };
  const handleOnMouseLeave = () => {
    setShow(false);
  };
  const ref = useRef(null);

  // const goToConnectWalletPage = async () => {
  //   router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
  // };

  const onClickCopy = (address: string) => {
    copy(address);
    toast.success('Copied');
  };

  const gotoBridge = (tab: string, tokenSymbol: string) => {
    window.open(`${TRUSTLESS_BRIDGE}${tokenSymbol}`);
  };

  const walletPopover = (
    <WalletPopover
      id="wallet-header"
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      show={show}
    >
      <div className="wallet-tc">
        <div className="wallet-item">
          <IconSVG
            src={`${CDN_URL}/icons/ic-penguin-white.svg`}
            maxWidth="24"
            maxHeight="24"
          />
          <Text className="address">
            {shortCryptoAddress(user?.walletAddress || '', 10)}
          </Text>
        </div>
        <div
          className="icCopy"
          onClick={() => onClickCopy(user?.walletAddress || '')}
        >
          <IconSVG src={`${CDN_URL}/icons/ic-coppy-white.svg`}></IconSVG>
        </div>
      </div>

      <div className="divider"></div>
      <div className="wallet-btc">
        <div className="wallet-item">
          <IconSVG
            src={`${CDN_URL}/icons/ic-btc.svg`}
            maxWidth="24"
            maxHeight="24"
          />
          <Text className="address">
            {shortCryptoAddress(user?.walletAddressBtcTaproot || '', 10)}
          </Text>
        </div>
        <div
          className="icCopy"
          onClick={() => onClickCopy(user?.walletAddressBtcTaproot || '')}
        >
          <IconSVG src={`${CDN_URL}/icons/ic-coppy-white.svg`}></IconSVG>
        </div>
      </div>
      <div className="divider"></div>
      <div className="cta">
        <div className="wallet-link" onClick={() => window.open(WALLET_URL)}>
          <IconSVG src={`${CDN_URL}/icons/ic-menu-wallet.svg`} maxWidth="20" />
          <Text className="label">Wallet</Text>
        </div>
        <div className="wallet-link" onClick={() => window.open(TRUSTLESS_FAUCET)}>
          <IconSVG src={`${CDN_URL}/icons/ic-menu-faucet.svg`} />
          <Text className="label">Faucet</Text>
        </div>
        <div className="wallet-link" onClick={() => gotoBridge('deposit', 'btc')}>
          <IconSVG src={`${CDN_URL}/icons/ic-menu-convert.svg`} />
          <Text className="label">Wrap BTC</Text>
        </div>
        <div className="wallet-link" onClick={() => gotoBridge('deposit', 'eth')}>
          <IconSVG src={`${CDN_URL}/icons/ic-menu-convert.svg`} />
          <Text className="label">Wrap ETH</Text>
        </div>
        <div className="wallet-link" onClick={() => gotoBridge('deposit', 'usdc')}>
          <IconSVG src={`${CDN_URL}/icons/ic-menu-convert.svg`} />
          <Text className="label">Wrap USDC</Text>
        </div>
        {user?.walletAddress && (
          <div
            className="wallet-link"
            onClick={() => window.open(ROUTE_PATH.TM_TRANSFER_HISTORY, '_self')}
          >
            <img width={20} height={20} src={`${CDN_URL}/icons/tm_icon.png`} />
            <Text className="label">{formatCurrency(balanceTM, 5)} TM</Text>
          </div>
        )}

        <div className="divider"></div>
        <div className="wallet-disconnect" onClick={onDisconnect}>
          <IconSVG
            src={`${CDN_URL}/icons/ic-logout.svg`}
            maxWidth="20"
            color="red"
            type="stroke"
          />
          <Text size="medium" className={'disconnect-text'}>
            Disconnect
          </Text>
        </div>
      </div>
    </WalletPopover>
  );

  return (
    <>
      {isAuthenticated && tcWalletAddress ? (
        <Flex gap={2}>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="bottom"
            overlay={walletPopover}
            container={ref}
            show={show}
          >
            <div
              className={`wallet ${mobileScreen ? 'isMobile' : ''}`}
              // onClick={() => window.open(TC_WEB_URL)}
              ref={ref}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            >
              <WalletBalance className={isTokenPage ? 'isTokenPage' : ''}>
                <div className="balance">
                  <Flex alignItems={'center'} gap={1}>
                    <Skeleton isLoaded={!loading} noOfLines={1}>
                      {formatCurrency(formatBTCPrice(btcBalance))}
                    </Skeleton>
                    BTC
                  </Flex>
                  {/* <p>{formatCurrency(formatBTCPrice(btcBalance))} BTC</p> */}
                  <span className="divider"></span>
                  <Flex alignItems={'center'} gap={1}>
                    <Skeleton isLoaded={!loading} noOfLines={1}>
                      {formatCurrency(web3.utils.fromWei(juiceBalance), 5)}
                    </Skeleton>
                    TC
                  </Flex>
                </div>
                <div className="avatar">
                  <Jazzicon
                    diameter={32}
                    seed={jsNumberForAddress(tcWalletAddress)}
                  />
                </div>
              </WalletBalance>
            </div>
          </OverlayTrigger>
          {accounts.length > 1 && (
            <Menu placement="bottom-end">
              <MenuButton
                title="Change account"
                className="btn-select-account"
                as={IconButton}
                icon={<img src={`${CDN_URL}/icons/ic-swap-acc.svg`} />}
              />
              <MenuList>
                {accounts.map((acc: IAccount) => (
                  <MenuItem key={acc.tcAddress}>
                    <ChangeAccountWalletItem account={acc} />
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
        </Flex>
      ) : (
        <ConnectWalletButton
          disabled={isConnecting}
          className="hideMobile"
          onClick={handleConnectWallet}
        >
          {isConnecting ? (
            <Flex gap={2} alignItems={'center'}>
              Connecting
              <Spinner size={'sm'} />
            </Flex>
          ) : (
            'Connect wallet'
          )}
        </ConnectWalletButton>
      )}
    </>
  );
};

export default WalletHeader;
