/*
Script: *
	MooTools MVC - A MVC Approach for the MooTools Javascript Framework

License:
	Custom License.

Copyright:
	Copyright (c) 2009 [Sven Eisenschmidt](http://unsicherheitsagent.de/).
*//**
 *
 * @package Mvc_Application
 * @subpackage Mvc_Application
 */

/**
 * Mvc_Application
 *
 * @package Mvc_Application
 * @subpackage Mvc_Application
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Application = new Class({

    Implements: Events,

    _name: 'Mvc_Application',

    _front: null,

    _stage: 'production',
    
    /**
     * Mvc_Application::initialize
     *
     * @param object config the configuration Object
     * @scope public
     * @return void
     */
    initialize: function(config)
    {
        if(!$chk(config)) {
            new Mvc_Exception('Missing config');
        }

        this._config = config;

        new Mvc_Registry().getInstance().store(
            'config', config
        );

        this.setFrontController(
            new Mvc_Controller_Front());
    },

    /**
     * Mvc_Application::setStage
     *
     * @param stage
     * @scope public
     * @return object
     */
    setStage: function(stage)
    {
        return this.getFrontController().setStage(stage);
    },

    /**
     * Mvc_Application::getStage
     *
     * @scope public
     * @return string
     */
    getStage: function()
    {
        return this.getFrontController().getStage();
    },

    /**
     * Mvc_Application::isStage
     *
     * @scope public
     * @return boolean
     */
    isStage: function(stage)
    {
        return this.getFrontController().isStage(stage);
    },

    /**
     * Mvc_Application::bootstrap
     *
     * @scope public
     * @return void
     */
    bootstrap: function()
    {
        $each(this._config, function(value, key) {
            this._bootstrapKey(key, value);
        }.bind(this));
    },

    /**
     * Mvc_Application::run
     *
     * @scope public
     * @return void
     */
    run: function()
    {
        if(this.getRouter() === null) {
            new Mvc_Exception(this._name + ': No Router given in!');
        }
        if(this.getRequest() === null) {
            new Mvc_Exception(this._name + ': No Request given in!');
        }
        
        this.getFrontController().run();
        return this;
    },
    
    /**
     * Mvc_Application::_bootstrapKey
     *
     * @param object config A confugration item
     * @scope protected
     * @return void
     */
    _bootstrapKey: function(key, value)
    {
       // the confguration for the router
       if(key == 'routes') {
            this.setRouter(
                new Mvc_Router(value));
       }
       if(key == 'stack') {
            if(value.length > 0) {
                this.setActionStack(
                    new Mvc_Controller_Action_Stack(value))
            }
       }

    }.protect(),

    /**
     * Mvc_Application::setActionStack
     *
     * @param object stack
     * @scope public
     * @return void
     */
    setActionStack: function(stack)
    {
        if(stack._name !== 'Mvc_Controller_Action_Stack') {
            new Mvc_Controller_Exception('Stack is no Mvc_Controller_Action_Stack!');
        }
        this.getFrontController().setActionStack(stack);
    },

    /**
     * Mvc_Application::setRouter
     *
     * @param object router The Mv_Router Object
     * @scope public
     * @return void
     */
    setRouter: function(router)
    {
        if(router._name !== 'Mvc_Router') {
            new Mvc_Controller_Exception('Router is no Mvc_Router!');
        }
        this.getFrontController().setRouter(router);
    },

    /**
     * Mvc_Application::getRouter
     *
     * @scope public
     * @return object
     */
    getRouter: function()
    {
        return this.getFrontController().getRouter();
    },

    /**
     * Mvc_Application::getFrontController
     *
     * @scope public
     * @return object
     */
    getFrontController: function()
    {
        return this._front;
    },

    /**
     * Mvc_Application::setFrontController
     *
     * @param object frontCOntroller The Mvc_Controller_Front
     * @scope public
     * @return object
     */
    setFrontController: function(frontController)
    {
        this._front = frontController;
    },

    /**
     * Mvc_Application::setRequest
     *
     * @param object request The Mvc_Request_* Object
     * @scope public
     * @return void
     */
    setRequest: function(request)
    {
        this.getFrontController().setRequest(request);

    },

    /**
     * Mvc_Application::getRequest
     *
     * @scope public
     * @return object
     */
    getRequest: function()
    {
        return this.getFrontController().getRequest();

    },

    /**
     * Mvc_Application::addEvent
     *
     * @scope public
     * @return object
     */
    addEvent: function(type, fn)
    {
        return this.getFrontController().addEvent(type, fn);
    },

    /**
     * Mvc_Application::addEvents
     *
     * @scope public
     * @return object
     */
    addEvents: function(obj)
    {
        return this.getFrontController().addEvents(obj);
    }
});/**
 * Extends Mootools Events
 *
 * Fires when the hash of the locationbar has hanged
 *
 * @package Mvc_Application
 * @subpackage Mvc_Application
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

Element.Events.hashChanged = {

	onAdd: function(){

            var _hash  = window.location.hash;
            var _timer = function() {
                            if(window.location.hash != _hash) {
                                _hash = window.location.hash;
                                this.fireEvent('hashChanged');
                            }
                         };

            _timer.periodical(50, this);
	}

};/**
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Action
 */

/**
 * Mvc_Controller_Action
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Action
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */


