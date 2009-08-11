
/**
 * CommentsController
 *
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @access public
 */

var CommentsController = new Class({

    Implements: [Mvc_Controller_Action],

    _name: 'CommentsController',

    recentAction: function()
    {
        var commentsModel = new Default_Comments_Model();
            commentsModel.setSourceFilePath(APPLICATION_PATH + 'assets/scripts/usr/default/data/comments.json');

        var json = commentsModel.getRecent(
                       this._getParam('amount'));

        this.getView().assign('comments', json.comments.slice(0, this._getParam('amount')));
        this.render();
    }

});


