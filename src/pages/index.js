import { useCallback, useEffect, useState } from "react";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import web3ModalSetup from "./../helpers/web3ModalSetup";
import Web3 from "web3";
import {
  getBurgerHouseContract,
  // REFERRAL_PERCENT,
  // WITHDRAW_FEE,
  // DENOMINATOR,
  // DENOMINATOR_PERCENT,
  // DECIMALS,
  // EPOCH_LENGTH,
  // BurgerHouse,
  // START_TIME,
  RPC_URL,
  MAINNET,
  ADMIN_ACCOUNT,
  ADMIN_ACCOUNT1,
  REF_PREFIX,
  // TREASURY,
  // WITHDRAW_TIME
} from "../constant";

const web3Modal = web3ModalSetup();

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    color: 'rgba(255, 255, 255, 0.8)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}));

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

    window.location.reload();
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

  // const refWithdraw = async (e) => {
  //   try {
  //     e.preventDefault();
  //     if (pendingTx) {
  //       setPendingMessage("Pending...")
  //       return
  //     }

  //     if (referralReward <= 0) {
  //       setPendingMessage("No Next Referral Rewards!")
  //       return
  //     }

  //     setPendingTx(true)
  //     if (isConnected && burgerHouseContract) {
  //       //  console.log("success")
  //       setPendingMessage("Referral Rewards withdrawing...")
  //       await burgerHouseContract.methods.withdrawReferral().send({
  //         from: curAcount,
  //       }).then((txHash) => {
  //         console.log(txHash)
  //         const txHashString = `${txHash.transactionHash}`
  //         const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
  //         setPendingMessage(`Withdraw Successfully! txHash is ${msgString}`);
  //       }).catch((err) => {
  //         console.log(err)
  //         setPendingMessage(`Withdraw Failed because ${err.message}`);
  //       });

  //     } else {
  //       // console.log("connect wallet");
  //     }
  //     setPendingTx(false)
  //   } catch (error) {
  //     setPendingTx(false)
  //   }
  // };

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

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark" style={{ marginTop: "30px" }}>
        <div className="container"
          style={{
            justifyContent: isMobile ? 'space-around' : 'space-between',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
          <div style={{ width: "200px" }}></div>
          {/* <div style={{ width: "200px", height: "140px" }}></div> */}
          <button className="btn btn-primary btn-lg btnd btn-custom"
            style={{ color: "#fff", width: "155px", fontWeight: "bold" }}
            disabled={pendingTx}
            onClick={isConnected ? logoutOfWeb3Modal : loadWeb3Modal}>
            <i className="fas fa-wallet" style={{ marginRight: "12px", color: "white" }}>
            </i>
            {connButtonText}
          </button>
        </div>
      </nav>
      <div className="container">
        {
          pendingMessage !== '' ?
            <>
              <center>
                <div className="alert alert-warning alert-dismissible" style={{ width: isMobile ? '270px' : '100%' }}>
                  <p onClick={closeBar} className="badge bg-dark" style={{ float: "right", cursor: "pointer" }}>X</p>
                  {pendingMessage}
                </div>
              </center>
            </> : <></>
        }
        {/* <div className="row">
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <center>
                  <h4 className="subtitle">TREASURY</h4>
                  <h4 className="value-text">{Number(treasuryAmount).toFixed(2)} BUSD</h4>
                </center>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <center>
                  <h4 className="subtitle">CURRENT APY</h4>
                  <h4 className="value-text">{curAPY / DENOMINATOR_PERCENT * 12}%</h4>
                </center>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <center>
                  <h4 className="subtitle">CURRENT EPOCH</h4>
                  <h4 className="value-text">{curEpoch}</h4>
                </center>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card">
              <div className="card-body">
                <center>
                  <h4 className="subtitle">CLAIM YIELD FEE</h4>
                  <h4 className="value-text">{WITHDRAW_FEE / DENOMINATOR_PERCENT}%</h4>
                </center>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      <br />
      {/* <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <div className="card cardDino">
              <div className="card-body">
                <h4 className="subtitle-normal" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <b>BANK</b>
                  <b style={{ color: "rgb(254 222 91)" }}>{Number(totalAmount).toFixed(2)} BUSD</b>
                </h4>
                <hr />
                <table className="table">
                  <tbody>
                    <tr>
                      <td><h5 className="content-text"><b>WALLET</b></h5></td>
                      <td style={{ textAlign: "right", width: "160px" }}><h5 className="value-text">{Number(userBalance).toFixed(2)} BUSD</h5></td>
                    </tr>
                    <tr>
                      <td><h5 className="content-text"><b>DEPOSITED</b></h5></td>
                      <td style={{ textAlign: "right" }}><h5 className="value-text">{Number(userDepositedAmount).toFixed(2)} BUSD</h5></td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          placeholder="100 BUSD"
                          min={0}
                          className="form-control input-box"
                          value={depositValue}
                          step={10}
                          onChange={(e) => setDepositValue(e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-primary btn-lg btn-custom" style={{ width: "123px" }}
                          onClick={Number.isNaN(parseFloat(depositValue)) || userApprovedAmount > parseFloat(depositValue) ? deposit : approve}
                          disabled={pendingTx}
                        >
                          {Number.isNaN(parseFloat(depositValue)) || userApprovedAmount > parseFloat(depositValue) ? 'DEPOSIT' : 'APPROVE'}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <br />
            <div className="card">
              <div className="card-body">
                <h4 className="subtitle-normal"><b>REFERRAL REWARDS  {REFERRAL_PERCENT / DENOMINATOR_PERCENT}%</b></h4>
                <hr />
                <table className="table">
                  <tbody>
                    <tr>
                      <td><h5 className="content-text">BUSD REWARDS</h5></td>
                      <td style={{ textAlign: "right" }}><h5 className="value-text">{Number(referralReward).toFixed(2)} BUSD</h5></td>
                    </tr>
                    <tr>
                      <td><h5 className="content-text">TOTAL</h5></td>
                      <td style={{ textAlign: "right" }}><h5 className="value-text">{Number(refTotalWithdraw).toFixed(2)} BUSD</h5></td>
                    </tr>
                  </tbody>
                </table>
                <center> <button className="btn btn-primary btn-lg btn-custom" onClick={refWithdraw} disabled={referralReward <= 0 || pendingTx}>WITHDRAW REWARDS</button> </center>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card cardDino">
              <div className="card-body">
                <h4 className="subtitle-normal"><b>CLAIM REWARDS</b></h4>
                <hr />
                <table className="table">
                  <tbody>
                    <tr>
                      <td><h5 className="content-text">TOTAL</h5></td>
                      <td style={{ textAlign: "right" }}>
                        <h5 className="value-text">
                          {Number(web3NoAccount.utils.fromWei(houseInfo && Object.keys(houseInfo).length > 0 ? houseInfo[5] : "0", DECIMALS)).toFixed(3)} BUSD
                        </h5>
                      </td>
                    </tr>
                    
                    <tr>
                      <td><h5 className="content-text">LAST CLAIM</h5></td>
                      <td style={{ textAlign: "right" }}>
                        <h5 className="value-text">{Number(web3NoAccount.utils.fromWei(houseInfo && Object.keys(houseInfo).length > 0 ? houseInfo[4] : "0", DECIMALS)).toFixed(3)} BUSD</h5>
                      </td>
                    </tr>
                    <tr>
                      <td><h5 className="content-text">ESTIMATED NEXT CLAIM</h5></td>
                      <td style={{ textAlign: "right" }}><h5 className="value-text">{Number(nextWithdraw).toFixed(3)} BUSD</h5></td>
                    </tr>
                  </tbody>
                </table>
                <center>
                  <button className="btn btn-primary btn-lg btn-custom" onClick={ClaimNow} disabled={pendingTx || nextWithdraw <= 0}>CLAIM</button>
                </center>
              </div>
            </div>
            <br />
            <div className="card" style={{ marginTop: "58px" }}>
              <div className="card-body">
                <h4 className="subtitle-normal"><b>REFERRAL LINK</b></h4>
                <hr />
                <form>
                  <span className="content-text13">Share your referral link to earn {REFERRAL_PERCENT / DENOMINATOR_PERCENT}% of BUSD </span>
                  <br />
                  <LightTooltip
                    PopperProps={{
                      disablePortal: true,
                    }}
                    open={isTooltipDisplayed}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={`Copied! ${refLink}`}
                    followCursor
                  >
                    <input type="text"
                      className="form-control input-box" readOnly
                      style={{ marginTop: "10px", fontSize: "15px" }}
                      value={refLink}
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(refLink)
                          setIsTooltipDisplayed(true);
                          setTimeout(() => {
                            setIsTooltipDisplayed(false);
                          }, 5000);
                        }
                      }} />
                  </LightTooltip>
                </form>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card">
              <div className="card-body">
                <h4 className="subtitle-normal">
                  <b>WITHDRAW</b>
                </h4>
                <hr />
                <table className="table">
                  <tbody>
                    <tr>
                      <td><h5 className="content-text">{withdrawState ? "Opening..." : "Remain Time:"}</h5></td>
                      <td style={{ textAlign: "right" }}>
                        <h5 className="value-text">
                          {displayRemainTime(remainTime)}
                        </h5>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h6 className="content-text" style={{ lineHeight: "20px" }}>
                          <b>ENABLE</b><br /><span className="value-text">{Number(enabledAmount).toFixed(2)} BUSD</span>
                        </h6>
                      </td>
                      <td style={{ textAlign: "right", width: "160px" }} >
                        <h6 className="content-text" style={{ lineHeight: "20px" }}>
                          <b>REQUESTED</b><br />
                          <span className="value-text">
                            {Number(web3NoAccount.utils.fromWei(houseInfo && Object.keys(houseInfo).length > 0 ? houseInfo[0] : "0", DECIMALS)).toFixed(2)} BUSD
                          </span>
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          placeholder="100 BUSD"
                          min={0}
                          className="form-control input-box"
                          value={withdrawRequestValue}
                          step={10}
                          onChange={(e) => setWithdrawRequestValue(e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-primary btn-lg btn-custom" style={{ width: "123px" }}
                          onClick={withdrawRequest}
                          disabled={pendingTx}
                        >
                          REQUEST
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="number"
                          placeholder="100 BUSD"
                          min={0}
                          className="form-control input-box"
                          value={withdrawValue}
                          step={10}
                          onChange={(e) => setWithdrawValue(e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-primary btn-lg btn-custom" style={{ width: "123px" }}
                          onClick={unStake}
                          disabled={
                            pendingTx ||
                            !withdrawState ||
                            Number.isNaN(withdrawValue) ||
                            parseFloat(withdrawValue) > enabledAmount ||
                            parseFloat(web3NoAccount.utils.fromWei(houseInfo && Object.keys(houseInfo).length > 0 ? houseInfo[0] : "0", DECIMALS))
                          }
                        >
                          WITHDRAW
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header" style={{ border: "none" }}>
                <h3 className="subtitle-normal">RETURN CALCULATOR</h3>
              </div>
              <div className="card-body" style={{ paddingTop: "0.6rem" }}>
                <div className="row">
                  <div className="col-sm-6">
                    <input
                      type="number"
                      placeholder="100 BUSD"
                      className="form-control input-box"
                      value={calculate}
                      step={10}
                      onChange={(e) => setCalculator(e.target.value)}
                    />
                    <br />
                    <p className="content-text18">Amount of returns calculated on the basis of deposit amount.
                      <br />
                      <b>Note:</b> Min deposit is 20 BUSD & max deposit is 25,000 BUSD.
                    </p>
                  </div>
                  <div className="col-sm-6" style={{ textAlign: "right" }}>
                    <h3 className="subtitle-normal" style={{ fontSize: "16px" }}>ROI</h3>
                    <p className="content-text">
                      DAILY RETURN: <span className="value-text">{Number(calculate * curAPY / DENOMINATOR / 30).toFixed(3)} BUSD</span> <br />
                      WEEKLY RETURN: <span className="value-text">{Number(calculate * curAPY / DENOMINATOR / 4.286).toFixed(3)} BUSD</span>  <br />
                      MONTHLY RETURN: <span className="value-text">{Number(calculate * curAPY / DENOMINATOR).toFixed(3)} BUSD</span>  <br />
                      Anual RETURN: <span className="value-text">{Number(calculate * curAPY / DENOMINATOR * 12).toFixed(3)} BUSD</span> </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
      </div> */}
    </>);
}

export default Home;
