import BigNumber from 'bignumber.js';
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
  { CollateralToken, MarketContract }
) {
  const type = 'TRADE_ORDER';

  return async function(dispatch) {
    dispatch({ type: `${type}_PENDING` });

    if (web3 && typeof web3 !== 'undefined') {
      console.log(order);

      // Get current ethereum wallet.
      web3.eth.getAccounts(async function(error, accounts) {
        // Log errors, if any
        // TODO: Handle error
        if (error) {
          console.error(error);
        }

        order.remainingQty = 100;

        const marketjs = new Market(web3.currentProvider);

        const initialCredit = new BigNumber(1e23);
        const maker = accounts.length > 1 ? accounts[1] : accounts[0];

        const {
          collateralPoolAddress,
          collateralTokenAddress
        } = await MarketContract.at(contractAddress).then(async function(
          instance
        ) {
          const collateralPoolAddress = await instance.MARKET_COLLATERAL_POOL_ADDRESS.call();
          const collateralTokenAddress = await instance.COLLATERAL_TOKEN_ADDRESS.call();

          return {
            collateralPoolAddress,
            collateralTokenAddress
          };
        });

        await CollateralToken.at(collateralTokenAddress).then(async function(
          collateralTokenInstance
        ) {
          await collateralTokenInstance.transfer(
            maker,
            initialCredit.toNumber(),
            {
              from: accounts[0]
            }
          );

          await collateralTokenInstance.transfer(
            accounts[0],
            initialCredit.toNumber(),
            {
              from: accounts[0]
            }
          );

          await collateralTokenInstance.approve(
            collateralPoolAddress,
            initialCredit.toNumber(),
            { from: maker }
          );

          await collateralTokenInstance.approve(
            collateralPoolAddress,
            initialCredit.toNumber(),
            { from: accounts[0] }
          );
        });

        await marketjs.depositCollateralAsync(
          collateralPoolAddress,
          initialCredit,
          {
            from: maker
          }
        );

        await marketjs.depositCollateralAsync(
          collateralPoolAddress,
          initialCredit,
          {
            from: accounts[0]
          }
        );

        await marketjs.tradeOrderAsync(order, 1, {
          from: accounts[0],
          gas: 400000
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
