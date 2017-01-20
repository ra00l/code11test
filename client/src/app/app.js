(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['code11app']);
  });

  function config($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/list');
    $logProvider.debugEnabled(true);
    //$httpProvider.interceptors.push('httpInterceptor');

   
  }

  function run($log) {
    $log.debug('App is running!');
  }

  angular.module('code11app.filters', []); //declare modules here
	angular.module('code11app.services', []);

  angular.module('code11app', [
      'ui.router',
      'code11app.login',
      'code11app.list',
	  'code11app.services',
      'code11app.filters'
      //'custom',
      //'getting-started',
      //'common.header',
      //'common.footer',
      //'common.services.data',
      //'common.directives.version',
      //'common.filters.uppercase',
      //'common.interceptors.http'//,
      //'templates'
    ])
    .config(config)
    .run(run);
    //.controller('MainCtrl', MainCtrl)
})();
