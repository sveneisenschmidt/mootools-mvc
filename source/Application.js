/**
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
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_Application = new Class({

    Implements: [Events, Mvc_Class_Base],

    _name: 'Mvc_Application',

    _front: null,

    _stage: 'prodcution',
    
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

        for (var key in this._config) {
            this._bootstrapKey(key, this._config[key]);
        }
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
});