var Mvc_Controller_Action = new Class({

    Implements: Mvc_Controller_Action_Interface,

    _name: 'Mvc_Controller_Action',

    _params: null,

    _frontController: null,

    _view: null,

    config: null,

    _response: null,

    /**
     * Mvc_Controller_Action::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function(response)
    {
        this.config = new Mvc_Registry()
                             .getInstance()
                                 .get('config');
    },

    /**
     * Mvc_Controller_Action::setResponse
     *
     * @param object response
     * @scope public
     * @return void
     */
    setResponse: function(response)
    {
        this._response = response;
        return this;
    },

    /**
     * Mvc_Controller_Action::getResponse
     *
     * @scope public
     * @return object
     */
    getResponse: function()
    {
        return this._response;
    },

    /**
     * Mvc_Controller_Action::_initView
     *
     * @scope protected
     * @return void
     */
    _initView: function()
    {
        var view = new Mvc_View();
        var scriptPath = this.getFrontController().getModulesDirectory();

        if($chk(this.getFrontController().getDispatcher().getModule())) {
            scriptPath += this.getFrontController().getDispatcher().getModule() + '/';
        }

        view.setScriptPath(scriptPath + 'views/scripts/');
        this.setView(view);
        
    }.protect(),

    /**
     * Mvc_Controller_Action::dispatch
     *
     * @param string method The method to dispatch!
     * @scope public
     * @return void
     */
    dispatch: function(method)
    {
        this._initView();

        try {
            eval('this.' + method + '()');
        } catch (e) {
            new Mvc_Controller_Exception(this._name + ': ' + e.toString());
        }
    },

    /**
     * Mvc_Controller_Action::setParams
     *
     * @param object params
     * @scope protected
     * @return object
     */
    setParams: function(params)
    {
        this._params = params;
        return this;
    },

    /**
     * Mvc_Controller_Action::_getParams
     *
     * @scope protected
     * @return object
     */
    _getParams: function()
    {
        return this._params;
    }.protect(),

    /**
     * Mvc_Controller_Action::_getParam
     *
     * @scope protected
     * @return object
     */
    _getParam: function(params)
    {
        return this._params[params];
    }.protect(),

    /**
     * Mvc_Controller_Front::setFrontController
     *
     * @param object frontController
     * @scope public
     * @return string
     */
    setFrontController: function(frontController)
    {
        this._frontController = frontController;
        return this;
    },

    /**
     * Mvc_Controller_Front::getFrontController
     *
     * @scope public
     * @return object
     */
    getFrontController: function()
    {
        return this._frontController;
    },

    /**
     * Mvc_Controller_Action::render
     *
     * @scope public
     * @return object
     */
    setView: function(view)
    {
        this._view = view;
        return this;
    },

    /**
     * Mvc_Controller_Action::render
     *
     * @scope public
     * @return object
     */
    getView: function()
    {
        return this._view;
    },

    /**
     * Mvc_Controller_Action::render
     *
     * @scope public
     * @return string
     */
    render: function()
    {
        var html = this.getView().render(
                        this.getViewFile());

        if($chk(this.getView().getHelpers())) {
            this.getResponse().appendHelpers(
                this.getView().getHelpers());
        }

        this.getResponse()
            .appendBody(this.getViewTarget(), html);
    },

    /**
     * Mvc_Controller_Action::getViewFile
     *
     * @scope public
     * @return string
     */
    getViewFile: function()
    {
        var filePath = null;
        if($chk(this._params['view'])) {
            return this._params['view'];
        }
        var currentRoute = this.getFrontController().getCurrentRouteName();

        filePath = this._getParam('controller') + '/' + this._getParam('action') + '.html';

        if($chk(this.config.views)) {
            this.config.views.each(function(item) {
                if($chk(item[currentRoute]) && $chk(item[currentRoute]['view']) && filePath != null) {
                    filePath = item[currentRoute]['view'];
                }                
            });
        }

        return filePath;
    },

    /**
     * Mvc_Controller_Action::getViewTarget
     *
     * @scope public
     * @return string
     */
    getViewTarget: function()
    {

        var target = null;
        if($chk(this._params['target'])) {
            return this._params['target'];
        }
        
        var currentRoute = this.getFrontController().getCurrentRouteName();

        if($chk(this.config.views) && !$chk(target)) {
            this.config.views.each(function(item) {
                if($chk(item[currentRoute]) && $chk(item[currentRoute]['target']) && target == null) {
                    target = item[currentRoute]['target'];
                }
            });
        }

        if(!$chk(target)) {
            this.config.views.each(function(item) {
                if($chk(item['default'])) {
                    if($chk(item['default'])) {
                        target = item['default']['target'];
                    }
                }
            });
        }

        return target;
    }

});/**
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Action_Interface
 */

/**
 * Mvc_Controller_Action_Interface
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Action_Interface
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Controller_Action_Interface = new Class({

    /**
     * Mvc_Controller_Action_Interface::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function()
    {
        throw new Error("Interface can't be called itself!");
    },

    /**
     * Mvc_Controller_Action_Interface::dispatch
     *
     * @scope public
     * @return void
     */
    dispatch: function(n) {
        throw new Error("Method can't be called from its Interface. You have to implement in the child Class!");
    }
});/**
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Action_Stack
 */

/**
 * Mvc_Controller_Action_Stack
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Action_Stack
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */


