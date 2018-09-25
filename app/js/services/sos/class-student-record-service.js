/**
 * 班级学员出入班记录service
 */
angular.module('ywsApp').factory(
  'ClassStudentRecordService', ['$http', '$q', 'config',function($http, $q, config) {
	  var service = {};
	  service.findUnAssignedStudents = findUnAssignedStudents;
	  service.joinOrExitClass = joinOrExitClass;
	  service.pageList = pageList;
	  service.deleteLastRecord = deleteLastRecord;
	  
	  /**
	   * 获取待分配学员
	   */
	  function findUnAssignedStudents(model){
		  var deferred = $q.defer();
	      $http.post(config.endpoints.sos.crmStudentClassRecord + "/findUnAssignedStudents", model)
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
	   * 入班或出班操作
	   */
	  function joinOrExitClass(model){
		  var deferred = $q.defer(),
              url = '/joinOrExitClass'
          if(arguments[1]){
              url = '/batchJoinOrExitClass'
          }
	      $http.post(config.endpoints.sos.crmStudentClassRecord + url, model)
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
	   * 获取学员进出班列表
	   */
	  function pageList(model){
		  var deferred = $q.defer();
	      $http.post(config.endpoints.sos.crmStudentClassRecord + "/queryForPage?dateTime="+new Date().getTime(), model)
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
	   * 删除学员最后一条进出班记录
	   */
	  function deleteLastRecord(model){
		  var deferred = $q.defer();
		  $http.post(config.endpoints.sos.crmStudentClassRecord + "/deleteLastRecord", model)
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
