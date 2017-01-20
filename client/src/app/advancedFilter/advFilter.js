(function() {
  'use strict';

  function AdvancedFilterCtrl($scope, $log, $uibModal, filterData, ContactService) {
    var vm = this;

    vm.filterData = angular.copy(filterData);
    vm.optionGroups = ContactService.getGroups();

    vm.close = close;
    vm.save = save;

    function save() {
      $scope.$close(vm.filterData);
    }

    function close() {
      $scope.$dismiss('user cancelled');
    }
  }

  angular.module('code11app.advFilter', [])
    .controller('AdvancedFilterCtrl', AdvancedFilterCtrl);
})();
