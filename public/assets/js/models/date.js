/**
 * Date Model
 */

'use strict';

var Backbone    = require('backbone');
var moment      = require('moment');

var DateModel = Backbone.Model.extend({

    defaults: {
        current: 0,
        monthCount: 0,
    },

    initialize: function () {

        this.set('current', moment().format('YYYY_MM'));

    },

    reset: function () {

        this.initialize();

    }

});

module.exports = new DateModel();
