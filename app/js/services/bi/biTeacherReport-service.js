/**
 * The BiTeacherReportService service.
 * @version 1.0
 */
angular.module('ywsApp').factory('BiTeacherReportService', ['$http', '$q', 'config',
    function($http, $q, config) {
    	var service = {};

        service.generateTeacherConsumeReport = generateTeacherConsumeReport;
        service.getCustomizedDates = getCustomizedDates;
        service.generateTeacherConsumeMonthlyReport = generateTeacherConsumeMonthlyReport;
        service.generateSubjectGroupReport=generateSubjectGroupReport;

        function generateTeacherConsumeReport(schoolId, startDate, endDate) {
          var deferred = $q.defer();
          $http.get(config.endpoints.bi.biTeacherReport + '/consume?schoolId=' + schoolId + '&startDate=' + startDate + '&endDate=' +endDate)
            .success(function(response, status, headers, config) {
              deferred.resolve({ data: response.data });
            })
            .error(function(response, status, headers, config) {
              deferred.reject(response.error);
            });
          return deferred.promise;
        }

        function generateTeacherConsumeMonthlyReport(schoolId, startDate) {
          var deferred = $q.defer();
          $http.get(config.endpoints.bi.biTeacherReport + '/consume/monthly?schoolId=' + schoolId + '&month=' + startDate)
            .success(function(response, status, headers, config) {
              deferred.resolve({ data: response.data });
            })
            .error(function(response, status, headers, config) {
              deferred.reject(response.error);
            });
          return deferred.promise;
        }

        function getCustomizedDates() {
            var deferred = $q.defer();
            $http.get(config.endpoints.bi.biTeacherReport + '/customizedDates')
              .success(function(response, status, headers, config) {
                deferred.resolve({ data: response.data });
              })
              .error(function(response, status, headers, config) {
                deferred.reject(response.error);
              });
            return deferred.promise;
        }
        /**
         * 生成学科组汇总表（非校长）
         */
        function generateSubjectGroupReport(condition){
        	 var deferred = $q.defer();
             $http.post(config.endpoints.bi.biTeacherReport + '/subjectGroup',condition)
               .success(function(response, status, headers, config) {
                 deferred.resolve({ data: response.data });
               })
               .error(function(response, status, headers, config) {
                 deferred.reject(response.error);
               });
             return deferred.promise;
        }
    	return service;
	}
]);
