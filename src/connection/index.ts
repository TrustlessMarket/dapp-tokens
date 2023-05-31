/* eslint-disable @typescript-eslint/no-explicit-any */
import { Web3ReactHooks } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { metaMask, hooks as metaMaskHooks } from '@/connectors/metaMask';
import { useCallback } from 'react';
import * as TC_CONNECT from 'tc-connect';
import { V2_CONNECT_URL, V2_WALLET_URL } from '@/configs';

export enum ConnectionType {
  METAMASK = 'METAMASK',
  TC_NETWORK = 'TC_NETWORK',
}

export interface Connection {
  name: string;
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
  icon?: string;
  shouldDisplay?: boolean;
  overrideActivate?: () => void;
}

export const MetamaskConnection: Omit<Connection, 'icon'> = {
  name: 'MetaMask',
  connector: metaMask,
  hooks: metaMaskHooks,
  type: ConnectionType.METAMASK,
  shouldDisplay: true,
  overrideActivate: () => window.open('https://metamask.io/', 'inst_metamask'),
};

export function getConnections() {
  return [MetamaskConnection];
}

export function getConnection(c: Connector | ConnectionType) {
  return getConnections().find((connection) => connection.connector === c);
}

export function useConnections() {
  return getConnections();
}

export function useGetConnection() {
  return useCallback((c: Connector | ConnectionType) => {
    if (c instanceof Connector) {
      const connection = getConnections().find(
        (connection) => connection.connector === c,
      );
      if (!connection) {
        throw Error('unsupported connector');
      }
      return connection;
    } else {
      switch (c) {
        case ConnectionType.METAMASK:
          return MetamaskConnection;
      }
    }
  }, []);
}

export const getConnector = (): any => {
  return new TC_CONNECT.DappConnect(V2_CONNECT_URL, V2_WALLET_URL);
};
