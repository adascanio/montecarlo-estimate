'use strict'
var biaser = require("./biaser.js");

class MonteCarlo {

	constructor(options) {
		this.TOTAL_ITERATIONS = 10000;
		this.threshold = options.threshold;
		this.totalIterations = options.iterations || this.TOTAL_ITERATIONS;
		this.bias = options.bias || biaser.bias;
		this.biasKey = options.biasKey;
	};

	roll(items, threshold) {

		//Table containing the values with the corresponding totals
		var retTable = {};

		try {
			for (var i = 0; i < this.totalIterations; i++) {
				var biasedItems = [];
				var totalBiased = 0;
				items.forEach(item => {

					var biasedItem = this.bias(item, { key: this.biasKey });

					biasedItems.push(biasedItem);
					totalBiased += biasedItem.biasedValue;
				});



				if (retTable["" + totalBiased]) {
					retTable["" + totalBiased].count++;
				}
				else {
					retTable["" + totalBiased] = { count: 1 }
				}

				retTable["" + totalBiased].biasedItems = biasedItems;

			}


			var cumulative = 0;
			var valueAtThreshold = null;
			var thresholdIndex = null;
			var counter = 0;

			//calculate the cumulative probability
			for (var key in retTable) {
				var count = retTable[key].count;
				var probability = Math.ceil(count * 10000 / this.totalIterations) / 10000;
				retTable[key].probability = probability;
				retTable[key].cumulative = Math.ceil((cumulative + probability) * 10000) / 10000;
				cumulative = retTable[key].cumulative;

				if (threshold != null &&
					cumulative >= threshold && valueAtThreshold == null) {
					valueAtThreshold = key;
					thresholdIndex = counter;
				}
				counter++;
			}

			return {
				probabilityTable: retTable,
				valueAtThreshold: valueAtThreshold,
				thresholdIndex: thresholdIndex
			}

		}
		catch (e) {
			console.log("@Montecarlo:roll", e)
		}

	};//roll

	static transformToArray(probTable) {
		try {

			var table = [];
			for (var key in probTable) {
				table.push({
					effort: key,
					prob: probTable[key].probability,
					cumulative: probTable[key].cumulative
				});
			}

			table.sort((a, b) => a.effort - b.effort);

			return table;
		}
		catch (e) {
			console.log(e);
		}

	};


} //MonteCarlo

module.exports = MonteCarlo;
