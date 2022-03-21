const PredictionMarket = artifacts.require('PredictionMarket.sol');
  
const Side = {
  Event_X: 0,
  Event_Y: 1
};

contract('PredictionMarket', addresses => {
  const [admin, oracle, predictor1, predictor2, predictor3, predictor4, _] = addresses;

  it('should work', async () => {
    const predictionMarket = await PredictionMarket.new(oracle);
    
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
      {from: predictor4, value: web3.utils.toWei('4')}
    );

    await predictionMarket.reportResult(
      Side.Event_X, 
      Side.Event_Y, 
      {from: oracle}
    );

    const balancesBefore = (await Promise.all( 
      [predictor1, predictor2, predictor3, predictor4].map(predictor => (
        web3.eth.getBalance(predictor)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));
    await Promise.all(
      [predictor1, predictor2, predictor3].map(predictor => (
        predictionMarket.withdrawGain({from: predictor})
      ))
    );
    const balancesAfter = (await Promise.all( 
      [predictor1, predictor2, predictor3, predictor4].map(predictor => (
        web3.eth.getBalance(predictor)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));

    //predictor 1, 2, 3 should have respectively 2, 2 and 4 extra ether
    //but we also have to take into consideration gas spent when calling
    //withdrawGain(). We can ignore this problem by just comparing
    //the first 3 digits of balances
    assert(balancesAfter[0].sub(balancesBefore[0]).toString().slice(0, 3) === '199');
    assert(balancesAfter[1].sub(balancesBefore[1]).toString().slice(0, 3) === '199');
    assert(balancesAfter[2].sub(balancesBefore[2]).toString().slice(0, 3) === '399');
    assert(balancesAfter[3].sub(balancesBefore[3]).isZero());
  });
});