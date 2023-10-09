interface INetworkConfig {
  name: string;
  icon: string;
  rpc: string;
  explorer: string;
  chainName: string;
  chainId: string;
  ggAdminAddr: string;
  ggClaimStartDate: Date;
  ggPaymentContractAddr: string;
  ggTokenContractAddr: string;
  giftAdminAddr: string;
  launchpadAdminAddr: string;
  launchpadEthAdminAddr: string;
  launchpadEthSafeAddr: string;
  launchpadFactoryContractAddr: string;
  launchpadVoteAdminAddr: string;
  lpBtcFee: string;
  lpEthFee: string;
  percentRewardForVoter: string;
  percentRewardProtocol: string;
  swapFactoryContractAddr: string;
  swapNonfungibleTokenPositionDescriptor: string;
  swapNonfungibleTokenPositionManager: string;
  swapQuoterV2ContractAddr: string;
  swapRouterContractAddr: string;
  tmContractAddress: string;
  wbtcContractAddress: string;
  wethContractAddress: string;
  whiteListContractAddress: string;
  wtcContractAddress: string;
  wusdcContractAddress: string;
  wusdtContractAddress: string;
  xiangqiAdminAddr: string;
  xiangqiContractAddr: string;
  xiangqiTokenAdminAddr: string;
  xiangqiTokenContractAddr: string;
}

interface IConfigs {
  [key: string]: INetworkConfig;
}


export type {
  INetworkConfig,
  IConfigs,
};
