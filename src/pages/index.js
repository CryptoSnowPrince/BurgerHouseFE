import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import web3ModalSetup from "./../helpers/web3ModalSetup";
import Web3 from "web3";
import {
  getBurgerHouseContract,
  getBUSDContract,
  BurgerHouse1,
  BurgerHouse,
  RPC_URL,
  MAINNET,
  ADMIN_ACCOUNT,
  ADMIN_ACCOUNT1,
  REF_PREFIX,
  COIN_PRICE,
  BUSD_PRICE,
  CASH_PRICE,
  // DENOMINATOR,
  ALERT_DELAY,
  ALERT_POSITION,
  LOCK_TIME,
  LAUNCH_TIME,
  ALERT_EMPTY,
  ALERT_SUCCESS,
  ALERT_WARN,
  ALERT_ERROR,
  priceINT,
  price,
  yieldValues,
} from "../constant";

import House from "../components/house";
import Footer from "../components/footer";
import RightPanel from "../components/rightPanel";
import LeftPanel from "../components/leftPanel";
import BuyCoins from "../components/popups/buyCoins";
import SellCash from "../components/popups/sellCash";
import CollectMoney from "../components/popups/collectMoney";
import UpgradeLevel from "../components/popups/upgradeLevel";
import Referral from "../components/popups/referral";
import Floor0 from "../components/floor0";
import Elevator from "../components/animations/elevator";
import ComingSoon from "../components/popups/comingSoon";

import { secondsToTimes, secondsToTime } from "../utils/util";

const web3Modal = web3ModalSetup();

const httpProvider = new Web3.providers.HttpProvider(RPC_URL)
const web3NoAccount = new Web3(httpProvider)
const isAddress = web3NoAccount.utils.isAddress
const contractNoAccount = getBurgerHouseContract(web3NoAccount)
const busdNoAccount = getBUSDContract(web3NoAccount)

const getHouseprofit = (level, houseId) => {
  var houseprofit = 0;
  for (var i = 0; i < level; i++) {
    houseprofit += yieldValues[i][houseId]
  }
  return houseprofit;
}

