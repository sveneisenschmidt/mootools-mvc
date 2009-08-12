/**
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
 * @version $Id$
 * @license Custom License
 * @access public
 */


var Mvc_Controller_Action = new Class({

    Implements: [Mvc_Class_Base, Mvc_Controller_Action_Interface],

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
        this.config = new Mvc_Registry().getInstance().get('config');
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

        view.setScriptPath(scriptPath + 'views/');
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
            new Mvc_Controller_Exception(this.getClassName() + ': ' + e.toString());
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

});