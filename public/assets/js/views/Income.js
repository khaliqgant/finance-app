/**
 * Pencil View
 */

/* global document */

'use strict';

var Backbone       = require('backbone');
var $              = require('jquery');
var _              = require('underscore');
var vars           = require('../vars');

var OverviewModel = require('../models/overview');

var Income = Backbone.View.extend({

    initialSelector: '.income .salary',

    initialize: function () {


    },

    /**
     *
     * Pay Calculation
     * @desc calculate the amount received per paycheck and the total
     *
     */
    payCalculations: function () {

        // get total
        var salary = $(this.initialSelector + ' .numerical').attr('data-value');
        var gross = (salary / 12 / 2).toFixed(2);
        var misc = $(vars.income.misc).parent('ul').find('.numerical')
            .attr('data-value') ?
            $(vars.income.misc).parent('ul').find('.numerical')
            .attr('data-value') :
            0;

        this.append('gross', gross);

        var total = parseFloat(gross) +  parseFloat(gross) +
            parseFloat(misc);

        this.append('total', total);

        // get available cash
        var costs = 0;
        _.each($(vars.fixed_costs).parent().children(), function (el) {
            var num = $(el).find('.numerical').attr('data-value');

            // make sure we got something
            if (typeof num !== 'undefined') {
                // while we're at it, make this red too
                $(el).find('.numerical').addClass('negative');
                costs += parseFloat(num);
            }
        });

        var available = (total - costs).toFixed(2);

        OverviewModel.set('income', parseFloat(available));

        // put in the header
        $(vars.income.header).html(
            ': $' + available
        );

        //put at the end of the section
        $(vars.income.section).html(
            'Total: $' + available
        );

    },

    /**
     *
     * Append
     * @desc add any arbitrary value to the initial selector in place
     *
     */
    append: function (name, value) {

        if ($(this.initialSelector + ' .' + name).length === 0) {
            $(this.initialSelector).append(
                '<li class="' + name + '">' +
                name + ' : ' +
                '<span class="numerical">' +
                '$' + value +
                '</span>' +
                '</li>'
            );
        }

    }

});

module.exports = new Income();
