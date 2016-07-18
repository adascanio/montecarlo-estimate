
var biaser = require("./biaser.js");

var TOTAL_ITERATIONS = 10000;


function getTotalSprintPlanning(sprint) {
	var total = 0;
	sprint.cards.forEach(function(item) {
		total +=item.estimation;
	})
	return total;
}

//no bias

__defaultBiasFun = function (item) {
    
	if(!item.hasOwnProperty("biasedValue")) {
		item.biasedValue = item.value;
	}
	return item;
}

function MonteCarlo (settings) {

	var self = this;
	this.config = function (options) {
		self.threshold = options.threshold;
		self.totalIterations = options.iterations || TOTAL_ITERATIONS;
		self.bias = options.bias || biaser.bias;
		return self;
	};

	this.config(settings || {});

	this.roll = function (items, threshold){

	//Table containing the values with the corresponding totals
	var retTable = {};
				
		try {
			for(var i = 0; i < self.totalIterations; i++) {
				var biasedItems = [];
				var totalBiased = 0;
				items.forEach(function(item){

					var biasedItem = self.bias(item);

					biasedItems.push(biasedItem);
					totalBiased += biasedItem.biasedValue;
				});

				if (retTable[""+totalBiased]) {
					retTable[""+totalBiased].count++;		
				}
				else {
					retTable[""+totalBiased] = {count : 1}
				}
				//retTable[""+total].solution = biasedItems;
				retTable[""+totalBiased].solution = biasedItems;
		
			}
			

			var cumulative = 0;
	    	var valueAtThreshold = null;
	    	var thresholdIndex = null;
	    	var counter = 0;

			//calculate the cumulative probability
			for(var key in retTable) {
		    	var count = retTable[key].count;
		    	var probability = Math.ceil(count * 10000/self.totalIterations)/10000;
		    	retTable[key].probability = probability;
		    	retTable[key].cumulative = Math.ceil((cumulative + probability) *10000) / 10000;
		    	cumulative = retTable[key].cumulative;

		    	if (threshold != null &&
		    		cumulative >= threshold && valueAtThreshold == null) {
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
			console.log("@Montecarlo:roll", e)
		}
		
	}

};

MonteCarlo.prototype.constructor = function (settings) {
	//this.config(settings);
}





module.exports = MonteCarlo;


