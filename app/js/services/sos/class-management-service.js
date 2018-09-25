/**
 * The class management service.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').factory(
	'ClassManagementService', ['$http', '$q', 'config', function ($http, $q, config) {
		var service = {};
		service.getClassesByFilter = getClassesByFilter;
		service.create = create;
		service.generateClassCoursePlan = generateClassCoursePlan;
		service.update = update;
		service.getStudentClassUnpastCoursePlan = getStudentClassUnpastCoursePlan;
		service.deleteStudentClassUnpastCoursePlan = deleteStudentClassUnpastCoursePlan;
		service.getClassCoursePlanList = getClassCoursePlanList;
		service.queryById = queryById;

		/**
		 * 查询班级排课记录
		 */
		function getClassCoursePlanList(start, number, params, filter) {
			var deferred = $q.defer();
			if (!params.search.predicateObject) {
				params.search.predicateObject = {};
				params.search.predicateObject.pageNum = start / number + 1;
				params.search.predicateObject.pageSize = number;
			} else {
				params.search.predicateObject.pageNum = start / number + 1;
				params.search.predicateObject.pageSize = number;
			}
			filter.pageNum = params.search.predicateObject.pageNum;
			filter.pageSize = params.search.predicateObject.pageSize;
			$http.post(config.endpoints.sos.crmStudentClass + '/getClassCoursePlanList', filter).success(function (response, status, headers, config) {
				deferred.resolve({
					data: response.data.list,
					numberOfPages: response.data.pages
				});
			}).error(function (response, status, headers, config) {
				deferred.reject(response.error);
			}
				);
			return deferred.promise;
		}

		function deleteStudentClassUnpastCoursePlan(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.crmStudentClass + "/deleteStudentClassUnpastCoursePlan", filter)
				.success(function (response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function (response, status, headers, config) {
					deferred.reject(response);
				}
				);
			return deferred.promise;
		}

		function getStudentClassUnpastCoursePlan(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.crmStudentClass + "/getStudentClassUnpastCoursePlan", filter)
				.success(function (response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function (response, status, headers, config) {
					deferred.reject(response);
				}
				);
			return deferred.promise;
		}

		function getClassesByFilter(filter) {
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.crmStudentClass + "/queryForPage", filter)
				.success(function (response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function (response, status, headers, config) {
					deferred.reject(response);
				}
				);
			return deferred.promise;
		}

		function create(studentClass) {
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.crmStudentClass + "/create", studentClass)
				.success(function (response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function (response, status, headers, config) {
					deferred.reject(response);
				}
				);
			return deferred.promise;
		}

		function generateClassCoursePlan(coursePlanlist) {
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.creatCoursePlan, coursePlanlist)
				.success(function (response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function (response, status, headers, config) {
					deferred.reject(response);
				}
				);
			return deferred.promise;
		}

		/**
		 * 更新学生班级信息
		 */
		function update(studentClass) {
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.crmStudentClass + "/update", studentClass)
				.success(function (response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function (response, status, headers, config) {
					deferred.reject(response);
				}
				);
			return deferred.promise;
		}

		/**
		 * 根据id获取班级信息
		 */
		function queryById(classId) {
			var deferred = $q.defer();
			$http.post(config.endpoints.sos.crmStudentClass + "/queryById/" + classId)
				.success(function (response, status, headers, config) {
					deferred.resolve(response);
				})
				.error(function (response, status, headers, config) {
					deferred.reject(response);
				}
				);
			return deferred.promise;
		}

		return service;
	}
	]);
