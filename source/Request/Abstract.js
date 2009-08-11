/**
 *
 * @package Mvc_Request
 * @subpackage Mvc_Request_Abstract
 */

/**
 * Mvc_Exception
 *
 * @package Mvc_Request
 * @subpackage Mvc_Request_Abstract
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license MIT-Style License
 * @access public
 */

var Mvc_Request_Abstract = new Class({

    Implements:[ Mvc_Class_Base, Events],

    _name: 'Mvc_Request_Abstract',

    _requestUrl: null,

    _protocol: null,

    _host: null,

    _fullPath: null,

    _fullUrl: null,

    _requestParams: {},

    initialize: function() {},

    /**
     * Mvc_Request_Abstract::setRequestUrl
     *
     * @param string url The Request url
     * @scope public
     * @return void
     */
    setRequestUrl: function(url)
    {
        this._requestUrl = url;
    },

    /**
     * Mvc_Request_Abstract::setHost
     *
     * @param string url The Host url
     * @scope public
     * @return void
     */
    setHost: function(host)
    {
        this._host = host;
    },

    /**
     * Mvc_Request_Abstract::setProtocol
     *
     * @param string url The Protocol Type
     * @scope public
     * @return void
     */
    setProtocol: function (protocol)
    {
        this._protocol = protocol;
    },

    /**
     * Mvc_Request_Abstract::setFullPath
     *
     * @param string path The Full Path fo the Request
     * @scope public
     * @return void
     */
    setFullPath: function (path)
    {
        this._fullPath = path;
    },

    /**
     * Mvc_Request_Abstract::setFullUrl
     *
     * @param string path The Full Url fo the Request
     * @scope public
     * @return void
     */
    setFullUrl: function (url)
    {
        this._fullUrl = url;
    },

    /**
     * Mvc_Request_Abstract::setQuery
     *
     * @param string path The Full Url fo the Request
     * @scope public
     * @return void
     */
    setQuery: function (queryObj)
    {
        this._requestParams = queryObj;
        
    },

    /**
     * Mvc_Request_Abstract::getRequestUrl
     *
     * @scope public
     * @return string
     */
    getRequestUrl: function()
    {
        return this._requestUrl;
    },

    /**
     * Mvc_Request_Abstract::getHost
     *
     * @scope public
     * @return string
     */
    getHost: function()
    {
        return this._host;
    },

    /**
     * Mvc_Request_Abstract::getProtocol
     *
     * @scope public
     * @return string
     */
    getProtocol: function ()
    {
        return this._protocol;
    },

    /**
     * Mvc_Request_Abstract::getFullPath
     *
     * @scope public
     * @return string
     */
    getFullPath: function (path)
    {
        return this._fullPath;
    },

    /**
     * Mvc_Request_Abstract::getFullUrl
     *
     * @scope public
     * @return string
     */
    getFullUrl: function (url)
    {
        return  this._fullUrl;
    },

    /**
     * Mvc_Request_Abstract::getAllParams
     *
     * @scope public
     * @return string
     */
    getAllParams: function()
    {
        
        return this._requestParams;
    },

    /**
     * Mvc_Request_Abstract::setParams
     *
     * @scope public
     * @return string
     */
    setParams: function(params)
    {
        this._requestParams = params;
    },

    /**
     * Mvc_Request_Abstract::getActionName
     *
     * @scope public
     * @return string
     */
     getActionName: function()
     {
         params = this.getAllParams();
         return params['action'];
     },

    /**
     * Mvc_Request_Abstract::getActionName
     *
     * @scope public
     * @return string
     */
     getControllerName: function()
     {
         params = this.getAllParams();
         return params['controller'];
     },

    /**
     * Mvc_Request_Abstract::getModuleName
     *
     * @scope public
     * @return string
     */
     getModuleName: function()
     {
         params = this.getAllParams();
         return params['module'];
     }
});