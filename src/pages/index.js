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

const price =
  [
    [500, 1500, 4500, 13500, 40500, 120000, 365000, 1000000],
    [625, 1800, 5600, 16800, 50600, 150000, 456000, 1200000],
    [780, 2300, 7000, 21000, 63200, 187000, 570000, 1560000],
    [970, 3000, 8700, 26000, 79000, 235000, 713000, 2000000],
    [1200, 3600, 11000, 33000, 98800, 293000, 890000, 2500000],
  ]

const yeild =
  [
    [123, 390, 1197, 3585, 11250, 34200, 108600, 312000],
    [156, 471, 1494, 4590, 14100, 42900, 136500, 379500],
    [195, 603, 1875, 5760, 17700, 53700, 171600, 501000],
    [246, 792, 2340, 7140, 22200, 68100, 217500, 649500],
    [309, 954, 2985, 9015, 27900, 86100, 274500, 825000],
  ]

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
  const [connButtonText, setConnButtonText] = useState("CONNECT");

  const [refetch, setRefetch] = useState(true);

  const [pendingMessage, setPendingMessage] = useState('');
  const [pendingTx, setPendingTx] = useState(false);
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const [refLink, setRefLink] = useState(`${REF_PREFIX}0x0000000000000000000000000000000000000000`);
  const [depositValue, setDepositValue] = useState('');
  const [withdrawValue, setWithdrawValue] = useState('');

  const [userBalance, setUserBalance] = useState(0);
  const [houseInfo, setHouseInfo] = useState({});

  const [allHousesLength, setAllHousesLength] = useState(0)
  const [totalInvested, setTotalInvested] = useState(0)
  const [totalUpgrades, setTotalUpgrades] = useState(0)

  const [blockTimestamp, setBlockTimestamp] = useState(0)

  const [showBuyCoins, setShowBuyCoins] = useState(false)
  const [showGetBNB, setShowGetBNB] = useState(false)

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

    // window.location.reload();
  };
  const loadWeb3Modal = useCallback(async () => {
    // console.log("Connecting Wallet...");
    const provider = await web3Modal.connect();
    // console.log("provider: ", provider);
    setInjectedProvider(new Web3(provider));
    const acc = provider.selectedAddress
      ? provider.selectedAddress
      : provider.accounts[0];
    const short = shortenAddr(acc);

    setWeb3(new Web3(provider));
    setBurgerHouseContract(getBurgerHouseContract(new Web3(provider)));
    // setAccounts([acc]);
    setCurAcount(acc);
    //     setShorttened(short);
    setIsConnected(true);

    setConnButtonText(short);

    provider.on("chainChanged", (chainId) => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new Web3(provider));
      logoutOfWeb3Modal();
    });

    provider.on("accountsChanged", () => {
      console.log(`curAcount changed!`);
      setInjectedProvider(new Web3(provider));
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
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }

    // eslint-disable-next-line
  }, []);

  const shortenAddr = (addr) => {
    if (!addr) return "";
    const first = addr.substr(0, 5);
    const last = addr.substr(38, 41);
    return first + "..." + last;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _blockTimestamp = (await web3NoAccount.eth.getBlock('latest')).timestamp;
        setBlockTimestamp(_blockTimestamp);

        const _totalUpgrades = await contractNoAccount.methods.totalUpgrades().call();
        setTotalUpgrades(_totalUpgrades);

        const _totalInvested = await contractNoAccount.methods.totalInvested().call();
        setTotalInvested(_totalInvested);

        const _allHousesLength = await contractNoAccount.methods.allHousesLength().call();
        setAllHousesLength(_allHousesLength)

        if (curAcount) {
          const refLink = `${REF_PREFIX}${curAcount}`;
          setRefLink(refLink);
        }

        if (isConnected && burgerHouseContract && curAcount) {
          const houseInfo = await contractNoAccount.methods.houses(curAcount).call();
          setHouseInfo(houseInfo)
        }
      } catch (error) {
        console.log('fetchData error: ', error);
      }
    };

    fetchData();
  }, [isConnected, web3, burgerHouseContract, refetch, curAcount]);

  // buttons

  const ClaimNow = async (e) => {
    try {
      e.preventDefault();
      if (pendingTx) {
        setPendingMessage("Pending...")
        return
      }

      // if (nextWithdraw <= 0) {
      //   setPendingMessage("No Next Rewards!")
      //   return
      // }

      // setPendingTx(true)
      // if (isConnected && burgerHouseContract) {
      //   //  console.log("success")
      //   setPendingMessage("Claiming...")
      //   burgerHouseContract.methods.withdraw("0").send({
      //     from: curAcount,
      //   }).then((txHash) => {
      //     console.log(txHash)
      //     const txHashString = `${txHash.transactionHash}`
      //     const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
      //     setPendingMessage(`Claimed Successfully! txHash is ${msgString}`);
      //   }).catch((err) => {
      //     console.log(err)
      //     setPendingMessage(`Claim Failed because ${err.message}`);
      //   });

      // } else {
      //   // console.log("connect wallet");
      // }
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  };

  const closeBar = async (e) => {
    e.preventDefault();
    setPendingMessage('');
  }

  const deposit = async (e) => {
    try {
      e.preventDefault();
      if (pendingTx) {
        setPendingMessage("Pending...")
        return
      }

      // if (Number.isNaN(parseFloat(depositValue))) {
      //   setPendingMessage("Input Deposit Amount!")
      //   return
      // }

      // if (parseFloat(depositValue) > userBalance) {
      //   setPendingMessage("Deposit amount must be equal or less than your wallet balance!")
      //   return
      // }

      // if (parseFloat(depositValue) < 0) {
      //   setPendingMessage("Deposit amount must be equal or greater than 0 BUSD!")
      //   return
      // }

      // setPendingTx(true)
      // if (isConnected && burgerHouseContract) {
      //   // console.log("success")

      //   setPendingMessage("Depositing...")
      //   const _value = web3NoAccount.utils.toWei(depositValue, DECIMALS);
      //   console.log("[PRINCE](deposit): ", _value)

      //   let referrer = window.localStorage.getItem("REFERRAL");
      //   referrer = isAddress(referrer, MAINNET) ? referrer : ADMIN_ACCOUNT

      //   await burgerHouseContract.methods.deposit(_value, referrer).send({
      //     from: curAcount
      //   }).then((txHash) => {
      //     console.log(txHash)
      //     const txHashString = `${txHash.transactionHash}`
      //     const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
      //     setPendingMessage(`Deposited Successfully! txHash is ${msgString}`);
      //   }).catch((err) => {
      //     console.log(err)
      //     setPendingMessage(`Deposited Failed because ${err.message}`);
      //   });
      // }
      // else {
      //   // console.log("connect wallet");
      // }
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  };

  const unStake = async (e) => {
    console.log('[PRINCE](unStake)')
    try {
      e.preventDefault();
      if (pendingTx) {
        setPendingMessage("Pending...")
        return
      }

      // if (Number.isNaN(parseFloat(withdrawValue))) {
      //   setPendingMessage("Input Withdraw Amount!")
      //   return
      // }

      // if (parseFloat(withdrawValue) > userDepositedAmount) {
      //   setPendingMessage("Withdraw amount must be less than your deposited amount!")
      //   return
      // }

      // setPendingTx(true)
      // if (isConnected && burgerHouseContract) {
      //   setPendingMessage("Unstaking...");
      //   const _withdrawValue = web3NoAccount.utils.toWei(withdrawValue, DECIMALS);
      //   console.log("[PRINCE](withdraw): ", _withdrawValue)
      //   await burgerHouseContract.methods.withdraw(_withdrawValue).send({
      //     from: curAcount,
      //   }).then((txHash) => {
      //     console.log(txHash)
      //     const txHashString = `${txHash.transactionHash}`
      //     const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
      //     setPendingMessage(`UnStaked Successfully! txHash is ${msgString}`);
      //   }).catch((err) => {
      //     console.log(err)
      //     setPendingMessage(`UnStaked Failed because ${err.message}`);
      //   });
      // }
      // else {
      //   // console.log("connect Wallet");
      // }
      setPendingTx(false)
    } catch (error) {
      setPendingTx(false)
    }
  };

  const addCoins = async (e) => {

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
                  <div class="menu-bar-coin"></div>
                  <div class="menu-bar-value menu-bar-money-value">0.00</div>
                  <button type="button" class="menu-bar-btn-plus" onClick={() => setShowBuyCoins(true)} />
                </div>
                <div class="menu-bar">
                  <div class="menu-bar-gas"></div>
                  <div class="menu-bar-value menu-bar-money-value">0.00</div>
                  <button type="button" class="menu-bar-btn-minus" onClick={() => setShowBuyCoins(true)} />
                </div>
                <div class="menu-bar fc-bar">
                  <div class="menu-bar-money"></div>
                  <div class="menu-bar-value menu-bar-money-value">0.00</div>
                </div>
                <div class="menu-bar fc-bar ls-bar">
                  <div class="menu-bar-market"></div>
                  <div class="menu-bar-value menu-bar-money-value">0.00</div>
                </div>
                <div class="menu-bar">
                  <div class="menu-bar-peso"></div>
                  <div class="menu-bar-value menu-bar-money-value">1 CASH = ₱ 0.75</div>
                </div>
                <div class="menu-bar">
                  <div class="menu-bar-exchange"></div>
                  <div class="menu-bar-value menu-bar-money-value sell-allotment" id="allotment_amount">₱ 2,500,000</div>
                </div>
              </div>
            </div>
            <div class="menu-fixed-right">
              <div class="menu-btns">
                <button class="menu-btn-red" id="send_cash" data-bs-placement="right" data-bs-toggle="tooltip" title="Send FC/LC">
                  <i class="fa fa-money-bill-wave"></i>
                </button>
                <button class="menu-btn menu-btn-leaderboard" data-bs-placement="right" data-bs-toggle="tooltip" title="Leaderboard">
                  <i class="fa fa-trophy"></i>
                </button>
                <button class="menu-btn menu-btn-affiliate" data-bs-placement="right" data-bs-toggle="tooltip" title="Affiliate"  >
                  <i class="fa fa-users"></i>
                </button>
                <button class="menu-btn menu-btn-transactions" data-bs-placement="right" data-bs-toggle="tooltip" title="Transactions">
                  <i class="fa fa-cubes"></i>
                </button>
                <button class="menu-btn menu-btn-logs" data-bs-placement="right" data-bs-toggle="tooltip" title="Logs">
                  <i class="fa fa-money-check"></i>
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
                <div class="barn">
                  <div class="barn-1 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn" data-toggle="modal" data-target="#upgradeHouse">
                      <div class="farm-coin" >&nbsp;</div>
                      500
                    </button>
                  </div>
                </div>
                <div class="barn">
                  <div class="barn-2 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      1500
                    </button>
                  </div>
                </div>
                <div class="barn">
                  <div class="barn-3 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      4500
                    </button>
                  </div>
                </div>
                <div class="barn">
                  <div class="barn-4 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      13.5K
                    </button>
                  </div>
                </div>
              </div >
              <div class="barns">
                <div class="barn">
                  <div class="barn-5 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      40.5K
                    </button>
                  </div>
                </div>
                <div class="barn">
                  <div class="barn-6 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      120K
                    </button>
                  </div>
                </div>
                <div class="barn">
                  <div class="barn-7 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      365K
                    </button>
                  </div>
                </div>
                <div class="barn">
                  <div class="barn-8 barn-grey-100"></div>
                  <div class="barn-action">
                    <button class="btn-red btn-buy-barn">
                      <div class="farm-coin">&nbsp;</div>
                      1M
                    </button>
                  </div>
                </div>
              </div >
            </>
            :
            <div className="login-action">
              <button type="button" class="btn-green btn-login" onClick={loadWeb3Modal}>Connect</button>
            </div>
          }
        </div >
      </div >

      <div class="popup-wrapper popup-buy popup-exchange" id="buyCoins" style={{ display: showBuyCoins ? "block" : "none" }}>
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
            <input style={{ fontSize: "20px" }} name="coin" type="number" inputmode="decimal" placeholder="0.0" class="popup-buy-input popup-buy-input-coin" />
          </div>
          <div class="popup-buy-arrow">
            <i class="fa-solid fa-arrow-down"></i>
          </div>
          <div class="popup-buy-text-container" style={{ marginTop: "0px" }}>
            <div class="popup-buy-text-ticker">
              <div class="popup-buy-coin-icon"></div>
              FARM CASH
            </div>
          </div>
          <div class="popup-buy-input-wrapper">
            <input style={{ fontSize: "20px" }} type="number" inputmode="decimal" placeholder="0" class="popup-buy-input popup-buy-input-cash" />
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
        <button type="button" class="popup-btn-close popup-btn-close-3" onClick={() => setShowBuyCoins(false)} />
      </div>

      <div class="modal" id="upgradeHouse">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">upgradeHouse</h4>
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
                  <button class="btn-red btn-upgrade" onClick={unStake}>
                    <div class="farm-coin" >&nbsp;</div>
                    500
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
