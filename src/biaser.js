var config = require("../config/config.json");

var confidenceFactor = config.confidence;

/**
 * Return a randon value with a biased distribution around the bias value
 * @param {number} min the lower bound of distribution range
 * @param {number} max the upper bound of distribution range
 * @param {number} bias the value around which the distribution should be biased
 * @param {number} influence the influence factor of values around the bias. Set it to 0 for a uniform distribution
 * @return the biased randon between min and max
 */
function getRndDistribution(min, max, bias, influence) {
	var rnd = Math.random() * (max - min) + min,   // random in range
		mix = Math.random() * influence;         // random mixer
	return rnd * (1 - mix) + bias * mix;
}


/**
 * Perform a biased estimation of a card.
 * The bias comes from the configuration file or the card itself
 * @param {Object} card the card object it must have
 * 	<code>id</code>
 *  <code>estimation</code>
 */
function bias(card, settings) {

	settings = settings || {};

	var confFactor = settings.confidence || config.confidence;
	var biasedKey = settings.key || "value";

	if (card.confidence instanceof Array) {
		confFactor = card.confidence;
	}
	else {
		confFactor = confFactor[card.confidence] || config.confidenceFactor[0];
	}

	var est = card[biasedKey];
	var initialValue = est * (1 - confFactor[0]);
	var endValue = est * (1 + confFactor[1]);
	var biasType = card.bias;

	var bias = selectBias(biasType, initialValue, endValue, est);

	//if bias value is negative, the distribution should be uniform
	var influence = bias >= 0 ? 1 : 0;

	var value = Math.round(getRndDistribution(initialValue, endValue, bias, influence));

	card.biasedValue = value;
	return card;
}

/**
 * Provide the bias value according to the card configuration 
 * @param {string} biasType
 * <code>exact</code> for bias around the exactValue
 * <code>low</code> for bias around initValue
 * <code>medium</code> for bias around mean value betweens end and init value
 * <code>high</code> for bias around endValue
 * <code>none</code> for no bias (uniform distribution if used for random value generation)
 * @param {number} initValue
 * @param {number} endValue
 * @param {number} exactValue
 * @return {number} the bias value
 */
function selectBias(biasType, initialValue, endValue, exactValue) {
	var ret;

	if (biasType == null) {
		biasType = config.bias;
	}

	switch (biasType) {
		case "exact":
			ret = exactValue;
			break;
		case "low":
			ret = initialValue;
			break;
		case "medium":
			ret = initialValue + (endValue - initialValue) / 2;
			break;
		case "high":
			ret = endValue
			break;
		case "none":
			ret = -1;
			break;
	}
	return ret;
}



module.exports = {
	bias: bias
}