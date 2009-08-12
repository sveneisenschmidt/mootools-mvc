var APPLICATION_PATH = window.location.pathname;

var $app;
var config = {

   /*
    *   Routes
    *
    */
   'routes': [
        {
           /*
            *   This route has no defaults.
            *
            *   It will be dispatched with the internal default values:
            *
            *       {'controller': 'content'},
            *       {'action': 'list'},
            *       {'module': 'default}
            */
            'index': {
                'route': ''
            }
        },
        {
            'newslist': {
                'route': 'news/:page',
                'defaults': [
                    {'controller': 'content'},
                    {'action': 'list'},
                    {'page': 1}
                ]
            }
        },
        {
            'newsview': {
                'route': 'news/:date/:id',
                'defaults': [
                    {'controller': 'content'},
                    {'action': 'view'},
                    {'date': '01-01-1970'},
                    {'id': '*'}
                ]
            }
        },
        {
            'recent': {
                'route': 'comments/recent/:amount',
                'defaults': [
                    {'controller': 'comments'},
                    {'action': 'recent'},
                    {'amount': '10'}
                ]
            }
        },

        // TESTING
        {
            '404': {
                'route': '404',
                'defaults': [
                    {'controller': 'error'},
                    {'action': 'not-found'}
                ]
            }
        },
        {
            'error': {
                'route': 'raise-error',
                'defaults': [
                    {'controller': 'fanzy-error-raise'}
                ]
            }
        }
    ],
   /*
    *   Views
    *
    *   You can assign here a different view files and for a route to be used.
    *   If you dont do so the Action Renderer will look up for a file in
    *   the given module path like views/{controller}/{action}.html.
    *
    *   You can also set a param called target.
    *   This params defines where the view is rendered in. Normally you only
    *   need for the main content one area or all.
    *   
    */
   'views': [
       {
           'default': {
               'target': '#content'
           }
       },
       {
           'index': {
               'view': 'index/index.html'
           }
       },
       {
           'newsview': {
               'view': 'content/view.html'
           }
       }
    ],

   /*
    *   ActionStack
    *
    *   In this section you can define additional Controllers/Actions
    *   to be executed. You have to define at least the controller, action
    *   and target.
    *
    *   You can set additional the view, module and additional params.
    *   To switch the stack for a specific route of you declare the route and set the content to []
    */
   /*
    'stack': [
        {
            'default': [
                {
                    'controller': '{your controller}',
                    'action'    : '{the action}',
                    'target'    : '{the element (i.e. #sidebar)}',
                    'module'    : '{the name of the module}',
                    'param1'    : 'value1',
                    'param2'    : 'value2'
                }
            ]
        },
        {
            'otherpage': [] // no stack will be rendered
        }
    ]
    */
    'stack': [
        {
            'default': [
                {
                    'controller': 'content',
                    'action'    : 'sidebar-list',
                    'target'    : '#sidebar',
                    'view'      : 'content/sidebar-list.html',
                    'param1'    : 'value1',
                    'param2'    : 'value2'
                }
            ]
        },
        {
              // 'index': [] // no stack will be rendered
        }
    ]
};

window.addEvent('domready', function() {
    bootstrap();
});

function bootstrap()
{
    $app = new Mvc_Application(config);
    $app.bootstrap();
    // change stages (affects error reporting)
    // $app.setStage('production');
    $app.setStage('developement');
    $app.setRequest(new Mvc_Request_Hash());
    $app.getFrontController().setModulesDirectory(
        APPLICATION_PATH + 'assets/scripts/usr/'
    ).setDefaultModule('default').setLayoutTarget(
        document.getElement('body')
    );
    // add here your events (see below for the list of events)
    $app.run();

}

/*
 *  Events
 *
    $app.addEvents({
        'beforeRouteStartup': function(){
            // this will be fired when a request is passed to the router
        },

        'afterRouteShutdown': function(){
            // this will be fired when a route is succesfull delivered
        },

        'dispatchLoopStartup': function(){
            // this will be fired before the actual request is getting started
            // to be dispatched
        },

        'dispatchActionStackLoopStartup': function(){
            // this will be fired before the actual action stack dispatch loop
        },

        'dispatchActionStackLoopShutdown': function(){
            // this will be fired after the action stack dispatch loop
        },

        'dispatchThrowsError': function(){
            // this will be fired when and before the dispatch process throws an error
        },

        'dispatchLoopShutdown': function(){
            // this will be fired after the response is succesfully
            // generated and returned
        },

        'renderingDone': function(){
            // define here your custom class calls for manipualting the rendered response
            // like setting events etc
        }
    });

 */