import Web3 from 'web3';

import showMessage from '../../components/message';
import store from '../../store';

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED';

function web3Initialized(results) {
  return {
    type: WEB3_INITIALIZED,
    payload: results
  };
}

const GANACHE = '5777';
const RINKEBY = '4';
const TRUFFLE = '4447';

const networkMap = {
  1: 'mainnet',
  2: 'morden',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
  4447: 'truffle',
  5777: 'ganache'
};

let getWeb3 = (
  window,
  showErrorMessage = showMessage.bind(showMessage, 'error'),
  dispatch = store.dispatch.bind(store)
) =>
  new Promise(function(resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function() {
      let results;
      let web3 = window.web3;

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (
        typeof web3 !== 'undefined' &&
        web3.currentProvider &&
        web3.currentProvider.isMetaMask
      ) {
        console.log("Mist/MetaMask's detected!");

        web3.eth.getAccounts((err, accounts) => {
          if (accounts.length === 0) {
            // check for unlocked metamask state
            results = {
              web3Instance: null,
              network: 'unknown'
            };

            console.log('Please unlock MetaMask!');

            showErrorMessage(
              'MetaMask is locked! Please unlock and refresh this page',
              8
            );
            resolve(dispatch(web3Initialized(results)));
          }
        });

        web3.version.getNetwork((error, network) => {
          // Ensure beta users don't spend real ETH
          if (
            network !== RINKEBY &&
            network !== TRUFFLE &&
            network !== GANACHE
          ) {
            results = {
              web3Instance: null,
              network: 'unknown'
            };

            console.log(
              'dApp beta only compatible with Ganache or Rinkeby or Truffle'
            );

            showErrorMessage(
              'Please select Rinkeby Test Network in MetaMask and then restart browser',
              8
            );

            resolve(dispatch(web3Initialized(results)));
          } else {
            web3 = new Web3(web3.currentProvider);

            results = {
              web3Instance: web3,
              network: networkMap[network] || 'unknown'
            };

            console.log('Injected web3 detected.');

            resolve(dispatch(web3Initialized(results, error)));
          }
        });
      } else {
        // Fallback to localhost if no web3 injection. We've configured this to
        // use the development console's port by default.
        const provider = new Web3.providers.HttpProvider(
          'http://127.0.0.1:9545'
        );

        web3 = new Web3(provider);

        results = {
          web3Instance: web3,
          network: 'truffle'
        };

        console.log('No web3 instance injected, using Local web3.');

        resolve(dispatch(web3Initialized(results)));
      }
    });
  });

export default getWeb3;
