/**
 * Vars.js
 * @author Khaliq Gant
 * @use maps all the selectors
 * @dependencies :
 *      Moment.js : https://github.com/moment/moment
 */

'use strict';

var moment = require('moment');

var Vars = {
    date : moment().format('YYYY_MM'),
    cash : '.js-cash',
    debt : '.js-debt',
    to_pay : '.js-to_pay',
    due_dates : '.js-to_pay',
    closing_dates : '.js-to_pay',
    links : '.js-to_pay',
    notes : '.js-notes',
    remove : '.js-remove',
    notesHeader : '.js-notes-header',
    notesSection : '.js-notes .circle',
    monthHeader : '.js-month span',
    increaseMonth : '.js-increase',
    decreaseMonth : '.js-decrease',
    monthCount : 0,
    value : '.js-value',
    fixed_costs : '.js-fixed_costs',
    income : {
        header : '.js-income',
        section : '.income .js-total'
    },
    payments : {
        header : '.js-payments',
        section : '.payments .js-total'
    },
    toPay : {
        header : '.js-toPay',
        section : '.pay .js-total'
    },
    overview : {
        short : '.js-short',
        date : '.js-date',
        left : '.js-left',
    },
    ring : '.js-ring',
    paid : '.js-paid',
    pencil : '.js-pencil',
    confirm : '.js-confirm',
    noteConfirm : '.js-confirm-note',
    payInput : '.js-pay-input',
    noteInput : '.js-note-input',
    pencilHtml : ' <i class="fa fa-pencil-square-o js-pencil"></i>',
    plusHtml : '<i class="fa fa-plus-circle js-add-note"></i>',
    addNote : '.js-add-note',
    dropdown : {
        listener :'.js-dropdown-activate',
        el :'.js-dropdown',
    },
    refresh : '.js-refresh',
    overviewBoxClass :'js-overview',
    trendBoxClass :'js-trends',
    overviewBox :'.js-overview',
    historical : '.js-historical',
    toPayAvg : '.js-toPay-average',
    difference : '.js-diff',
    visualizations: {
        listener: '.js-visualize',
        show: 'visualization',
        card: '.js-card',
        average: '.js-average',
        min: '.js-min',
        max: '.js-max',
    }
};

module.exports = Vars;

