/**
 * The biClassCourse service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiOutboundPhoneService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};
		service.getPageList = getPageList;

		//方法实现
		/**
		 * 获取分页后的外呼统计信息
		 */
		function getPageList(model) {
            var deferred = $q.defer();
            console.log(model);
            $http.post(config.endpoints.bi.biOutboundPhone + "/queryForPage", model)
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
