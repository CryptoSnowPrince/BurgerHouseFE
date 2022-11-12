import { useCallback, useEffect, useState } from "react";
import web3ModalSetup from "./../helpers/web3ModalSetup";
import Web3 from "web3";
import {
  getBurgerHouseContract,
  RPC_URL,
  MAINNET,
  ADMIN_ACCOUNT,
  ADMIN_ACCOUNT1,
  REF_PREFIX,
  COIN_PRICE,
  BNB_PRICE,
  GAS_AMOUNT
} from "../constant";

const web3Modal = web3ModalSetup();

const httpProvider = new Web3.providers.HttpProvider(RPC_URL)
const web3NoAccount = new Web3(httpProvider)
const isAddress = web3NoAccount.utils.isAddress
const contractNoAccount = getBurgerHouseContract(web3NoAccount)

const displayRemainTime = (seconds) => {
  if (seconds > 0) {
    // Calculating the days, hours, minutes and seconds left
    const timeDays = Math.floor(seconds / (60 * 60 * 24))
    const timeHours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60))
    const timeMinutes = Math.floor((seconds % (60 * 60)) / 60)

    if (timeDays > 0) {
      return `${timeDays}D : ${timeHours}H`
    } else {
      return `${timeHours}H : ${timeMinutes}M`
    }
  }

  return `0H : 0M`
}

const priceINT =
  [
    [500, 1500, 4500, 13500, 40500, 120000, 365000, 1000000],
    [625, 1800, 5600, 16800, 50600, 150000, 456000, 1200000],
    [780, 2300, 7000, 21000, 63200, 187000, 570000, 1560000],
    [970, 3000, 8700, 26000, 79000, 235000, 713000, 2000000],
    [1200, 3600, 11000, 33000, 98800, 293000, 890000, 2500000],
  ]

const price =
  [
    ["500", "1500", "4500", "13.5K", "40.5K", "120K", "365K", "1M"],
    ["625", "1800", "5600", "16.8K", "50.6K", "150K", "456K", "1.2M"],
    ["780", "2300", "7000", "21K", "63.2K", "187K", "570K", "1.56M"],
    ["970", "3000", "8700", "26K", "79K", "235K", "713K", "2M"],
    ["1200", "3600", "11K", "33K", "98.8K", "293K", "890K", "2.5M"],
  ]

// const yield =
//   [
//     [123, 390, 1197, 3585, 11250, 34200, 108600, 312000],
//     [156, 471, 1494, 4590, 14100, 42900, 136500, 379500],
//     [195, 603, 1875, 5760, 17700, 53700, 171600, 501000],
//     [246, 792, 2340, 7140, 22200, 68100, 217500, 649500],
//     [309, 954, 2985, 9015, 27900, 86100, 274500, 825000],
//   ]

