
var montecarlo = require('./src/montecarlo');
//var biaser = require('./src/biaser');
var testData = require('./src/testData');

var mc = new montecarlo();

var result = mc.roll(testData.cards, 0.90)

console.log(result)

module.exports = {
	montecarlo : montecarlo
	//biaser : biaser
}