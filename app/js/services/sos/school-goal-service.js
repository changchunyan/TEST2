'use strict';

/**
 * 校区目标service
 * 
 * @author JeanZhang
 */
angular.module('ywsApp').factory('SchoolGoalService',['$http','$q','config',
	function($http, $q, config) {
		// 服务声明
		var service = {};
		service.addOrUpdate = addOrUpdate;
		service.getPageList = getPageList;
	
		// 方法实现
		/**
		 * 插入或者更新校区目标
		 */
		function addOrUpdate(model){
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.schoolGoal+"/addOrUpdate", model).success(
					function(response, status, headers, config){
						deferred.resolve(response.data);
					}
				).error(
					function(response, status, headers, config){
						deferred.reject(response.error);
					}
				);
			return deferred.promise;	
		}
		
		/**
		 * 获取分页后的校区目标信息
		 */
		function getPageList(model){
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.schoolGoal+"/queryForPage", model).success(
					function(response, status, headers, config){
						deferred.resolve({
							data:response.data,
							numberOfPages:response.data.pages
						});
					}
				).error(
					function(response, status, headers, config){
						deferred.reject(response.error);
					}
				);
			return deferred.promise;
		}
	
		return service;
	} 
]);