/**
 * The biChannelOrder service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiGradeSubjectConsumeService', ['$http', '$q', 'config',
    function($http, $q, config) {
		//服务声明
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;
		service.queryBySummary = queryBySummary;
		service.queryByChannelSummary = queryByChannelSummary;
		service.queryByMarketSummary = queryByMarketSummary;
		service.getTabs=getTabs;
    service.getSummary = getSummary;

    function getSummary(departmentId, startDate, endDate) {
      var deferred = $q.defer();
      $http.get(config.endpoints.bi.biGradeSubjectConsume + "?departmentId=" + departmentId + "&startDate=" + startDate + "&endDate=" + endDate)
        .success(function(response, status, headers, config) {
      	  deferred.resolve({ data: response.data });
        })
        .error(function(response, status, headers, config) {
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

		function getTabs(){
			var deferred = $q.defer();
            $http.get(config.endpoints.bi.biChannelOrder + "/tabs")
              .success(function(response, status, headers, config) {
            	  deferred.resolve({
                      data: response.data,
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
            $http.post(config.endpoints.bi.biChannelOrder + "/queryForPage", model)
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
			$http.post(config.endpoints.bi.biChannelOrder + "/queryByModel", model)
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
		function queryBySummary(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biChannelOrder + "/queryBySummary", model)
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
		function queryByChannelSummary(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biChannelOrder + "/queryForChannelPage", model)
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
		function queryByMarketSummary(model) {
			var deferred = $q.defer();
			var params = angular.copy(model)
            // 將startTime和endTIme日期化
            if (params.startTime && params.startTime.length<=10) {
                params.startTime = new Date(params.startTime.replace(/-/g,'/'))
            }
            if (params.endTime && params.endTime.length<=10) {
                params.endTime = new Date(params.endTime.replace(/-/g,'/'))
            }
			$http.post(config.endpoints.bi.biChannelOrder + "/queryForMarketPage", params)
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
