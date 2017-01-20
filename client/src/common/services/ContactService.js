(function() {
  'use strict';

  function ContactService($http, $q) {
    return {
      getAll: function() {
        var def = $q.defer();

        $http.get('/src/data/contacts.json').then(function(res) {
          var data = res.data;
          def.resolve(data);
        }, function() {
          alert('oups, an error has occured!');
            def.reject();
        });

        return def.promise;
      }
    };
  }

  angular.module('code11app.services')
    .factory('ContactService', ContactService);
})();
