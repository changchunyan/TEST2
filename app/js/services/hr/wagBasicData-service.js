/**
 * The wagBasicData service.
 * @version 1.0
 */
angular.module('ywsApp').factory('WagBasicDataService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};

		service.departmentbasiclist = departmentbasiclist;

		function departmentbasiclist(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.hr.salary+"/queryBasisDataDept",filter)
				.success(function(response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response);
				});
			return deferred.promise;
		}
		
		return service;
	}
]);