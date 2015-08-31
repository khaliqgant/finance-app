'use strict';
var moment = require('moment');

var trends = {
    toPay : function(req,res) {
        var start = req.body.start;
        var end = req.body.end;
        var addT = moment(start,'MM_YYYY').add(1,'months');
        console.log(addT);
        console.log(start,end);

    },
};

module.exports = trends;
