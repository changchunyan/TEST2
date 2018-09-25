/**
 * The biO2oOrder service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiO2oOrderService', ['$http', '$q', 'config',
    function($http, $q, config) {
		//服务声明
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;
		
		//方法实现
		/**
		 * 获取分页后的o2o订单信息
		 */
		function getPageList(model) {
	        var deferred = $q.defer();
	        $http.post(config.endpoints.bi.biO2oOrder + "/queryForPage", model)
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
		 * 获取所有o2o订单信息
		 */
		function getAllList(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biO2oOrder + "/queryByModel", model)
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