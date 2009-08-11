/**
 *
 * @package Mvc_Request
 * @subpackage Mvc_Request_Hash
 */

/**
 * Mvc_Request_Hash
 *
 * @package Mvc_Request
 * @subpackage Mvc_Request_Hash
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license MIT-Style License
 * @access public
 */

var Mvc_Request_Hash = new Class({

    Implements: [Mvc_Class_Base, Mvc_Request_Abstract],

    _name: 'Mvc_Request_Hash',

    _requestData: null,

    /**
     * Mvc_Request_Hash::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function()
    {
        this.setRequestData(window.location);

        window.addEvent('hashChanged', function() {
            this.setRequestData(window.location);
            this.fireEvent('changed');
        }.bind(this));
    },

    /**
     * Mvc_Request_Hash::_processData
     *
     * @scope public
     * @return void
     */
    _processData: function()
    {
        this.setRequestUrl(this.getHash());
        this.setProtocol(this._requestData.protocol.replace(':', ''));
        this.setHost(this._requestData.host);
        this.setFullPath(
            this.getProtocol() + '://' + this.getHost() + this._requestData.pathname);

        this.setFullUrl(this._requestData.href);

        if($chk(this._requestData.search) || this._requestData.search != '') {
            this.setQuery(
                this._requestData.search.toString().parseQueryString());
        }


    }.protect(),

    /**
     * Mvc_Request_Hash::getHash
     *
     * @scope public
     * @return String
     */
    getHash: function()
    {
        var hash = this._requestData.hash.replace('#/', '').replace('#', '');

        if(hash.substr(-1) == '/') {
            hash = hash.substr(0, hash.length -1)
        }
        
        return hash;
    },

    /**
     * Mvc_Request_Hash::setRequestData
     *
     * @param data Object The window location object
     * @scope public
     * @return void
     */
    setRequestData: function(data)
    {
        this._requestData = data;
        this._processData();
    }
});