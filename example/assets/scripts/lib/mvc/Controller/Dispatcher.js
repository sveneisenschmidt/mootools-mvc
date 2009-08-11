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
 * @license MIT-Style License
 * @access public
 */

var Mvc_Controller_Dispatcher = new Class({

    Implements: [Mvc_Class_Base, Events],

    _name: 'Mvc_Controller_Dispatcher',

    _defaultController: 'index',

    _defaultAction:     'index',

    _defaultModule:     'default',

    _moduleDirectory: null,

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
    initialize: function() 
    {
        this.setResponse(new Mvc_Response_Http());
    },

    setResponse: function(response)
    {
        this._response = response;
    },

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
        if(!$chk(request)) {
            new Mvc_Controller_Exception('The Dispatcher(Mvc_Controller_Dispatcher) is missing the request object');
        }
        if(!$chk(response)) {
            new Mvc_Controller_Exception('The Dispatcher(Mvc_Controller_Dispatcher) is missing the response object');
        } else {
            this.setResponse(response);
        }

        this.setModule(request);

        actionMethod     = this.getActionMethod(request);
        controllerClass  = this.getControllerClass(request);

        var controller;

        try {

            controller = this.loadClass(controllerClass);
            controller.setResponse(this.getResponse());
            controller.setFrontController(this.getFrontController());
            controller.setParams(request.getAllParams());

            //finally
            controller.dispatch(actionMethod);

            return this;

            //get Reponse

        } catch (exception) {
            this.setError(exception);
            return this;
        }

        return this;
    },

    loadClass: function(controller)
    {
        try {
            controllerObj = eval('new ' + controller + '()');
        } catch (exception) {
            new Mvc_Controller_Exception('Controller "' + controller + '" could not be found!');
        }

        return controllerObj;
    },

    /**
     * Mvc_Controller_Front:getResponse
     *
     * @scope public
     * @return object
     */
    getResponse: function()
    {
        return this._response;
    },

    /**
     * Mvc_Controller_Front:setResponse
     *
     * @param object response
     * @scope public
     * @return void
     */
    setResponse: function(response)
    {
        this._response = response;
    },
    
    /**
     * Mvc_Controller_Front::setDefaultScriptPath
     *
     * @scope public
     * @return void
     */
    setModuleDirectory: function(path)
    {
        this._moduleDirectory = path;
        return this;
    },

    /**
     * Mvc_Controller_Front::getDefaultScriptPath
     *
     * @scope public
     * @return void
     */
    getModuleDirectory: function()
    {
        return this._moduleDirectory;
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
     * Mvc_Controller_Front::getDefaultModule
     *
     * @scope public
     * @return string
     */
    getDefaultModule: function()
    {
        return this._defaultModule;
    },

    getModule: function()
    {
        return this._module;
    },

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
    }
});