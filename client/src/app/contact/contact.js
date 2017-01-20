(function() {
  'use strict';

  function ContactCtrl($scope, $log, ContactService, contact) {
    var vm = this;

    vm.contact = contact ? angular.copy(contact) : {};
    vm.optionGroups = ContactService.getGroups();


    vm.close = close;
    vm.save = save;

    function save() {
      $scope.$close(vm.contact);
    }

    function close() {
      $scope.$dismiss('user cancelled');
    }
  }

  angular.module('code11app.detail', [])
    .controller('ContactCtrl', ContactCtrl);
})();
