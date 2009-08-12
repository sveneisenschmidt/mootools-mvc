/**
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
 * @version $Id$
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


});