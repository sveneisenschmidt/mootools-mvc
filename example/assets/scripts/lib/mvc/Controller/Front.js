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
 * @license Custom License
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

    _stage: null,

    _possibleStages: ['developement', 'production'],

    /**
     * Mvc_Controller_Front::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function()
    {
        this._dispatcher = new Mvc_Controller_Dispatcher();
        this._layout = new Mvc_Layout();
        
        return this;
    },

    getResponse: function()
    {
        return this._response;
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
            this.run();
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
     * Mvc_Controller_Front::setStage
     *
     * @param stage
     * @scope public
     * @return object
     */
    setStage: function(stage)
    {

        if(!this._possibleStages.contains(stage.toLowerCase())) {
            new Mvc_Exception('Stage: "' + stage + '" is not supported!');
        }
        this._stage = stage.toLowerCase();
        return this;
    },

    /**
     * Mvc_Controller_Front::geStage
     *
     * @scope public
     * @return string
     */
    getStage: function()
    {
        return this._stage;
    },

    /**
     * Mvc_Controller_Front::isStage
     *
     * @scope public
     * @return boolean
     */
    isStage: function(stage)
    {
        return (stage == this.getStage());
    },

    getLayout: function()
    {
        return this._layout;
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
        this._response = new Mvc_Response_Http();
        
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


        var module = this.getDispatcher()
                        .setModule(this.getRequest())
                            .getModule();

        // configure the layout
        this.getLayout().setScriptPath(
            this.getDispatcher().getModulesDirectory() + module  + '/layout/index.html');

        this.fireEvent('dispatchLoopStartup');
        
        // dispatch main request
        this.getDispatcher()
                .setFrontController(this)
                    .dispatch(this.getRequest(), this.getResponse());

        // start dipatch loop for action stack items        
        if(this.hasActionStack() && this.getActionStack().hasItemsForRoute(this.getCurrentRouteName())) {
            this.fireEvent('dispatchActionStackLoopStartup');
            this.getActionStack().getItemsForRoute(this.getCurrentRouteName()).each(function(stackItem) {
                 this._pushActionStack(stackItem);
            }.bind(this));
            this.fireEvent('dispatchActionStackLoopShutdown');
        }
        

        if(this.getDispatcher().hasError()) {
            this.fireEvent('dispatchThrowsError');
            var html  = '<h2>500 Internal Application Error </h2>';

            if ($chk(this.isStage('developement'))) {
                html += '<p>' + this.getDispatcher().getError() + '</p>';
            }

                html += '<hr/>';
                html += '<p>' + (new Date().toString()) +  '</p>';

                this.getLayout().getTarget().set('html', html);

            this._resetDispatcher();
            
        } else {

            this.fireEvent('dispatchLoopShutdown');

            // starts the Layout
            this.getLayout().start();
            
            var content = this.getDispatcher()
                                  .getResponse()
                                      .getResponseBody();

            content.each(function(entry) {
                var target = this.getLayout().getElement(entry.target);
                    target.set('html', target.get('html') + entry.content);                    
            }.bind(this));

            var helpers = this.getDispatcher()
                                 .getResponse()
                                    .getViewHelpers();

            if($chk(helpers)) {
                helpers.each(function(helper) {
                    helper.execute(this);
                }.bind(this));
            }

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
    setModulesDirectory: function(path)
    {
        this.getDispatcher().setModulesDirectory(path);
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
    getModulesDirectory: function()
    {
        return this.getDispatcher().getModulesDirectory();
    },

    /**
     * Mvc_Controller_Front::setDefaultModule
     *
     * @param string module
     * @scope public
     * @return object
     */
    setDefaultModule: function(module)
    {
        this.getDispatcher().setDefaultModule(module);
        return this;
    },

    /**
     * Mvc_Controller_Front::setLayoutTarget
     *
     * @param string target
     * @scope public
     * @return object
     */
    setLayoutTarget: function(target)
    {
        this.getLayout().setTarget(target);
        return this;
    },

    /**
     * Mvc_Controller_Front::getActionStack
     *
     * @scope public
     * @return object
     */
    getActionStack: function() {
        return this._actionStack;
    },

    /**
     * Mvc_Controller_Front::setActionStack
     *
     * @param object stack
     * @scope public
     * @return object
     */
    setActionStack: function(stack)
    {
        this._actionStack = stack;
        return this;
    },

    /**
     * Mvc_Controller_Front::hasActionStack
     *
     * @scope public
     * @return bollean
     */
    hasActionStack: function()
    {
        return $chk(this.getActionStack());
    },

    /**
     * Mvc_Controller_Front::_pushActionStack
     *
     * @scope protected
     * @return object
     */
    _pushActionStack: function(stackItem)
    {
        var stackRequest = new Mvc_Request_Standard();
            stackRequest.setParams(stackItem);
            
        this.getDispatcher()
                .setFrontController(this)
                    .dispatch(stackRequest, this.getResponse());

        return this;
    }.protect()
});