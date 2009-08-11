/**
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
 * @version $Id$
 * @license MIT-Style License
 * @access public
 */

var Mvc_View = new Class({

    Implements: [Mvc_Class_Base],

    _name: 'Mvc_View',

    _scriptPath: null,

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
        this._setupRenderContainer();
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

        for(var propName in this.vars) {
            if($chk(this[propName])) {
                new Mvc_Exception(this._name + ': Possible overwrite of an internal Method/Property "' + propName +  '"!');
            }
            this[propName] = this.vars[propName];
        }
        this.vars = null;
        
        this._getRenderContainer().set('html', request.response.text);
        this._getRenderContainer().getElements('script').each(function(script){
            eval(script.get('text'));
            script.dispose();
        }.bind(this));

        var html = this._getRenderContainer().get('html');
        this._getRenderContainer().set('html', '');
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
        return this._getRenderContainer().getElement(string);
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
        return this._getRenderContainer().getElements(string);
    }
});