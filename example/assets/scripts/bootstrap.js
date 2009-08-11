var APPLICATION_PATH = window.location.pathname;

var $app;
var config;

window.addEvent('domready', function() {
    config = {
       'routes': [
            {
                'index': {
                    'route': '',
                    'defaults': [
                        {'controller': 'index'},
                        {'action': 'index'}
                    ]
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
       'views': [
           {
               'default': {
                   'target': document.getElement('body')
               }
           },
           // You can assign here a diffetent view file for the route
           // if you dont do so the Action Renderer will look up for
           // a file in the given in module path like views/{controller}/{action}.html
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
        ]
    };
    
    bootstrap();
});

function bootstrap()
{
    $app = new Mvc_Application(config);
    $app.bootstrap();
    $app.setRequest(new Mvc_Request_Hash());
    $app.getFrontController().setModuleDirectory(
        APPLICATION_PATH + 'assets/scripts/usr/'
    );

    $app.getFrontController().addEvent('beforeRouteStartup', function() {
        // this will be fired when a request is done
    });

    $app.getFrontController().addEvent('afterRouteShutdown', function() {
        // this will be fired when a route is succesfull delivered
    });

    $app.getFrontController().addEvent('dispatchLoopStartup', function() {
        // this will be fired before the actual request is getting started to be dispatched
    });

    $app.getFrontController().addEvent('dispatchLoopShutdown', function() {
        // this will be fired after the response is succesfully generated an given back
    });

    $app.getFrontController().addEvent('renderingDone', function() {
    // define here your custom class calls for manipualting the rendered response
    // like setting events etc    
    });

    $app.run();
    
}