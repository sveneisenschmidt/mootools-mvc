/**
 * IndexController
 *
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @access public
 */

var IndexController = new Class({

    Implements: [Mvc_Controller_Action],

    _name: 'IndexController',

    indexAction: function()
    {
        this.getView().assign('title', 'Index Seite!')
        this.getView().assign('links', [
           {
               text: 'Test Link 1',
               href: '#/'
           },
           {
               text: 'Test Link 2',
               href: '#/news'
           }
        ]);

        this.render();
    }

});