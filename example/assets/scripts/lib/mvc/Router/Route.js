/**
 *
 * @package Mvc_Router_Route
 * @subpackage Mvc_Router
 */

/**
 * Mvc_Router
 *
 * @package Mvc_Router_Route
 * @subpackage Mvc_Router
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */


var Mvc_Router_Route = new Class({

    Implements: Mvc_Class_Base,

    _name: 'Mvc_Router_Route',

    _routeName: $empty,

    _routeParams: $empty,

    _clean: null,

    _route: null,

    /**
     * Mvc_Router_Route::initialize
     *
     * @param object config the configuration Object
     * @scope public
     * @return void
     */
    initialize: function(routeConfig)
    {
        if(!$chk(routeConfig))
            new Mvc_Exception('Missing config');

        this._routeName = this._getIdentifier(routeConfig);

        this._routeParams = this._processRoute(routeConfig[this.getRouteName()]);

    },

    /**
     * Mvc_Router_Route::_getIdentifier
     *
     * @param object config the configuration Object
     * @scope protected
     * @return string
     */
    _getIdentifier: function(routeConfig)
    {
        var routeString = routeConfig.toSource();
            return routeString.substr(2, routeString.indexOf(':') - 2).toString();
    }.protect(),

    /**
     * Mvc_Router_Route::getRouterName
     *
     * @scope public
     * @return string
     */
    getRouteName: function()
    {
        return this._routeName;
    },

    /**
     * Mvc_Router_Route::getPlainRoute
     *
     * @scope public
     * @return string
     */
    getPlainRoute: function()
    {
        return this._route;
    },

    /**
     * Mvc_Router_Route::getCleanRoute
     *
     * @scope public
     * @return string
     */
    getCleanRoute: function()
    {
        return this._clean;
    },

    /**
     * Mvc_Router_Route::getParam
     *
     * @scope public
     * @return Array
     */
    getParam: function(param)
    {
        return this._routeParams[param];
    },

    /**
     * Mvc_Router_Route::getParams
     *
     * @scope public
     * @return Array
     */
    getParams: function()
    {
        return this._routeParams;
    },

    /**
     * Mvc_Router_Route::_processRoute
     *
     * @param object route The current route config
     * @scope protected
     * @return Object
     */
    _processRoute: function(route)
    {
        var main = route.route;
        var params = {};
        var tmpParams = null;

        if(main.indexOf(':') != -1) {
            main = main.substr(0, main.indexOf(':'));

            tmpParams = route.route.replace(main, '').split(':');
            tmpParams.erase('');
            
            tmpParams.each(function(prop) {
                if(prop.substr(-1) == '/') {
                    prop = prop.substr(0, prop.length - 1);
                }
                params[prop] = null;
            });            
        }

        if (main.lastIndexOf('/') == main.length - 1) {
            main = main.substr(0, main.length - 1);
        }

        if($chk(route.defaults)) {
            route.defaults.each(function(item, index){
                key = this._getIdentifier(item);
                value = item[key].toString();
                params[key] = value;
            }.bind(this));
        }

        if(tmpParams != null) {
            tmpParams.each(function(prop){
                if(prop.substr(-1) == '/') {
                    prop = prop.substr(0, prop.length - 1);
                }
                if(!$chk(params[prop]))
                    new Mvc_Router_Exception('Missing Default Parameter "' + prop + '" for Route "' + this.getRouteName() + '" !');
                
            }.bind(this));
        }

        // params.name = this.getRouteName();
        this._route = route.route;
        this._clean = main;

        return params;

    }.protect(),

    /**
     * Mvc_Router_Route::mach
     *
     * @param string path Tries to match the path to a route
     * @scope public
     * @return Boolean
     */
    match: function(path)
    { 
        if(this._getBaseRoute() == path) {
            return true;
        }

        var pathParts = path.split('/');
        var routeParts = this._route.split('/');
        var cleanRouteParts = this._clean.split('/');
        var baseMatch = true;
        
        cleanRouteParts.each(function(key, index){
            if ((key != pathParts[index]) && (baseMatch = false)) {
                baseMatch = true;
            }
        });

        if(baseMatch == true) {

            var pathParams = pathParts.slice(cleanRouteParts.length, pathParts.length);
            var routeParams = routeParts.slice(cleanRouteParts.length, routeParts.length);

            if(routeParams.length.toInt() == pathParams.length.toInt()) {
                return true;
            }
        }

        return false;
    },

    /**
     * Mvc_Router_Route::_getBaseRoute
     *
     * @scope protected
     * @return String
     */
    _getBaseRoute: function()
    {
        var route = this._route;
        if(this._route.indexOf(':') != -1) {
            route = this._route.substr(0, this._route.indexOf(':'));
        }
        if(route.substr(-1) == '/') {
            route = route.substr(0, route.length - 1);
        }
        return route;
    }.protect()
});