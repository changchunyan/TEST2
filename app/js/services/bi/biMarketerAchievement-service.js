/**
 * The biMarketerAchievement service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiMarketerAchievementService', ['$http', '$q', 'config',

  function($http, $q, config) {
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;

		function getPageList(model) {
      var deferred = $q.defer();
      $http.post(config.endpoints.bi.biMarketerAchievement + "/queryForPage", model)
        .success(function(response, status, headers, config) {
      	  deferred.resolve({
            data: response.data,
            numberOfPages: response.data.pages
          });
        })
        .error(function(response, status, headers, config) {
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

		function getAllList(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biMarketerAchievement + "/queryByModel", model)
				.success(function(response, status, headers, config) {
					deferred.resolve({
						data: response.data
					});
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response.error);
				}
			);
			return deferred.promise;
		}

		return service;
	}

]);
