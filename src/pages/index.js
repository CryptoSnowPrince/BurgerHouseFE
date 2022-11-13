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
  GAS_AMOUNT,
  CASH_PRICE,
  REFERRAL_CASH,
  REFERRAL_COIN
} from "../constant";

const web3Modal = web3ModalSetup();

const httpProvider = new Web3.providers.HttpProvider(RPC_URL)
const web3NoAccount = new Web3(httpProvider)
const isAddress = web3NoAccount.utils.isAddress
const contractNoAccount = getBurgerHouseContract(web3NoAccount)

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

const yieldValues =
  [
    [123, 390, 1197, 3585, 11250, 34200, 108600, 312000],
    [156, 471, 1494, 4590, 14100, 42900, 136500, 379500],
    [195, 603, 1875, 5760, 17700, 53700, 171600, 501000],
    [246, 792, 2340, 7140, 22200, 68100, 217500, 649500],
    [309, 954, 2985, 9015, 27900, 86100, 274500, 825000],
  ]

const getHouseprofit = (level, houseId) => {
  var houseprofit = 0;
  for (var i = 0; i < level; i++) {
    houseprofit += yieldValues[i][houseId]
  }
  return houseprofit;
}

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

  const [userBalance, setUserBalance] = useState('');
  const [houseInfo, setHouseInfo] = useState({});

  const [allHousesLength, setAllHousesLength] = useState(0)
  const [totalInvested, setTotalInvested] = useState(0)
  const [totalUpgrades, setTotalUpgrades] = useState(0)

  const [blockTimestamp, setBlockTimestamp] = useState(0)

  const [showBuyCoins, setShowBuyCoins] = useState(false)
  const [showGetBNB, setShowGetBNB] = useState(false)
  const [showGetMoney, setShowGetMoney] = useState(false)
  const [upgradeLevel, setUpgradeLevel] = useState(0)
  const [showReferral, setShowReferral] = useState(false)

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

  const enableValue = () => {
    return (houseInfo && Object.keys(houseInfo).length > 0)
  }

  const pendingHours = () => {
    if (enableValue()) {
      var hrs = parseInt((blockTimestamp - houseInfo.timestamp) / 3600)
      if (hrs + houseInfo.hrs > 24) {
        hrs = 24 - houseInfo.hrs;
      }
      return hrs;
    }
    return 0;
  }

  const pendingCash = () => {
    if (enableValue()) {
      return pendingHours() * houseInfo.yield + parseInt(houseInfo.burger);
    }
    return 0;
  }

  const sellHouse = async () => {
    console.log('[PRINCE](sellHouse)')
    try {
      if (pendingTx) {
        alert("Pending...")
        return
      }

      setPendingTx(true)
      if (isConnected && burgerHouseContract) {
        await burgerHouseContract.methods.sellHouse().send({
          from: curAcount,
        }).then((txHash) => {
          console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
          alert(`Sell House Success! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          alert(`Sell House Fail! Reason: ${err.message}`);
        });
      }
      else {
        console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (e) {
      console.log('sellHouse: ', e)
      setPendingTx(false)
    }
  }

  const withdrawMoney = async () => {
    console.log('[PRINCE](withdrawMoney)')
    try {
      if (pendingTx) {
        alert("Pending...")
        return
      }

      setPendingTx(true)
      if (isConnected && burgerHouseContract) {
        await burgerHouseContract.methods.withdrawMoney().send({
          from: curAcount,
        }).then((txHash) => {
          console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
          alert(`Withdraw Money Success! txHash is ${msgString}`);
        }).catch((err) => {
          console.log(err)
          alert(`Withdraw Money Fail! Reason: ${err.message}`);
        });
      }
      else {
        console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (e) {
      console.log('withdrawMoney: ', e)
      setPendingTx(false)
    }
  }

  const upgradeHouse = async (e, houseId) => {
    console.log('[PRINCE](upgradeHouse)', e, houseId)
    try {
      e.preventDefault();
      if (pendingTx) {
        alert("Pending...")
        return
      }

      if (
        !enableValue() ||
        parseInt(houseInfo.coins) < priceINT[parseInt(houseInfo.levels[upgradeLevel - 1])][upgradeLevel - 1]) {
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
                  <div class="menu-bar-value" style={{ left: "55%" }}>{`${curAcount.toString().substr(0, 6)}...${curAcount.toString().substr(38, 41)}`}</div>
                </div>
                <div class="menu-bar">
                  <div class="menu-bar-coin"></div>
                  <div class="menu-bar-value">{enableValue() ? houseInfo.coins : "--"}</div>
                  <button type="button" class="menu-bar-btn-plus" onClick={() => setShowBuyCoins(true)} />
                </div>
                <div class="menu-bar fc-bar">
                  <div class="menu-bar-money"></div>
                  <div class="menu-bar-value">{enableValue() ? houseInfo.cash : "--"}</div>
                  <button type="button" class="menu-bar-btn-minus" onClick={() => setShowGetBNB(true)} />
                </div>
                <div class="menu-bar-value menu-bar-without-background">{enableValue() ? `+ ${houseInfo.yield}` : "--"}/h</div>
              </div>
            </div>
            <div class="menu-fixed-right">
              <div class="menu-btns">
                <button class="menu-btn menu-btn-affiliate"
                  onClick={() => setShowReferral(true)}
                  data-bs-placement="right"
                  data-bs-toggle="tooltip"
                  title="Partners">
                  <i class="fa fa-users"></i>
                </button>
                <button class="menu-btn menu-btn-leaderboard" data-bs-placement="right" data-bs-toggle="tooltip" title="Telegram">
                  <svg fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="3 5 50 50" width="30px" height="30px"><path d="M46.137,6.552c-0.75-0.636-1.928-0.727-3.146-0.238l-0.002,0C41.708,6.828,6.728,21.832,5.304,22.445	c-0.259,0.09-2.521,0.934-2.288,2.814c0.208,1.695,2.026,2.397,2.248,2.478l8.893,3.045c0.59,1.964,2.765,9.21,3.246,10.758	c0.3,0.965,0.789,2.233,1.646,2.494c0.752,0.29,1.5,0.025,1.984-0.355l5.437-5.043l8.777,6.845l0.209,0.125	c0.596,0.264,1.167,0.396,1.712,0.396c0.421,0,0.825-0.079,1.211-0.237c1.315-0.54,1.841-1.793,1.896-1.935l6.556-34.077	C47.231,7.933,46.675,7.007,46.137,6.552z M22,32l-3,8l-3-10l23-17L22,32z"></path></svg>
                </button>
                <button class="menu-btn menu-btn-transactions" data-bs-placement="right" data-bs-toggle="tooltip" title="Help">
                  <i class="fa fa-question"></i>
                </button>
                <button class="menu-btn menu-btn-logout" data-bs-placement="right" data-bs-toggle="tooltip" title="Logout"
                  onClick={logoutOfWeb3Modal} >
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
                    <button className="btn-red btn-buy-barn"
                      onClick={() => setUpgradeLevel(1)}>
                      {enableValue() && parseInt(houseInfo.levels[0]) === 5 ? (
                        <div style={{ fontWeight: "bold", marginTop: "95px", color: "yellow" }}>Top Level</div>
                      ) : (
                        <>
                          <div class="farm-coin" >&nbsp;</div>
                          <div style={{ fontWeight: "bold", marginTop: "95px" }}>
                            {enableValue() ? price[parseInt(houseInfo.levels[0])][0] : "--"}
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house2">
                  <div class="barn-2 barn-grey-100"></div>
                  <div class="barn-action">
                    <button className="btn-red btn-buy-barn"
                      onClick={() => setUpgradeLevel(2)}>
                      {enableValue() && parseInt(houseInfo.levels[1]) === 5 ? (
                        <div style={{ fontWeight: "bold", marginTop: "95px", color: "yellow" }}>Top Level</div>
                      ) : (
                        <>
                          <div class="farm-coin" >&nbsp;</div>
                          <div style={{ fontWeight: "bold", marginTop: "95px" }}>
                            {enableValue() ? price[parseInt(houseInfo.levels[1])][1] : "--"}
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house3">
                  <div class="barn-3 barn-grey-100"></div>
                  <div class="barn-action">
                    <button className="btn-red btn-buy-barn"
                      onClick={() => setUpgradeLevel(3)}>
                      {enableValue() && parseInt(houseInfo.levels[2]) === 5 ? (
                        <div style={{ fontWeight: "bold", marginTop: "95px", color: "yellow" }}>Top Level</div>
                      ) : (
                        <>
                          <div class="farm-coin" >&nbsp;</div>
                          <div style={{ fontWeight: "bold", marginTop: "95px" }}>
                            {enableValue() ? price[parseInt(houseInfo.levels[2])][2] : "--"}
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house4">
                  <div class="barn-4 barn-grey-100"></div>
                  <div class="barn-action">
                    <button className="btn-red btn-buy-barn"
                      onClick={() => setUpgradeLevel(4)}>
                      {enableValue() && parseInt(houseInfo.levels[3]) === 5 ? (
                        <div style={{ fontWeight: "bold", marginTop: "95px", color: "yellow" }}>Top Level</div>
                      ) : (
                        <>
                          <div class="farm-coin" >&nbsp;</div>
                          <div style={{ fontWeight: "bold", marginTop: "95px" }}>
                            {enableValue() ? price[parseInt(houseInfo.levels[3])][3] : "--"}
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div >
              <div class="barns">
                <div class="barn" id="house5">
                  <div class="barn-5 barn-grey-100"></div>
                  <div class="barn-action">
                    <button className="btn-red btn-buy-barn"
                      onClick={() => setUpgradeLevel(5)}>
                      {enableValue() && parseInt(houseInfo.levels[4]) === 5 ? (
                        <div style={{ fontWeight: "bold", marginTop: "95px", color: "yellow" }}>Top Level</div>
                      ) : (
                        <>
                          <div class="farm-coin" >&nbsp;</div>
                          <div style={{ fontWeight: "bold", marginTop: "95px" }}>
                            {enableValue() ? price[parseInt(houseInfo.levels[4])][4] : "--"}
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house6">
                  <div class="barn-6 barn-grey-100"></div>
                  <div class="barn-action">
                    <button className="btn-red btn-buy-barn"
                      onClick={() => setUpgradeLevel(6)}>
                      {enableValue() && parseInt(houseInfo.levels[5]) === 5 ? (
                        <div style={{ fontWeight: "bold", marginTop: "95px", color: "yellow" }}>Top Level</div>
                      ) : (
                        <>
                          <div class="farm-coin" >&nbsp;</div>
                          <div style={{ fontWeight: "bold", marginTop: "95px" }}>
                            {enableValue() ? price[parseInt(houseInfo.levels[5])][5] : "--"}
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house7">
                  <div class="barn-7 barn-grey-100"></div>
                  <div class="barn-action">
                    <button className="btn-red btn-buy-barn"
                      onClick={() => setUpgradeLevel(7)}>
                      {enableValue() && parseInt(houseInfo.levels[6]) === 5 ? (
                        <div style={{ fontWeight: "bold", marginTop: "95px", color: "yellow" }}>Top Level</div>
                      ) : (
                        <>
                          <div class="farm-coin" >&nbsp;</div>
                          <div style={{ fontWeight: "bold", marginTop: "95px" }}>
                            {enableValue() ? price[parseInt(houseInfo.levels[6])][6] : "--"}
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div class="barn" id="house8">
                  <div class="barn-8 barn-grey-100"></div>
                  <div class="barn-action">
                    <button className="btn-red btn-buy-barn"
                      onClick={() => setUpgradeLevel(8)}>
                      {enableValue() && parseInt(houseInfo.levels[7]) === 5 ? (
                        <div style={{ fontWeight: "bold", marginTop: "95px", color: "yellow" }}>Top Level</div>
                      ) : (
                        <>
                          <div class="farm-coin" >&nbsp;</div>
                          <div style={{ fontWeight: "bold", marginTop: "95px" }}>
                            {enableValue() ? price[parseInt(houseInfo.levels[7])][7] : "--"}
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div >
              <div className="get-money">
                <button type="button" class="btn-green"
                  style={{ fontWeight: "bold" }}
                  onClick={() => setShowGetMoney(true)}>
                  Get Money
                </button>
              </div>
            </>
            :
            <div className="login-action">
              <button type="button" class="btn-green btn-login" style={{ fontWeight: "bold" }}
                onClick={loadWeb3Modal}>
                Connect
              </button>
            </div>
          }
        </div >
      </div >

      <div class="popup-wrapper popup-buy popup-exchange" id="buyCoins" style={{ display: showBuyCoins && isConnected ? "block" : "none" }}>
        <div class="popup-box-1">
          <div class="popup-buy-header">Purchase Of Coins</div>
          <div class="popup-buy-text-container">
            <div class="popup-buy-text-ticker">
              <div class="popup-buy-currency-icon"></div>
              BNB
            </div>
            <div class="popup-buy-text-balance" style={{ fontWeight: "bold" }}
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
          <div class="popup-buy-arrow" style={{ marginTop: "10px" }}>
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
          <div class="popup-buy-text-ticker" style={{ marginTop: "16px" }}>
            {COIN_PRICE} BNB For 1 COIN
          </div>
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

      <div class="popup-wrapper popup-sell" style={{ display: showGetBNB && isConnected ? "block" : "none" }}>
        <div class="popup-box-1">
          <div class="popup-sell-header">Get BNB</div>
          <div class="popup-sell-rate-text">
            0.00002 BNB For 100 <div class="popup-sell-rate-money-icon"></div>
          </div>
          <div class="popup-sell-figure"></div>
          <div class="popup-sell-description">
            {`You can exchange `}
            <span class="popup-sell-money-value">
              {enableValue() ? `${houseInfo.cash} ` : `0 `}
              <div class="popup-sell-money-icon" />
            </span>
            {` for `}
            <span class="popup-sell-currency-value">
              {enableValue() ? `${houseInfo.cash * CASH_PRICE} ` : `0 `}
              BNB
            </span>
          </div>
          <button type="button" class="popup-sell-btn-swap" onClick={() => withdrawMoney()}>Exchange</button>
          <button type="button" class="popup-sell-btn-destroy" onClick={() => sellHouse()}>Sell House</button>
        </div>
        <button type="button" class="popup-btn-close" onClick={() => setShowGetBNB(false)} />
      </div>

      <div class="popup-wrapper popup-profit" style={{ display: showGetMoney && isConnected ? "block" : "none" }}>
        <div class="popup-box-1">
          <div class="popup-profit-header" style={{ fontWeight: "bold" }}>Your Profit</div>
          <div class="popup-profit-time">
            <div class="popup-profit-time-icon" />
            <div class="popup-profit-time-text" style={{ fontWeight: "bold" }}>{pendingHours()} Hours</div>
          </div>
          <div style={{ fontSize: "16px", fontWeight: "bold" }} class="popup-profit-time-description">
            Don't forget to collect profit every 24 hours
          </div>
          <div class="popup-profit-figure" />
          <div class="popup-profit-money-bar">
            <div class="popup-profit-money-bar-icon" />
            <div class="popup-profit-money-bar-text">{pendingCash()}</div>
          </div>
          <button type="button" class="btn-green" style={{ marginTop: "5px", fontWeight: "bold" }}
            disabled={pendingTx || !isConnected}
            onClick={(e) => collectMoney(e)}
          >
            Collect
          </button>
        </div>
        <button type="button" class="popup-btn-close" onClick={() => setShowGetMoney(false)} />
      </div>

      <div class="popup-wrapper popup-upgrade" style={{ display: upgradeLevel > 0 && isConnected ? "block" : "none" }}>
        <div class="popup-box-2">
          <div class="popup-upgrade-header">House {upgradeLevel}</div>
          <div class="popup-upgrade-cover" />
          <div class="popup-upgrade-box">
            <div class="popup-upgrade-mini-box">
              <div class="popup-upgrade-mini-box-header">Level</div>
              <div class="popup-upgrade-mini-box-text">
                {enableValue() && upgradeLevel > 0 ? houseInfo.levels[upgradeLevel - 1] : 0} / 5
              </div>
              <div class="popup-upgrade-mini-box-added">
                {enableValue() && upgradeLevel > 0 && parseInt(houseInfo.levels[upgradeLevel - 1]) < 5 ? `+ 1` : ` + 0`}
              </div>
            </div>
            <div class="popup-upgrade-mini-box">
              <div class="popup-upgrade-mini-box-header">House Profit</div>
              <div class="popup-upgrade-mini-box-text">
                <span class="popup-upgrade-floor-profit">
                  {`${enableValue() && upgradeLevel > 0 ?
                    getHouseprofit(houseInfo.levels[upgradeLevel - 1], upgradeLevel - 1) :
                    0} / Hour`}
                </span>
                <div class="popup-upgrade-money-icon" />
              </div>
              <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">
                {`+ ${enableValue() && upgradeLevel > 0 && parseInt(houseInfo.levels[upgradeLevel - 1]) < 5 ?
                  yieldValues[houseInfo.levels[upgradeLevel - 1]][upgradeLevel - 1] :
                  0}`}
              </div>
            </div>
            <div class="popup-upgrade-mini-box">
              <div class="popup-upgrade-mini-box-header">Total Profit</div>
              <div class="popup-upgrade-mini-box-text">
                <span class="popup-upgrade-total-profit">{`${enableValue() ? houseInfo.yield : 0} / Hour`}</span>
                <div class="popup-upgrade-money-icon" />
              </div>
              <div class="popup-upgrade-mini-box-added popup-upgrade-mini-box-profit-added">
                {`+ ${enableValue() && upgradeLevel > 0 && parseInt(houseInfo.levels[upgradeLevel - 1]) < 5 ?
                  yieldValues[houseInfo.levels[upgradeLevel - 1]][upgradeLevel - 1] :
                  0}`}
              </div>
            </div>
          </div>
          <div class="popup-upgrade-info-text">
            {`House ${upgradeLevel} - `}
            {enableValue() && upgradeLevel > 0 ?
              (parseInt(houseInfo.levels[upgradeLevel - 1]) < 5 ?
                `Upgrade to Level ${parseInt(houseInfo.levels[upgradeLevel - 1]) + 1}` :
                `Top Level !!!`) :
              `Upgrade to Level 1`}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button class="btn-red btn-upgrade"
              disabled={
                pendingTx || !isConnected || upgradeLevel <= 0 ||
                (enableValue() && upgradeLevel > 0 && parseInt(houseInfo.levels[upgradeLevel - 1]) === 5)
              }
              onClick={(e) => upgradeHouse(e, upgradeLevel - 1)}>
              {enableValue() && upgradeLevel > 0 ? (
                parseInt(houseInfo.levels[upgradeLevel - 1]) < 5 ?
                  (
                    <div class="farm-coin" style={{ fontWeight: "bold", marginLeft: "-12px", paddingLeft: "30px", paddingTop: "2px" }}>
                      {price[parseInt(houseInfo.levels[upgradeLevel - 1])][upgradeLevel - 1]}
                    </div>
                  )
                  :
                  (
                    <div style={{ marginLeft: "-24px", fontWeight: "bold", fontSize: "16px" }}>TOP LEVEL</div>
                  )
              )
                : (<div>--</div>)}
            </button>
          </div>
        </div>
        <button type="button" class="popup-btn-close"
          style={{ marginTop: "-12px", marginLeft: "35px" }}
          onClick={() => setUpgradeLevel(0)} />
      </div>

      <div class="popup-wrapper popup-partners" style={{ display: showReferral && isConnected ? "block" : "none" }}>
        <div class="popup-box-1">
          <div class="popup-partners-header">Your link</div>
          <div class="popup-partners-input-wrapper">
            <input class="popup-partners-input" readonly="readonly" value={refLink} />
          </div>
          <button type="button"
            class="popup-partners-btn-copy"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(refLink)
                setIsTooltipDisplayed(true);
                setTimeout(() => {
                  setIsTooltipDisplayed(false);
                }, 3000);
              }
            }}
          >
            Copy
          </button>
          <div class="popup-partners-description">
            Get <span>7%</span>
            <div class="popup-partners-coin-icon" />{` and `}<span>3%</span>
            <div class="popup-partners-money-icon" />{` from each deposit of your partner.`}
          </div>
          <div class="popup-partners-header" style={{ marginTop: "15px" }}>Referral statistics</div>
          <div class="popup-partners-coins-bar">
            <div class="popup-partners-coins-bar-icon" />
            <div class="popup-partners-coins-bar-text">{enableValue() ? `+ ${houseInfo.refCoins}` : `+ 0`}</div>
          </div>
          <div class="popup-partners-money-bar">
            <div class="popup-partners-money-bar-icon" />
            <div class="popup-partners-money-bar-text">
              {enableValue() ? `+ ${houseInfo.refCoins * REFERRAL_CASH / REFERRAL_COIN}` : `+ 0`}
            </div>
          </div>
          <div class="popup-partners-users-bar">
            <div class="popup-partners-users-bar-icon" />
            <div class="popup-partners-users-bar-text">{enableValue() ? `+ ${houseInfo.refs}` : `+ 0`}</div>
          </div>
        </div>
        <div className="alert" style={{ opacity: isTooltipDisplayed ? 1 : 0 }}>Copied!</div>
        <button type="button" class="popup-btn-close" onClick={() => setShowReferral(false)} />
      </div>
    </>
  );
}

export default Home;
