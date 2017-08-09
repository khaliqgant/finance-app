/**
 * Info Input View
 */

/* global document */

'use strict';

var Backbone       = require('backbone');
var $              = require('jquery');
var vars           = require('../vars');
var OverviewModel  = require('../models/overview');
var DateModel      = require('../models/date');
var Server = require('../server');

var InputH         = require('../helpers/input');
var InputHelper = new InputH();

var _this;

var InfoInput = Backbone.View.extend({

    initialize: function () {

        _this = this;

        $(document).on('click', vars.confirmInfo, this.confirm);
        $(document).on('keyup', vars.infoInput, this.keyConfirm);

    },

    /**
     *
     * Confirm
     * @desc grab the element and send to the handle on confirm click
     *
     */
    confirm: function (e) {

        var $self = $(this).prev();
        _this.handler($self);

    },

    /**
     *
     * Key Confirm
     * @desc on endter grab the element and send to the handler
     *
     */
    keyConfirm: function (e) {

        if (e.keyCode === 13) {
            _this.handler($(this));
        }

    },

    /**
     *
     * Handler
     * @desc prepare the data to be sent to the server and adjust the DOM
     * after a successful POST
     *
     */
    handler: function ($self) {

        var data = InputHelper.map($self);
        var key = $self.attr('data-key');
        var infoVal = $self.val();
        var $infoEl = $self.prev();
        var associatedValue = $self.attr('data-associated-value');

        data.value = {
            info: infoVal,
            value: associatedValue
        };
        var $parentLi = $self.parents('li');

        var object;
        var model = $self.parents('.financial').attr('data-model');
        if (OverviewModel.get('sectionModels').model.get(model).remote) {
            model = OverviewModel.get('sectionModels').model.get(model);
            object = false;
        }

        object = typeof object !== 'undefined' ?
            false : $self.parents('.financial').attr('data-object');

        Server.postIt(
            model,
            data.name,
            data.key,
            data.value,
            data.parent,
            object,
            DateModel.get('current'),
            function (result) {
                if (result) {
                    $parentLi.find(vars.infoInput).hide();
                    $parentLi.find(vars.confirmInfo).hide();
                    $infoEl.attr('title', infoVal);
                }
            });

    }

});

module.exports = new InfoInput();
