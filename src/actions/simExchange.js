import { Market } from '@marketprotocol/marketjs';

export function selectContract({ contract }) {
  return function(dispatch) {
    dispatch({ type: 'SELECTED_CONTRACT', payload: contract });
  };
}

export function getContractBids({ web3, getBids }) {
  const type = 'GET_BIDS';

  return async function(dispatch) {
    dispatch({ type: `${type}_PENDING` });

    if (web3 && typeof web3 !== 'undefined') {
      await getBids().then(bids => {
        dispatch({ type: `${type}_FULFILLED`, payload: bids });
      });
    } else {
      dispatch({
        type: `${type}_REJECTED`,
        payload: { error: 'Web3 not initialised' }
      });
    }
  };
}

export function getContractAsks({ web3, getAsks }) {
  const type = 'GET_ASKS';

  return async function(dispatch) {
    dispatch({ type: `${type}_PENDING` });

    if (web3 && typeof web3 !== 'undefined') {
      await getAsks().then(asks => {
        dispatch({ type: `${type}_FULFILLED`, payload: asks });
      });
    } else {
      dispatch({
        type: `${type}_REJECTED`,
        payload: { error: 'Web3 not initialised' }
      });
    }
  };
}

export function tradeOrder(
  { web3, order, contractAddress },
  { MarketContract }
) {
  const type = 'TRADE_ORDER';

  return async function(dispatch) {
    dispatch({ type: `${type}_PENDING` });

    if (web3 && typeof web3 !== 'undefined') {
      console.log(order);

      // Get current ethereum wallet.
      web3.eth.getCoinbase(async function(error, coinbase) {
        // Log errors, if any
        // TODO: Handle error
        if (error) {
          console.error(error);
        }

        order.taker = coinbase;
        order.remainingQty = 1;

        const marketjs = new Market(web3.currentProvider);
        await marketjs.tradeOrderAsync(order, 1, {
          from: coinbase,
          gas: 2000000
        });

        dispatch({ type: `${type}_FULFILLED` });
      });
    } else {
      dispatch({
        type: `${type}_REJECTED`,
        payload: { error: 'Web3 not initialised' }
      });
    }
  };
}
