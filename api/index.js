'use strict';

var moment = require('moment');
var fs = require('fs');

/**
 * API
 * @use return some json to an authenticated request for a financial overview
 */

var api = {
    get: function() {
        var today = moment().format('YYYY_MM');
        var file = 'data/' + today + '.json';
        var data = JSON.parse(fs.readFileSync(file));

        return data;
    }
};
module.exports = api;
