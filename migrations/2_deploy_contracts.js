const PredictionMarket = artifacts.require('PredictionMarket');

const Side = {
  Event_X: 0,
  Event_Y: 1
};

module.exports = async function (deployer, _network, addresses) {
  const [admin, oracle, predictor1, predictor2, predictor3, predictor4, _] = addresses;
  await deployer.deploy(PredictionMarket, oracle);
  const predictionMarket = await PredictionMarket.deployed();
  await predictionMarket.placeBet(
    Side.Event_X, 
    {from: predictor1, value: web3.utils.toWei('1')}
  );
  await predictionMarket.placeBet(
    Side.Event_X, 
    {from: predictor2, value: web3.utils.toWei('1')}
  );
  await predictionMarket.placeBet(
    Side.Event_X, 
    {from: predictor3, value: web3.utils.toWei('2')}
  );
  await predictionMarket.placeBet(
    Side.Event_Y, 
    {from: predictor4, value: web3.utils.toWei('1')}
  );
};