var Mvc_Controller_Action_Stack = new Class({

    _name: 'Mvc_Controller_Action_Stack',

    _items: null,

    /**
     * Mvc_Controller_Action_Stack::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function(items)
    {
        this._items = items;
    },

    /**
     * Mvc_Controller_Action_Stack::_getAllStackItems
     *
     * @scope protected
     * @return object
     */
    _getAllStackItems: function()
    {
        return this._items;
    }.protect(),

    /**
     * Mvc_Controller_Action_Stack::hasItemsForRoute
     *
     * @param string routeName
     * @scope public
     * @return boolean
     */
    hasItemsForRoute: function(routeName)
    {
        var hasItems = null;
        var items = this._getAllStackItems();

        items.each(function(item) {
            if($chk(item[routeName]) && hasItems == null) {
                hasItems = true;
            }
        });

        if(!$chk(hasItems)) {
            items.each(function(item) {
                if($chk(item['default']) && hasItems == null) {
                    hasItems = true;
                }
            });
        }

        return $chk(hasItems);
    },

    /**
     * Mvc_Controller_Action_Stack::getItemsForRoute
     *
     * @param string routeName
     * @scope public
     * @return object
     */
    getItemsForRoute: function(routeName)
    {
        var returnItems = null;
        var items = this._getAllStackItems();

        items.each(function(item) {
            if($chk(item[routeName]) && returnItems == null) {
                returnItems = item[routeName];
            }
        });

        if(!$chk(returnItems)) {
            items.each(function(item) {
                if($chk(item['default']) && returnItems == null) {
                    returnItems = item['default'];
                }
            });
        }

        return returnItems;
    }
});/**
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Dispatcher
 */

/**
 * Mvc_Controller_Dispatcher
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Dispatcher
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Controller_Dispatcher = new Class({

    Implements: Events,

    _name: 'Mvc_Controller_Dispatcher',

    _defaultController: 'index',

    _defaultAction:     'index',

    _defaultModule:     'default',

    _modulesDirectory: null,

    _defaultErrorController: 'ErrorController',

    _defaultErrorAction: 'error',

    _frontController: null,

    _module: null,

    _response: null,

    _error: false,

    /**
     * Mvc_Controller_Dispatcher::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function()  {},

    /**
     * Mvc_Controller_Dispatcher::setResponse
     *
     * @param object response
     * @scope public
     * @return object
     */
    setResponse: function(response)
    {
        this._response = response;
        return this;
    },

    /**
     * Mvc_Controller_Dispatcher::getResponse
     *
     * @scope public
     * @return object
     */
    getResponse: function()
    {
        return this._response;
    },

    /**
     * Mvc_Controller_Front::disptach
     *
     * @scope object response
     * @return string
     */
    dispatch: function (request, response)
    {
        var request;
        var response;

        if(!$chk(request)) {
            new Mvc_Controller_Exception('The Dispatcher(Mvc_Controller_Dispatcher) is missing the request object');
        }
        if(!$chk(response)) {
            new Mvc_Controller_Exception('The Dispatcher(Mvc_Controller_Dispatcher) is missing the response object');
        } else {
            this.setResponse(response);
        }
        
        try {

            this._loadClass(this.getControllerClass(request))
                .setResponse(this.getResponse())
                    .setFrontController(this.getFrontController())
                        .setParams(request.getAllParams())
                            .dispatch(this.getActionMethod(request));
            
        } catch (exception) {
            this.setError(exception);
        }

        return this;
    },

    /**
     * Mvc_Controller_Front::_loadClass
     *
     * @param string controller
     * @scope protected
     * @return object
     */
    _loadClass: function(controller)
    {
        try {
            return eval('new ' + controller + '()');
        } catch (e) {
            new Mvc_Controller_Exception('Controller "' + controller + '" could not be found!');
        }
    }.protect(),
    
    /**
     * Mvc_Controller_Front::setModuleDirectory
     *
     * @scope public
     * @return void
     */
    setModulesDirectory: function(path)
    {
        this._modulesDirectory = path;
        return this;
    },

    /**
     * Mvc_Controller_Front::getModuleDirectory
     *
     * @scope public
     * @return void
     */
    getModulesDirectory: function()
    {
        return this._modulesDirectory;
    },
    /**
     * Mvc_Controller_Front::getDefaultController
     *
     * @scope public
     * @return string
     */
    getDefaultController: function()
    {
        return this._defaultController;
    },

    /**
     * Mvc_Controller_Front::getDefaultAction
     *
     * @scope public
     * @return string
     */
    getDefaultAction: function()
    {
        return this._defaultAction;
    },

    /**
     * Mvc_Controller_Front::setDefaultModule
     *
     * @scope public
     * @return string
     */
    setDefaultModule: function(module)
    {
        this._defaultModule = module;
        return this;
    },

    /**
     * Mvc_Controller_Front::getDefaultModule
     *
     * @scope public
     * @return string
     */
    getDefaultModule: function()
    {
        return this._defaultModule;
    },

    /**
     * Mvc_Controller_Front::getModule
     *
     * @scope public
     * @return string
     */
    getModule: function()
    {
        return this._module;
    },

    /**
     * Mvc_Controller_Front::setModule
     *
     * @param object request
     * @scope public
     * @return object
     */
    setModule: function(request)
    {
        var module = request.getModuleName();

        if(!$chk(module) || module == this.getDefaultModule()) {
            this._module = this.getDefaultModule();
            return this;
        }

        this._module = module;
        return this;
    },

    /**
     * Mvc_Controller_Front::getActionMethod
     *
     * @param object request
     * @scope public
     * @return string
     */
    getActionMethod: function(request)
    {
        action = request.getActionName();
        if (!$chk(action)) {
            action = this.getDefaultAction();
        }

        return this.formatActionName(action);
    },

    /**
     * Mvc_Controller_Front::formatActionName
     *
     * @param string string
     * @param string string
     * @scope public
     * @return string
     */
    formatActionName: function(string)
    {
        action = string.toLowerCase()
                    .capitalize()
                        .replace(/[^0-9a-zA-Z]+/g, '');

        action = action[0].toLowerCase() +
                    action.substr(1, action.length);
                            
        return action + 'Action';
    },

    /**
     * Mvc_Controller_Front::getControllerClass
     *
     * @param object request
     * @scope public
     * @return string
     */
    getControllerClass: function(request)
    {
        className = request.getControllerName();
        if (!$chk(className)) {
            className = this.getDefaultAction();
        }

        return this.formatControllerName(className, request.getModuleName());
    },

    /**
     * Mvc_Controller_Front::formatControllerName
     *
     * @param string string
     * @param string string
     * @scope public
     * @return string
     */
    formatControllerName: function(string, module)
    {
        controllerName = string.toLowerCase()
                            .capitalize()
                                .replace(/[^0-9a-zA-Z]+/g, '');

        if(($chk(module) == true) && (this.getDefaultModule().toString() != module)) {
            controllerName = module[0].toUpperCase() 
                           + module.substr(1, module.length)
                           + '_' + controllerName;
        }

        return controllerName + 'Controller';
    },

    /**
     * Mvc_Controller_Front::setFrontController
     *
     * @param object frontController
     * @scope public
     * @return string
     */
    setFrontController: function(frontController)
    {
        this._frontController = frontController;
        return this;
    },

    /**
     * Mvc_Controller_Front::getFrontController
     *
     * @scope public
     * @return object
     */
    getFrontController: function()
    {
        return this._frontController;
    },

    /**
     * Mvc_Controller_Dispatcher::setError
     *
     * @param object exception
     * @scope public
     * @return void
     */
    setError: function(exception)
    {
        this._error = exception;
        return this;
    },

    /**
     * Mvc_Controller_Dispatcher::setError
     *
     * @scope public
     * @return Boolean
     */
    hasError: function()
    {
        return $chk(this._error);
    },

    /**
     * Mvc_Controller_Dispatcher::getError
     *
     * @scope public
     * @return object
     */
    getError: function()
    {
        return this._error;
    },

    /**
     * Mvc_Controller_Dispatcher::reset
     *
     * @scope public
     * @return void
     */
    reset: function()
    {
        this._error = false;
        return this;
    }
});/**
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Exception
 */

