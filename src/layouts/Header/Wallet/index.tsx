/* eslint-disable @typescript-eslint/no-explicit-any */
import IconSVG from '@/components/IconSVG';
import { CDN_URL, WALLET_URL } from '@/configs';
import { AssetsContext } from '@/contexts/assets-context';
import { getIsAuthenticatedSelector, getUserSelector } from '@/state/user/selector';
import { formatBTCPrice } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import copy from 'copy-to-clipboard';
import SelectedNetwork from '@/components/Swap/selectNetwork';
import Text from '@/components/Text';
import { TRUSTLESS_BRIDGE } from '@/constants/common';
import { WalletContext } from '@/contexts/wallet-context';
import { IResourceChain } from '@/interfaces/chain';
import {
  CHAIN_ID,
  compareString,
  formatCurrency,
  formatLongAddress,
  isSupportedChain,
} from '@/utils';
import { showError } from '@/utils/toast';
import { useWindowSize } from '@trustless-computer/dapp-core';
import { useRouter } from 'next/router';
import { useContext, useMemo, useRef, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useSelector } from 'react-redux';
import web3 from 'web3';
import { isScreenDarkMode } from '..';
import { ConnectWalletButton, WalletBalance } from '../Header.styled';
import { WalletPopover } from './Wallet.styled';
import { currentChainSelector } from '@/state/pnftExchange';
import useCheckIsLayer2 from '@/hooks/useCheckIsLayer2';

