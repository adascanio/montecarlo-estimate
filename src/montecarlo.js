
//var biaser = require("./biaser.js");
//var util = require("util");

//var confidenceFactor = config.confidence;

var TOTAL_ITERATIONS = config.totalIterations;


function getTotalSprintPlanning(sprint) {
	var total = 0;
	sprint.cards.forEach(function(item) {
		total +=item.estimation;
	})
	return total;
}

__defaultBiasFun = function (item) {
	if(!item.hasOwnProperty(biasedValue)) {
		item.biasedValue = item.value;
	}
}

function MonteCarlo () {

	var self = this;
	this.config = function (options) {
		self.threshold = options.threshold;
		self.totalIterations = options.iterations || TOTAL_ITERATIONS;
		self.biasFun = options.bias || __defaultBiasFun;
		self.threshold = options.threshold;
		return self;
	};

	this.roll = function (items, threshold){

		try {
			for(var i = 0; i < self.totalIterations; i++) {
				var biasedItems = [];
				var totalBiased = 0;
				items.forEach(function(item){
					var biasedItem = self.bias(item);
					biasedItems.push(biasedItem);
					totalBiased += biasedItem.biasedValue;
				});

				//Table containing the values with the corresponding totals
				var retTable = {};
				if (retTable[""+totalBiased]) {
					retTable[""+totalBiased].count++;		
				}
				else {
					retTable[""+totalBiased] = {count : 1}
				}
		
			}

			var cumulative = 0;
	    	var valueAtThreshold = null;
	    	var thresholdIndex = null;
	    	var counter = 0;

			//calculate the cumulative probability
			for(var key in retTable) {
		    	var count = retTable[key].count;
		    	var probability = Math.ceil(count * 10000/totalIterations)/10000;
		    	retTable[key].probability = probability;
		    	retTable[key].cumulative = Math.ceil((cumulative + probability) *10000) / 10000;
		    	cumulative = retTable[key].cumulative;

		    	if (threshold != null &&
		    		cumulative >= mcThreshold && valueAtThreshold == null) {
		    		valueAtThreshold = key;
		    		thresholdIndex = counter;
		    	}
		    	counter++;
		    }

		    return { 
	    			probabilityTable : retTable,
	    		 	valueAtThreshold : valueAtThreshold,
	    		 	thresholdIndex : thresholdIndex
	    		}
    
		}
		catch(e){
			console.log("@simulator#runMontecarlo", e)
		}
		
	}

}





module.exports = {
	runMontecarlo : runMontecarlo
}