/**
 * Mvc_Controller_Exception
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Exception
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Controller_Exception = new Class({

    Implements: Mvc_Exception,

    _name: 'Mvc_Controller_Exception'
});/**
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
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Controller_Front = new Class({

    Implements: Events,

    _name: 'Mvc_Controller_Front',

    _router: null,

    _request: null,

    _dispatcher: null,

    _controllerDirectory: null,

    _runOnce: null,

    _stage: null,

    _possibleStages: ['developement', 'production'],

    _layout: null,

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

    /**
     * Mvc_Controller_Front::getResponse
     *
     * @scope public
     * @return object
     */
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
            return this._forward('404');
        }

        this._setCurrentRouteName(route.getRouteName());
        this.fireEvent('afterRouteShutdown');
        this.getRequest().setParams(
            this._getRouteParamsWithRequest(route));

        var module = this.getDispatcher()
                        .setModule(this.getRequest())
                            .getModule();

        // configure the layout
        this.getLayout().setScriptPath(this.getDispatcher().getModulesDirectory() + module + '/');

        this.addEvent('dispatchLoopShutdown', function(){
            this.getLayout().start()
        }.bind(this));

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
            
            var content = this.getDispatcher()
                                  .getResponse()
                                      .getResponseBody();

            content.each(function(entry) {
                    entry.content.inject(this.getLayout()
                        .getElement(entry.target), 'bottom');
            }.bind(this));

            var helpers = this.getDispatcher()
                                 .getResponse()
                                    .getViewHelpers();

            if($chk(helpers)) {
                helpers.each(function(helper) {
                    helper.execute(this);
                        }.bind(this));}

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
        $each(params, function(value, key) {
            routeToReturn[key] = value;
        });

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
     * Mvc_Controller_Front::_forward
     *
     * @param string path
     * @scope protected
     * @return object
     */
    _forward: function(path)
    { 
        if(this.getRequest()._name == 'Mvc_Request_Hash') {
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
});/**
 *
 * @package Mvc_Exception
 * @subpackage Mvc_Exception
 */

/**
 * Mvc_Exception
 *
 * @package Mvc_Exception
 * @subpackage Mvc_Exception
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Exception = new Class({

    _name: 'Mvc_Exception',

    initialize: function(msg)
    {
        throw new Error(msg);
    }
});/**
 *
 * @package Mvc_Layout
 * @subpackage Mvc_Layout
 */

