/**
 * The biChannelOrder service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiChannelOrderService', ['$http', '$q', 'config',
    function($http, $q, config) {
		//服务声明
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;
		service.queryBySummary = queryBySummary;
		service.queryByChannelSummary = queryByChannelSummary;
		service.queryByMarketSummary = queryByMarketSummary;
		service.getTabs=getTabs;

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
		function queryByMarketSummary(model1) {
			var deferred = $q.defer();
            var model = angular.copy(model1)
			model.statTime = undefined
            // 將startTime和endTIme日期化
            if (model.startTime && model.startTime.length<=10) {
                model.startTime = new Date(model.startTime.replace(/-/g,'/'))
            }
            if (model.endTime && model.endTime.length<=10) {
                model.endTime = new Date(model.endTime.replace(/-/g,'/'))
            }
			$http.post(config.endpoints.bi.biChannelOrder + "/queryForMarketPage", model)
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