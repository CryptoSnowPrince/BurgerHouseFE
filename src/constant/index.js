import Web3 from "web3";

import BurgerHouse_ABI from './abi.json'
import BUSD_ABI from './busd.json'
import CONF_ABI from './conf.json'
import { getConf } from '../utils/util'

export function RELEASE(param1, param2, ...param3) {
	return
}

export const DEBUG = console.log

export const RUN_MODE = RELEASE

export const API_URL = 'https://api.hariwhitedream.com/api/utils'
export const CONF_RPC = 'https://data-seed-prebsc-2-s3.binance.org:8545'

export const COIN_PRICE = 0.005; // 1 coin = 0.005 BUSD
export const BUSD_PRICE = 200;	// 1 BUSD = 200 coin
export const CASH_PRICE = 0.00005; // 100 cash = 0.005 BUSD

export const DEV_FEE = 400;
export const DEV_COIN_FEE = 500;
export const DEV_CASH_FEE = 500;
export const LIMIT_INCOME = 15000;
export const DENOMINATOR = 10000;

export const ALERT_DELAY = 5000;
export const ALERT_POSITION = 'top-center';
export const LAUNCH_TIME = 1671001200;

export const ALERT_EMPTY = ""
export const ALERT_SUCCESS = "success"
export const ALERT_WARN = "warning"
export const ALERT_ERROR = "error"

export const ALERT_NOT_LAUNCH = "Please wait until project is launched!"
export const ALERT_CONNECT_WALLET = "Please connect wallet to Binance Smart Chain!"
export const ALERT_PENDING_TX = "Pending... Please wait for a few seconds!"

export const priceINT =
	[
		500, 625, 780, 970, 1200,
		1500, 1800, 2300, 3000, 3600,
		4500, 5600, 7000, 8700, 11000,
		13500, 16800, 21000, 26000, 33000,
		40500, 50600, 63200, 79000, 98800,
		120000, 150000, 187000, 235000, 293000,
		365000, 456000, 570000, 713000, 890000,
		1000000, 1200000, 1560000, 2000000, 2500000
	]

export const price =
	[
		"500", "625", "780", "970", "1200",
		"1500", "1800", "2300", "3000", "3600",
		"4500", "5600", "7000", "8700", "11K",
		"13.5K", "16.8K", "21K", "26K", "33K",
		"40.5K", "50.6K", "63.2K", "79K", "98.8K",
		"120K", "150K", "187K", "235K", "293K",
		"365K", "456K", "570K", "713K", "890K",
		"1M", "1.2M", "1.56M", "2M", "2.5M"
	]

export const yieldValues =
	[
		20.5, 26.0, 32.5, 41.0, 51.0,
		68.0, 82.0, 105.0, 138.0, 167.0,
		222.0, 277.0, 348.0, 435.0, 558.0,
		721.0, 905.0, 1135.0, 1410.0, 1804.0,
		2506.0, 3141.0, 3944.0, 4950.0, 6216.0,
		7848.0, 9844.0, 12323.0, 15627.0, 19759.0,
		26300.0, 33000.0, 41500.0, 52400.0, 65400.0,
		81500.0, 98600.0, 129304.0, 167640.0, 21303.00
	]

export const LOCK_TIME = 3600 * 24 * 7; // Lock time = 7 days

export function getBurgerHouseContract(web3, _burger) {
	if (web3) {
		return new web3.eth.Contract(BurgerHouse_ABI, _burger);
	}
	return null;
}

export const BUSD = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
export const VNT = "0x2f053e33bd590830858161d42C67e9E8A9390019"
export const VNT_HOLDER = "0xD2E5656a23F9ebabA95EaebcEBD8831D3aCf7BB4"
export function getVNTContract(web3) {
	if (web3) {
		return new web3.eth.Contract(BUSD_ABI, VNT);
	}
	return null;
}

export function getBUSDContract(web3, _busd) {
	if (web3) {
		return new web3.eth.Contract(BUSD_ABI, _busd);
	}
	return null;
}

export function getConfContract() {
	const httpProvider = new Web3.providers.HttpProvider(CONF_RPC)
	const web3NoAccount = new Web3(httpProvider)
	return new web3NoAccount.eth.Contract(CONF_ABI, getConf());
}
