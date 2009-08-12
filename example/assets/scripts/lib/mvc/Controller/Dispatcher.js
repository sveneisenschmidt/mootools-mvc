/**
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
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_Controller_Dispatcher = new Class({

    Implements: [Mvc_Class_Base, Events],

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

        if(this.getFrontController().isStage('developement') && $chk(console)) {
            console.info('dispatch: ' + this.getControllerClass(request) + '::' + this.getActionMethod(request) + '!');
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
});