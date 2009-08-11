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
 * @license MIT-Style License
 * @access public
 */

var Mvc_Application = new Class({

    Implements: [Events, Mvc_Class_Base],

    _name: 'Mvc_Application',

    _front: null,

    _view: null,
    
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

        new Mvc_Config().getInstance().store(
            'config', config
        );

        this.setFrontController(
            new Mvc_Controller_Front());
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

    }.protect(),

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

    }
});