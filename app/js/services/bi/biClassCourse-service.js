/**
 * The biClassCourse service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiClassCourseService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;

		//方法实现
		/**
		 * 获取分页后的渠道签约信息
		 */
		function getPageList(model) {
            var deferred = $q.defer();
            console.log(model);
            $http.post(config.endpoints.bi.biClassCourse + "/queryForPage", model)
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
		 * 获取所有课程类型信息
		 */
		function getAllList(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biClassCourse + "/queryByModel", model)
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
