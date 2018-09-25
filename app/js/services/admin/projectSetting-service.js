/**
 * The projectSetting service.
 * @version 1.0
 */
angular.module('ywsApp').factory('ProjectSettingService', ['$http', '$q', 'config',
    function($http, $q, config) {

		var service = {};
	    service.create = create;
	    service.update = update;
	    service.deleteProjectSetting = deleteProjectSetting;
	    service.getProjectSettingByFilter = getProjectSettingByFilter;
	    service.getProjectSettingList = getProjectSettingList;//不带分页

	    // 科目配置
	    service.createSubject = createSubject;
	    service.updateSubject = updateSubject;
	    service.deleteSubject = deleteSubject;
	    service.getSubjectsList = getSubjectsList;

	    var getDateTime = function () {
			return new Date().getTime()
		}
	    /**
	     * 获取项目参数设置列表
	     */
	    function getProjectSettingByFilter(model){
	        var deferred = $q.defer();
	        $http.post(config.endpoints.admin.projectSetting + "/queryByModel?v="+getDateTime(),model)
	            .success(function(response, status, headers, config) {
	            	 deferred.resolve({
	                      data: response.data,
	                      numberOfPages: response.data.pages
	                 });
	            })
	            .error(function(response, status, headers, config) {
	              deferred.reject(response);
	            }
	        );
	        return deferred.promise;
	      }
	     /**
	      * 项目列表-不带分页
	      */
	     function getProjectSettingList(model){
	        var deferred = $q.defer();
	        $http.post(config.endpoints.admin.projectSetting + "/list?v="+getDateTime(),model)
	            .success(function(response, status, headers, config) {
	            	 deferred.resolve({
	                      data: response.data,
	                      numberOfPages: response.data.pages
	                 });
	            })
	            .error(function(response, status, headers, config) {
	              deferred.reject(response);
	            }
	        );
	        return deferred.promise;
	     }

	      /**
	       * Creates a projectSetting.
	       * @param projectSetting the projectSetting to create
	       * @return the promise
	       */
	      function create(projectSetting) {
	        var deferred = $q.defer();
	        $http.post(config.endpoints.admin.projectSetting + "/create?v="+getDateTime(), projectSetting)
	            .success(function(response, status, headers, config) {
	              deferred.resolve(response);
	            })
	            .error(function(response, status, headers, config) {
	              deferred.reject(response);
	            }
	        );
	        return deferred.promise;
	      }

	      /**
	       * Updates a projectSetting.
	       * @param projectSetting the projectSetting to update
	       * @return the promise
	       */
	      function update(projectSetting) {
	        var deferred = $q.defer();
	        $http.post(config.endpoints.admin.projectSetting + '/update?v='+getDateTime(), projectSetting)
	            .success(function(response, status, headers, config) {
	              deferred.resolve(response);
	            })
	            .error(function(response, status, headers, config) {
	              deferred.reject(response);
	            }
	        );
	        return deferred.promise;
	      }
	      /**
	       * 删除项目参数设置
	       */
	      function deleteProjectSetting (subject) {
	    	    var deferred = $q.defer();
		        $http.post(config.endpoints.admin.projectSetting + '/delete?v='+getDateTime(), subject)
		            .success(function(response, status, headers, config) {
		              deferred.resolve(response);
		            })
		            .error(function(response, status, headers, config) {
		              deferred.reject(response);
		            }
		        );
		        return deferred.promise;
	      }
	      /**
	       * 获取科目list
	       */
	      function getSubjectsList(model){
	    	  var deferred = $q.defer();
		        $http.post(config.endpoints.admin.projectSetting + "/querySubjectsByModel?v="+getDateTime(),model)
		            .success(function(response, status, headers, config) {
		            	 deferred.resolve({
		                      data: response.data,
		                      numberOfPages: response.data.pages
		                 });
		            })
		            .error(function(response, status, headers, config) {
		              deferred.reject(response);
		            }
		        );
		        return deferred.promise;
	      }
	      /**
	       * 创建subject
	       */
	      function createSubject(obj){
	    	var deferred = $q.defer();
	        $http.post(config.endpoints.admin.projectSetting + "/createSubject?v="+getDateTime(), obj)
	            .success(function(response, status, headers, config) {
	              deferred.resolve(response);
	            })
	            .error(function(response, status, headers, config) {
	              deferred.reject(response);
	            }
	        );
	        return deferred.promise;
	      }
	      /**
	       * 更新subject
	       */
	      function  updateSubject(obj){
	    	  var deferred = $q.defer();
		      $http.post(config.endpoints.admin.projectSetting + '/updateSubject?v='+getDateTime(), obj)
	            .success(function(response, status, headers, config) {
	              deferred.resolve(response);
	            })
	            .error(function(response, status, headers, config) {
	              deferred.reject(response);
	            }
	          );
		      return deferred.promise;
	      }

	      /**
	       * 删除subject
	       */
	      function deleteSubject(obj){
	    	  var deferred = $q.defer();
		      $http.post(config.endpoints.admin.projectSetting + '/deleteSubject?v='+getDateTime(), obj)
		            .success(function(response, status, headers, config) {
		              deferred.resolve(response);
		            })
		            .error(function(response, status, headers, config) {
		              deferred.reject(response);
		            }
		       );
		       return deferred.promise;
	      }
		return service;
	}
]);
