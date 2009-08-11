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

        var router = this.getFrontController().getRouter();
        
        this.getView().assign('title', 'Index Seite!')
        this.getView().assign('links', [
           {
               text: 'Test Link 1',
               href: '#/'
           },
           {
               text: 'Test link to a detail news page assembled by the router',
               href: '#/' + router.assemble({
                              'id': 'assembled-page-link.html',
                              'date': '31-12-1999'
                          },'newsview')
           }
        ]);

        this.render();
    }

});