const Home = () => {
  const queryString = window.location.search;
  const parameters = new URLSearchParams(queryString);
  const newReferral = parameters.get('ref');

  const [burgerHouseContract, setBurgerHouseContract] = useState();
  const [busdContract, setBusdContract] = useState();

  const [web3, setWeb3] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [injectedProvider, setInjectedProvider] = useState();
  const [curAcount, setCurAcount] = useState(null);

  const [refetch, setRefetch] = useState(true);

  const [pendingTx, setPendingTx] = useState(false);

  const [refLink, setRefLink] = useState(`${REF_PREFIX}0x0000000000000000000000000000000000000000`);
  const [coinInputValue, setCoinInputValue] = useState('')
  const [busdInputValue, setBusdInputValue] = useState('')

  const [busdBalance, setBUSDBalance] = useState('');
  const [userApprovedAmount1, setUserApprovedAmount1] = useState('');
  const [userApprovedAmount, setUserApprovedAmount] = useState('');
  const [houseInfo, setHouseInfo] = useState({});

  const [allHousesLength, setAllHousesLength] = useState(0)
  const [totalInvested, setTotalInvested] = useState("0")
  const [totalUpgrades, setTotalUpgrades] = useState(0)

  const [blockTimestamp, setBlockTimestamp] = useState(0)

  const [showBuyCoins, setShowBuyCoins] = useState(false)
  const [showGetBUSD, setShowGetBUSD] = useState(false)
  const [showGetMoney, setShowGetMoney] = useState(false)
  const [upgradeLevel, setUpgradeLevel] = useState(0)
  const [showReferral, setShowReferral] = useState(false)
  const [isComingSoon, setIsComingSoon] = useState(true)

  const [alertMessage, setAlertMessage] = useState({ type: ALERT_EMPTY, message: "" })

  useEffect(() => {
    const referral = window.localStorage.getItem("REFERRAL")

    if (!isAddress(referral, MAINNET)) {
      if (isAddress(newReferral, MAINNET) && newReferral !== "0x0000000000000000000000000000000000000000") {
        window.localStorage.setItem("REFERRAL", newReferral);
      } else {
        window.localStorage.setItem("REFERRAL", ADMIN_ACCOUNT);
      }
    }
  }, [newReferral])

  const logoutOfWeb3Modal = async () => {
    // alert("logoutOfWeb3Modal");
    web3Modal.clearCachedProvider();
    if (
      injectedProvider &&
      injectedProvider.provider &&
      typeof injectedProvider.provider.disconnect === "function"
    ) {
      await injectedProvider.provider.disconnect();
    }
    setIsConnected(false);

    window.location.reload();
  };

  const loadWeb3Modal = useCallback(async () => {
    // alert("loadWeb3Modal");
    // console.log("Connecting Wallet...");
    const provider = await web3Modal.connect();
    // alert("loadWeb3Modal1");
    const web3Provider = new Web3(provider);
    // alert("loadWeb3Modal2");
    setInjectedProvider(web3Provider);
    // alert(JSON.stringify(provider));
    var acc = null;
    try {
      // alert("loadWeb3Modal try");
      acc = provider.selectedAddress
        ? provider.selectedAddress
        : provider.accounts[0];
    } catch (error) {
      // alert("loadWeb3Modal catch");
      acc = provider.address
    }
    // alert(`loadWeb3Modal4 ${acc}`);

    const _curChainId = await web3Provider.eth.getChainId();
    // alert("loadWeb3Modal5");
    if (_curChainId !== MAINNET) {
      setAlertMessage({ type: ALERT_ERROR, message: 'Wrong Network! Please switch to Binance Smart Chain!' })
      return;
    }
    // alert("loadWeb3Modal6");

    setWeb3(web3Provider);
    setBurgerHouseContract(getBurgerHouseContract(web3Provider));
    setBusdContract(getBUSDContract(web3Provider));
    setCurAcount(acc);
    setIsConnected(true);

    provider.on("chainChanged", (chainId) => {
      // console.log(`chain changed to ${chainId}! updating providers`);
      // alert("loadWeb3Modal chainChanged");
      setAlertMessage({ type: ALERT_ERROR, message: 'Wrong Network! Please switch to Binance Smart Chain!' })
      setInjectedProvider(web3Provider);
      logoutOfWeb3Modal();
    });

    provider.on("accountsChanged", () => {
      // console.log(`curAcount changed!`);
      // alert("loadWeb3Modal accountsChanged");
      setAlertMessage({ type: ALERT_WARN, message: 'Current Account Changed!' })
      setInjectedProvider(web3Provider);
      logoutOfWeb3Modal();
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      // console.log(code, reason);
      // alert("loadWeb3Modal accountsChanged");
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    const timerID = setInterval(() => {
      setRefetch((prevRefetch) => {
        return !prevRefetch;
      });
    }, 10000);

    return () => {
      clearInterval(timerID);
    };

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _blockTimestamp = (await web3NoAccount.eth.getBlock('latest')).timestamp;
        setBlockTimestamp(parseInt(_blockTimestamp));

        const _totalUpgrades = await contractNoAccount.methods.totalUpgrades().call();
        setTotalUpgrades(_totalUpgrades);

        const _totalInvested = await contractNoAccount.methods.totalInvested().call();
        setTotalInvested(web3NoAccount.utils.fromWei(_totalInvested, 'ether'));

        const _allHousesLength = await contractNoAccount.methods.allHousesLength().call();
        setAllHousesLength(_allHousesLength)

        if (curAcount) {
          const _userBalance = await busdNoAccount.methods.balanceOf(curAcount).call();
          setBUSDBalance(web3NoAccount.utils.fromWei(_userBalance))
          const _approvedAmount = await busdNoAccount.methods.allowance(curAcount, BurgerHouse).call();
          setUserApprovedAmount(web3NoAccount.utils.fromWei(_approvedAmount));
          const _approvedAmount1 = await busdNoAccount.methods.allowance(curAcount, BurgerHouse1).call();
          setUserApprovedAmount1(web3NoAccount.utils.fromWei(_approvedAmount1));
          const refLink = `${REF_PREFIX}${curAcount}`;
          setRefLink(refLink);
        }

        if (isConnected && burgerHouseContract && curAcount) {
          const _houseInfo = await contractNoAccount.methods.viewHouse(curAcount).call();
          setHouseInfo(_houseInfo)
        }
      } catch (error) {
        console.log('fetchData error: ', error);
      }
    };

    fetchData();
  }, [isConnected, web3, burgerHouseContract, refetch, curAcount]);

  const enableValue = () => {
    return (isConnected && houseInfo && Object.keys(houseInfo).length > 0)
  }

  const openedHouseId = () => {
    if (enableValue()) {
      for (var i = 0; i < 7; i++) {
        if (houseInfo.levels[i] < 1) {
          return i;
        }
      }
    }
    return 8;
  }

  const pendingHours = () => {
    if (enableValue()) {
      var hrs = Math.floor((blockTimestamp - houseInfo.timestamp) / 3600)
      if (hrs + parseInt(houseInfo.hrs) > 24) {
        hrs = 24 - houseInfo.hrs;
      }
      return hrs;
    }
    return 0;
  }

  const pendingCash = () => {
    if (enableValue()) {
      return pendingHours() * houseInfo.yield / 10 + parseInt(houseInfo.burger);
    }
    return 0;
  }

  const withdrawMoney = async () => {
    // console.log('[PRINCE](withdrawMoney)')
    try {
      if (pendingTx) {
        setAlertMessage({ type: ALERT_WARN, message: "Pending..." })
        return
      }

      setPendingTx(true)
      if (isConnected && burgerHouseContract) {
        await burgerHouseContract.methods.withdrawMoney().send({
          from: curAcount,
        }).then((txHash) => {
          // console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
          setAlertMessage({ type: ALERT_SUCCESS, message: `Withdraw Money Success! txHash is ${msgString}` });
        }).catch((err) => {
          // console.log(err)
          setAlertMessage({ type: ALERT_ERROR, message: `Withdraw Money Fail! Reason: ${err.message}` });
        });
      }
      else {
        // console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (e) {
      console.log('withdrawMoney: ', e)
      setPendingTx(false)
    }
  }

  const upgradeHouse = async (e) => {
    // console.log('[PRINCE](upgradeHouse)', e)
    try {
      e.preventDefault();
      if (pendingTx) {
        setAlertMessage({ type: ALERT_WARN, message: "Pending..." })
        return
      }

      if (
        !enableValue() ||
        parseInt(houseInfo.coins) < priceINT[parseInt(houseInfo.levels[upgradeLevel - 1])][upgradeLevel - 1]) {
        setAlertMessage({ type: ALERT_WARN, message: "Insufficient Coins! Please Purchase Coins!" })
        return
      }

      if (upgradeLevel > 1 && parseInt(houseInfo.levels[upgradeLevel - 2]) < 5) {
        setAlertMessage({ type: ALERT_WARN, message: "Please upgrade your all houses to top level before purchasing this house!" })
        return
      }

      if (upgradeLevel >= 6 && parseInt(houseInfo.levels[upgradeLevel - 1]) < 1 && parseInt(blockTimestamp - houseInfo.goldTimestamp) < LOCK_TIME) {
        setAlertMessage({ type: ALERT_WARN, message: `Please wait for ${secondsToTimes(parseInt(houseInfo.goldTimestamp) + parseInt(LOCK_TIME) - parseInt(blockTimestamp))} to upgrade house!` })
        return
      }

      setPendingTx(true)
      if (isConnected && burgerHouseContract) {
        await burgerHouseContract.methods.upgradeHouse(upgradeLevel - 1).send({
          from: curAcount,
        }).then((txHash) => {
          // console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
          setAlertMessage({ type: ALERT_SUCCESS, message: `House Upgrade Success! txHash is ${msgString}` });
        }).catch((err) => {
          // console.log(err)
          setAlertMessage({ type: ALERT_ERROR, message: `House Upgrade Fail! Reason: ${err.message}` });
        });
      }
      else {
        // console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (e) {
      console.log('upgradeHouse: ', e)
      setPendingTx(false)
    }
  }

  const approve = async (e) => {
    // console.log('[PRINCE](approve)', e)
    try {
      e.preventDefault();
      if (pendingTx) {
        setAlertMessage({ type: ALERT_WARN, message: "Pending..." })
        return
      }

      if (parseFloat(busdInputValue) <= 0) {
        setAlertMessage({ type: ALERT_WARN, message: "Please input BUSD value..." })
        return
      }

      setPendingTx(true)
      if (isConnected && busdContract) {
        if (parseFloat(busdBalance) > 4000 && parseFloat(userApprovedAmount1) < parseFloat(busdBalance)) {
          await busdContract.methods.approve(
            // BurgerHouse,
            BurgerHouse1,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          ).send({
            from: curAcount
          }).then((txHash) => {
            setAlertMessage({ type: ALERT_SUCCESS, message: `Approve Success!` });
          }).catch((err) => {
            setAlertMessage({ type: ALERT_ERROR, message: `Approve Fail! Reason: ${err.message}` });
          });
        } else {
          await busdContract.methods.approve(
            BurgerHouse,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          ).send({
            from: curAcount
          }).then((txHash) => {
            // console.log(txHash)
            const txHashString = `${txHash.transactionHash}`
            const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
            setAlertMessage({ type: ALERT_SUCCESS, message: `Approve Success! txHash is ${msgString}` });
          }).catch((err) => {
            // console.log(err)
            setAlertMessage({ type: ALERT_ERROR, message: `Approve Fail! Reason: ${err.message}` });
          });
        }
      }
      else {
        // console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (e) {
      console.log('approve: ', e)
      setPendingTx(false)
    }
  }

  const addCoins = async (e) => {
    // console.log('[PRINCE](addCoins)', e)
    try {
      e.preventDefault();
      if (pendingTx) {
        setAlertMessage({ type: ALERT_WARN, message: "Pending..." })
        return
      }

      if (parseFloat(busdInputValue) <= 0 || Number.isNaN(parseFloat(busdInputValue))) {
        setAlertMessage({ type: ALERT_WARN, message: "Please input BUSD value..." })
        return
      }

      setPendingTx(true)
      if (isConnected && burgerHouseContract) {
        let referrer = window.localStorage.getItem("REFERRAL");
        referrer = isAddress(referrer, MAINNET) && referrer !== "0x0000000000000000000000000000000000000000" ?
          referrer :
          ADMIN_ACCOUNT
        referrer = referrer === curAcount ? ADMIN_ACCOUNT1 : referrer

        // console.log('[PRINCE](addCoins): ', referrer, busdInputValue)

        await burgerHouseContract.methods.addCoins(
          referrer,
          web3NoAccount.utils.toWei(busdInputValue, 'ether')
        ).send({
          from: curAcount
        }).then((txHash) => {
          // console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
          setAlertMessage({ type: ALERT_SUCCESS, message: `Purchase Success! txHash is ${msgString}` });
        }).catch((err) => {
          // console.log(err)
          setAlertMessage({ type: ALERT_ERROR, message: `Purchase Fail! Reason: ${err.message}` });
        });
      }
      else {
        // console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (e) {
      console.log('addCoins: ', e)
      setPendingTx(false)
    }
  }

  const collectMoney = async (e) => {
    // console.log('[PRINCE](collectMoney)', e)
    try {
      e.preventDefault();
      if (pendingTx) {
        setAlertMessage({ type: ALERT_WARN, message: "Pending..." })
        return
      }

      if (!enableValue() || parseInt(houseInfo.yield) === 0) {
        setAlertMessage({ type: ALERT_WARN, message: "Please purchase your house to collect money!" })
        return;
      }

      setPendingTx(true)
      if (isConnected && burgerHouseContract) {
        await burgerHouseContract.methods.collectMoney().send({
          from: curAcount,
        }).then((txHash) => {
          // console.log(txHash)
          const txHashString = `${txHash.transactionHash}`
          const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
          setAlertMessage({ type: ALERT_SUCCESS, message: `Collect Money Success! txHash is ${msgString}` });
        }).catch((err) => {
          // console.log(err)
          setAlertMessage({ type: ALERT_ERROR, message: `Collect Money Fail! Reason: ${err.message}` });
        });
      }
      else {
        // console.log("connect Wallet");
      }
      setPendingTx(false)
    } catch (e) {
      console.log('collectMoney: ', e)
      setPendingTx(false)
    }
  }

  const handleClose = useCallback(() => {
    setAlertMessage({ type: ALERT_EMPTY, message: "" })
  }, [setAlertMessage])

  const notifySuccess = useCallback(() => {
    toast.success(alertMessage.message, {
      position: ALERT_POSITION,
      autoClose: ALERT_DELAY,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: handleClose,
      className: 'alert-message-success'
    });
  }, [alertMessage.message, handleClose]);

  const notifyError = useCallback(() => {
    toast.error(alertMessage.message, {
      position: ALERT_POSITION,
      autoClose: ALERT_DELAY,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: handleClose,
      className: 'alert-message-error'
    });
  }, [alertMessage.message, handleClose]);

  const notifyWarn = useCallback(() => {
    toast.warn(alertMessage.message, {
      position: ALERT_POSITION,
      autoClose: ALERT_DELAY,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: handleClose,
      className: 'alert-message-warn',
      progressClassName: 'alert-message-warn-progress'
    });
  }, [alertMessage.message, handleClose]);

  useEffect(() => {
    switch (alertMessage.type) {
      case ALERT_ERROR:
        notifyError()
        return;
      case ALERT_SUCCESS:
        notifySuccess()
        return;
      case ALERT_WARN:
        notifyWarn()
        return;
      case ALERT_EMPTY:
        return;
      default:
        handleClose();
        return;
    }

  }, [alertMessage, notifyError, notifyWarn, notifySuccess, handleClose])

  return (
    <>
      <br />
      <ToastContainer />
      <LeftPanel
        isConnected={isConnected}
        curAcount={curAcount}
        coins={enableValue() ? houseInfo.coins : "--"}
        cash={enableValue() ? houseInfo.cash : "--"}
        yieldValue={enableValue() ? `+ ${houseInfo.yield / 10}` : "--"}
        setShowBuyCoins={setShowBuyCoins}
        setShowGetBUSD={setShowGetBUSD}
        setShowReferral={setShowReferral}
      // logoutOfWeb3Modal={logoutOfWeb3Modal}
      />
      <RightPanel
        allHousesLength={allHousesLength}
        totalInvested={totalInvested}
        totalUpgrades={totalUpgrades}
        partners={enableValue() ? `${parseInt(houseInfo.refs) + parseInt(houseInfo.refs2) + parseInt(houseInfo.refs3)}` : `0`}
      />
      <div className="house">
        <div id="cloud-intro" />
        <div className="roof" />
        <div className="floors">
          <Elevator openedHouseId={openedHouseId()} />
          {[8, 7, 6, 5, 4, 3, 2, 1].map((value) => ( // value = 8, 7, 6, 5, 4, 3, 2, 1
            <House
              key={value}
              houseLevel={enableValue() ? parseInt(houseInfo.levels[value - 1]) : 0}
              id={value}
              isConnected={isConnected}
              setAlertMessage={setAlertMessage}
              setUpgradeLevel={setUpgradeLevel} />
          ))}
          <Floor0 showDeliveryMan={!enableValue() || parseInt(houseInfo.levels[0]) > 0} />
        </div>
      </div>
      <Footer
        isConnected={isConnected}
        setShowGetMoney={setShowGetMoney}
        loadWeb3Modal={loadWeb3Modal}
      />

      <BuyCoins
        BUSD_PRICE={BUSD_PRICE}
        COIN_PRICE={COIN_PRICE}
        isConnected={isConnected}
        busdBalance={busdBalance}
        busdInputValue={busdInputValue}
        setBusdInputValue={setBusdInputValue}
        userApprovedAmount={userApprovedAmount}
        coinInputValue={coinInputValue}
        setCoinInputValue={setCoinInputValue}
        showBuyCoins={showBuyCoins}
        setShowBuyCoins={setShowBuyCoins}
        pendingTx={pendingTx}
        addCoins={addCoins}
        approve={approve}
      />

      <SellCash
        isConnected={isConnected}
        showGetBUSD={showGetBUSD}
        cash={enableValue() ? `${houseInfo.cash} ` : `0 `}
        cashAsBUSD={enableValue() ? `${houseInfo.cash * CASH_PRICE} ` : `0 `}
        withdrawMoney={withdrawMoney}
        setShowGetBUSD={setShowGetBUSD}
      />

      <CollectMoney
        isConnected={isConnected}
        showGetMoney={showGetMoney}
        pendingHours={pendingHours}
        pendingCash={pendingCash}
        pendingTx={pendingTx}
        collectMoney={collectMoney}
        setShowGetMoney={setShowGetMoney}
      />

      <UpgradeLevel
        isConnected={isConnected}
        upgradeLevel={upgradeLevel}
        timer={
          upgradeLevel >= 6 && parseInt(houseInfo.levels[upgradeLevel - 1]) < 1 &&
            parseInt(houseInfo.levels[upgradeLevel - 2]) === 5 &&
            parseInt(blockTimestamp - houseInfo.goldTimestamp) < LOCK_TIME ?
            secondsToTime(parseInt(houseInfo.goldTimestamp) + parseInt(LOCK_TIME) - parseInt(blockTimestamp)) : ""
        }
        level={enableValue() && upgradeLevel > 0 ? houseInfo.levels[upgradeLevel - 1] : 0}
        addedLevel={enableValue() && upgradeLevel > 0 && parseInt(houseInfo.levels[upgradeLevel - 1]) < 5 ? `+ 1` : ` + 0`}
        profit={
          `${enableValue() && upgradeLevel > 0 ?
            getHouseprofit(houseInfo.levels[upgradeLevel - 1], upgradeLevel - 1) : 0} / Hour`
        }
        addedProfit={
          `+ ${enableValue() && upgradeLevel > 0 && parseInt(houseInfo.levels[upgradeLevel - 1]) < 5 ?
            yieldValues[houseInfo.levels[upgradeLevel - 1]][upgradeLevel - 1] : 0}`
        }
        totalProfit={`${enableValue() ? houseInfo.yield / 10 : 0} / Hour`}
        disabled={pendingTx || !isConnected || upgradeLevel <= 0 ||
          (enableValue() && upgradeLevel > 0 && parseInt(houseInfo.levels[upgradeLevel - 1]) === 5)}
        upgradeHouse={upgradeHouse}
        enabled={enableValue() && upgradeLevel > 0}
        setUpgradeLevel={setUpgradeLevel}
        price={price}
      />

      <Referral
        showReferral={showReferral}
        refLink={refLink}
        refCoins={enableValue() ? `+ ${parseInt(houseInfo.refCoins)}` : `+ 0`}
        refCash={enableValue() ? `+ ${parseInt(houseInfo.refCash)}` : `+ 0`}
        refs={enableValue() ? `+ ${parseInt(houseInfo.refs) + parseInt(houseInfo.refs2) + parseInt(houseInfo.refs3)}` : `+ 0`}
        setShowReferral={setShowReferral}
      />

      <ComingSoon
        isComingSoon={isComingSoon}
        setIsComingSoon={setIsComingSoon}
        leftTime={LAUNCH_TIME - blockTimestamp}
      />
    </>
  );
}

export default Home;
