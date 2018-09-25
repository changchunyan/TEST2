/**
 * The biSchoolLeads service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiSchoolLeadsService', ['$http', '$q', 'config',
    function($http, $q, config) {
		//服务声明
		var service = {};
		service.getPageList = getPageList;
		service.getSummary = getSummary;
		
		//方法实现
		/**
		 * 获取分页后的校区客户信息统计信息
		 */
		function getPageList(model) {
	        var deferred = $q.defer();
	        $http.post(config.endpoints.bi.biSchoolLeads + "/queryForPage", model)
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
		 * 获取汇总的校区客户信息统计信息
		 */
		function getSummary(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biSchoolLeads + "/queryBySummary", model)
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
		
		return service;
	}
]);