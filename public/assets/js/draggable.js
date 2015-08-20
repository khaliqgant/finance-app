/**
 * Draggable.js
 * @author Khaliq Gant
 * @use maps all the selectors
 * @dependencies :
 *      Interactjs : https://github.com/taye/interact.js
 */

'use strict';

var interact = require('interact.js');
var _ = require('underscore');
var vars = require('./vars');

var Draggable = {

    /**
     * Init
     * @use set elements to be able to be draggable
     */
    init : function() {
        // KJG TODO, allow to be moved
        interact(vars.notesSection)
        .draggable({
            snap : {
                targets: [
                    { x: 100, y: 200 },
                    function (x, y) {
                        console.log('huh');
                        return { x: x % 20, y: y };
                    }
                ]}
            });
    },
};

module.exports = Draggable;

