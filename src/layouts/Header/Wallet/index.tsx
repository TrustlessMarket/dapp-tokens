import IconSVG from '@/components/IconSVG';
import { CDN_URL, TC_WEB_URL } from '@/configs';
// import { ROUTE_PATH } from '@/constants/route-path';
import { AssetsContext } from '@/contexts/assets-context';
import { getIsAuthenticatedSelector, getUserSelector } from '@/state/user/selector';
import { formatBTCPrice, formatEthPriceFloor } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import copy from 'copy-to-clipboard';
// import { useRouter } from 'next/router';
import SelectedNetwork from '@/components/Swap/selectNetwork';
import Text from '@/components/Text';
import { TRUSTLESS_BRIDGE, TRUSTLESS_FAUCET } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import { WalletContext } from '@/contexts/wallet-context';
import { compareString, formatLongAddress } from '@/utils';
import { showError } from '@/utils/toast';
import { useRouter } from 'next/router';
import { useContext, useMemo, useRef, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useSelector } from 'react-redux';
import { ConnectWalletButton, WalletBalance } from '../Header.styled';
import { WalletPopover } from './Wallet.styled';
import { SupportedChainId } from '@/constants/chains';

const WalletHeader = () => {
  const router = useRouter();
  const { account, chainId } = useWeb3React();
  const user = useSelector(getUserSelector);
  const { onDisconnect, onConnect, requestBtcAddress } = useContext(WalletContext);

  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const { btcBalance, juiceBalance } = useContext(AssetsContext);

  const isTokenPage = useMemo(() => {
    if (
      compareString(router?.pathname, ROUTE_PATH.HOME) ||
      compareString(router?.pathname, ROUTE_PATH.MARKETS) ||
      compareString(router?.pathname, ROUTE_PATH.IDO_MANAGE) ||
      compareString(router?.pathname, ROUTE_PATH.IDO)
    ) {
      return true;
    }

    return false;
  }, [router?.pathname]);

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await onConnect();
      await requestBtcAddress();
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
            src={`${CDN_URL}/icons/ic-penguin.svg`}
            maxWidth="24"
            maxHeight="24"
            type="fill"
          />
          <Text size={'regular'} className="address" fontWeight="regular">
            {formatLongAddress(user?.walletAddress || '')}
          </Text>
        </div>
        <div
          className="icCopy"
          onClick={() => onClickCopy(user?.walletAddress || '')}
        >
          <IconSVG
            src={`${CDN_URL}/icons/ic-copy.svg`}
            color="black"
            maxWidth="16"
            type="stroke"
          ></IconSVG>
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
          <Text size={'regular'} className="address" fontWeight="regular">
            {formatLongAddress(user?.walletAddressBtcTaproot || '')}
          </Text>
        </div>
        <div
          className="icCopy"
          onClick={() => onClickCopy(user?.walletAddressBtcTaproot || '')}
        >
          <IconSVG
            src={`${CDN_URL}/icons/ic-copy.svg`}
            color="black"
            maxWidth="16"
            type="stroke"
          ></IconSVG>
        </div>
      </div>
      <div className="divider"></div>
      <div className="cta">
        <div className="wallet-link" onClick={() => window.open(TC_WEB_URL)}>
          <IconSVG
            src={`${CDN_URL}/icons/ic-wallet.svg`}
            maxWidth="20"
            color="black"
            type="fill"
          />
          <Text size="medium">Wallet</Text>
        </div>
        <div className="wallet-link" onClick={() => window.open(TRUSTLESS_FAUCET)}>
          <IconSVG src={`/faucet.svg`} maxWidth="20" color="black" />
          <Text size="medium">Faucet</Text>
        </div>
        <div className="wallet-link" onClick={() => window.open(TRUSTLESS_BRIDGE)}>
          <IconSVG src={`/wrapbtc.svg`} maxWidth="20" color="black" type="fill" />
          <Text size="medium">Wrap BTC</Text>
        </div>
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
      {account && isAuthenticated ? (
        <>
          {!compareString(chainId, SupportedChainId.TRUSTLESS_COMPUTER) ? (
            <SelectedNetwork />
          ) : (
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="bottom"
              overlay={walletPopover}
              container={ref}
              show={show}
            >
              <div
                className="wallet"
                // onClick={() => window.open(TC_WEB_URL)}
                ref={ref}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              >
                <WalletBalance className={isTokenPage ? 'isTokenPage' : ''}>
                  <div className="balance">
                    <p>{formatBTCPrice(btcBalance)} BTC</p>
                    <span className="divider"></span>
                    <p>{formatEthPriceFloor(juiceBalance)} TC</p>
                  </div>
                  <div className="avatar">
                    <Jazzicon diameter={32} seed={jsNumberForAddress(account)} />
                  </div>
                </WalletBalance>
              </div>
            </OverlayTrigger>
          )}
        </>
      ) : (
        <ConnectWalletButton className="hideMobile" onClick={handleConnectWallet}>
          {isConnecting ? 'Connecting...' : 'Connect wallet'}
        </ConnectWalletButton>
      )}
    </>
  );
};

export default WalletHeader;
