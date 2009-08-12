/**
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
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_Router = new Class({

    Implements: Mvc_Class_Base,

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
     * @return void
     */
    addRoute: function(route)
    {
        this._routes.include(
            new Mvc_Router_Route(route)
        );
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

        var params = route.getParams();
        for(var paramName in params) {
            assembledRoute = assembledRoute.replace(':' + paramName,  params[paramName]);
        }

       return assembledRoute;
    }
});