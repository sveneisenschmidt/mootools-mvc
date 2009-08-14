/**
 * ExampleController
 *
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @access public
 */

var ExampleController = new Class({

    Implements: Mvc_Controller_Action,

    _name: 'ExampleController',

    indexAction: function()
    {

        

        this.render();
    },

    sidebarListAction: function()
    {

        this.getView().assign('links', this._getParam('links'));
        
        this.render();
    }

});