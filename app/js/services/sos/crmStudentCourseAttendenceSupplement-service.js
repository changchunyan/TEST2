/**
 * The crmStudentCourseAttendenceSupplement service.
 * @version 1.0
 */
angular.module('ywsApp').factory('CrmStudentCourseAttendenceSupplementService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};
		service.getPageList=getPageList;
		service.create=create;
		service.update=update;
		service.countStudents=countStudents;
		
		/**
		 * 获取分页信息
		 */
		function getPageList(model){
            var deferred=$q.defer();
            $http.post(config.endpoints.sos.crmStudentCourseAttendenceSupplement + "/queryForPage?v="+new Date().getTime(), model)
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
		 * 插入记录
		 */
		function create(model){
			var deferred=$q.defer();
			$http.post(config.endpoints.sos.crmStudentCourseAttendenceSupplement + "/create", model)
				.success(function(response, status, headers, config) {
		            deferred.resolve(response);
		        })
		        .error(function(response, status, headers, config) {
		        	deferred.reject(response);
		        });
			return deferred.promise;
		}
		/**
		 * 更新记录
		 */
		function update(model){
			var deferred=$q.defer();
			$http.post(config.endpoints.sos.crmStudentCourseAttendenceSupplement + "/update", model)
			.success(function(response, status, headers, config) {
				deferred.resolve(response);
			})
			.error(function(response, status, headers, config) {
				deferred.reject(response);
			});
			return deferred.promise;
		}
		/**
		 * 学生数
		 */
		function countStudents(model){
			var deferred=$q.defer();
			$http.post(config.endpoints.sos.crmStudentCourseAttendenceSupplement + "/countStudents", model)
			.success(function(response, status, headers, config) {
				deferred.resolve(response);
			})
			.error(function(response, status, headers, config) {
				deferred.reject(response);
			});
			return deferred.promise;
		}
		
		return service;
	}
]);