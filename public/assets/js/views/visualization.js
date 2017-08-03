/**
 * Visualization View
 * @desc show the associated card data view on click
 * @dependencies
 *  2d: http://visjs.org/docs/graph2d/
 *      custombox: http://dixso.github.io/custombox/
 */

/* global document */
/* global Custombox */

'use strict';

var Backbone       = require('backbone');
var $              = require('jquery');
var vis            = require('vis');
var vars           = require('../vars');
var VisualizeModel = require('../models/visualize');

var Visualization = Backbone.View.extend({

    initialize: function () {

        $(document).on(
            'click', vars.visualizations.listener, this.create.bind(this)
        );

    },

    el: vars.visualizations.listener,

    /**
     *
     * Create
     * @desc leverage vis to display graph information for cc info
     *
     */
    create: function (e) {

        e.preventDefault();

        var el = vars.visualizations.listener;
        var _this = this;

        Custombox.open({
            target: '#visualize-overlay',
            effect: 'push',
            position: ['center', 'top'],
            overlayOpacity: 1,
            open: function () {
                var container = document.getElementById(
                    vars.visualizations.show
                );
                var card_type = $(el).parents('.circle')
                    .attr('data-name').toLowerCase();
                var card = $(el).parents('li').attr('data-key');
                var items = _this.graphCards(card_type, card);
                var dataset = new vis.DataSet(items);

                var options = {
                    orientation: 'top',
                    autoResize: true
                };

                var graph2d = new vis.Graph2d(container, dataset, options);

                // add in stats and card header
                var cardType = card_type.ucfirst() + ' - ' + card.ucfirst()
                    .replace(/_/, ' ');
                $(vars.visualizations.card).text(cardType);

                // add in stats data
                var stats = VisualizeModel.stats;

                if (stats[card_type].hasOwnProperty(card)) {
                    $(vars.visualizations.average).text(
                        stats[card_type][card].avg
                    );
                    $(vars.visualizations.min).text(
                        stats[card_type][card].min
                    );
                    $(vars.visualizations.max).text(
                        stats[card_type][card].max
                    );
                }
            },

            close: function () {
                $('#visualize-overlay').hide();
                $('#visualization').html('');
                $(document.body).scrollTop($('a[name="pay"]').offset().top);
            },
        });

    },

    /**
     *
     * Graph
     * @desc make items for visualization purposes
     * @return {array} items
     *
     */
    graphCards: function (card_type, card) {

        var cards = [];
        var all_cards = VisualizeModel.all_cards;
        for (var i = 0; i < VisualizeModel.all_dates.length; i++)
        {
            if (all_cards[i][card_type].hasOwnProperty(card)) {
                cards.push({
                    x: VisualizeModel.all_dates[i].replace(/_/, '-'),
                    y: VisualizeModel.all_cards[i][card_type][card],
                    label: {
                        content: VisualizeModel.all_cards[i]
                        [card_type][card],
                        className: 'visualize-text',
                        xOffset: -40,
                        yOffset: -15
                    }
                });
            }
        }

        return cards;

    }
});

module.exports = new Visualization();

