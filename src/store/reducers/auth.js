import { getType } from 'typesafe-actions';
import * as actions from '../actions';

export const defaultState = {
  web3: null,
  isConnected: false,
  injectedProvider: null,
  curAcount: null,
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    case getType(actions.setWeb3):
      return { ...state, web3: action.payload };
    case getType(actions.setIsConnected):
      return { ...state, isConnected: action.payload };
    case getType(actions.setInjectedProvider):
      return { ...state, injectedProvider: action.payload };
    case getType(actions.setCurAcount):
      return { ...state, curAcount: action.payload };
    case getType(actions.setInit):
      return defaultState;
    default:
      return state;
  }
};

export default states;