/**
 * Mvc_Layout
 *
 * @package Mvc_Layout
 * @subpackage Mvc_Layout
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Layout = new Class({

    _name: 'Mvc_Layout',

    _scriptPath: null,

    _scriptFile: 'index.html',

    _target: null,

    _layoutHtml: null,

    /**
     * Mvc_Layout::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function() {},

    /**
     * Mvc_Layout::start
     *
     * @scope public
     * @return object
     */
    start: function()
    {
        if(!$chk(this._getLayoutHtml())) {
            this._setLayoutHtml(this._getLayoutFile());
        }

        this.getTarget().set('html', this._getLayoutHtml());
        return this;
    },

    /**
     * Mvc_Layout::_getLayoutHtml
     *
     * @scope protected
     * @return object
     */
    _getLayoutHtml: function()
    {
        return this._layoutHtml;
    }.protect(),

    /**
     * Mvc_Layout::_setLayoutHtml
     *
     * @param string html
     * @scope protected
     * @return void
     */
    _setLayoutHtml: function(html)
    {
        this._layoutHtml = html;
    }.protect(),

    /**
     * Mvc_Layout::_getLayoutFile
     *
     * @scope protected
     * @return string
     */
    _getLayoutFile: function()
    {
        var scriptUrl =   this.getScriptPath() + 'layout/' + this.getScriptFile();
        var request = new Request.HTML({
            method: 'get',
            url: scriptUrl,
            async: false,
            evalScripts: false
        }).send();

        if(!$chk(request.isSuccess())) {
            new Mvc_Exception('No File for Layout found under: "' + this.getScriptPath() + '"!');
        }

        return request.response.html;

    }.protect(),

    /**
     * Mvc_Layout::setScriptPath
     *
     * @param string path
     * @scope public
     * @return object
     */
    setScriptPath: function(path)
    {
        this._scriptPath = path;
        return this;
    },

    /**
     * Mvc_Layout::getScriptPath
     *
     * @scope public
     * @return string
     */
    getScriptPath: function()
    {
        return this._scriptPath;
    },

    /**
     * Mvc_Layout::setScriptFile
     *
     * @param string path
     * @scope public
     * @return object
     */
    setScriptFile: function(file)
    {
        this._scriptFile = file;
        return this;
    },

    /**
     * Mvc_Layout::getScriptFile
     *
     * @scope public
     * @return string
     */
    getScriptFile: function()
    {
        return this._scriptFile;
    },

    /**
     * Mvc_Layout::setTarget
     *
     * @param mixed target
     * @scope public
     * @return object
     */
    setTarget: function(target)
    {
        if($type(target) == 'element') {
            this._target = target;
        }
        if($type(target) == 'string') {
            this._target = document.getElement(target);
        }
        return this;
    },

    /**
     * Mvc_Layout::getTarget
     *
     * @scope public
     * @return object
     */
    getTarget: function()
    {
        return this._target;
    },

    /**
     * Mvc_Layout::getElement
     *
     * @param string selector
     * @scope public
     * @return object
     */
    getElement: function(selector)
    {
        return this.getTarget().getElement(selector);
    }

});/**
 *
 * @package Mvc_Loader
 * @subpackage Mvc_Loader_Autoload
 */

/**
 * Mvc_Autload
 *
 * @package Mvc_Loader
 * @subpackage Mvc_Loader_Autoload
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Loader_Autoload = new Class({
    
    /**
     * Implements Mootools internal Methods
     */
    Implements: Events,

    /**
     * @var Array
     */
    _namespaces: [],

    /**
     * @var Object
     */
    _lastLoadedClass: null,

    /**
     * Sets the namespace including the path to look up for the object
     *
     * @param string namespace The Name of the Namespace
     * @param string path The Path according to the Namespace
     * @scope public
     * @return void
     */
    registerNamespace: function(name, path)
    {
        this._namespaces.include([name, path]);
    },

    /**
     * Returns all Namespaces
     *
     * @return array
     */
    getNamespaces: function()
    {
        return this._namespaces;
    },

    /**
     * tries to autoload the class
     *
     * @param string name The Name of the Object to instanciate
     * @scope public
     * @return void
     */
     autoload: function(name)
     {
         var namespace = this._getNamespaceFromString(name);

         var args = [].extend(arguments).erase(name);

         if(!this._isNamespaceRegistered(namespace[0]))
             throw new Error('No Namespace for "' + namespace[0]  + '" defined!');

         var path = this._getPathFromNamespace(namespace);

         return this._autoload(path, name, args);
     },

    /**
     * appends the javascript file to head and then return the object
     *
     * @param string name The Name of the Object to instanciate
     * @scope public
     * @return void
     */
     _autoload: function(path, name, args)
     {
         var head = document.getElement('head');

         var script = new Element('script', {
                        'type': 'text/javascript',
                        'src': path
                      });
             script.inject(head);

        var argArray = [];
            args.each(function(arg, index){
                argArray.include('args[' + index + ']');
            });

        var call = 'new ' + name + '(' + argArray.join(', ') + ')';


        var request = new Request({method: 'get', url: path}).send();

        _return = function() {
            return eval(call);
        }
     },
     
    /**
     * Returns the path to the object
     *
     * @param array namespace The splitted Namespace
     * @scope protected
     * @return String
     */
     _getPathFromNamespace: function(namespace)
     {
        var location = this._getNamespacePath(namespace[0]);
        
        if( location.charAt(location.length - 1) == '/')
            location = location.substring(0, location.length - 1);


        var path = [location];
            path.extend(namespace);


            return path.join('/') + '.js';
     }.protect(),

    /**
     * checks for the existence of the namespace
     *
     * @param string name The Prefix of the Object Namespace
     * @scope protected
     * @return Boolean
     */
     _isNamespaceRegistered: function(prefix)
     {
        var $return = false;
        this.getNamespaces().each(function(item) {
            if(item[0] == prefix + "_") {
                $return = true;
            }
        });

        return $return;
     }.protect(),

    /**
     * returns the declared path according to the namespace
     *
     * @param string name The Prefix of the Object Namespace
     * @scope protected
     * @return Boolean
     */
     _getNamespacePath: function(prefix)
     {
        var $return = null;
        this.getNamespaces().each(function(item) {
            if(item[0] == prefix + "_") {
                $return = item[1];
            }
        });

        return $return;
     }.protect(),
     
    /**
     * return the name of the namespace
     *
     * @param string name The Name of the Object to retrieve namespace from
     * @scope protected
     * @return Array
     */
     _getNamespaceFromString: function(string)
     {
        var namespace = string.trim()
                              .clean();

        var namespaceItems = namespace.split('_');

        var namespaceArray = new Array();

        var first = namespaceItems[0];
        var last  = namespaceItems.getLast();

            namespaceItems.erase(first)
                          .erase(last);

            namespaceArray.include(first);
        if(namespaceItems.length > 0)
            namespaceItems.each(function(item){
                namespaceArray.include(item);
            });

            namespaceArray.include(last);

        return namespaceArray;


     }.protect()


});/**
 *
 * @package Mvc_Registry
 * @subpackage Mvc_Registry
 */

