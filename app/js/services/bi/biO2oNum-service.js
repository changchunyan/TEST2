/**
 * The biO2oNum service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiO2oNumService', ['$http', '$q', 'config',
    function($http, $q, config) {
		//服务声明
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;
		service.queryBySummary = queryBySummary;
		
		//方法实现
		/**
		 * 获取分页后的o2o用户信息
		 */
		function getPageList(model) {
	        var deferred = $q.defer();
	        $http.post(config.endpoints.bi.biO2oNum + "/queryForPage", model)
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
		 * 获取所有o2o用户信息
		 */
		function getAllList(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biO2oNum + "/queryByModel", model)
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
		
		/**
		 * 获取所有o2o用户信息
		 */
		function queryBySummary(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biO2oNum + "/queryBySummary", model)
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