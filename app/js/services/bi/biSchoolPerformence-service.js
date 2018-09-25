/**
 * The biContinuousConsumeCourse service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiSchoolPerformenceService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;
		service.getSchoolPerfermenceInfos = getSchoolPerfermenceInfos;
    service.getBUList = getBUList;
    service.getTimeline = getTimeline;
    service.getSchoolPerfermenceTotal = getSchoolPerfermenceTotal;
		/**
		 * 实时获取校区业绩信息
		 */
		function getSchoolPerfermenceInfos(model){
			 var deferred = $q.defer();
	            $http.post(config.endpoints.bi.biSchoolPerformence, model)
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
		 * 实时获取校区业绩信息总和
		 */
		function getSchoolPerfermenceTotal(model){
			 var deferred = $q.defer();
	            $http.post(config.endpoints.bi.biSchoolPerformence + '/total', model)
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
		//方法实现
		/**
		 * 获取分页后的渠道签约信息
		 */
		function getPageList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biSchoolPerformence + "/queryForPage", model)
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
			$http.post(config.endpoints.bi.biSchoolPerformence + "/queryByModel", model)
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

    function getBUList(model) {
      var deferred = $q.defer();
			$http.post(config.endpoints.bi.biSchoolPerformence + "/queryBUByModel", model)
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

    function getTimeline(departmentId, statType, startDate, endDate) {
      var deferred = $q.defer();
			$http.get(config.endpoints.bi.biSchoolPerformence + "/timeline?departmentId=" + departmentId + "&statType=" + statType + "&startDate=" + startDate + "&endDate=" + endDate)
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
