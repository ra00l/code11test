(function() {
  'use strict';

  function config($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'src/app/login/login.tpl.html',
        controller: 'LoginCtrl as vm'
      });
  }

  function LoginCtrl($state) {
    var vm = this;
    //home.data = data.data;

    vm.doLogin = doLogin;


    function doLogin() {
      if(!vm.user || !vm.pass) {
        vm.hasError = true;
        return;
      }

      vm.hasError = false;

      //validation OK, redirect
      $state.go('list');
    }
  }

  angular.module('code11app.login', [])
    .config(config)
    .controller('LoginCtrl', LoginCtrl);
})();
