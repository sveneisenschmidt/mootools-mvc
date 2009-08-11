/**
 * ContentController
 *
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @access public
 */

var ContentController = new Class({

    Implements: [Mvc_Controller_Action],

    _name: 'ContentController',

    listAction: function()
    {
        this.render();
    },

    viewAction: function()
    {
        this.getView().assign('params', this._getParams());
        this.render();
    }

});