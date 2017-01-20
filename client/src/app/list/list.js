(function() {
  'use strict';

  function config($stateProvider) {
    $stateProvider
      .state('list', {
        url: '/list',
        templateUrl: 'src/app/list/list.tpl.html',
        controller: 'ListCtrl as vm',
        resolve: { //raul: I actually prefer to load the data inside the controller, because I have better control over error messages and UI (show loading, etc) but I know this is what you are expecting :)
          serverContacts: function (ContactService) {
            return ContactService.getAll();
          },
          checkAuth: function ($q, $state, $timeout, $rootScope) {
            var def = $q.defer();
            $timeout(function () {
              if (!$rootScope.isLogged) {
                $state.go('login');
                def.reject();
              } else {
                def.resolve();
              }
            });

            return def.promise;
          }
        }
      });
  }

  function ListCtrl($log, $state, $uibModal, serverContacts, ContactService, checkAuth) { //leave check auth here

    var vm = this;

    var colorExamples = ['#A0D300', '#EC0033', '#FFCD00', '#00B869', '#999', '#FF7300', '#004CB0', '#CC1111', '#11CCCC', '#1111CC', '#11CC11', '#F781F3', '#B40486', '#FFFF00', '#F5A9A9', '#61380B', '#21610B'];

    vm.groupColors = {};
    ContactService.getGroups().forEach(function(grp, idx) {
      vm.groupColors[grp] = colorExamples[idx];
    });

    vm.refreshContactDisplay = refreshContactDisplay;
    vm.selectContact = selectContact;
    vm.editContact = editContact;
    vm.removeContact = removeContact;
    //vm.formatContactName = formatContactName; todo later, if time
    vm.showAdvancedFilter = showAdvancedFilter;
    vm.removeFilters = removeFilters;

    var allContacts = serverContacts;
    vm.filter = {};
    refreshContactDisplay();

    function removeFilters() {
      vm.filter = {};

      refreshContactDisplay();
    }

    function removeContact(contact) {
      if (!confirm('Are you sure you want to remove ' + contact.firstName + ' ' + contact.lastName + ' ?'))
        return;

      var cidx = allContacts.indexOf(contact);
      if (cidx > -1) {
        allContacts.splice(cidx, 1);

        //todo: send data to server + on OK do next:
        vm.selectedContact = null;

        refreshContactDisplay();
      }
    }

    function showAdvancedFilter() {
      $uibModal.open({
        backdrop: true,
        size: 'lg',
        templateUrl: 'src/app/advancedFilter/advFilter.tpl.html',
        controller: 'AdvancedFilterCtrl',
        controllerAs: 'vm',
        resolve: {
          filterData: function () {
            return vm.filter;
          }
        }
      }).result.then(function (res) {
        //copy props
        vm.filter.name = res.name;
        vm.filter.group = res.group;

        refreshContactDisplay();

      }, function () {
        $log.log('modal dismissed!');
      })
    }

    function editContact(contact) {
      $uibModal.open({
        backdrop: true,
        size: 'lg',
        templateUrl: 'src/app/contact/contact.tpl.html',
        controller: 'ContactCtrl',
        controllerAs: 'vm',
        resolve: {
          contact: function () {
            return contact;
          }
        }
      }).result.then(function (res) {
        //copy props
        var firstNameChanged = contact.firstName != res.firstName;
        contact.firstName = res.firstName;
        contact.lastName = res.lastName;
        contact.group = res.group;

        if (firstNameChanged)
          refreshContactDisplay();

      }, function () {
        $log.log('modal dismissed!');
      });
    }

    function selectContact(contact) {
      vm.selectedContact = contact;
    }

    function refreshContactDisplay() {
      vm.filteredContacts = {};

      allContacts.sort(function compare(contA, contB) {
        var a = contA.firstName.toLowerCase();
        var b = contB.firstName.toLowerCase();

        if (a < b)
          return -1;
        else if (a > b)
          return 1;

        return 0;
      }).forEach(function (contact) {

        if (!passsesFilter(contact)) return;

        var arr = vm.filteredContacts[contact.firstName[0]];
        if (!arr) arr = vm.filteredContacts[contact.firstName[0]] = [];

        arr.push(contact);
      });


      $log.log('contacts: ', vm.filteredContacts);
    }

    function passsesFilter(contact) { //raul: angular trims the filter. if it ends with space, bad luck buddy!
      var passed = true;
      if (vm.filter.name)
        passed = ((contact.firstName || '').toLowerCase() + ' ' + (contact.lastName || '').toLowerCase()).indexOf(vm.filter.name) > -1;

      if (vm.filter.group)
        passed = passed && contact.group === vm.filter.group;

      return passed;
    }
  }

  angular.module('code11app.list', [])
    .config(config)
    .controller('ListCtrl', ListCtrl);
})();
