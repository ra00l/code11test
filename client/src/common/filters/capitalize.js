(function() {
  'use strict';

  function capitalize() {
    return function(text) {
      if(!text) return;
      return text[0].toUpperCase() + text.substr(1);
    };
  }

  angular.module('code11app')
    .filter('capitalize', capitalize);
})();
