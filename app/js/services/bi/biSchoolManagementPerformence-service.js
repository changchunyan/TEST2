/**
 * The biSchoolManagementPerformence service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiSchoolManagementPerformenceService', ['$http', '$q', 'config',
    function($http, $q, config) {
		//服务声明
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;
		
		/**
		 * 获取分页后的信息
		 */
		function getPageList(model) {
	        var deferred = $q.defer();
	        $http.post(config.endpoints.bi.biSchoolManagementPerformence + "/queryForPage", model)
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
		
		/**
		 * 获取所有信息
		 */
		function getAllList(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biSchoolManagementPerformence + "/queryByModel", model)
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