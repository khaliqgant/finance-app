'use strict';
var moment = require('moment');
var fs = require('fs');

var trends = {
    /**
     * To Pay Average
     * @use find the average to pay amount per each available month
     * @param {function} callback
     * @return {function} callback
     */
    toPay : function(callback) {
        var start = moment().subtract(12, 'months');
        var end = moment();
        var count = 0;
        var total = 0;
        while(start.format('YYYY_MM') !== end.format('YYYY_MM'))
        {
            start = start.add('1', 'months');
            var fileDate = start.format('YYYY_MM');
            var file = 'data/' + fileDate + '.json';
            try {
                var data = JSON.parse(fs.readFileSync(file));
                var cards = data.to_pay.credit_cards;
                count++;
                for (var credit in cards) {
                    for (var type in cards[credit]) {
                        total += parseFloat(cards[credit][type]);
                    }
                }

            } catch(e) {
                // file not available
            }
        }
        if (typeof callback === 'function') {
            var average = total / count;
            callback(average);
        }

    },
};

module.exports = trends;
