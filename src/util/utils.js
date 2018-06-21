import { Market } from '@marketprotocol/marketjs';
import BigNumber from 'bignumber.js';

const BUY_SIGN = 1;
const SELL_SIGN = -1;

/**
 *
 * @param priceFloor
 * @param priceCap
 * @param qtyMultiplier
 * @param qty
 * @param price
 * @return {number}
 */
export const calculateCollateral = function(
  priceFloor,
  priceCap,
  qtyMultiplier,
  qty,
  price
) {
  const zero = 0;
  let maxLoss;
  if (qty > zero) {
    if (price <= priceFloor) {
      maxLoss = zero;
    } else {
      maxLoss = price - priceFloor;
    }
  } else {
    if (price >= priceCap) {
      maxLoss = zero;
    } else {
      maxLoss = priceCap - price;
    }
  }
  return maxLoss * Math.abs(qty) * qtyMultiplier;
};

// TODO: move me to wherever I belong -clean up, add documentation, figure out how best to create order object in JS
export async function getBids(
  web3,
  contractAddress,
  marketContract,
  orderLib,
  collateralToken
) {
  console.log('getBids');

  orderLib = await orderLib.deployed();

  const {
    collateralPoolAddress,
    collateralTokenAddress,
    priceCap,
    priceFloor
  } = await marketContract.at(contractAddress).then(async function(instance) {
    const priceFloor = await instance.PRICE_FLOOR.call().then(data =>
      data.toNumber()
    );

    const priceCap = await instance.PRICE_CAP.call().then(data =>
      data.toNumber()
    );

    const collateralPoolAddress = await instance.MARKET_COLLATERAL_POOL_ADDRESS.call();
    const collateralTokenAddress = await instance.COLLATERAL_TOKEN_ADDRESS.call();

    return {
      collateralPoolAddress,
      collateralTokenAddress,
      priceCap,
      priceFloor
    };
  });

  // for now we will create orders around the contract mid price, eventually we should create orders
  // that are around an price pulled from an active API that mimics the oracle solution
  const contractMidPrice = (priceFloor + priceCap) / 2;

  return new Promise((resolve, reject) => {
    // Get current ethereum wallet.
    web3.eth.getAccounts(async function(error, accounts) {
      // Log errors, if any
      // TODO: Handle error
      if (error) {
        console.error(error);
      }

      // we will need to fix this, the server will need to have an unlocked account created the order for the user to match
      // here we are just using an account that we only have access to in the dev environment, but wont be able
      // to use when we attempt to deploy to a test net (rinkeby)
      const bids = await createNewOrders(
        web3,
        contractAddress,
        orderLib,
        accounts.length > 1 ? accounts[1] : accounts[0],
        contractMidPrice - SELL_SIGN, // subtract our sign so our market are not crossed.
        SELL_SIGN,
        2,
        collateralToken,
        collateralTokenAddress,
        collateralPoolAddress
      );

      resolve(bids);
    });
  });
}

export async function getAsks(
  web3,
  contractAddress,
  marketContract,
  orderLib,
  collateralToken
) {
  console.log('getAsks');

  orderLib = await orderLib.deployed();

  return new Promise((resolve, reject) => {
    // Get current ethereum wallet.
    web3.eth.getAccounts(async function(error, accounts) {
      // Log errors, if any
      // TODO: Handle error
      if (error) {
        console.error(error);
      }

      const maker = accounts.length > 1 ? accounts[1] : accounts[0];

      const {
        collateralPoolAddress,
        collateralTokenAddress,
        priceCap,
        priceFloor
      } = await marketContract
        .at(contractAddress)
        .then(async function(instance) {
          const priceFloor = await instance.PRICE_FLOOR.call().then(data =>
            data.toNumber()
          );
          const priceCap = await instance.PRICE_CAP.call().then(data =>
            data.toNumber()
          );

          const collateralPoolAddress = await instance.MARKET_COLLATERAL_POOL_ADDRESS.call();
          const collateralTokenAddress = await instance.COLLATERAL_TOKEN_ADDRESS.call();

          return {
            collateralPoolAddress,
            collateralTokenAddress,
            priceCap,
            priceFloor
          };
        });

      // for now we will create orders around the contract mid price, eventually we should create orders
      // that are around an price pulled from an active API that mimics the oracle solution
      const contractMidPrice = (priceFloor + priceCap) / 2;

      // we will need to fix this, the server will need to have an unlocked account created the order for the user to match
      // here we are just using an account that we only have access to in the dev environment, but wont be able
      // to use when we attempt to deploy to a test net (rinkeby)
      const asks = await createNewOrders(
        web3,
        contractAddress,
        orderLib,
        maker,
        contractMidPrice - BUY_SIGN, // subtract our sign so our market are not crossed.
        BUY_SIGN,
        2,
        collateralToken,
        collateralTokenAddress,
        collateralPoolAddress
      );

      resolve(asks);
    });
  });
}

