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
                        {'date': ' '},
                        {'id': ' '}
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
    
    $app.run();



    
}



