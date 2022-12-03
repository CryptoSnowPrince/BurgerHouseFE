import BurgerHouse_ABI from './abi.json'
import BUSD_ABI from './busd.json'

export const PUBLIC_URL = 'https://burgerhouse.io'

export const COIN_PRICE = 0.005; // 1 coin = 0.005 BUSD
export const BUSD_PRICE = 200;	// 1 BUSD = 200 coin
export const CASH_PRICE = 0.00005; // 100 cash = 0.005 BUSD
export const LOCK_TIME = 3600 * 24 * 7; // Lock time = 7 days

export const DEV_FEE = 400;
export const DEV_COIN_FEE = 500;
export const DEV_CASH_FEE = 500;
export const LIMIT_INCOME = 15000;
// export const DENOMINATOR = 10000;

export const ALERT_DELAY = 5000;
export const ALERT_POSITION = 'top-center';
export const LAUNCH_TIME = 1670166000;

// BSC TESTNET
export const ADMIN_ACCOUNT = '0x36285fDa2bE8a96fEb1d763CA77531D696Ae3B0b'
export const ADMIN_ACCOUNT1 = '0x2faf8ab2b9ac8Bd4176A0B9D31502bA3a59B4b41'

export const BurgerHouse1 = '0xA27F758a5091264AE06b2088789E6c7E6a401c8a'
export const BurgerHouse = '0xA27F758a5091264AE06b2088789E6c7E6a401c8a'
export const BUSD = "0x7A62eE9B6cde5cdd3Fd9d82448952f8E2f99c8C0";

export const RPC_URL = "https://bsc-testnet.public.blastapi.io"
export const MAINNET = 97

// BSC MAINNET
// export const ADMIN_ACCOUNT = '0x2Cc4467e7a94D55497B704a0acd90ACd1BF9A5af'
// export const ADMIN_ACCOUNT1 = '0xAD30Ed907f394cF1E426c2F3Fa2Ba18B46aC6E66'

// export const BurgerHouse1 = '0xa58129841d3Eb3B575f5773A2C04ac1fc8AA6d3c'
// export const BurgerHouse = '0xa58129841d3Eb3B575f5773A2C04ac1fc8AA6d3c'
// export const BUSD = "0xb7b657071Ad838AEB0096597f071AF981cdD4c9a"; // MockBUSD
// // export const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";

// export const RPC_URL = "https://bsc-dataseed1.binance.org"
// export const MAINNET = 56

export const REF_PREFIX = `${PUBLIC_URL}/?ref=`

export function getBurgerHouseContract(web3) {
	return new web3.eth.Contract(BurgerHouse_ABI, BurgerHouse);
}

export function getBUSDContract(web3) {
	return new web3.eth.Contract(BUSD_ABI, BUSD);
}
