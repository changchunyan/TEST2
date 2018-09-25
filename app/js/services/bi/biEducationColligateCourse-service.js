/**
 * The biEducationColligateCourse service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiEducationColligateCourseService', ['$http', '$q', 'config',
    function($http, $q, config) {
		//服务声明
		var service = {};
		service.getPageList = getPageList;
		service.getAllList = getAllList;
		service.getSummaryAllList = getSummaryAllList;
    service.getTeachingManagementPage = getTeachingManagementPage;

    function getTeachingManagementPage(model) {
      if (model.departmentId) {
        model.schoolId = model.departmentId;
      }
      var deferred = $q.defer();
      $http.post(config.endpoints.bi.biEducationColligateCourse + "/listBySub?start=" + model.start + "&size=" + model.size, model)
        .success(function(response, status, headers, config) {
          console.log(response);
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

    function getPageList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biEducationColligateCourse + "/queryForPage", model)
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
		 * 获取分页后的列表
		 */
		function getPageList(model) {
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biEducationColligateCourse + "/queryForPage", model)
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
		 * 查询汇总的记录
		 */
		function getSummaryAllList(model){
            var deferred = $q.defer();
            $http.post(config.endpoints.bi.biEducationColligateCourse + "/querySummary", model)
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
	            $http.post(config.endpoints.bi.biEducationColligateCourse + "/queryByModel", model)
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