const createNewOrders = async function(
  web3,
  contractAddress,
  orderLib,
  maker,
  startingPrice,
  mktSign,
  desiredOrderCount,
  collateralToken,
  collateralTokenAddress,
  collateralPoolAddress
) {
  if (desiredOrderCount <= 0) return null;

  startingPrice = Math.trunc(startingPrice); //convert to integer
  const orders = [];
  const orderQty = 1 * mktSign; // for now all orders have qty of 1 (+1 for bid, -1 for sell)
  const expirationTimestamp = Math.floor(Date.now() / 1000) + 86400; // order expires in a day.
  const taker = '0x0000000000000000000000000000000000000000';
  const feeRecipient = '0x0000000000000000000000000000000000000000';
  const makerFee = 0;
  const takerFee = 0;
  const salt = 1;

  const marketjs = new Market(web3.currentProvider);

  const initialCredit = new BigNumber(1e23);

  await collateralToken
    .at(collateralTokenAddress)
    .then(async function(collateralTokenInstance) {
      collateralTokenInstance.transfer.call(maker, initialCredit.toNumber(), {
        from: web3.eth.accounts[0]
      });

      collateralTokenInstance.approve.call(
        collateralPoolAddress,
        initialCredit.toNumber(),
        { from: maker }
      );
    });

  /*await marketjs.getUserAccountBalanceAsync(
    collateralTokenAddress,
    web3.eth.accounts[0]
  ).then(d => console.log(d));*/

  await marketjs
    .depositCollateralAsync(collateralTokenAddress, initialCredit, {
      from: maker
    })
    .then(d => console.log(d));

  for (let i = 0; i < desiredOrderCount; i++) {
    const price = startingPrice - i * mktSign;

    const order = {
      contractAddress,
      expirationTimestamp,
      feeRecipient,
      maker,
      makerFee,
      orderQty,
      price,
      salt,
      taker,
      takerFee
    };

    await marketjs
      .createOrderHashAsync(orderLib.address, order)
      .then(function(data) {
        order.orderHash = data;
      });

    await marketjs
      .signOrderHashAsync(order.orderHash, maker)
      .then(function(data) {
        order.ecSignature = data;
      });

    orders.push(order);
  }

  return orders;
};

