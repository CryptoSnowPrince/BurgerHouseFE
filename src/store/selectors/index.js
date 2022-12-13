// Wallet Selectors
export const web3State = (state) => state.auth.web3;
export const isConnectedState = (state) => state.auth.isConnected;
export const injectedProviderState = (state) => state.auth.injectedProvider;
export const curAcountState = (state) => state.auth.curAcount;

// Config Selectors
export const confState = (state) => state.conf.conf;
export const burgerHouseContractState = (state) => state.conf.burgerHouseContract;
export const busdContractState = (state) => state.conf.busdContract;
