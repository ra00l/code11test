(function() {
  'use strict';

  function config($stateProvider) {
    $stateProvider
      .state('list', {
        url: '/list',
        templateUrl: 'src/app/list/list.tpl.html',
        controller: 'ListCtrl as vm',
        resolve: {
			serverContacts: function(ContactService) {
				return ContactService.getAll();
			}
        }
      });
  }

  function ListCtrl(ContactService, $log, serverContacts) {
    var vm = this;
    vm.refreshContactDisplay = refreshContactDisplay;
    vm.selectContact = selectContact;

    var allContacts = serverContacts;
    refreshContactDisplay();


    function selectContact(contact) {
      vm.selectedContact = contact;
    }

    function refreshContactDisplay() {
      vm.filteredContacts = {};

		allContacts.sort().forEach(function(contact) {

        if(!passsesFilter(contact)) return;

        var arr = vm.filteredContacts[contact.firstName[0]];
        if(!arr) arr = vm.filteredContacts[contact.firstName[0]] = [];

        arr.push(contact);
      });

      $log.log('contacts: ', vm.filteredContacts);
    }

    function passsesFilter(contact) { //raul: angular trims the filter. if it ends with space, bad luck buddy!
      if(!vm.filterName) return true;
      return ((contact.firstName || '').toLowerCase() + ' ' + (contact.lastName || '').toLowerCase()).indexOf(vm.filterName) > -1;
    }
  }

  angular.module('code11app.list', [])
    .config(config)
    .controller('ListCtrl', ListCtrl);
})();
