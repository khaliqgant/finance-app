/**
 * Month View
 * @desc interact with the month model and handle increase/decrease actions
 */

/* global document */

'use strict';

var Backbone       = require('backbone');
var $              = require('jquery');
var vars           = require('../vars');

var DateView = Backbone.View.extend({

    initialize: function () {

        //$(document).on('click', vars.pencil, this.swap);

    },

    /**
     *
     * Swap
     * @desc change value to a input box when a pencil is clicked
     *
     */
    swap: function (e) {
    },

});

module.exports = new DateView();