const Home = () => {
  const isMobile = window.matchMedia("only screen and (max-width: 1000px)").matches;

  const queryString = window.location.search;
  const parameters = new URLSearchParams(queryString);
  const newReferral = parameters.get('ref');

  const [burgerHouseContract, setBurgerHouseContract] = useState();

  const [web3, setWeb3] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [injectedProvider, setInjectedProvider] = useState();
  const [curAcount, setCurAcount] = useState(null);

  const [refetch, setRefetch] = useState(true);

  const [pendingTx, setPendingTx] = useState(false);
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const [refLink, setRefLink] = useState(`${REF_PREFIX}0x0000000000000000000000000000000000000000`);
  const [coinInputValue, setCoinInputValue] = useState('')
  const [bnbInputValue, setBnbInputValue] = useState('')
  const [depositValue, setDepositValue] = useState('');
  const [withdrawValue, setWithdrawValue] = useState('');

  const [userBalance, setUserBalance] = useState('');
  const [houseInfo, setHouseInfo] = useState({});

  const [allHousesLength, setAllHousesLength] = useState(0)
  const [totalInvested, setTotalInvested] = useState(0)
  const [totalUpgrades, setTotalUpgrades] = useState(0)

  const [blockTimestamp, setBlockTimestamp] = useState(0)

  const [showBuyCoins, setShowBuyCoins] = useState(false)
  const [showGetBNB, setShowGetBNB] = useState(false)
  const [showGetMoney, setShowGetMoney] = useState(false)

  useEffect(() => {
    const referral = window.localStorage.getItem("REFERRAL")

    if (!isAddress(referral, MAINNET)) {
      if (isAddress(newReferral, MAINNET)) {
        window.localStorage.setItem("REFERRAL", newReferral);
      } else {
        window.localStorage.setItem("REFERRAL", ADMIN_ACCOUNT);
      }
    }
  }, [newReferral])

  const logoutOfWeb3Modal = async () => {
    web3Modal.clearCachedProvider();
    if (
      injectedProvider &&
      injectedProvider.provider &&
      typeof injectedProvider.provider.disconnect == "function"
    ) {
      await injectedProvider.provider.disconnect();
    }
    setIsConnected(false);
  };

  const loadWeb3Modal = useCallback(async () => {
    // console.log("Connecting Wallet...");
    const provider = await web3Modal.connect();
    const web3Provider = new Web3(provider);
    setInjectedProvider(web3Provider);
    const acc = provider.selectedAddress
      ? provider.selectedAddress
      : provider.accounts[0];

    const _curChainId = await web3Provider.eth.getChainId();
    if (_curChainId !== MAINNET) {
      alert('Wrong Network! Please switch to Binance Smart Chain!')
      return;
    }

    setWeb3(web3Provider);
    setBurgerHouseContract(getBurgerHouseContract(web3Provider));
    setCurAcount(acc);
    setIsConnected(true);

    provider.on("chainChanged", (chainId) => {
      console.log(`chain changed to ${chainId}! updating providers`);
      alert('Wrong Network! Please switch to Binance Smart Chain!')
      setInjectedProvider(web3Provider);
      logoutOfWeb3Modal();
    });

    provider.on("accountsChanged", () => {
      console.log(`curAcount changed!`);
      alert('Current Account Changed!')
      setInjectedProvider(web3Provider);
      logoutOfWeb3Modal();
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    setInterval(() => {
      setRefetch((prevRefetch) => {
        return !prevRefetch;
      });
    }, 10000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _blockTimestamp = (await web3NoAccount.eth.getBlock('latest')).timestamp;
        setBlockTimestamp(parseInt(_blockTimestamp));

        const _totalUpgrades = await contractNoAccount.methods.totalUpgrades().call();
        setTotalUpgrades(_totalUpgrades);

        const _totalInvested = await contractNoAccount.methods.totalInvested().call();
        setTotalInvested(_totalInvested);

        const _allHousesLength = await contractNoAccount.methods.allHousesLength().call();
        setAllHousesLength(_allHousesLength)

        if (curAcount) {
          const _userBalance = await web3NoAccount.eth.getBalance(curAcount)
          setUserBalance(web3NoAccount.utils.fromWei(_userBalance))
          const refLink = `${REF_PREFIX}${curAcount}`;
          setRefLink(refLink);
        }

        if (isConnected && burgerHouseContract && curAcount) {
          const _houseInfo = await contractNoAccount.methods.viewHouse(curAcount).call();
          setHouseInfo(_houseInfo)
          console.log('[PRINCE](houseInfo): ', _houseInfo)
        }
      } catch (error) {
        console.log('fetchData error: ', error);
      }
    };

    fetchData();
  }, [isConnected, web3, burgerHouseContract, refetch, curAcount]);

  const pendingHours = () => {
    if (houseInfo && Object.keys(houseInfo).length > 0) {
      var hrs = parseInt((blockTimestamp - houseInfo.timestamp) / 3600)
      if (hrs + houseInfo.hrs > 24) {
        hrs = 24 - houseInfo.hrs;
      }
      return hrs;
    }
    return 0;
  }

  const pendingCash = () => {
    if (houseInfo && Object.keys(houseInfo).length > 0) {
      return pendingHours() * houseInfo.yield;
    }
    return 0;
  }

  const upgradeHouse = async (e, houseId) => {
    console.log('[PRINCE](upgradeHouse)', e, houseId)
    try {
      e.preventDefault();
      if (pendingTx) {
        alert("Pending...")
        return
      }

      if (!houseInfo || Object.keys(houseInfo).length <= 0 || parseInt(houseInfo.coins) < priceINT[parseInt(houseInfo.levels[0])][0]) {
        alert("Insufficient Coins! Please Purchase Coins!")
        return
      }

      setPendingTx(true)
      if (isConnected && burgerHouseContract) {
        await burgerHouseContract.methods.upgradeHouse(houseId).send({
          from: curAcount,
        }).then((txHash) => {
          console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
          alert(`House Upgrade Success! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          alert(`House Upgrade Fail! Reason: ${err.message}`);
        });
      }
      else {
        console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (e) {
      console.log('upgradeHouse: ', e)
      setPendingTx(false)
    }
  }

  const addCoins = async (e) => {
    console.log('[PRINCE](addCoins)', e)
    try {
      e.preventDefault();
      if (pendingTx) {
        alert("Pending...")
        return
      }

      if (parseFloat(bnbInputValue) <= 0) {
        alert("Please input BNB value...")
        return
      }

      setPendingTx(true)
      if (isConnected && burgerHouseContract) {
        let referrer = window.localStorage.getItem("REFERRAL");
        referrer = isAddress(referrer, MAINNET) ? referrer : ADMIN_ACCOUNT
        referrer = referrer === curAcount ? ADMIN_ACCOUNT1 : referrer

        console.log('[PRINCE](addCoins): ', referrer, bnbInputValue)

        await burgerHouseContract.methods.addCoins(referrer).send({
          from: curAcount,
          value: web3NoAccount.utils.toWei(bnbInputValue, 'ether')
        }).then((txHash) => {
          console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
          alert(`Purchase Success! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          alert(`Purchase Fail! Reason: ${err.message}`);
        });
      }
      else {
        console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (e) {
      console.log('addCoins: ', e)
      setPendingTx(false)
    }
  }

  const collectMoney = async (e) => {
    console.log('[PRINCE](collectMoney)', e)
    try {
      e.preventDefault();
      if (pendingTx) {
        alert("Pending...")
        return
      }

      setPendingTx(true)
      if (isConnected && burgerHouseContract) {
        await burgerHouseContract.methods.collectMoney().send({
          from: curAcount,
        }).then((txHash) => {
          console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
          alert(`Collect Money Success! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          alert(`Collect Money Fail! Reason: ${err.message}`);
        });
      }
      else {
        console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (e) {
      console.log('collectMoney: ', e)
      setPendingTx(false)
    }
  }

  return (
    <>
      <div class="section-open">
        <div class="logo-desktop"></div>
        {isConnected &&
          <>
            <div class="menu-fixed-left">
              <div class="menu-bars">
                <div class="menu-bar">
                  <div class="menu-bar-wallet">
                    <i class="fa fa-wallet" style={{ color: "#e6a71e", marginTop: "-9px" }}></i>
                  </div>
                  <div class="menu-bar-value menu-bar-money-value" style={{ left: "55%" }}>{`${curAcount.toString().substr(0, 6)}...${curAcount.toString().substr(38, 41)}`}</div>
                </div>
                <div class="menu-bar">
                  <div class="menu-bar-coin"></div>
                  <div class="menu-bar-value menu-bar-money-value">{houseInfo && Object.keys(houseInfo).length > 0 ? houseInfo.coins : "--"}</div>
                  <button type="button" class="menu-bar-btn-plus" onClick={() => setShowBuyCoins(true)} />
                </div>
                <div class="menu-bar fc-bar">
                  <div class="menu-bar-money"></div>
                  <div class="menu-bar-value menu-bar-money-value">{houseInfo && Object.keys(houseInfo).length > 0 ? houseInfo.cash : "--"}</div>
                  <button type="button" class="menu-bar-btn-minus" onClick={() => setShowGetBNB(true)} />
                </div>
                <div class="menu-bar-value menu-bar-money-value menu-bar-without-background">+{houseInfo && Object.keys(houseInfo).length > 0 ? houseInfo.yield : "--"}/h</div>
              </div>
            </div>
            <div class="menu-fixed-right">
              <div class="menu-btns">
                <button class="menu-btn menu-btn-affiliate" data-bs-placement="right" data-bs-toggle="tooltip" title="Partners"  >
                  <i class="fa fa-users"></i>
                </button>
                <button class="menu-btn menu-btn-leaderboard" data-bs-placement="right" data-bs-toggle="tooltip" title="Telegram">
                  <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="3 5 50 50" width="30px" height="30px"><path d="M46.137,6.552c-0.75-0.636-1.928-0.727-3.146-0.238l-0.002,0C41.708,6.828,6.728,21.832,5.304,22.445	c-0.259,0.09-2.521,0.934-2.288,2.814c0.208,1.695,2.026,2.397,2.248,2.478l8.893,3.045c0.59,1.964,2.765,9.21,3.246,10.758	c0.3,0.965,0.789,2.233,1.646,2.494c0.752,0.29,1.5,0.025,1.984-0.355l5.437-5.043l8.777,6.845l0.209,0.125	c0.596,0.264,1.167,0.396,1.712,0.396c0.421,0,0.825-0.079,1.211-0.237c1.315-0.54,1.841-1.793,1.896-1.935l6.556-34.077	C47.231,7.933,46.675,7.007,46.137,6.552z M22,32l-3,8l-3-10l23-17L22,32z"></path></svg>
                </button>
                <button class="menu-btn menu-btn-transactions" data-bs-placement="right" data-bs-toggle="tooltip" title="Help">
                  <i class="fa fa-question"></i>
                </button>
                <button class="menu-btn menu-btn-logout" data-bs-placement="right" data-bs-toggle="tooltip" title="Logout" onClick={logoutOfWeb3Modal} >
                  <i class="fa fa-sign-out"></i>
                </button>
              </div>
            </div>
          </>
        }
        < div class="ranch trees">
          {isConnected ?
            <>
              <div class="barns">
                <div class="barn" id="house1">
                  <div class="barn-1 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn" data-toggle="modal" data-target="#upgradeHouse0">
                      <div class="farm-coin" >&nbsp;</div>
                      {houseInfo && Object.keys(houseInfo).length > 0 ? price[parseInt(houseInfo.levels[0])][0] : "--"}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house2">
                  <div class="barn-2 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      {houseInfo && Object.keys(houseInfo).length > 0 ? price[parseInt(houseInfo.levels[1])][1] : "--"}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house3">
                  <div class="barn-3 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      {houseInfo && Object.keys(houseInfo).length > 0 ? price[parseInt(houseInfo.levels[2])][2] : "--"}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house4">
                  <div class="barn-4 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      {houseInfo && Object.keys(houseInfo).length > 0 ? price[parseInt(houseInfo.levels[3])][3] : "--"}
                    </button>
                  </div>
                </div>
              </div >
              <div class="barns">
                <div class="barn" id="house5">
                  <div class="barn-5 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      {houseInfo && Object.keys(houseInfo).length > 0 ? price[parseInt(houseInfo.levels[4])][4] : "--"}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house6">
                  <div class="barn-6 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      {houseInfo && Object.keys(houseInfo).length > 0 ? price[parseInt(houseInfo.levels[5])][5] : "--"}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house7">
                  <div class="barn-7 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      {houseInfo && Object.keys(houseInfo).length > 0 ? price[parseInt(houseInfo.levels[6])][6] : "--"}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house8">
                  <div class="barn-8 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      {houseInfo && Object.keys(houseInfo).length > 0 ? price[parseInt(houseInfo.levels[7])][7] : "--"}
                    </button>
                  </div>
                </div>
              </div >
              <div className="get-money">
                <button type="button" class="btn-green" onClick={() => setShowGetMoney(true)}>Get Money</button>
              </div>
            </>
            :
            <div className="login-action">
              <button type="button" class="btn-green btn-login" onClick={loadWeb3Modal}>Connect</button>
            </div>
          }
        </div >
      </div >

      <div class="popup-wrapper popup-buy popup-exchange" id="buyCoins" style={{ display: showBuyCoins && isConnected ? "block" : "none" }}>
        <div class="popup-box-1">
          <div class="popup-buy-header">Purchase of Coins</div>

          <div class="popup-buy-text-container">
            <div class="popup-buy-text-ticker">
              <div class="popup-buy-currency-icon"></div>
              BNB
            </div>
            <div class="popup-buy-text-balance"
              onClick={() => {
                const bnbVaule = (parseFloat(userBalance) - GAS_AMOUNT).toFixed(4)
                setBnbInputValue(bnbVaule)
                setCoinInputValue(parseInt(parseFloat(bnbVaule) * BNB_PRICE))
              }}>
              Balance: {parseFloat(userBalance).toFixed(3)}
            </div>
          </div>
          <div class="popup-buy-input-wrapper">
            <input style={{ fontSize: "20px" }} name="coin" class="popup-buy-input popup-buy-input-coin"
              type="number" inputmode="decimal" placeholder="0.0" min="0"
              value={bnbInputValue}
              onChange={(e) => {
                setBnbInputValue(e.target.value)
                setCoinInputValue(parseInt(parseFloat(e.target.value) * BNB_PRICE))
              }}
            />
          </div>
          <div class="popup-buy-arrow">
            <i class="fa fa-arrow-down"></i>
          </div>
          <div class="popup-buy-text-container" style={{ marginTop: "0px" }}>
            <div class="popup-buy-text-ticker">
              <div class="popup-buy-coin-icon"></div>
              COIN
            </div>
          </div>
          <div class="popup-buy-input-wrapper">
            <input style={{ fontSize: "20px" }} class="popup-buy-input popup-buy-input-cash"
              type="number" inputmode="decimal" placeholder="0" min="0"
              value={coinInputValue}
              onChange={(e) => {
                setCoinInputValue(parseInt(e.target.value))
                setBnbInputValue((parseInt(e.target.value) / BNB_PRICE).toFixed(5))
              }}
            />
          </div>
          <div class="popup-buy-rate-text" style={{ fontWeight: "bold", marginTop: "15px" }}>
            {COIN_PRICE} BNB For 1 COIN
          </div>
          {/* <div class="container">
            <div class="alert alert-warning" role="alert">
              Not enough coins
            </div>
          </div> */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: "20px" }}>
            <button class="btn-green" style={{ fontWeight: "bold" }}
              disabled={pendingTx || !isConnected}
              onClick={addCoins}>
              Buy
            </button>
          </div>
        </div>
        <button type="button" class="popup-btn-close popup-btn-close-3" onClick={() => setShowBuyCoins(false)} />
      </div>

      <div class="popup-wrapper popup-payout" style={{ display: showGetBNB && isConnected ? "block" : "none" }}>
        <div class="popup-box-exchange popup-box">
          <div class="popup-profit-header sell-header">Sell Farm Cash</div>

          <div class="popup-buy-text-container">
            <div class="popup-buy-text-ticker">
              FC
            </div>
            <div class="popup-buy-text-balance popup-sell-input-max">Max: 0.00</div>
          </div>
          <div class="popup-buy-input-wrapper">
            <input style={{ fontSize: "20px" }} name="cash" type="number" id="sell_input_cash" inputmode="decimal" placeholder="0.0" class="popup-buy-input popup-sell-input-cash" />
          </div>

          <div class="popup-buy-text-container computation">
            <div class="popup-buy-text-ticker">
              5% TAX
            </div>
            <div class="popup-buy-text-balance popup-sell-input-tax"></div>
          </div>

          <div class="popup-buy-text-container computation">
            <div class="popup-buy-text-ticker">
              PHP
            </div>
            <div class="popup-buy-text-balance popup-sell-input-php"></div>
          </div>

          <div class="popup-buy-text-container">
            <div class="popup-buy-text-ticker">
              Mode of Payment
            </div>
          </div>
          <div class="popup-buy-input-wrapper">
            <input style={{ fontSize: "20px" }} name="mop" type="text" placeholder="gcash or bank details" class="popup-buy-input popup-sell-input-mop" />
          </div>
          <div id="sell_fc_alert"></div>
          <div class="container">
            <div class="alert alert-warning" role="alert">
              Not enough cash
            </div>
          </div>
        </div>
        <button type="button" class="popup-btn-close" onClick={() => setShowGetBNB(false)} />
      </div>

      <div class="popup-wrapper popup-profit" style={{ display: showGetMoney && isConnected ? "block" : "none" }}>
        <div class="popup-box-1">
          <div class="popup-profit-header">Your profit</div>
          <div class="popup-profit-time">
            <div class="popup-profit-time-icon" />
            <div class="popup-profit-time-text">{pendingHours()} Hours</div>
          </div>
          <div style={{ fontSize: "16px" }} class="popup-profit-time-description">
            Don't forget to collect profit every 24 hours
          </div>
          <div class="popup-profit-figure" />
          <div class="popup-profit-money-bar">
            <div class="popup-profit-money-bar-icon" />
            <div class="popup-profit-money-bar-text">{pendingCash()}</div>
          </div>
          <button type="button" class="btn-green" style={{ marginTop: "5px" }}
            disabled={pendingTx || !isConnected}
            onClick={(e) => collectMoney(e)}
          >
            Collect
          </button>
        </div>
        <button type="button" class="popup-btn-close" onClick={() => setShowGetMoney(false)} />
      </div>

      <div class="modal" id="upgradeHouse0">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Burger House 1</h4>
              <button type="button" class="btn-close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="popup-upgrade-box">
                <div class="popup-upgrade-mini-box">
                  <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Level</div>
                  <div class="popup-upgrade-mini-box-added">1</div>
                </div>
                <div class="popup-upgrade-mini-box">
                  <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Slots</div>
                  <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">2</div>
                </div>
                <div class="popup-upgrade-mini-box">
                  <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Amount</div>
                  <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">100</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button class="btn-red btn-upgrade"
                    disabled={pendingTx || !isConnected}
                    onClick={(e) => upgradeHouse(e, 0)}>
                    <div class="farm-coin" >&nbsp;</div>
                    {houseInfo && Object.keys(houseInfo).length > 0 ? price[parseInt(houseInfo.levels[0])][0] : "--"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" id="referral">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Affiliates</h4>
              <button type="button" class="btn-close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="popup-partners-input-wrapper">
                <input class="popup-partners-input" readonly="readonly" value="https://happyfarmer.app/register?ref_id=1667231961" />
              </div>
              <div class="popup-partners-description">
                Get <div class="popup-partners-money-icon"></div>20% FC of total purchased animals of your partner
              </div>
              <div class="popup-partners-users-bar">
                <div class="popup-partners-users-bar-icon"></div>
                <div class="popup-partners-users-bar-text">+ 0</div>
              </div>

              <div class="popup-buy-header">Latest 10 Referral</div>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Registered</th>
                    <th scope="col">Name</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" id="transactionModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Transactions</h4>
              <button type="button" class="btn-close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Value</th>
                    <th scope="col">Peso</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" id="logsModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Latest 10 Transactions</h4>
              <button type="button" class="btn-close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Transaction</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" id="transferModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Send Coins</h4>
              <button type="button" class="btn-close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">

              <form action="https://happyfarmer.app/transfer-coins" method="post">
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Mobile Number</label>
                  <input type="text" class="form-control" name="mobile_number" placeholder="Mobile Number" />
                  <div id="emailHelp" class="form-text">Please enter valid mobile number.</div>
                </div>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Coins</label>
                  <input type="text" name="amount" class="form-control" placeholder="Coins" />
                  <div id="emailHelp" class="form-text">Please enter coins amount.</div>
                </div>
                <div class="container">
                  <div class="alert alert-warning" role="alert">
                    Not enough coins
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" id="transferGasModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Send Gas</h4>
              <button type="button" class="btn-close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">

              <form action="https://happyfarmer.app/transfer-gas" method="post">
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Mobile Number</label>
                  <input type="text" class="form-control" name="mobile_number" placeholder="Mobile Number" />
                  <div id="emailHelp" class="form-text">Please enter valid mobile number.</div>
                </div>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Gas</label>
                  <input type="text" name="amount" class="form-control" placeholder="Gas amount" />
                  <div id="emailHelp" class="form-text">Please enter gas amount.</div>
                </div>
                <div class="container">
                  <div class="alert alert-warning" role="alert">
                    Not enough gas
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" id="sendCashModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Send Cash</h4>
              <button type="button" class="btn-close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">

              <form action="https://happyfarmer.app/transfer-cash" method="post">
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Mobile Number</label>
                  <input type="text" class="form-control" name="mobile_number" placeholder="Mobile Number" />
                  <div id="emailHelp" class="form-text">Please enter valid mobile number.</div>
                </div>
                <div class="mb-3 radio-picker">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="type" value="fc" checked />
                    <label class="form-check-label">
                      Send FARM CASH
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="type" value="lc" />
                    <label class="form-check-label">
                      Send LIVESTOCK CASH
                    </label>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Amount</label>
                  <input type="text" name="amount" id="send_amount" class="form-control" placeholder="Coins" />
                  <div id="emailHelp" class="form-text">Please enter cash amount.</div>
                </div>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Gas Fee</label>
                  <input type="text" name="gas" id="send_gas_amount" class="form-control" placeholder="Gas fee" readonly />
                </div>
                <button type="submit" class="btn-red">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" id="leaderBoardModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">LEADERBOARD</h4>
              <button type="button" class="btn-close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <table class="table">
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>Darlynne</td>
                    <td>43.5K</td>
                  </tr>
                  <tr>
                    <th scope="row">2</th>
                    <td>richel gonzales</td>
                    <td>41.7K</td>
                  </tr>
                  <tr>
                    <th scope="row">3</th>
                    <td>RANDEX</td>
                    <td>41.5K</td>
                  </tr>
                  <tr>
                    <th scope="row">4</th>
                    <td>Sarry Gin Boy O. Bengil</td>
                    <td>39.6K</td>
                  </tr>
                  <tr>
                    <th scope="row">5</th>
                    <td>Esteban Jr</td>
                    <td>35.2K</td>
                  </tr>
                  <tr>
                    <th scope="row">6</th>
                    <td>Roan</td>
                    <td>33.4K</td>
                  </tr>
                  <tr>
                    <th scope="row">7</th>
                    <td>CryptoCritic</td>
                    <td>25.6K</td>
                  </tr>
                  <tr>
                    <th scope="row">8</th>
                    <td>Jomar lopez</td>
                    <td>24.6K</td>
                  </tr>
                  <tr>
                    <th scope="row">9</th>
                    <td>Sherwin Bagulaya</td>
                    <td>24.3K</td>
                  </tr>
                  <tr>
                    <th scope="row">10</th>
                    <td>Jone Estabillo</td>
                    <td>17.9K</td>
                  </tr>
                  <tr>
                    <th scope="row">11</th>
                    <td>jehdee</td>
                    <td>15.5K</td>
                  </tr>
                  <tr>
                    <th scope="row">12</th>
                    <td>Michael Tangco</td>
                    <td>15.2K</td>
                  </tr>
                  <tr>
                    <th scope="row">13</th>
                    <td>Michael Ignacio</td>
                    <td>13.5K</td>
                  </tr>
                  <tr>
                    <th scope="row">14</th>
                    <td>BienReyes28</td>
                    <td>12.8K</td>
                  </tr>
                  <tr>
                    <th scope="row">15</th>
                    <td>Jenny lyn</td>
                    <td>12.4K</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* <div class="popup-wrapper popup-barn-1" id="hello">
        <div class="popup-box-1 popup-box">
          <div class="popup-profit-header">BASIC BARN</div>
          <div class="container">
            <div class="popup-upgrade-box">
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Level</div>
                <div class="popup-upgrade-mini-box-added">1</div>
              </div>
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Slots</div>
                <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">2</div>
              </div>
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Amount</div>
                <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">100</div>
              </div>
            </div>
          </div>
          <div class="popup-profit-figure"></div>
          <div class="container">
            <div class="alert alert-warning" role="alert">
              Not enough coins
            </div>
          </div>
        </div>
        <button type="button" class="popup-btn-close"></button>
      </div> */}
      {/* <div class="popup-wrapper popup-barn-2">
        <div class="popup-box-2 popup-box">
          <div class="popup-profit-header">MEDIUM BARN</div>
          <div class="container">
            <div class="popup-upgrade-box">
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Level</div>
                <div class="popup-upgrade-mini-box-added">1</div>
              </div>
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Slots</div>
                <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">20</div>
              </div>
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Amount</div>
                <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">1K</div>
              </div>
            </div>
          </div>
          <div class="popup-profit-figure"></div>
          <div class="container">
            <div class="alert alert-warning" role="alert">
              Not enough coins
            </div>
          </div>
        </div>
        <button type="button" class="popup-btn-close"></button>
      </div>
      <div class="popup-wrapper popup-barn-3">
        <div class="popup-box-3 popup-box">
          <div class="popup-profit-header">LARGE BARN</div>
          <div class="container">
            <div class="popup-upgrade-box">
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Level</div>
                <div class="popup-upgrade-mini-box-added">1</div>
              </div>
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Slots</div>
                <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">60</div>
              </div>
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Amount</div>
                <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">2K</div>
              </div>
            </div>
          </div>
          <div class="popup-profit-figure"></div>
          <div class="container">
            <div class="alert alert-warning" role="alert">
              Not enough coins
            </div>
          </div>
        </div>
        <button type="button" class="popup-btn-close"></button>
      </div>
      <div class="popup-wrapper popup-barn-4">
        <div class="popup-box-4 popup-box">
          <div class="popup-profit-header">GRAND BARN</div>
          <div class="container">
            <div class="popup-upgrade-box">
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Level</div>
                <div class="popup-upgrade-mini-box-added">1</div>
              </div>
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Slots</div>
                <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">120</div>
              </div>
              <div class="popup-upgrade-mini-box">
                <div class="popup-upgrade-mini-box-text popup-upgrade-chefs popup-text">Amount</div>
                <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">3K</div>
              </div>
            </div>
          </div>
          <div class="popup-profit-figure"></div>
          <div class="container">
            <div class="alert alert-warning" role="alert">
              Not enough coins
            </div>
          </div>
        </div>
        <button type="button" class="popup-btn-close"></button>
      </div> */}
      {/* <div class="loading" style="display:none;">Loading&#8230;</div> */}

      {/* <div class="popup-wrapper popup-buy popup-exchange" style="display: none;">
        <form action="https://happyfarmer.app/exchange" method="post" role="form" >
          <div class="popup-box-1">
            <div class="popup-buy-header">Purchase of Farm Cash</div>

            <div class="popup-buy-text-container">
              <div class="popup-buy-text-ticker">
                <div class="popup-buy-currency-icon"></div>
                COIN
              </div>
              <div class="popup-buy-text-balance">Balance: 0.00</div>
            </div>
            <div class="popup-buy-input-wrapper">
              <input style="font-size: 20px" name="coin" type="number" inputmode="decimal" placeholder="0.0" class="popup-buy-input popup-buy-input-coin" />
            </div>
            <div class="popup-buy-arrow">
              <i class="fa-solid fa-arrow-down"></i>
            </div>
            <div class="popup-buy-text-container" style="margin-top: 0px">
              <div class="popup-buy-text-ticker">
                <div class="popup-buy-coin-icon"></div>
                FARM CASH
              </div>
            </div>
            <div class="popup-buy-input-wrapper">
              <input style="font-size:  20px" type="number" inputmode="decimal" placeholder="0" class="popup-buy-input popup-buy-input-cash" />
            </div>
            <div class="popup-buy-rate-text">
              1 COIN For 1.33 Farm Cash (FC)
            </div>
            <div class="container">
              <div class="alert alert-warning" role="alert">
                Not enough coins
              </div>
            </div>
          </div>
        </form>
        <button type="button" class="popup-btn-close popup-btn-close-3"></button>
      </div>

      <div class="popup-wrapper popup-payout" style="display: none;">
        <div class="popup-box-exchange popup-box">
          <form id="form_sell_fc" action="https://happyfarmer.app/sell" method="post">
            <div class="popup-profit-header sell-header">Sell Farm Cash</div>

            <div class="popup-buy-text-container">
              <div class="popup-buy-text-ticker">
                FC
              </div>
              <div class="popup-buy-text-balance popup-sell-input-max">Max: 0.00</div>
            </div>
            <div class="popup-buy-input-wrapper">
              <input style="font-size: 20px" name="cash" type="number" id="sell_input_cash" inputmode="decimal" placeholder="0.0" class="popup-buy-input popup-sell-input-cash" />
            </div>

            <div class="popup-buy-text-container computation">
              <div class="popup-buy-text-ticker">
                5% TAX
              </div>
              <div class="popup-buy-text-balance popup-sell-input-tax"></div>
            </div>

            <div class="popup-buy-text-container computation">
              <div class="popup-buy-text-ticker">
                PHP
              </div>
              <div class="popup-buy-text-balance popup-sell-input-php"></div>
            </div>

            <div class="popup-buy-text-container">
              <div class="popup-buy-text-ticker">
                Mode of Payment
              </div>
            </div>
            <div class="popup-buy-input-wrapper">
              <input style="font-size: 20px" name="mop" type="text" placeholder="gcash or bank details" class="popup-buy-input popup-sell-input-mop" />
            </div>
            <div id="sell_fc_alert"></div>
            <div class="container">
              <div class="alert alert-warning" role="alert">
                Not enough cash
              </div>
            </div>
          </form>
        </div>
        <button type="button" class="popup-btn-close"></button>
      </div>

      <div class="popup-wrapper popup-payout-ls" style="display: none;">
        <div class="popup-box-exchange popup-box">
          <form id="form_sell_ls" action="https://happyfarmer.app/sell-ls" method="post">
            <div class="popup-profit-header sell-header">Sell Livestock Cash</div>

            <div class="popup-buy-text-container">
              <div class="popup-buy-text-ticker">
                Livestock Amount
              </div>
              <div class="popup-buy-text-balance popup-sell-input-max">Max: 0.00</div>
            </div>
            <div class="popup-buy-input-wrapper">
              <input style="font-size: 20px" name="cash" type="number" id="sell_input_cash" inputmode="decimal" placeholder="0.0" class="popup-buy-input popup-sell-input-ls" />
            </div>

            <div class="popup-buy-text-container computation">
              <div class="popup-buy-text-ticker">
                5% TAX
              </div>
              <div class="popup-buy-text-balance popup-sell-input-tax"></div>
            </div>

            <div class="popup-buy-text-container computation">
              <div class="popup-buy-text-ticker">
                PHP
              </div>
              <div class="popup-buy-text-balance popup-sell-input-php"></div>
            </div>

            <div class="popup-buy-text-container">
              <div class="popup-buy-text-ticker">
                Mode of Payment
              </div>
            </div>
            <div class="popup-buy-input-wrapper">
              <input style="font-size: 20px" name="mop" type="text" placeholder="gcash or bank details" class="popup-buy-input popup-sell-input-mop" />
            </div>
            <div id="sell_lc_alert"></div>
            <div class="container">
              <div class="alert alert-warning" role="alert">
                Not enough cash
              </div>
            </div>
          </form>
        </div>
        <button type="button" class="popup-btn-close"></button>
      </div> */}
    </>);
}

export default Home;
