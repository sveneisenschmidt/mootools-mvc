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

    Implements: [Mvc_Controller_Action_Interface, Events],

    _name: 'Mvc_Controller_Action',

    _params: null,

    _frontController: null,

    view: null,

    config: null,

    _response: null,

    _methodName: null,

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

        this.addEvent('preRenderControllerAction', function() {
            $try(eval('this.preRender' + this.getActionMethodName().ucfirst()));
        }.bind(this));

        this.addEvent('postRenderControllerAction', function() {
            $try(eval('this.postRender' + this.getActionMethodName().ucfirst()));
        }.bind(this));

        $try(eval('this.init'));

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
            view.setController(this);
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
            this._methodName = method;
            eval('this.' + method + '()');
        } catch (e) {
            new Mvc_Controller_Exception(this._name + ': ' + e.message);
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
        this.view = view;
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
        return this.view;
    },

    /**
     * Mvc_Controller_Action::render
     *
     * @scope public
     * @return string
     */
    render: function()
    {
        this.fireEvent('preRenderControllerAction');

        var html = this.getView().render(
                        this.getViewFile());

        if($chk(this.getView().getHelpers())) {
            this.getResponse().appendHelpers(
                this.getView().getHelpers());
        }

        this.getResponse()
            .appendBody(this.getViewTarget(), html);

        this.fireEvent('postRenderControllerAction');
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


        var controller = this._getParam('controller');
        var action = this._getParam('action');

        if(!$chk(controller)) {
            controller = this.getControllerName();
        }
        if(!$chk(action)) {
            action = this.getActionName();
        }


        filePath =  controller + '/' + action  + '.html';

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
     * Mvc_Controller_Action::getControllerName
     *
     * @scope public
     * @return string
     */
    getControllerName: function()
    {
        var controllerName  = this._name.replace('Controller', '').hyphenate();
        if(controllerName[0] == '-') {
            controllerName = controllerName.substring(1, 1000);
        }

        return controllerName;
    },

    /**
     * Mvc_Controller_Action::getActionName
     *
     * @scope public
     * @return string
     */
    getActionName: function()
    {
        return this._methodName.replace('Action', '').hyphenate().toLowerCase();
    },

    /**
     * Mvc_Controller_Action::getActionMethodName
     *
     * @scope public
     * @return string
     */
    getActionMethodName: function()
    {
        return this._methodName;
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