/**
 * Mvc_Registry
 *
 * @package Mvc_Registry
 * @subpackage Mvc_Registry
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Registry = new Class({

    Implements: Events,

    _name: 'Mvc_Registry',

    _storage: {},

    /**
     * Mvc_Router::store
     *
     * @param string key
     * @param mixed value
     * @scope public
     * @return object
     */
    store: function(key, value)
    {

        this._storage[key] = value;
        this.fireEvent('stored', [key, value]);
        return this
    },

    /**
     * Mvc_Router::get
     *
     * @param string key
     * @scope public
     * @return mixed
     */
    get: function(key)
    {
        return this._storage[key];
    },

    /**
     * Mvc_Router::erase
     *
     * @param string key
     * @scope public
     * @return void
     */
    erase: function(key)
    {
        this._storage.erase(key);
        this.fireEvent('erased', [key]);
        return this;
    },

    /**
     * Mvc_Router::getInstance
     *
     * @scope public
     * @return object
     */
    getInstance: function()
    {
        if(!$chk(window._mvcRegistry)) {
            window._mvcRegistry = new Mvc_Registry();
            return window._mvcRegistry;
        }

        return window._mvcRegistry;
    }
});/**
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
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Request_Abstract = new Class({

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
     },

    /**
     * Mvc_Request_Abstract::getTarget
     *
     * @scope public
     * @return string
     */
     getTarget: function()
     {
         params = this.getAllParams();
         return params['target'];
     }
});/**
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
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Request_Hash = new Class({

    Implements: [Mvc_Request_Abstract, Events],

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

        if(!$chk(window.location.hash)) window.location.hash = '#/';

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
});/**
 *
 * @package Mvc_Request
 * @subpackage Mvc_Request_Standard
 */

/**
 * Mvc_Request_Standard
 *
 * @package Mvc_Request
 * @subpackage Mvc_Request_Standard
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Request_Standard = new Class({

    Implements: Mvc_Request_Abstract,

    _name: 'Mvc_Request_Standard'
});/**
 *
 * @package Mvc_Response
 * @subpackage Mvc_Response_Abstract
 */

/**
 * Mvc_Response_Abstract
 *
 * @package Mvc_Response
 * @subpackage Mvc_Response_Abstract
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Response_Abstract = new Class({

    _name: 'Mvc_Response_Abstract',

    _responseBody: [],

    _responseHelpers: null,

    /**
     * Mvc_Response_Abstract::appendBody
     *
     * @param string key
     * @param string value
     * @scope public
     * @return object
     */
    appendBody: function(key, value)
    {
        this._responseBody.include(
            {
                'target': key,
                'content': value
            }
        );

        return this;
    },

    /**
     * Mvc_Response_Abstract::getResponseBody
     *
     * @scope public
     * @return object
     */
    getResponseBody: function()
    {
        return this._responseBody;
    },

    /**
     * Mvc_Response_Abstract::appendHelpers
     *
     * @param object helpers
     * @scope public
     * @return object
     */
    appendHelpers: function(helpers)
    {
        $each(helpers, function(value, key) {
            if(!$chk(this._responseHelpers)) {
                this._responseHelpers = [];
            }
            this._responseHelpers.include(value);
        }.bind(this));

        return this;
    },

    /**
     * Mvc_Response_Abstract::getViewHelpers
     *
     * @scope public
     * @return object
     */
    getViewHelpers: function()
    {
        return this._responseHelpers;
    }
});/**
 *
 * @package Mvc_Response
 * @subpackage Mvc_Response_Http
 */

