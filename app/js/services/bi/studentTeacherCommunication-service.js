/**
 * The studentTeacherCommunication service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiStudentTeacherCommunicationService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;
		service.getSummaryPageList = getSummaryPageList;
		service.getSummaryAllList = getSummaryAllList;
		service.getComments = getComments;
		service.updateStudentTeacherCommunication = updateStudentTeacherCommunication;
		
		//方法实现
		/**
		 * 获取分页后的信息
		 */
		function getPageList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biStudentTeacherCommunication + "/queryForPage", model)
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
		 * 获取所有信息
		 */
		function getAllList(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biStudentTeacherCommunication + "/queryByModel", model)
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
		 * 获取分页后的信息
		 */
		function getSummaryPageList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biStudentTeacherCommunication + "/queryForSummaryPage", model)
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
		 * 获取所有信息
		 */
		function getSummaryAllList(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biStudentTeacherCommunication + "/querySummaryByModel", model)
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
		 * 获取评价信息
		 */
		function getComments(model) {
			var deferred = $q.defer();
			$http.post(config.endpoints.bi.biStudentTeacherCommunication + "/queryCourseDataAndComments", model)
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
		 * 更新教师评价的记录
		 */
		function updateStudentTeacherCommunication(model){
			var deferred = $q.defer();
			//console.log(model);
			$http.post(config.endpoints.bi.biStudentTeacherCommunication + "/updateStuTeacherCommunication", model)
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