/**
 * Input View
 */

/* global document */

'use strict';

var Backbone       = require('backbone');
var $              = require('jquery');
var vars           = require('../vars');
var OverviewModel  = require('../models/overview');
var DateModel      = require('../models/date');

var _this;

var Input = Backbone.View.extend({

    initialize: function () {

        _this = this;

        //$(document).on('click', vars.confirm, this.confirm);
        //$(document).on('click', vars.payInput, this.keyConfirm);

    },

    /**
     *
     * Confirm
     * @desc
     *
     */
    confirm: function (e) {

        var $self = $(this).prev();
        _this.handler($self);

    },

    keyConfirm: function (e) {

        if (e.keyCode === 13) {
            _this.handler($(this));
        }

    },

    handler: function ($self) {

        // KJG TODO
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
            if (OverviewModel.get('sectionModels').model.get(model).remote) {
                model = OverviewModel.get('sectionModels').model.get(model);
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
                DateModel.get('current'),
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


    }

});

module.exports = new Input();