/**
 * Mvc_Response_Http
 *
 * @package Mvc_Response
 * @subpackage Mvc_Response_Http
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Response_Http = new Class({

    Implements: Mvc_Response_Abstract,

    _name: 'Mvc_Response_Http',

    /**
     * Mvc_Response_Http::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function() {}
});/**
 *
 * @package Mvc_Router
 * @subpackage Mvc_Router
 */

/**
 * Mvc_Router
 *
 * @package Mvc_Router
 * @subpackage Mvc_Router
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Router = new Class({

    _name: 'Mvc_Router',

    _config: $empty,

    _routes: [],

    /**
     * Mvc_Router::initialize
     *
     * @param object config the configuration Object
     * @scope public
     * @return void
     */
    initialize: function(routes)
    {
        if(!$chk(routes))
            new Mvc_Exception('Missing routes');

        routes.each(function(route){
            this.addRoute(route);
        }.bind(this));
    },

    /**
     * Mvc_Router::addRoute
     *
     * @param object route the configuration for a single route
     * @scope public
     * @return object
     */
    addRoute: function(route)
    {
        this._routes.include(new Mvc_Router_Route(route));
        return this;
    },

    /**
     * Mvc_Router::getRoutes
     *
     * @scope public
     * @return void
     */
    getRoutes: function(route)
    {
        return this._routes;
    },

    /**
     * Mvc_Router::getRouteByName
     *
     * @param string name The name of the route to retrieve
     * @scope public
     * @return void
     */
    getRouteByName: function(name)
    {
        var routeToReturn = null;

        this.getRoutes().each(function(route) {
           if(route.getRouteName() == name) {
               routeToReturn = route;
               return;
           }
        });

        return routeToReturn;
    },

    /**
     * Mvc_Router::getRouteByUrl
     *
     * @param string name The name of the route to retrieve
     * @scope public
     * @return void
     */
    getRouteByUrl: function(search)
    {
        var routeToReturn = null;
        
        this.getRoutes().each(function(route) {
           if(route.match(search) == true && routeToReturn == null) {
               routeToReturn = route;
           }
        });

        if(routeToReturn == null) {
            new Mvc_Router_Exception('No Configuration for this route!');
        }
        
        return routeToReturn;
    },

    assemble: function(params, routeName)
    {
        var route = this.getRouteByName(routeName);

        if(!$chk(route)) {
            new Mvc_Router_Exception(this._name + '::assemble -  Route "' + routeName + '" could not be found!');
        }

        var plainRoute = route.getPlainRoute();
        var assembledRoute = plainRoute;


        for(var paramName in params) {
            assembledRoute = assembledRoute.replace(':' + paramName,  params[paramName]);
        }

        $each(route.getParams(), function(value, key) {
            assembledRoute = assembledRoute.replace(':' + key,  value);
        });
        
        return assembledRoute;
    }
});/**
 *
 * @package Mvc_Router
 * @subpackage Mvc_Router_Exception
 */

/**
 * Mvc_Router_Exception
 *
 * @package Mvc_Router
 * @subpackage Mvc_Router_Exception
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_Router_Exception = new Class({

    Implements: Mvc_Exception,

    _name: 'Mvc_Router_Exception'
});/**
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
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */


var Mvc_Router_Route = new Class({

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
    
});/**
 *
 * @package Mvc_View
 * @subpackage Mvc_View
 */

/**
 * Mvc_View
 *
 * @package Mvc_View
 * @subpackage Mvc_View
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_View = new Class({

    _name: 'Mvc_View',

    _scriptPath: null,

    _helpers: {},

    vars: {},

    _renderContainer: null,

    /**
     * Mvc_Controller_Action::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function()
    {
        return this._setupRenderContainer();
    },

    /**
     * Mvc_Controller_Action::getHelpers
     *
     * @scope public
     * @return object
     */
    getHelpers: function()
    {
        return this._helpers;
    },

    /**
     * Mvc_Controller_Action::getHelper
     *
     * @scope public
     * @return object
     */
    getHelper: function(helper)
    {
        var helperName = helper.toLowerCase();
            helperName = helperName[0].toUpperCase() + helperName.substr(1, helperName.length);

        var helper = helper.toLowerCase();

        if(!$chk(this._helpers[helper.toLowerCase()])){
            this._helpers[helper] = eval('new Mvc_View_Helper_' + helperName);
            return this._helpers[helper];
        }
        
        return this._helpers[helper];
    },

    /**
     * Mvc_Controller_Action::_setupRenderContainer
     *
     * @scope protected
     * @return void
     */
    _setupRenderContainer: function()
    {
        this._renderContainer = new Element('div', {
            'styles': {
                'display': 'none',
                'visibility': 'hidden'
            },
            'class': '_mvcRenderContainer',
            'text': 'test'
        }).inject(document.getElement('body'), 'bottom');

        return this;
    }.protect(),

    /**
     * Mvc_Controller_Action::getRenderContainer
     *
     * @scope protected
     * @return element
     */
    _getRenderContainer: function()
    {
        return document.getElement('div._mvcRenderContainer');
    }.protect(),

    /**
     * Mvc_Controller_Action::setScriptPath
     *
     * @param string path
     * @scope public
     * @return void
     */
    setScriptPath: function(path)
    {
        this._scriptPath = path;
    },

    /**
     * Mvc_Controller_Action::assign
     *
     * @param string key
     * @param mixed value
     * @scope public
     * @return void
     */
    assign: function(key, value)
    {
        this.vars[key] = value;
    },

    /**
     * Mvc_Controller_Action::render
     *
     * @param string filePath
     * @scope public
     * @return string
     */
    render: function(filePath)
    {
        var fullPath = this.getScriptPath() + filePath;

        var request = new Request({method: 'get', async: false, url: fullPath, evalScripts: false});
            request.send();
            
        if(!$chk(request.isSuccess())) {
            new Mvc_View_Exception('No File for View found under: "' + fullPath + '"!');
        }

        $each(this.vars, function(value, key) {
            if($chk(this[key])) {
                new Mvc_Exception(this._name + ': Possible overwrite of an internal Method/Property "' + propName +  '"!');
            }
            this[key] = this.vars[key];
        }.bind(this));

        this.vars = null;

        var injectContainer = new Element('div', {
            'html': request.response.text,
            'class': 'inject-container'
        }).inject(this._getRenderContainer());

        injectContainer.getElements('script').each(function(script){
            eval(script.get('text'));
            script.dispose();
        }.bind(this));

        var html = injectContainer.clone().cloneEvents(injectContainer);
        var htmlElements = html.getElements('*');
        
        injectContainer.getElements('*').each(function(injectItem, index) {
            htmlElements[index].cloneEvents(injectItem);
        });

        injectContainer.dispose();

        return html;
    },

    /**
     * Mvc_Controller_Action::getScriptPath
     *
     * @scope public
     * @return string
     */
    getScriptPath: function()
    {
        return this._scriptPath;
    },

    /**
     * Mvc_Controller_Action::getElement
     *
     * @param string selector
     * @scope public
     * @return object
     */
    getElement: function(selector)
    {
        return this._getRenderContainer().getElement('.inject-container').getElement(selector);
    },

    /**
     * Mvc_Controller_Action::getElements
     *
     * @param string selector
     * @scope public
     * @return object
     */
    getElements: function(selector)
    {
        return this._getRenderContainer().getElement('.inject-container').getElements(selector);
    }
});/**
 *
 * @package Mvc_View
 * @subpackage Mvc_View_Exception
 */

