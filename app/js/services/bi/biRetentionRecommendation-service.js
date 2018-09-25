/**
 * The biRetentionRecommendation service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiRetentionRecommendationService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};
    service.getSummary = getSummary;

    function getSummary(departmentId, startDate, endDate) {
      var deferred = $q.defer();
      $http.get(config.endpoints.bi.biRetentionRecommendation + "/summary?departmentId=" + departmentId + "&startDate=" + startDate + "&endDate=" + endDate)
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
