/**
 * The wagClassTimeDetail service.
 * @version 1.0
 */
angular.module('ywsApp').factory('WagClassTimeDetailService', ['$http', '$q', 'config',
    function($http, $q, config) {
		var service = {};

		service.empbasiclist = empbasiclist;
		service.courseTimeDetail = courseTimeDetail;
		service.xtOrderList =xtOrderList;
		service.queryFourHourStudent =queryFourHourStudent;
		service.queryRefundOrder =queryRefundOrder;
		service.queryTeacherOrderOut =queryTeacherOrderOut;
		service.queryTransferPlatOrder=queryTransferPlatOrder;
		service.queryTeacherOrderInBefore=queryTeacherOrderInBefore;
		service.queryTeacherOrderOutAfter=queryTeacherOrderOutAfter;
		service.queryTeacherOrderIn=queryTeacherOrderIn;

		function empbasiclist(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.hr.salary+"/queryBasisDataForEmp",filter)
				.success(function(response, status, headers, config) {
					deferred.resolve({
						data: response.data.list,
						numberOfPages: response.data.pages
					});
					//deferred.resolve(response);
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response);
				});
			return deferred.promise;
		}

		function courseTimeDetail(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.hr.salary+"/queryCourseDetailForTeacher",filter)
				.success(function(response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response);
				});
			return deferred.promise;
		}

		function xtOrderList(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.hr.salary+"/queryRenewalsOrderDetail",filter)
				.success(function(response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response);
				});
			return deferred.promise;
		}

		function queryFourHourStudent(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.hr.salary+"/queryFourHourStudent",filter)
				.success(function(response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response);
				});
			return deferred.promise;
		}

		function queryTransferPlatOrder(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.hr.salary+"/queryTransferPlatOrder",filter)
				.success(function(response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response);
				});
			return deferred.promise;
		}
		
		function queryRefundOrder(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.hr.salary+"/queryRefundOrder",filter)
				.success(function(response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response);
				});
			return deferred.promise;
		}

		function queryTeacherOrderIn(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.hr.salary+"/queryTeacherOrderIn",filter)
				.success(function(response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response);
				});
			return deferred.promise;
		}

		function queryTeacherOrderInBefore(filter) {
			var deferred = $q.defer();
			$http.get(config.endpoints.hr.salary+"/queryTeacherOrderInBefore/"+filter)
				.success(function(response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response);
				});
			return deferred.promise;
		}

		function queryTeacherOrderOutAfter(filter) {
			var deferred = $q.defer();
			$http.get(config.endpoints.hr.salary+"/queryTeacherOrderOutAfter/"+filter)
				.success(function(response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function(response, status, headers, config) {
					deferred.reject(response);
				});
			return deferred.promise;
		}

		function queryTeacherOrderOut(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.hr.salary+"/queryTeacherOrderOut",filter)
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