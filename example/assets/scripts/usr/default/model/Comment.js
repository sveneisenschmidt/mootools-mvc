/**
 * Default_Comments_Model
 *
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @access public
 */

var Default_Comments_Model = new Class({

    Implements: [Mvc_Class_Base],

    _name: 'Default_Comments_Model',

    _data: null,

    _sourceFilePath: null,

    getRecent: function(amount)
    {
        return this._loadData('count=' + amount.toInt());
    },

    setSourceFilePath: function(file)
    {
        this._sourceFilePath = file;
        return this;
    },

    _loadData: function(params)
    {
        var request = new Request.JSON({url: this.getSourceFilePath(), method: 'post', async: false });
            request.send(params);

        if(!$chk(request.isSuccess())) {
            throw new Error('Request failed!');
        }

        return request.response.json;
    }.protect(),

    getSourceFilePath: function()
    {
        return this._sourceFilePath;
    }

});