const WalletHeader = () => {
  const router = useRouter();
  const { account, chainId } = useWeb3React();
  const user = useSelector(getUserSelector);
  const { onDisconnect, onConnect, requestBtcAddress, getConnectedChainInfo } =
    useContext(WalletContext);
  const { mobileScreen } = useWindowSize();

  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const { btcBalance, juiceBalance } = useContext(AssetsContext);

  const chainInfo: IResourceChain = getConnectedChainInfo();

  const currentChain: IResourceChain = useSelector(currentChainSelector);

  // const dispatch = useAppDispatch();
  // const allConfigs: any = useSelector(selectPnftExchange).allConfigs;

  const isL2 = useCheckIsLayer2();

  const isTokenPage = useMemo(() => {
    return isScreenDarkMode();
  }, [router?.pathname]);

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await onConnect();
      await requestBtcAddress();
    } catch (err) {
      const message = (err as Error).message;
      if (
        !message.toLowerCase()?.includes('User rejected the request'.toLowerCase())
      ) {
        showError({
          message,
        });
        onDisconnect();
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // const getBalanceTM = async () => {
  //   if (!user?.walletAddress || !isActive) {
  //     return;
  //   }
  //
  //   try {
  //     const response: any = await getBalanceErc20({
  //       erc20TokenAddress: getTMAddress(),
  //     });
  //     // setBalanceTM(response);
  //   } catch (error) {
  //   }
  // };
  //
  // useEffect(() => {
  //   getBalanceTM();
  // }, [user?.walletAddress, isActive, currentChain?.chain]);

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

  // const onChangeRouter = (_chainA?: any) => {
  //   dispatch(updateCurrentChain(_chainA));
  //   const key = _chainA?.chain?.toLowerCase() || '';
  //   dispatch(updateConfigs(allConfigs[key]));
  //   localStorage.setItem(CHAIN_INFO, JSON.stringify(_chainA));
  // };

  const walletPopover = (
    <WalletPopover
      id='wallet-header'
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      show={show}
    >
      <div className='wallet-tc'>
        <div className='wallet-item'>
          <IconSVG
            src={`${CDN_URL}/icons/ic-penguin.svg`}
            maxWidth='24'
            maxHeight='24'
            type='fill'
          />
          <Text size={'regular'} className='address' fontWeight='regular'>
            {formatLongAddress(user?.walletAddress || '')}
          </Text>
        </div>
        <div
          className='icCopy'
          onClick={() => onClickCopy(user?.walletAddress || '')}
        >
          <IconSVG
            src={`${CDN_URL}/icons/ic-copy.svg`}
            color='black'
            maxWidth='16'
            type='stroke'
          />
        </div>
      </div>
      {user?.walletAddressBtcTaproot &&
        compareString(
          currentChain?.chainId,
          CHAIN_ID.TRUSTLESS_COMPUTER,
        ) && (
          <>
            <div className='divider'></div>
            <div className='wallet-btc'>
              <div className='wallet-item'>
                <IconSVG
                  src={`${CDN_URL}/icons/ic-btc.svg`}
                  maxWidth='24'
                  maxHeight='24'
                />
                <Text size={'regular'} className='address' fontWeight='regular'>
                  {formatLongAddress(user?.walletAddressBtcTaproot || '')}
                </Text>
              </div>
              <div
                className='icCopy'
                onClick={() => onClickCopy(user?.walletAddressBtcTaproot || '')}
              >
                <IconSVG
                  src={`${CDN_URL}/icons/ic-copy.svg`}
                  color='black'
                  maxWidth='16'
                  type='stroke'
                />
              </div>
            </div>
          </>
        )}

      {/*<div className='divider' />*/}
      <div className='cta'>
        {
          !isL2 && (
            <>
              <div className='wallet-link' onClick={() => window.open(WALLET_URL)}>
                <IconSVG
                  src={`${CDN_URL}/icons/ic-wallet.svg`}
                  maxWidth='20'
                  color='black'
                  type='fill'
                />
                <Text size='medium'>Wallet</Text>
              </div>
              <div className='wallet-link' onClick={() => gotoBridge('deposit', 'btc')}>
                <IconSVG src={`/wrapbtc.svg`} maxWidth='20' color='black' type='fill' />
                <Text size='medium'>Wrap BTC</Text>
              </div>
              {/*<div className='wallet-link' onClick={() => gotoBridge('deposit', 'eth')}>*/}
              {/*  <IconSVG src={`/wrapbtc.svg`} maxWidth='20' color='black' type='fill' />*/}
              {/*  <Text size='medium'>Wrap ETH</Text>*/}
              {/*</div>*/}
            </>
          )
        }
        {/*{user?.walletAddress && (*/}
        {/*  <div*/}
        {/*    className='wallet-link'*/}
        {/*    onClick={() => window.open(ROUTE_PATH.TM_TRANSFER_HISTORY, '_self')}*/}
        {/*  >*/}
        {/*    <img width={20} height={20} src={`${CDN_URL}/icons/tm_icon.png`} />*/}
        {/*    <Text size='medium'>{formatCurrency(balanceTM, 5)} TM</Text>*/}
        {/*  </div>*/}
        {/*)}*/}
        {/*{*/}
        {/*  isL2 && (*/}
        {/*    <div*/}
        {/*      className='wallet-link'*/}
        {/*      onClick={() => onChangeRouter(TRUSTLESS_COMPUTER_CHAIN_INFO)}*/}
        {/*    >*/}
        {/*      <img width={20} height={20} src={'https://cdn.trustless.domains/icons/tc_ic.svg'}*/}
        {/*           style={{ borderRadius: '50%' }} />*/}
        {/*      <Text size='small'>Trustless Computer</Text>*/}
        {/*    </div>*/}
        {/*  )*/}
        {/*}*/}

        <div className='divider'></div>
        <div className='wallet-disconnect' onClick={onDisconnect}>
          <IconSVG
            src={`${CDN_URL}/icons/ic-logout.svg`}
            maxWidth='20'
            color='red'
            type='stroke'
          />
          <Text size='medium' className={'disconnect-text'}>
            Disconnect
          </Text>
        </div>
      </div>
    </WalletPopover>
  );


  return (
    <>
      {account && isAuthenticated ? (
        <>
          {!isSupportedChain(chainId) ||
          !compareString(currentChain?.chainId, chainId) ? (
            <SelectedNetwork />
          ) : (
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement='bottom'
              overlay={walletPopover}
              container={ref}
              show={show}
            >
              <div
                className={`wallet ${mobileScreen ? 'isMobile' : ''}`}
                ref={ref}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              >
                <WalletBalance className={isTokenPage ? 'isTokenPage' : ''}>
                  <div className='balance'>
                    {compareString(
                      currentChain?.chainId,
                      CHAIN_ID.TRUSTLESS_COMPUTER,
                    ) && (
                      <>
                        <p>{formatCurrency(formatBTCPrice(btcBalance))} BTC</p>
                        <span className='divider' />
                      </>
                    )}

                    <p>
                      {formatCurrency(web3.utils.fromWei(juiceBalance), 5)}{' '}
                      {chainInfo.nativeCurrency.symbol}
                    </p>
                  </div>
                  <div className='avatar'>
                    <Jazzicon diameter={32} seed={jsNumberForAddress(account)} />
                  </div>
                </WalletBalance>
              </div>
            </OverlayTrigger>
          )}
        </>
      ) : (
        <ConnectWalletButton className='hideMobile' onClick={handleConnectWallet}>
          {isConnecting ? 'Connecting...' : 'Connect wallet'}
        </ConnectWalletButton>
      )}
    </>
  );
};

export default WalletHeader;
