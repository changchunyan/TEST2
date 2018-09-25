/**
 * The biConsumeAnalysis service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiConsumeAnalysisService', ['$http', '$q', 'config',
    function($http, $q, config) {

		var service = {};
    service.getStudentClassHour = getStudentClassHour;

    function getStudentClassHour(startDate, endDate, statType, schoolId) {
      var deferred = $q.defer();
      $http.get(config.endpoints.bi.biConsumeAnalysis + "/queryByStartAndEndDate?startDate=" + startDate + "&endDate=" + endDate + "&statType=" + statType + "&schoolId=" + schoolId)
        .success(function(response, status, headers, config) {
          deferred.resolve({
                data: response.data,
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
