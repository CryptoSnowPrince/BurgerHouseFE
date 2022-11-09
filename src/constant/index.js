import BurgerHouse_ABI from './abi.json'

export const PUBLIC_URL = "https://dapp-frontend-prince.web.app/"

// BSC TESTNET
export const ADMIN_ACCOUNT = '0x36285fDa2bE8a96fEb1d763CA77531D696Ae3B0b'
export const ADMIN_ACCOUNT1 = '0x2faf8ab2b9ac8Bd4176A0B9D31502bA3a59B4b41'

export const BurgerHouse = '0x592E207E647DfD583749b71E499A28C68f4CB9D8'

export const RPC_URL = "https://data-seed-prebsc-2-s2.binance.org:8545"
export const MAINNET = 97

// BSC MAINNET
// export const ADMIN_ACCOUNT = '0xc50F0919AB4c2b779387Eb04ab984fee37D70b38'
// export const ADMIN_ACCOUNT1 = '0xAD30Ed907f394cF1E426c2F3Fa2Ba18B46aC6E66'

// export const BurgerHouse = '0x370D30b3f8437c2f40E203c1307e84a4BB6d672e'

// export const RPC_URL = "https://bsc-dataseed1.binance.org"
// export const MAINNET = 56

export const REF_PREFIX = `${PUBLIC_URL}/?ref=`

export function getBurgerHouseContract(web3) {
	return new web3.eth.Contract(BurgerHouse_ABI, BurgerHouse);
}