/**
 * Mvc_View_Exception
 *
 * @package Mvc_View
 * @subpackage Mvc_View_Exception
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_View_Exception = new Class({

    Implements: Mvc_Exception,

    _name: 'Mvc_View_Exception'
});/**
 *
 * @package Mvc_View
 * @subpackage Mvc_View_Helper_Abstract
 */

/**
 * Mvc_View_Helper_Abstract
 *
 * @package Mvc_View
 * @subpackage Mvc_View_Helper_Abstract
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_View_Helper_Abstract = new Class({

    /**
     * Mvc_View_Helper_Abstract::execute
     *
     * @scope public
     * @return void
     */
    execute: function() {
        throw new Error("Method can't be called from its parent. You have to overwrite this method in you class!");
    }
});/**
 *
 * @package Mvc_View
 * @subpackage Mvc_View_Helper_Headlink
 */

/**
 * Mvc_View_Helper_Headlink
 *
 * @package Mvc_View
 * @subpackage Mvc_View_Helper_Headlink
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version 0.1 M2
 * @license Custom License
 * @access public
 */

var Mvc_View_Helper_Headtitle = new Class({

    _name: 'Mvc_View_Helper_Headtitle',

    _headTitle: '',

    _preserveOld: false,

    _oldTitle: null,

    /**
     * Mvc_View_Helper_Headtitle::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function() {},

    /**
     * Mvc_View_Helper_Headtitle::set
     *
     * @param sting value
     * @param string type
     * @scope public
     * @return object
     */
    set: function(value, type)
    {
        if(!$chk(type)) {
            this._headTitle = value;
        } else if(type == 'append') {
            this._append(value);
        } else if(type == 'prepend') {
            this._prepend(value);
        }
        return this;
    },

    /**
     * Mvc_View_Helper_Headtitle::execute
     *
     * @scope public
     * @return object
     */
    execute: function(frontController)
    {   
        if(!$chk(this._headTitle)) {
            return false;
        }

        this._oldTitle = document.title;

        if(this._preserveOld) {


            document.title = document.title + " - " + this._headTitle;
        } else {
            document.title = this._headTitle;
        }
        

        var headTitleEvent = function() {
            document.title = this._oldTitle;
            frontController.removeEvent('beforeRouteStartup', headTitleEvent);
        }.bind(this);
        
        frontController.addEvent('beforeRouteStartup', headTitleEvent);

        return true;        
    },

    /**
     * Mvc_View_Helper_Headtitle::preserveOldTitle
     *
     * @param bool boolean
     * @scope public
     * @return object
     */
    preserveOldTitle: function(bool)
    {
        this._preserveOld = bool;
        return this;
    },

    /**
     * Mvc_View_Helper_Headtitle::_append
     *
     * @param sting value
     * @scope protected
     * @return void
     */
    _append: function(value)
    {
        this._set(this._headTitle + value);
    }.protect(),

    /**
     * Mvc_View_Helper_Headtitle::_prepend
     *
     * @param sting value
     * @scope protected
     * @return void
     */
    _prepend: function(value)
    {
        this._set(value + this._headTitle);
    }.protect(),
    
    /**
     * Mvc_View_Helper_Headtitle::_set
     *
     * @param sting value
     * @scope protected
     * @return void
     */
    _set: function(value)
    {
        this._headTitle = value;
    }.protect()
});