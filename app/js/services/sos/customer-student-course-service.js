'use strict';


/**
 * 学生客户排课service
 * @author fanlin@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').factory('CustomerStudentCourseService', ['$http', '$q', 'config', '$filter', '$timeout', function ($http, $q, config, $filter, $timeout) {

    var service = {};
    // 方法声明
    service.getCSShooleTeacherByFilters = getCSShooleTeacherByFilters;
    // service.getCRMCustomerStudentInfoByID = getCRMCustomerStudentInfoByID;
    service.getCRMCustomerGroupInfoByGroupID = getCRMCustomerGroupInfoByGroupID;
    service.getCRMCustomerLeaderInfoByID = getCRMCustomerLeaderInfoByID;
    service.getAllSubject = getAllSubject;
    service.getAllGrade = getAllGrade;
    service.getSchoolName = getSchoolName;
    service.getCSShooleTeacherByFiltersNew = getCSShooleTeacherByFiltersNew;
    // 排课改版
    service.getOrderCourseList = getOrderCourseList;
    service.getLeadsCoursePlan = getLeadsCoursePlan;
    /**
     * 展示客户详情
     * @param crm_student_id
     */
	/*function getCRMCustomerStudentInfoByID(start, number,crm_student_id){
	 var deferred = $q.defer();
	 $http.get(config.endpoints.sos.customerStudentCourse + '/customerStudent?CustomerStudentId=' + crm_student_id
	 + '&start=' + start + '&number=' + number)
	 .success(function(response, status, headers, config){
	 deferred.resolve({
	 data: response.data,
	 numberOfPages: response.data.studentCoursePlan.pages
	 });
	 })
	 .error(function(response, status, headers, config){
	 console.log('Failed to get Detail : ' + JSON.stringify(response));
	 deferred.reject(response.error);
	 })
	 return deferred.promise;
	 }*/

    /**
     * 展示leads详情
     */
    function getCRMCustomerLeaderInfoByID(start, number, crm_student_id) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.customerStudentCourse + '/customerLeader?CustomerStudentId=' + crm_student_id
            + '&start=' + start + '&number=' + number)
            .success(function (response, status, headers, config) {

                deferred.resolve({
                    data: response.data,
                    numberOfPages: response.data.studentCoursePlan.pages
                });
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;

    }

	/*
	 * 根据学校名称、教师名称、学科进行模糊查询
	 */
    function getCSShooleTeacherByFilters(teacherName, schoolName, subjectId, partFull,
        mobile, teacherGrade, startTime, endTime, start, number) {
        var deferred = $q.defer();

        if (teacherName == undefined) {
            teacherName = "";
        }
        if (schoolName == undefined) {
            schoolName = "";
        }
        if (subjectId == undefined) {
            subjectId = "";
        }
        if (start == undefined) {
            start = "";
        }
        if (number == undefined) {
            number = "";
        }
        if (partFull == undefined) {
            partFull = "";
        }
        if (mobile == undefined) {
            mobile = "";
        }
        if (teacherGrade == undefined) {
            teacherGrade = "";
        }
        if (startTime == undefined) {
            startTime = "";
        }
        if (endTime == undefined) {
            endTime = "";
        }
        $http.get(config.endpoints.sos.customerStudentCourse +
            '/getEmployeesByFilters?teacherName=' + teacherName + '&schoolName=' + schoolName + '&subjectId=' + subjectId + "&partFull=" + partFull
            + "&mobile=" + mobile + "&teacherGrade=" + teacherGrade + "&startTime=" + startTime + "&endTime=" + endTime + "&start=" + start + "&number=" + number)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data,
                    numberOfPages: response.data.studentTeachers.pages
                });
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }
    /**
     *  根据学校名称、教师名称、学科进行模糊查询
     */
    function getCSShooleTeacherByFiltersNew(start, number, params, filter) {
        var deferred = $q.defer();
        // TODO:修改
        for (var key in filter) {
            if (filter.hasOwnProperty(key) && !filter[key]) {
                delete filter[key]
            }
        }
		/*if(!params){
		 params = {}
		 params.search = {}
		 }*/
        if (!params.search) {
            params.search = {};
        }
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
        if (start == 0 && number == 0) {
            filter.pageNum = start;
            filter.number = number;
            filter.schoolId = params.search.schoolId;
            filter.subjectId = params.search.subjectId;
        }
        $http.post(config.endpoints.sos.customerStudentCourse + '/getEmployeesByFiltersNew', filter)
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data,
                    numberOfPages: response.data.studentTeachers.pages
                });
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to get teachers : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
            );
        return deferred.promise;
    }
    /**
     * 根据一对多id获取到该一对多下的学生的排课的信息
     */
    function getCRMCustomerGroupInfoByGroupID(start, number, groupID) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.CustomerStudentGroup + '/detail/' + groupID
        )
            .success(function (response, status, headers, config) {
                deferred.resolve({
                    data: response.data,
                    numberOfPages: response.data.groupStudentList.pages
                });
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }
    /**
     *  获取所有的科目的信息
     */
    function getAllSubject() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.customerStudentCourse + '/getAllSubjects/')
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }
    /**
     * 获取所有的年级
     */
    function getAllGrade() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.customerStudentCourse + '/getAllGrade/')
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }
    /**
     * 获取当前学员所在的学校的名称,一对多所在的学校 type=1 学员排课，type=2 一对多排课
     */
    function getSchoolName(crm_student_id, type) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.customerStudentCourse + '/getSchoolNameByStudentID?CustomerStudentId=' + crm_student_id + "&type=" + type)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    /**
     * 获取学员的订单课时信息-排课改版
     */
    function getOrderCourseList(obj) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.customerStudentCourse + '/getOrderCourseList', obj)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }
    /**
     * 获取leads的可排课时-排课改版
     */
    function getLeadsCoursePlan(studentPhone) {
        //一对多 解决报错的问题 未定义问题
        if (studentPhone) {
            var studentPhone = studentPhone;
        } else {
            var studentPhone = '';
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.customerStudentCourse + '/getLeaderCoursePlans?studentPhone=' + studentPhone)
            .success(function (response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    return service;
}
]);
