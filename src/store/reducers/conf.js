import { getType } from 'typesafe-actions';
import * as actions from '../actions';

export const defaultState = {
  conf: {
    chainId: 0,
    rpc: '',
    publicURL: '',
    admin: undefined,
    admin1: undefined,
    house: undefined,
    house1: undefined,
    busd: undefined,
    limit: 4000,
  },
  burgerHouseContract: undefined,
  busdContract: undefined,
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    case getType(actions.setConf):
      return { ...state, conf: action.payload };
    case getType(actions.setBurgerHouseContract):
      return { ...state, burgerHouseContract: action.payload };
    case getType(actions.setBusdContract):
      return { ...state, busdContract: action.payload };
    case getType(actions.setConfInit):
      return defaultState;
    default:
      return state;
  }
};

export default states;