// TODO(perfectmak): This should be moves to a more cohesive helper package
export async function processContractsList(
  marketContract,
  marketCollateralPool,
  collateralToken,
  ERC20,
  deployedContracts
) {
  let promises = deployedContracts.map(async contract => {
    return await marketContract
      .at(contract)
      .then(async function(instance) {
        const contractJSON = {};
        contractJSON['key'] = instance.address;
        contractJSON['CONTRACT_NAME'] = await instance.CONTRACT_NAME.call();

        const collateralTokenContractAddress = await instance.COLLATERAL_TOKEN_ADDRESS.call();
        contractJSON[
          'COLLATERAL_TOKEN_ADDRESS'
        ] = collateralTokenContractAddress;

        await collateralToken
          .at(collateralTokenContractAddress)
          .then(async function(collateralTokenInstance) {
            contractJSON[
              'COLLATERAL_TOKEN'
            ] = await collateralTokenInstance.name();
            contractJSON[
              'COLLATERAL_TOKEN_SYMBOL'
            ] = await collateralTokenInstance.symbol();
          })
          .catch(function(err) {
            try {
              const token = contract(ERC20).at(collateralTokenContractAddress);
              contractJSON['COLLATERAL_TOKEN'] = token.name();
              contractJSON['COLLATERAL_TOKEN_SYMBOL'] = token.symbol();
            } catch (e) {
              console.error(e);
              contractJSON['COLLATERAL_TOKEN'] = 'NA';
              contractJSON['COLLATERAL_TOKEN_SYMBOL'] = 'NA';
            }
          });

        contractJSON['PRICE_FLOOR'] = await instance.PRICE_FLOOR.call().then(
          data => data.toNumber()
        );
        contractJSON['PRICE_CAP'] = await instance.PRICE_CAP.call().then(data =>
          data.toNumber()
        );
        contractJSON[
          'PRICE_DECIMAL_PLACES'
        ] = await instance.PRICE_DECIMAL_PLACES.call().then(data =>
          data.toNumber()
        );
        contractJSON[
          'QTY_MULTIPLIER'
        ] = await instance.QTY_MULTIPLIER.call().then(data => data.toNumber());
        contractJSON['ORACLE_QUERY'] = await instance.ORACLE_QUERY.call();
        contractJSON['EXPIRATION'] = await instance.EXPIRATION.call().then(
          data => data.toNumber()
        );
        contractJSON['lastPrice'] = await instance.lastPrice
          .call()
          .then(data => data.toNumber());
        contractJSON['isSettled'] = await instance.isSettled.call();

        // TODO: There is a possibility a contract ends up in our registry that wasn't linked to a collateral pool
        // correctly.  The code below will handle this, but a better solution would probably to not actually
        // display contracts that are not correctly linked to a collateral pool!
        await marketCollateralPool
          .at(await instance.MARKET_COLLATERAL_POOL_ADDRESS.call())
          .then(async function(collateralPoolInstance) {
            contractJSON[
              'collateralPoolBalance'
            ] = await collateralPoolInstance.collateralPoolBalance
              .call()
              .then(data => data.toNumber());
          })
          .catch(function(err) {
            console.error(err);
            contractJSON['collateralPoolBalance'] = 'NA';
          });

        return contractJSON;
      })
      .catch(function(err) {
        console.error(err);
      });
  });

  return await Promise.all(promises);
}

/**
 * Convert MetaMask error message to dApp error message.
 * Fallback: return original message.
 *
 * @param errorMessage
 * @return getMetamaskError
 */
export const getMetamaskError = function(errorMessage) {
  if (errorMessage.indexOf('User denied transaction') !== -1)
    return 'User denied transaction';
  else return errorMessage;
};

export const getLocationOrigin = () => window.location.origin;

/**
 * Detect if network belongs to testnet/mainnet
 *
 * @param network
 * @return boolean true/false
 */
export const isTestnetOrMainnet = network => {
  return (
    network !== 'truffle' && network !== 'ganache' && network !== 'unknown'
  );
};

/**
 * Set `collateralTokenAddress` based on the `network`
 *
 * `0x01b8de20c76ed06c7e93068a45951c26f70be3db` -- WETH
 * `0x0c58e89866dda96911a78dedf069a1848618c185` -- Stable USD
 *
 * @param network
 * @return collateralTokenAddress
 *
 * TODO: Update the method to return `WUSD` if the selected symbol pair is USD
 */
export const getCollateralTokenAddress = (network, quoteAsset) => {
  if (network === 'rinkeby') {
    switch (quoteAsset) {
      case 'ETH':
        return '0x01b8de20c76ed06c7e93068a45951c26f70be3db';
      case 'USDT':
        return '0x0c58e89866dda96911a78dedf069a1848618c185';
      default:
        return '';
    }
  }
  return '';
};
