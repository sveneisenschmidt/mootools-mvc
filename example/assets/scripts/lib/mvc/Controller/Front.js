/**
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Front
 */

/**
 * Mvc_Controller_Front
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Front
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license MIT-Style License
 * @access public
 */

var Mvc_Controller_Front = new Class({

    Implements: [Mvc_Class_Base, Events],

    _name: 'Mvc_Controller_Front',

    _router: null,

    _request: null,

    _dispatcher: null,

    _controllerDirectory: null,

    _runOnce: null,

    _baseHtml: null,

    /**
     * Mvc_Controller_Front::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function()
    {
        this._dispatcher = new Mvc_Controller_Dispatcher();
        this._setBaseHtml(document.getElement('body').get('html'));
        return this;
    },

    /**
     * Mvc_Controller_Front::reInitialize
     *
     * @scope public
     * @return void
     */
    _reInitialize: function()
    {
        if(this._runOnce != null) {
            this._resetBaseHtml().run();
        }
    },

    /**
     * Mvc_Controller_Front::reInitialize
     *
     * @scope protected
     * @return void
     */
    _resetDispatcher: function()
    {
        this.getDispatcher().reset();
        return this;
    },

    /**
     * Mvc_Controller_Front::_resetBaseHtml
     *
     * @param string html
     * @scope protected
     * @return object
     */
    _resetBaseHtml: function(html)
    {
        document.getElement('body').set('html', this._baseHtml);
        return this;
    },

    /**
     * Mvc_Controller_Front::_setBaseHtml
     *
     * @param string html
     * @scope protected
     * @return object
     */
    _setBaseHtml: function(html)
    {
        this._baseHtml = html;
    },
    
    /**
     * Mvc_Controller_Front::run
     *
     * @scope public
     * @return void
     */
    run: function()
    {

        var requestUrl = this.getRequest().getRequestUrl();
        var route = null;
    
        this.fireEvent('beforeRouteStartup');
        try {
            route = this.getRouter().getRouteByUrl(requestUrl);
        } catch (e) {
            this.dispatch('404');
            return;
        }

        this._setCurrentRouteName(route.getRouteName());
        
        params = this._getRouteParamsWithRequest(route);
        this.fireEvent('afterRouteShutdown');
        this.getRequest().setParams(params);
        this.fireEvent('dispatchLoopStartup');

        // dispatch process
        this.getDispatcher()
                .setFrontController(this)
                    .dispatch(this.getRequest(),
                        new Mvc_Response_Http);

        if(this.getDispatcher().hasError()) {

            this._resetBaseHtml();

            var html  = '<h2>500 Internal Application Error </h2>';
                html += '<p>' + this.getDispatcher().getError() + '</p>';
                html += '<hr/>';
                html += '<p>' + (new Date().toString()) +  '</p>';

                document.getElement('body').set('html', html);

            this._resetDispatcher();
            
        } else {

            this.fireEvent('dispatchLoopShutdown');

            var content = this.getDispatcher()
                                  .getResponse()
                                      .getResponseBody();

            content.each(function(entry) {
                entry.element.set('html', entry.element.get('html') + entry.content);
            });

            this.fireEvent('renderingDone');
        }
        
        this._runOnce = true;
    },

    /**
     * Mvc_Controller_Front::_updateRouteParamsWithRequest
     *
     * @param object route The current Route
     * @scope proetcted
     * @return object
     */
    _getRouteParamsWithRequest: function(route)
    {
      
        var params = route.getParams();
        var plainRoute = route.getPlainRoute();
        var cleanRoute = route.getCleanRoute();
        var path = this.getRequest().getRequestUrl();

        if(path == cleanRoute) {
            return params;
        }

        var pathParts = path.split('/');
        var routeParts = plainRoute.split('/');

        cleanRoute.split('/').each(function(key) {
            pathParts.erase(key);
            routeParts.erase(key)
        });

        routeToReturn = {};
        for (var param in params) {
            routeToReturn[param] = params[param];
        }
        
        routeParts.each(function(key, index) {
            key = key.substr(1, key.length);
            routeToReturn[key] = pathParts[index];
        });

        return routeToReturn;
    }.protect(),
    
    /**
     * Mvc_Controller_Front::setRouter
     *
     * @param object router The Mvc Router object
     * @scope public
     * @return void
     */
    setRouter: function(router)
    {
        if(router._name !== 'Mvc_Router') {
            new Mvc_Controller_Exception('Router is no Mvc_Router!');
        }
            
        this._router = router;
        return this;
    },

    /**
     * Mvc_Controller_Front::getRouter
     *
     * @scope public
     * @return object
     */
    getRouter: function()
    {
        return this._router;
    },

    /**
     * Mvc_Controller_Front::setRequest
     *
     * @param object request The Mvc Request object
     * @scope public
     * @return void
     */
    setRequest: function(request)
    {
        this._request = request;
        this.getRequest().addEvent('changed', function() {
            this._reInitialize();
        }.bind(this));
        return this;
    },

    /**
     * Mvc_Controller_Front::getRequest
     *
     * @scope public
     * @return object
     */
    getRequest: function()
    {
        return this._request;
    },

    /**
     * Mvc_Controller_Front::setDefaultScriptPath
     *
     * @param string path
     * @scope public
     * @return object
     */
    setModuleDirectory: function(path)
    {
        this.getDispatcher().setModuleDirectory(path);
        return this;
    },

    /**
     * Mvc_Controller_Front::setDefaultScriptPath
     *
     * @param string path
     * @scope public
     * @return object
     */
    getDispatcher: function()
    {
        return this._dispatcher;
    },

    /**
     * Mvc_Controller_Front::dispatch
     *
     * @param string path
     * @scope public
     * @return object
     */
    dispatch: function(path)
    {
        return this._forward(path);
    },

    /**
     * Mvc_Controller_Front::_forward
     *
     * @param string path
     * @scope protected
     * @return object
     */
    _forward: function(path)
    { 
        if(this.getRequest().getClassName() == 'Mvc_Request_Hash') {
            window.location.hash = '#/' + path;
            return this;
        }
        return new Mvc_Controller_Exception('Type of Request not supported!');

    }.protect(),

    /**
     * Mvc_Controller_Front::_setCurrentRouteName
     *
     * @param string name
     * @scope protected
     * @return void
     */
    _setCurrentRouteName: function(name)
    {
        this._currentRouteName = name;
    }.protect(),

    /**
     * Mvc_Controller_Front::getCurrentRouteName
     *
     * @scope public
     * @return object
     */
    getCurrentRouteName: function()
    {
        return this._currentRouteName;
    },

    /**
     * Mvc_Controller_Front::getCurrentRoute
     *
     * @scope public
     * @return object
     */
    getCurrentRoute: function()
    {
        return this.getRouter().getRouteByName(this.getCurrentRouteName());
    },

    /**
     * Mvc_Controller_Front::getDefaultScriptPath
     *
     * @param string path
     * @scope public
     * @return object
     */
    getModuleDirectory: function()
    {
        return this.getDispatcher().getModuleDirectory();
    }
});