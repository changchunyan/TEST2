/**
 * The crmChargingScheme service.
 * @version 1.0
 */
angular.module('ywsApp').factory('CrmChargingSchemeService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service={};
		service.getPageList=getPageList;
		service.create=create;
		service.update=update;
		service.updateBySelective=updateBySelective;
		service.remove=remove;
		service.detail=detail;
		var getDateTime = function () {
			return new Date().getTime()
		}
		
		/**
		 * 获取计费分页信息
		 */
		function getPageList(model){
            var deferred=$q.defer();
            $http.post(config.endpoints.sos.crmChargingScheme + "/queryForPage?v="+getDateTime(), model)
              .success(function(response, status, headers, config){
            	  deferred.resolve({
                      data: response.data,
                      numberOfPages: response.data.pages
                  });
              })
              .error(function(response, status, headers, config){
            	  deferred.reject(response.error);
              }
            );
            return deferred.promise;
        }
		
		/**
		 * 增加计费方案
		 */
		function create(model){
			var deferred=$q.defer();
            $http.put(config.endpoints.sos.crmChargingScheme + "/create?v="+getDateTime(), model)
              .success(function(response, status, headers, config){
            	  deferred.resolve(response.data);
              })
              .error(function(response, status, headers, config){
            	  deferred.reject(response.error);
              }
            );
            return deferred.promise;
		}
		
		/**
		 * 更新计费方案
		 */
		function update(model){
			var deferred=$q.defer();
			$http.put(config.endpoints.sos.crmChargingScheme + "/update?v="+getDateTime(), model)
				.success(function(response, status, headers, config){
					deferred.resolve(response.data);
				})
				.error(function(response, status, headers, config){
					deferred.reject(response.error);
				}
			);
			return deferred.promise;
		}
		
		/**
		 * 更新计费方案(可选更新)
		 */
		function updateBySelective(model){
			var deferred=$q.defer();
			$http.put(config.endpoints.sos.crmChargingScheme + "/updateBySelective?v="+getDateTime(), model)
				.success(function(response, status, headers, config){
					deferred.resolve(response.data);
				})
				.error(function(response, status, headers, config){
					deferred.reject(response.error);
				}
			);
			return deferred.promise;
		}
		
		/**
		 * 获取计费方案明细
		 */
		function detail(model){
			var deferred=$q.defer();
			$http.post(config.endpoints.sos.crmChargingScheme + "/queryById/"+model.id)
				.success(function(response, status, headers, config){
					deferred.resolve(response.data);
				})
				.error(function(response, status, headers, config){
					deferred.reject(response.error);
				}
			);
			return deferred.promise;
		}
		
		/**
		 * 删除计费方案
		 */
		function remove(model){
			var deferred=$q.defer();
			$http.post(config.endpoints.sos.crmChargingScheme + "/delete", model)
				.success(function(response, status, headers, config){
					deferred.resolve(response.data);
				})
				.error(function(response, status, headers, config){
					deferred.reject(response.error);
				}
			);
			return deferred.promise;
		}
		
		return service;
	}
]);