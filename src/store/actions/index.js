import { createAction as action } from 'typesafe-actions';

// Wallet
export const setWeb3 = action('auth/SET_WEB3')();
export const setIsConnected = action('auth/SET_ISCONNECTED')();
export const setInjectedProvider = action('auth/SET_INJECTEDPROVIDER')();
export const setCurAcount = action('auth/SET_CURACCOUNT')();
export const setInit = action('auth/SET_INIT')();

// Config
export const setConf = action('conf/SET_CONF')();
export const setBurgerHouseContract = action('conf/SET_BURGERHOUSECONTRACT')();
export const setBusdContract = action('conf/SET_BUSDCONTRACT')();
export const setConfInit = action('conf/SET_INIT')();
