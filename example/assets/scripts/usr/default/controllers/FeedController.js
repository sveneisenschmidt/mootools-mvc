
/**
 * FeedController
 *
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @access public
 */

var FeedController = new Class({

    Implements: [Mvc_Controller_Action],

    _name: 'FeedController',

    listFeedAction: function()
    {


        if(!$chk(this._getParam('feed')) || !$chk(this._getParam('type')) || !$chk(this._getParam('amount')) ) {
            throw Error('Missing one or more parameters. You have to define feed, type and amount!');
        }

        if($chk(this._getParam('title'))) {
            this.getView().assign('title', this._getParam('title'));
        }

        var feedUrl     = this._getParam('feed');
        var feedType    = this._getParam('type');
        var feedAmount  = this._getParam('amount');

        var feedParser = new Default_Feed_Parser_Model();
            feedParser.load(feedUrl, feedType, feedAmount);

        var response = feedParser.getResponse(feedType);

        this.getView().assign('items', response);
        this.render();
            
    }

});


