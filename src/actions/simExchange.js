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

        await MarketContract.at(contractAddress).then(async function(instance) {
          await instance.tradeOrder(
            order.orderAddresses,
            order.unsignedOrderValues,
            order.orderQty, // qty is five
            -1, // let us fill a one lot
            order.v, // v
            order.r, // r
            order.s, // s
            { from: coinbase }
          );

          // NOTE: this is a very rough example of how this could all work.  Essentially the user selects an order object
          // to trade against and calls trade order from their account.

          dispatch({ type: `${type}_FULFILLED` });
        });
      });
    } else {
      dispatch({
        type: `${type}_REJECTED`,
        payload: { error: 'Web3 not initialised' }
      });
    }
  };
}
