/**
 * Finances.js
 * @author Khaliq Gant
 * @use main entry point into the app, this app manages state and makes calls
 * @dependencies :
 *      Moment.js : https://github.com/moment/moment
 *      Backbone : http://backbonejs.org/
 *      Underscore : http://underscorejs.org/
 *      jQuery : https://jquery.com/
 *      enquire : https://github.com/WickyNilliams/enquire.js/
 *      sweetAlert : https://github.com/t4t5/sweetalert
 *      Q : https://github.com/kriskowal/q
 *      vis : https://github.com/almende/vis
 */

/* global document */
/* global window */
/* global location */
/* global swal */
/* global Custombox */

'use strict';

var $           = require('jquery');
var _           = require('underscore');
var Backbone    = require('backbone');
var server      = require('./server');
var vars        = require('./vars');
var moment      = require('moment');
var sweetAlert  = require('sweetalert');
var enquire     = require('enquire.js');
var bunyan      = require('bunyan');
var TapListener = require('tap-listener');
var Q           = require('q');
var vis         = require('vis');

var Finances = (function(){
    var debug = false;
    var log = bunyan.createLogger({name: 'Finances', level: 'debug'});

    var app = {
        date : vars.date,
        mobile : false,
        current : null,
        money : null,
        financials : 0,
        check : 0,
        income : 0,
        debt : 0,
        toPay : 0,
        ring : 0,
        sections : ['debt','cash', 'to_pay', 'notes', 'links'],
        visualize: {}
    };

    /**
     * Financial View
     * @use handles the render logic by grabbing corresponding JSON and
     *      nested json by iterating through the json keys and checking for a
     *      remote key
     */
    var Financial = Backbone.View.extend({
        initialize : function(options) {
            this.val = options.val;
            this.model = new options.model();
            this.render();
        },
        render : function() {
            var self = this;
            this.model.fetch({
                success : function(model, response, options) {
                    // store this model for easier access
                    app.current = model.toJSON();
                    if (typeof(self.val) === 'object') {
                        // iterate through all the values we want to grab
                        _.each(self.val, function(val) {
                            methods.renderHandler(val);
                        });
                    } else {
                        // single value to obtain
                        methods.renderHandler(self.val);
                    }
                },
                error : function(model, response, options) {
                    console.log('DEBUG : bad json?');
                }
            }).done(function(){
                app.check++;
                // so we know when all financials have been returned
                if (app.check === app.financials) {
                    methods.postApplications();
                    methods.calculations.init();
                    methods.updateOverview();
                    methods.addNotePluses();
                    methods.computeTrends();
                }
            });

            return this;
        }
    });

    var methods = {
        init : function() {
            var Month = Backbone.Model.extend({
                url : 'data/' + app.date + '.json',
            });

            // grab the json by specifying the correct key
            var Money = new Financial({
                val : app.sections,
                model : Month
            });
            app.financials++;

            app.money = Money;

            server.nextMonthCheck(app.date);
            server.previousMonthCheck(app.date);
        },

        reset : function(callback) {
            // don't lose the section we were in before
            var height = $('main').children().first().height();
            $('main').children().first().height(height);

            // clear everything out
            for (var i = 0; i < app.sections.length; i++)
            {
                $(vars[app.sections[i]]).html('');
            }
            if (typeof(callback) === 'function') {
                callback(true);
            }
        },

        /**
         * Refresh
         * @use restart the app with an reset then init call
         */
        refresh : function() {
            methods.reset(function(done){
                methods.init();
            });
        },

        renderHandler : function(val) {
            if (app.current[val].hasOwnProperty('remote') &&
                app.current[val].remote)
            {
                // get another file
                var Model = Backbone.Model.extend({
                    url : 'data/' + app.current[val].file
                });
                var View = new Financial({
                    val : val,
                    model : Model
                });
                // keep track of where we are in the app rendering
                app.financials++;
            }
            methods.renderData(val);
        },
        /**
         * Render Data
         * @use render data return from backbone model into the DOM
         * @param {object} data
         * @return void
         */
        renderData : function(val) {
            // map the data
            var datas = app.current[val];
            _.each(datas, function(data, index) {
                if (!data.remote) {
                    // it's a number, append it right away
                    if (typeof(datas[index]) === 'number') {
                        $(vars[val]).append(
                            '<ul>'+
                                index.ucfirst() + ' : ' +
                                '<span class="numerical js-value" '+
                                    'data-value="'+ datas[index] +'">'+
                                        '$' + datas[index] +
                                '</span>' +
                            '</ul>'
                        );
                    } else {
                        var nested = false;
                        var items = _.map(
                            // need to adjust logic to obtain credit cards here
                            _.pairs(data), function(pair) {
                                var key = pair[0].ucfirst();
                                var keyClass = '.' + pair[0];

                                if (typeof(pair[1]) === 'object') {
                                    nested = true;
                                }
                                if (methods.numberCheck(key)) {
                                    key = '';
                                    keyClass = '';
                                }
                                return {
                                    key : key.strip(),
                                    keyClass : keyClass,
                                    keyName : pair[0],
                                    value : pair[1]
                                };
                            }
                        );

                        if (index !== 'file' && index !== 'remote') {
                            var template = methods.templateBuilder(
                                index,nested
                            );

                            var appendEl = vars[val];
                            var appendNest = false;
                            _.each(items, function(item){
                                var check = $(vars[val])
                                                .find(item.keyClass).length;
                                if (check > 0) {
                                    // apply based on logic
                                    methods.appendNested(item,val);
                                    appendNest = true;
                                }
                            });

                            if (!appendNest) {
                                $(appendEl).append(template({
                                    list : items
                                }));

                                if (nested) {
                                    methods.renderNested(vars[val],items);
                                }
                            }
                        }
                    }
                } else {
                    // this file is remote
                    var parentClass = $(vars[val]).parent().attr('class');
                    var Model = Backbone.Model.extend({
                        url : 'data/' + data.file
                    });
                    var View = new Financial({
                        val : index,
                        model : Model
                    });
                    app.financials++;
                }
            });
        },

        /**
         * Append Nested
         * @use append the nested values of key value pairs
         * @param {object} item
         * @param {object} value
         */
        appendNested : function(item,val) {
            if (debug) {
                log.trace('The item is: ');
                log.debug(item.value);
                if (!item.value.hasOwnProperty('next_month')) {
                    log.warn('this element doesn\'t have a next month');
                }
            }

            if (item.value.hasOwnProperty('next_month')) {
                var month = item.value.next_month ?
                    moment(app.date, 'YYYY_MM').month() + 2 :
                    moment(app.date, 'YYYY_MM').format('M');
                if (month > 12) {
                    month = 1;
                }
                var date = month + '/' + item.value.date;
                var dueOrClosing = !item.value.hasOwnProperty('paid') ?
                    'Closing Date' : '<strong>Due Date</strong>';
                // make due date bold for the date as well
                if (item.value.hasOwnProperty('paid')) {
                    date = '<strong>'+ date + '</strong>';
                }
                $(vars[val]).find(item.keyClass)
                    .append(' (' + dueOrClosing + ' : ' + date + ')');
            } else {
                if (debug) {
                    log.warn('this element is missing a next month prop');
                    log.debug(item.value);
                }
            }

            if (item.value.hasOwnProperty('paid')){
                var checked = item.value.paid ? 'checked' : '';
                var checkbox = '<input name="paid" class="checkbox js-'+
                    item.keyClass+' js-paid" type="checkbox" '+ checked +
                    ' data-key="'+item.keyName+'">';
                $(vars[val]).find(item.keyClass).parent()
                    .append(' <span class="check">Paid : ' +
                            checkbox +
                            '</span>');
            } else {
                if (debug) {
                    log.warn('this element is missing a paid prop');
                    log.debug(item.value);
                }
            }

            // @KJG TODO this logic is suspect since sometimes links remote file
            // are finished loading before due dates remote file
            if (item.value.hasOwnProperty('link')) {
                var content = $(vars[val]).find(item.keyClass).html();
                $(vars[val]).find(item.keyClass).replaceWith(
                    '<a target="_blank" href="'+item.value.link+'">' +
                        titleCase(content.strip()) +
                    '</a>'
                );
            }
        },

        /**
         * Template Builder
         * @use formulate a template string based on some rules
         * @param {string} index
         * @param {boolean} nested
         * @return {string} template - underscore string function
         */
        templateBuilder : function(index,nested) {
            var template = null;
            if (nested) {
                template = _.template(
                    '<% _(list).each(function(field) { %>'+
                        '<ul class="circle" data-name="<%= field.key %>">'+
                        '<%= field.key %></ul>'+
                    '<% }); %>'
                );
            } else {
                var openTag = '<ul class="circle" data-name="'+index+'">' +
                                    '<span class="section js-'+index+'">' +
                                        index.ucfirst().strip() +
                                    '</span>';
                var closeTag = '</ul>';
                template = _.template(
                     openTag +
                        '<% _(list).each(function(field) { %>'+
                            '<li class="<%= field.keyName %>" '+
                                'data-key=<%= field.keyName %>>'+
                                '<% if (field.key !== "") { %>' +
                                    '<%= field.key %> : '+
                                    '<span class="numerical js-value"'+
                                    ' data-value="<%= field.value %>">$' +
                                    '<% } %>'+
                                '<%= field.value %>'+
                                    vars.pencilHtml +
                                '<% if (field.key === "") { %>' +
                                    '<i class="fa fa-trash-o js-remove"></i>'+
                                '<% } %>'+
                                '<% if (field.key !== "") { %>' +
                                    '</span>'+
                                '<% } %>'+
                            '</li>'+
                        '<% }); %>' +
                    closeTag
                );
            }

            return template;
        },


        /**
         * Map Note Data
         */
        mapNoteData : function(model,name,key,value) {
            var file, entryPoint, date;
            if (model.remote) {
                file = 'data/' + model.file;
                entryPoint = file.split('/')[1];
                date = file.split('/')[2].replace('.json','');
            }

            var data = {
                file : file,
                entryPoint : entryPoint,
                name : name,
                key : key,
                value : value,
                date : date,
                currentDate : app.date
            };

            return data;
        },



        /**
         * Number Check
         * @use check if a typeof string is actually a number
         * @param {string} n
         * @ref http://stackoverflow.com/questions/16799469/how-to-check-if-a-string-is-a-natural-number
         */
        numberCheck : function(n) {
            // force the value in case it is not
            n = n.toString();
            var n1 = Math.abs(n),
            n2 = parseInt(n, 10);
            return !isNaN(n1) && n2 === n1 && n1.toString() === n;
        },

        /**
         * Render Nested
         * @use render the nested data of the object
         * @param {object} els
         * @param {object} items
         * @return DOM manipulation
         */
        renderNested : function(els, items){
            var nestedTemplate = null;
            _.each($(els).children(), function(el){
                var className = $(el).attr('data-name');
                nestedTemplate = _.template(
                '<% _(list).each(function(field) { %>'+
                    '<li data-key="<%= field.key.toLowerCase() %>">'+
                        '<span class="<%= field.keyClass %>"'+
                            '><%= field.key %>'+
                        '</span> : '+
                        '<span class="js-value numerical js-visualize '+
                        'card-data"'+
                        'data-value="<%= field.value %>">'+
                            '$<%= field.value %>'+
                            vars.pencilHtml +
                        '</span>' +
                    '</li>'+
                '<% }); %>'
                );
                _.each(items, function(item){
                    if (item.key === className) {
                        var nestedItems = _.map(
                            _.pairs(item.value), function(pair) {
                                return {
                                    keyClass : pair[0],
                                    key : pair[0].ucfirst(),
                                    value : pair[1]
                                };
                            }
                        );
                        $(el).append(nestedTemplate({
                            list : nestedItems
                        }));
                    }
                });
            });
        },

        postApplications : function(){
            // ring is optional
            $('.ring').append(
                '<input class="checkbox js-ring" type="checkbox">'
            );
            $(vars.ring).prop('checked',true);
            app.ring = $('.ring').find('.numerical').attr('data-value');

            // how many notes are there?
            var notes = $(vars.notes).find('.section').length;
            $(vars.notesHeader).html('Notes ('+notes+')');

        },

        /**
         * Add Note Pluses
         * @use add in a plus sign to each note
         */
        addNotePluses : function() {
            $(vars.notes + ' .circle').each(function(){
                $(this).append(vars.plusHtml);
            });
        },

        /**
         * Compute Trends
         * @use calculate trends and append to the trend box
         *      and add information for visualization data
         */
        computeTrends : function() {
            Q.allSettled([
                    server.postPromise(undefined, 'average'),
                    server.getPromise('data/analysis/stats.json')])
            .spread(function(averageResponse, statsResponse)
            {
                if (averageResponse.state === 'fulfilled' &&
                    statsResponse.state === 'fulfilled')
                {
                    // store this info for the visualizations
                    Finances.app.visualize.all_cards =
                        averageResponse.value.cards;
                    Finances.app.visualize.all_dates =
                        averageResponse.value.dates;
                    Finances.app.visualize.stats = statsResponse.value;

                    // add average to DOM
                    var average = averageResponse.value.average;
                    Finances.app.average = app.average = average.toFixed(2);
                    $(vars.toPayAvg).text('$' + average.toFixed(2));
                    var diff = (app.toPay - app.average).toFixed(2);
                    var posOrNeg = diff > 0 ? '+' : '';
                    var diffClass = diff < 0 ? 'plus' : 'negative';
                    $(vars.difference).removeClass('plus negative');
                    $(vars.difference).html('('+posOrNeg + diff+')')
                        .addClass(diffClass);
                }
            });
        },

        /**
         * Create Visualizations
         * @use leverage vis to display graph information for cc info
         * @dependencies
         *      2d: http://visjs.org/docs/graph2d/
         *      custombox: http://dixso.github.io/custombox/
         */
        createVisualizations: function(el) {
            Custombox.open({
                target: '#visualize-overlay',
                effect: 'push',
                position: ['center', 'top'],
                overlayOpacity: 1,
                open: function() {
                    var container = document.getElementById(
                        vars.visualizations.show
                    );
                    var card_type = $(el).parents('.circle')
                    .attr('data-name').toLowerCase();
                    var card = $(el).parents('li').attr('data-key');
                    var items = methods.createItems(card_type, card);
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
                    var stats = Finances.app.visualize.stats;

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
                close: function() {
                    $('#visualize-overlay').hide();
                    $('#visualization').html('');
                    $(document.body).scrollTop($('a[name="pay"]').offset().top);
                },
            });
        },

        /**
         * Create Items
         * @use return items array for visualization purposes
         */
        createItems: function(card_type, card) {
            var items = [];
            var all_cards = Finances.app.visualize.all_cards;
            for(var i = 0; i < Finances.app.visualize.all_dates.length; i++)
            {
                if (all_cards[i][card_type].hasOwnProperty(card)) {
                    items.push({
                        x: Finances.app.visualize.all_dates[i]
                            .replace(/_/, '-'),
                        y: Finances.app.visualize.all_cards[i][card_type][card],
                        label: {
                            content: Finances.app.visualize.all_cards[i]
                                        [card_type][card],
                            className: 'visualize-text',
                            xOffset: -40,
                            yOffset: -15
                        }
                    });
                }
            }
            return items;
        },

        updateOverview : function() {
            // find the diff
            var difference = app.income - app.toPay;
            $(vars.overview.short).text('$'+difference.toFixed(2));
            if (difference < 0) {
                $(vars.overview.short).removeClass('plus');
                $(vars.overview.short).addClass('minus');
            } else {
                $(vars.overview.short).removeClass('minus');
                $(vars.overview.short).addClass('plus');
            }

            // report the date
            $(vars.overview.date).html(
                moment().format('dddd, MMMM Do YYYY')
            );

            // update the to pay key
            var left = 0;
            _.each($(vars.to_pay + ' li'),function(el){
                if (!$(el).find(vars.paid).is(':checked')) {
                    left += parseFloat(
                        $(el).find(vars.value).attr('data-value')
                    );
                }
            });

            $(vars.overview.left).html('$' + left.toFixed(2));
        },

        updateMonth : function(setMonth) {
            var month = typeof(setMonth) === 'undefined' ?
                moment().format('MMMM') : setMonth;
            $(vars.monthHeader).text(month);
        },

        calculations : {
            init : function(){
                methods.calculations.income();
                methods.calculations.debt();
                methods.calculations.toPay();
            },

            /**
             * Income
             * @use given what is on the dom, make the calculation to find the
             *      total income
             */
            income : function() {
                // get total
                var gross = $('.income .gross .numerical').attr('data-value');
                var misc = $(vars.income.misc).parent('ul').find('.numerical')
                    .attr('data-value') ?
                        $(vars.income.misc).parent('ul').find('.numerical')
                    .attr('data-value') :
                        0;
                var total = parseFloat(gross) +  parseFloat(gross) +
                            parseFloat(misc);
                // only append once
                if ($('.income .gross .total').length === 0) {
                    $('.income .gross').append(
                        '<li class="total">'+
                            'Total : ' +
                            '<span class="numerical">'+
                                '$'+ total +
                            '</span>' +
                        '</li>'
                    );
                }

                // get available cash
                var costs = 0;
                _.each($(vars.fixed_costs).parent().children(), function(el){
                    var num = $(el).find('.numerical').attr('data-value');
                    // make sure we got something
                    if (typeof(num) !== 'undefined'){
                        // while we're at it, make this red too
                        $(el).find('.numerical').addClass('negative');
                        costs += parseFloat(num);
                    }
                });

                var available = (total - costs).toFixed(2);
                app.income = parseFloat(available);
                // put in the header
                $(vars.income.header).html(
                    ': $'+ available
                );
                //put at the end of the section
                $(vars.income.section).html(
                    'Total: $' + available
                );
            }, // end income function

            debt : function(){
                var debts = 0;
                _.each($(vars.debt + ' .numerical'), function(el){
                    var num = $(el).attr('data-value');
                    debts += parseFloat(num);
                });

                debts = debts.toFixed(2);
                $(vars.payments.header).html(
                    ': $'+ debts
                );
                $(vars.payments.section).html(
                    'Total: $' + debts
                );
                app.debt = debts;
            }, //end debt function

            toPay : function() {
                var pay = 0;
                _.each($(vars.to_pay + ' .numerical'), function(el){
                    var num = $(el).attr('data-value');
                    pay += parseFloat(num);
                });

                $(vars.toPay.header).html(
                    ': $'+ pay.toFixed(2)
                );
                $(vars.toPay.section).html(
                    'Total: $' + pay.toFixed(2)
                );

                // assign to the app object for convenience
                app.toPay = pay;
            }, //end toPay function
        }, //end calculations obect
    }; // end methods object

    var listeners = {
        init : function(){
            $(document).on('change', vars.ring, function(){
                var $parent = $(this).parent();
                var $el = $parent.find('.numerical');
                var checked = $(this).prop('checked');
                if (checked) {
                    $el.attr('data-value',app.ring);
                    $el.text('$' + app.ring);
                } else {
                    $el.attr('data-value',0);
                    $el.text('$0');
                }
                methods.calculations.income();
                methods.updateOverview();
            });

            /**
             * Paid checkbox listener
             * @use send off a post request when the paid checkbox is changed
             */
            $(document).on('change', vars.paid, function(){
                var checked = $(this).prop('checked');
                // get the model file that corresponds to paid
                var model = app.money.model.get('debt').due_dates;
                var data = listeners.methods.mapInputData($(this));

                var result = server.postIt(
                    model,
                    data.name,
                    data.key,
                    checked,
                    data.parent,
                    undefined,
                    app.date,
                    function(result) {
                        if (result) {
                            methods.updateOverview();
                        }
                    }
                );
            });

            /**
             * Visualizations show listener
             * @use show the associated card data view on click
             */
            $(document).on('click', vars.visualizations.listener, function(e) {
                methods.createVisualizations(this);
                e.preventDefault();
            });

            /**
             * Pencil click listener
             * @use change value to a input box when a pencil is clicked
             */
            $(document).on('click', vars.pencil, function(){
                var $li = $(this).parents('li');
                var key = $li.attr('data-key');
                var model = $(this).parents('.financial').attr('data-model');
                var note = false;
                if (!$li.find(vars.confirm).length) {
                    var input = '<input name="'+model+'"' +
                                'type="text" data-key="'+key+'"'+
                                'class="text-input js-pay-input">'+
                                ' <i class="fa fa-check-circle js-confirm">'+
                                '</i>';
                    // put before and hide that element
                    if ($(this).parent('span').length) {
                        $(this).parent('span').before(input);
                    } else {
                        // dealing with a note
                        var previousText = $li.text();
                        $li.html(input).append(vars.pencilHtml);
                        $li.find(vars.payInput).attr(
                            'data-value',previousText
                        ).addClass('js-value');
                        $li.find(vars.pencil).hide();
                        note = true;
                    }
                } else {
                    $(vars.payInput).css('display','inline-block');
                    $(vars.confirm).show();
                }
                $li.find(vars.payInput).focus();
                $li.find(vars.payInput).val('');
                if (note) {
                    $li.find(vars.payInput).val(previousText);
                }
                $(this).parent('span').hide();
            });

            /**
             * Confirm input box || enter key in input
             * @use change and send off post request and update
             */
            $(document).on('click', vars.confirm, function(){
                var $self = $(this).prev();
                listeners.methods.inputHandler($self);
            });
            $(document).on('keyup', vars.payInput, function(e){
                if (e.keyCode === 13) {
                    listeners.methods.inputHandler($(this));
                }
            });

            /**
             * Confirm note add || enter on input box
             */
            $(document).on('click', vars.noteConfirm, function(){
                var $self = $(this).prev();
                listeners.methods.addNoteHandler($self);
            });
            $(document).on('keyup', vars.noteInput, function(e){
                if (e.keyCode === 13) {
                    listeners.methods.addNoteHandler($(this));
                }
            });

            /**
             * Increase/Decrease Month Listener
             */
            $(document).on('click', vars.increaseMonth, function(e){
                e.preventDefault();
                vars.monthCount++;
                var last = app.date;
                var month = moment()
                        .add(vars.monthCount,'months').format('MMMM');
                methods.updateMonth(month);
                app.date = moment()
                        .add(vars.monthCount,'months').format('YYYY_MM');

                // make a new file
                if ($(this).hasClass('inactive')){
                    var data = {
                        lastMonth : $(this).attr('data-lastMonth'),
                        file : $(this).attr('data-url'),
                        rawDate : $(this).attr('data-rawDate'),
                        rawDateLast : last
                    };
                    server.newMonth(data,function(done){
                        methods.reset(function(){
                            methods.init();
                        });
                    });

                } else {
                    methods.reset(function(done){
                        methods.init();
                    });
                }
            });
            $(document).on('click', vars.decreaseMonth, function(e){
                e.preventDefault();
                vars.monthCount--;
                var month = moment()
                        .add(vars.monthCount,'months').format('MMMM');
                methods.updateMonth(month);
                app.date = moment()
                        .add(vars.monthCount,'months').format('YYYY_MM');
                // re-initialize the app
                methods.reset(function(done){
                    methods.init();
                });
            });
            // reset month to 0, by clicking on the month
            $(document).on('click', vars.monthHeader, function(e){
                e.preventDefault();
                vars.monthCount = 0;
                methods.updateMonth();
                app.date = moment().format('YYYY_MM');
                methods.reset(function(done){
                    methods.init();
                });
            });

            /**
             * Refresh
             * @use refresh the app by clicking the refresh button
             */
            $(document).on('click', vars.refresh, function(e){
                methods.refresh();
            });

            /**
             * Remove
             * @use action on trash can delete icon
             */
            $(document).on('click', vars.remove, function(e){
                var content;
                if (app.mobile) {
                    content = 'Delete this note?';
                } else {
                    var note = $(this).parent('li').text();
                    content = 'You sure you want to delete this note <br/>"' +
                        note + '"';
                }
                var self = this;
                sweetAlert({
                    title: 'Delete Note',
                    text: content,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Remove',
                    closeOnConfirm: false,
                    html: true
                }, function(){
                    // sent request to remove
                    var noteData = listeners.methods.mapNoteData($(self));
                    var data = methods.mapNoteData(
                        noteData.model,
                        noteData.name,
                        noteData.keyName,
                        noteData.value
                    );

                    server.note.remove(
                        data,
                        function(result){
                            if (result) {
                                // refresh the app, instead of changing li keys
                                methods.reset(function(done){
                                    methods.init();
                                });
                            }
                        }
                    );
                    swal('Removed',
                         'Your note has been removed',
                         'success');
                });
            });

            /**
             * Change note to input box on click
             */
            $(document).on('click', vars.addNote, function(){
                var key = $(this).parents('.circle').attr('data-name');
                var noteInputHtml = '<input name="notes"' +
                                'type="text" data-model="notes" '+
                                'data-key="'+key+'"'+
                                'class="text-input js-note-input">'+
                                ' <i class="fa fa-check-circle '+
                                'js-confirm-note">'+
                                '</i>';
                $(this).before(noteInputHtml);
                $(this).parents('.circle').find(vars.noteInput).focus();
            });

            /**
             * Hide overview and trend box if clicked/tap
             */
            var financeEl = document.getElementsByClassName(
                Finances.vars.overviewBoxClass)[0];
            var tapperF = new TapListener(financeEl);
            tapperF.on('tap',function(e){
                listeners.methods.overviewHide(financeEl);
            });

            var trendEl = document.getElementsByClassName(
                Finances.vars.trendBoxClass)[0];
            var tapperE = new TapListener(trendEl);
            tapperE.on('tap',function(e){
                listeners.methods.overviewHide(trendEl);
            });


            // immediately invoked
            methods.updateMonth();

            /**
             * Enquire listener to make the dollar icon also be a dropdown
             */
            enquire.register('screen and (max-width: 320px)', {
                match: function() {
                    $(document).on('click', vars.dropdown.listener, function(){
                        $(vars.dropdown.el).toggle();
                    });
                    app.mobile = true;
                },

            });
        }, // end init function

        methods : {
            mapInputData : function($el) {
                var data = {};
                data.name = $el.attr('name');
                data.key = $el.attr('data-key');
                data.parent = $el.parents('.circle').attr('data-name')
                                                .toLowerCase();
                return data;
            },

            mapNoteData : function($self) {
                var noteData = {};
                noteData.model = $self.parents('.financial').attr('data-model');
                if (app.money.model.get(noteData.model).remote) {
                    noteData.model = app.money.model.get(noteData.model);
                }
                noteData.name = $self.parents('.circle').attr('data-name');
                noteData.keyName = $self.parent('li').attr('data-key');

                return noteData;
            },

            /**
             * Add Note Handler
             * @use logic to send post to add a note
             */
            addNoteHandler : function($self) {
                var key = $self.attr('data-key');
                var value = $self.val();
                var model = $self.attr('data-model');
                var file = app.money.model.get(model).file;

                if (value !== '') {
                    server.note.add(
                        file,
                        model,
                        value,
                        key,
                        function(result) {
                            methods.reset(function(done){
                                methods.init();
                            });
                        }
                    );
                }
            },

            inputHandler : function($self) {
                var key = $self.attr('data-key');
                var value = $self.val();
                var model, result;
                // remove dollar sign if there
                if (value === '') {
                    value = $self.parent('li').find('.js-value')
                                    .attr('data-value');
                }
                value = value.replace('$','');
                // make sure it is a number
                if (!isNaN(value)) {
                    var object;
                    model = $self.parents('.financial').attr('data-model');
                    if (app.money.model.get(model).remote) {
                        model = app.money.model.get(model);
                        object = false;
                    }
                    var data = listeners.methods.mapInputData($self);
                    object = typeof(object) !== 'undefined' ?
                        false : $self.parents('.financial').attr('data-object');

                    server.postIt(
                        model,
                        data.name,
                        data.key,
                        value,
                        data.parent,
                        object,
                        app.date,
                        function(result) {
                            if (result) {
                                $(vars.payInput).hide();
                                $(vars.confirm).hide();
                                $self.parent('li').find('.numerical')
                                    .attr('data-value',value).html(
                                        '$'+value + vars.pencilHtml)
                                    .css('display','inline-block');
                                // update the calculations
                                methods.calculations.income();
                                methods.calculations.debt();
                                methods.calculations.toPay();
                                methods.updateOverview();
                            }
                        });
                } else {
                    // must be a note that was entered
                    var noteData = listeners.methods.mapNoteData($self);

                    var postData = methods.mapNoteData(noteData.model,
                                                   noteData.name,
                                                   noteData.keyName,
                                                   value
                                                  );
                    server.note.update(
                        postData,
                        function(result){
                            if (result) {
                                var updateContent = $self.val() === '' ?
                                    $self.attr('data-value') : $self.val();
                                $self.parent('li').html(
                                    updateContent + vars.pencilHtml
                                );
                            }
                        }
                    );
                }
            }, // end inputHandler

            /**
             * OverviewHide
             * @use show or hide the overview box on tap or click
             */
            overviewHide : function(el) {
                if ($(el).hasClass('thrown')) {
                    $(el).css('left', 'initial');
                    $(el).removeClass('thrown');
                } else {
                    var width = $(window).width();
                    $(el).css('left', width - 20);
                    $(el).addClass('thrown');
                }
            }, //end overviewHide
        },// end methods object within listeners
    }; // end listeners object

    String.prototype.ucfirst = function(){
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    String.prototype.strip = function(){
        return this.replace('_',' ');
    };

    // http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
    function titleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    var API = {
        app : app,
        vars : vars,
        methods : methods,
        listeners : listeners
    };
    // because browserify doesn't bind to the window, put finances & $ in the
    // window, instead of returning it
    window.Finances = API;
    window.$ = $;
    return API;
})();

$(document).ready(function() {
    Finances.methods.init();
    Finances.listeners.init();
});

