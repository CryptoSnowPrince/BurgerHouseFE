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
export const LAUNCH_TIME = 1670366000;

export const ALERT_EMPTY = ""
export const ALERT_SUCCESS = "success"
export const ALERT_WARN = "warning"
export const ALERT_ERROR = "error"

export const ALERT_CONNECT_WALLET = "Please connect wallet to Binance Smart Chain!"

export const priceINT =
	[
		[500, 1500, 4500, 13500, 40500, 120000, 365000, 1000000],
		[625, 1800, 5600, 16800, 50600, 150000, 456000, 1200000],
		[780, 2300, 7000, 21000, 63200, 187000, 570000, 1560000],
		[970, 3000, 8700, 26000, 79000, 235000, 713000, 2000000],
		[1200, 3600, 11000, 33000, 98800, 293000, 890000, 2500000],
	]

export const price =
	[
		["500", "1500", "4500", "13.5K", "40.5K", "120K", "365K", "1M"],
		["625", "1800", "5600", "16.8K", "50.6K", "150K", "456K", "1.2M"],
		["780", "2300", "7000", "21K", "63.2K", "187K", "570K", "1.56M"],
		["970", "3000", "8700", "26K", "79K", "235K", "713K", "2M"],
		["1200", "3600", "11K", "33K", "98.8K", "293K", "890K", "2.5M"],
	]

export const yieldValues =
	[
		[20.5, 68, 222, 721, 2506, 7848, 26300, 81500],
		[26.0, 82, 277, 905, 3141, 9844, 33000, 98600],
		[32.5, 105, 348, 1135, 3944, 12323, 41500, 129304],
		[41.0, 138, 435, 1410, 4950, 15627, 52400, 167640],
		[51.0, 167, 558, 1804, 6216, 19759, 65400, 213030],
	]

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
