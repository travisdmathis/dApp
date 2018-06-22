import { connect } from 'react-redux';

import store from '../store';
import Contracts from '../Contracts.js';

import withGAPageView from './GoogleAnalyticsTracker';
import SimExchangeComponent from '../components/SimExchange/SimExchange';

import { loadContracts } from '../actions/explorer';
import CreateInitializer, {
  contractConstructor
} from '../util/web3/contractInitializer';
import { getBids, getAsks, processContractsList } from '../util/utils';
import {
  getContractAsks,
  getContractBids,
  selectContract,
  tradeOrder
} from '../actions/simExchange';

const mapStateToProps = state => ({
  contracts: state.explorer.contracts,
  shouldRender: true,
  ...state.simExchange
});

const mapDispatchToProps = dispatch => ({
  getAsks: () => {
    const web3 = store.getState().web3.web3Instance;
    const contractAddress = store.getState().simExchange.contract.key;

    const initializeContracts = CreateInitializer(
      contractConstructor.bind(null, web3)
    );

    const contracts = initializeContracts(Contracts);

    const getAsksUtil = getAsks.bind(
      null,
      web3,
      contractAddress,
      contracts.MarketContract,
      contracts.OrderLib
    );

    dispatch(getContractAsks({ web3, getAsks: getAsksUtil }));
  },
  getBids: () => {
    const web3 = store.getState().web3.web3Instance;
    const contractAddress = store.getState().simExchange.contract.key;

    const initializeContracts = CreateInitializer(
      contractConstructor.bind(null, web3)
    );

    const contracts = initializeContracts(Contracts);

    const getBidsUtil = getBids.bind(
      null,
      web3,
      contractAddress,
      contracts.MarketContract,
      contracts.OrderLib
    );

    dispatch(getContractBids({ web3, getBids: getBidsUtil }));
  },
  getContracts: () => {
    const web3 = store.getState().web3.web3Instance;
    const initializeContracts = CreateInitializer(
      contractConstructor.bind(null, web3)
    );
    const contracts = initializeContracts(Contracts);
    const processContracts = processContractsList.bind(
      null,
      contracts.MarketContract,
      contracts.MarketCollateralPool,
      contracts.CollateralToken,
      contracts.ERC20
    );

    dispatch(
      loadContracts(
        { web3, processContracts },
        {
          MarketContractRegistry: contracts.MarketContractRegistry,
          CollateralToken: contracts.CollateralToken
        }
      )
    );
  },
  tradeOrder: order => {
    const web3 = store.getState().web3.web3Instance;
    const contractAddress = store.getState().simExchange.contract.key;
    const initializeContracts = CreateInitializer(
      contractConstructor.bind(null, web3)
    );
    const contracts = initializeContracts(Contracts);

    dispatch(
      tradeOrder(
        { web3, order, contractAddress },
        {
          CollateralToken: contracts.CollateralToken,
          MarketContract: contracts.MarketContract
        }
      )
    );
  },
  selectContract: contract => dispatch(selectContract({ contract }))
});

const SimExchange = withGAPageView(
  connect(mapStateToProps, mapDispatchToProps)(SimExchangeComponent)
);

export default SimExchange;
