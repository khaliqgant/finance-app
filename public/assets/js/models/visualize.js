/**
 * Visualize Model
 */

/* global $ */
/* global jQuery */
/* global _ */
/* global window */
/* global document */
/* global _dev */


var Backbone    = require('backbone');
var Visualize = Backbone.Model.extend({

    defaults: {
        all_cards: [],
        all_dates: [],
        stats: {}
    },

});

module.exports = new Visualize();
