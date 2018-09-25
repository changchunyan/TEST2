/**
 * The BiClassTeachingManagementService service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiClassTeachingManagementService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};
    service.getChildren = getChildren;

    function getChildren(departmentId, startDate, endDate) {
      var deferred = $q.defer();
			$http.get(config.endpoints.bi.biClassTeachingManagement + "/children?departmentId=" + departmentId + "&startDate=" + startDate + "&endDate=" + endDate)
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
