/**
 * The biCourseAdvisorProcess service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiCourseAdvisorProcessService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;
		service.getDetailList = getDetailList;
		
		//方法实现
		/**
		 * 获取分页后的渠道签约信息
		 */
		function getPageList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biCourseAdvisorProcess + "/queryForPage", model)
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
		 * 获取所有渠道签约信息
		 */
		function getAllList(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biCourseAdvisorProcess + "/queryByModel", model)
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
		 * 获取所有渠道签约信息
		 */
		function getDetailList(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biCourseAdvisorProcess + "/queryDetailByModel", model)
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