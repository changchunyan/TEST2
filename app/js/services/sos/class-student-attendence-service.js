/**
 * 班级学员出勤记录service
 */
angular.module('ywsApp').factory(
  'ClassStudentAttendenceService', ['$http', '$q', 'config',function($http, $q, config) {
	  var service = {};
	  service.pageList = pageList;
	  service.pageAttendenceList = pageAttendenceList;
	  service.callStudentNames = callStudentNames;
	  service.cancelCallStudentNames = cancelCallStudentNames;
    service.getSNPAttendenceList = getSNPAttendenceList;
    service.updateSNPAttendenceList = updateSNPAttendenceList;
    service.getSNPScoreGroups = getSNPScoreGroups;

	  /**
	   * 获取班级学员
	   */
	  function pageList(model){
		  var deferred = $q.defer();
	      $http.post(config.endpoints.sos.crmStudentClassAttendence + "/queryForPage", model)
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
	   * 获取点名上课学员
	   */
	  function pageAttendenceList(model){
		  var deferred = $q.defer();
		  $http.post(config.endpoints.sos.crmStudentClassAttendence + "/queryAttendenceList", model)
		  .success(function(response, status, headers, config) {
			  deferred.resolve(response);
		  })
		  .error(function(response, status, headers, config) {
			  deferred.reject(response);
		  }
		  );
		  return deferred.promise;
	  }

    function getSNPAttendenceList(classId, date) {
      var deferred = $q.defer();
		  $http.post(config.endpoints.sos.crmStudentClassAttendence + "/snpAttendenceList?classId=" + classId + "&date=" + date, {})
		  .success(function(response, status, headers, config) {
			  deferred.resolve(response);
		  })
		  .error(function(response, status, headers, config) {
			  deferred.reject(response);
		  }
		  );
		  return deferred.promise;
    }

    function updateSNPAttendenceList(attendanceList) {
      var deferred = $q.defer();
		  $http.post(config.endpoints.sos.crmStudentClassAttendence + "/updateSNPAttendenceList", attendanceList)
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
	   * 点名上课操作
	   */
	  function callStudentNames(model){
		  var deferred = $q.defer();
		  $http.post(config.endpoints.sos.crmStudentClassAttendence + "/callStudentNames", model)
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
	   * 撤销上课操作
	   */
	  function cancelCallStudentNames(model){
		  var deferred = $q.defer();
		  $http.post(config.endpoints.sos.crmStudentClassAttendence + "/cancelCallStudentNames", model)
		  .success(function(response, status, headers, config) {
			  deferred.resolve(response);
		  })
		  .error(function(response, status, headers, config) {
			  deferred.reject(response);
		  }
		  );
		  return deferred.promise;
	  }

    function getSNPScoreGroups() {
      var deferred = $q.defer();
		  $http.get(config.endpoints.sos.common + "/snpScoreGroups")
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
