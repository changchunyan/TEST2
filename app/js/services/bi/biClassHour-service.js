/**
 * The biClassHour service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiClassHourService', ['$http', '$q', 'config',
    function($http, $q, config) {
		//服务声明
		var service = {};
		service.getPageList = getPageList;
		
		//方法实现
		/**
		 * 获取分页后的课时统计信息
		 */
		function getPageList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biClassHour + "/queryForPage", model)
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