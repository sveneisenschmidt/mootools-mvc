/**
 * ErrorController
 *
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @access public
 */

var ErrorController = new Class({

    Implements: [Mvc_Controller_Action],

    _name: 'ErrorController',

    notFoundAction: function()
    {


        this.render();
    }

});