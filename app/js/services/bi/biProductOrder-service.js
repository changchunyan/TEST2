/**
 * The biProductOrder service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiProductOrderService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};
		
		service.getPageList = getPageList;
		service.getAllList = getAllList;
		service.getSummaryAllList = getSummaryAllList;
		/**
		 * 只有数据明细带分页的信息
		 */
		function getPageList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biProductOrder + "/queryForPage", model)
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
		 * 查询汇总的记录，不进行分页，展示所有的产品类型
		 */
		function getSummaryAllList(model){
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biProductOrder + "/queryForSummary", model)
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
	     * 查询所有的统计的数据，用于excel导出，不进行分页
	     */
		function getAllList(model){
		   var deferred = $q.defer();
            $http.post(config.endpoints.bi.biProductOrder + "/queryByModel", model)
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