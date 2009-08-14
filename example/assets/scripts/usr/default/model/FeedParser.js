/**
 * Default_Feed_Parser_Model
 *
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @access public
 */

var Default_Feed_Parser_Model = new Class({

    _name: 'Default_Feed_Parser_Model',

    _response: null,

    initialize: function(amount)
    {
        
    },

    load: function(feedUrl, feedType, feedAmount)
    {
        var request = new Request.HTML({
            method: 'get',
            url: feedUrl,
            async: false
        }).send();

        this._setResponse(request.response.xml);
        
    },

    _setResponse: function(response)
    {
        this._response = response;
        return this;
    },

    _getResponse: function()
    {
        return this._response;
    },

    getResponse: function(feedType)
    {
        return this._parseResponse(feedType);
    },

    _parseResponse: function(feedType)
    {
        var response = this._getResponse();

            switch (feedType) {
            case 'rss':
                return response.getElements('entry');break;
            default:
                return response.getElements('entry');
        }
    }

});