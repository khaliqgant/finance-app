'use strict';
var moment = require('moment');
var fs = require('fs');

var trends = {
    toPay : function(callback) {
        var start = moment().subtract(12, 'months');
        var end = moment();
        while(start.format('MM_YYYY') !== end.format('MM_YYYY'))
        {
            start = start.add('1', 'months');
            var fileDate = start.format('MM_YYYY');
            var file = 'data/' + fileDate + '.json';
            try {
                var data = JSON.parse(fs.readFileSync(file));
                var cards = data.to_pay.credit_cards;
                for (var credit in cards) {
                    console.log(credit);
                }

            } catch(e) {
                // file not available
            }
        }
        if (typeof callback === 'function') {
            callback(start);
        }

    },
};

module.exports = trends;
