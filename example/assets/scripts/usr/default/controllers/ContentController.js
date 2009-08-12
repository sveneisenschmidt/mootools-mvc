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
        this.getView().assign('page', this._getParam('page'));
        this.render();
    },

    viewAction: function()
    {
        this.getView().assign('params', this._getParams());
        this.render();
    },

    sidebarListAction: function()
    {
        this.getView().assign('params', this._getParams());
        this.render();
    }

});