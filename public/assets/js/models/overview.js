/**
 * Overview Model
 */

var Backbone    = require('backbone');
var Overview = Backbone.Model.extend({

    defaults: {
        income: 0,
        debt: 0,
        toPay: 0,
        investments: 0,
    },

});

module.exports = new Overview();
