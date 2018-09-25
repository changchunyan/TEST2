'use strict';

/**
 * 学生线索service层
 * @author zhangyf@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').factory('CourseRecordSevice', ['$http', '$q', 'config', '$filter', '$timeout', function ($http, $q, config, $filter, $timeout) {

    var service = {};
    service.list = list;
    service.schoolList = schoolList;
    service.create = create;
    service.update = update;
    service.remove = remove;
    service.detail = detail;
    service.saveAllot = saveAllot;
    service.schoolListAll = schoolListAll;

    /**
     * 获取学生线索列表.
     */
    function list(start, number, params, filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
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
        $http.post(config.endpoints.sos.LeadsStudent + '/list', filter).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get LeadsStudent : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    /**
     * 获取校区学生线索列表.
     */
    function schoolList(start, number, params, filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
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
        //console.dir(filter);
        $http.post(config.endpoints.sos.LeadsStudent + '/schoolList', filter).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get schoolLeadsStudent : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    /**
     * 获取校区学生线索和客户列表.
     */
    function schoolListAll(start, number, params, filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        if (!params.search.predicateObject) {
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        } else {
            params.search.predicateObject.pageNum = start / number + 1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize
        $http.post(config.endpoints.sos.LeadsStudent + '/schoolListAll', filter).success(function (response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function (response, status, headers, config) {
            console.log('Failed to get schoolLeadsStudent : ' + JSON.stringify(response));
            deferred.reject(response.error);
        }
            );
        return deferred.promise;
    }

    /**
     * 创建学生线索.
     */
    function create(CrmLeadsStudentVo) {
        //console.dir(CrmLeadsStudentVo);
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.LeadsStudent + '/create', CrmLeadsStudentVo).success(function (response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            /*if(response.status == 'FAILURE'){
                alert(response.data);
            }*/
            deferred.resolve(response);
        })
            .error(function (response, status, headers, config) {
                //console.log('Failed to create LeadsStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
            );
        return deferred.promise;
    }

    /**
     * 更新学生线索.
     */
    function update(CrmLeadsStudentVo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.LeadsStudent + '/update/', CrmLeadsStudentVo).success(function (response, status, headers, config) {
            //console.log("Updated : " + JSON.stringify(response));
            deferred.resolve(response);
        })
            .error(function (response, status, headers, config) {
                console.log('Failed to update LeadsStudent : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
            );
        return deferred.promise;
    }


    /**
     * 删除学生线索
     * @param LeadsStudent
     * @returns {*}
     */
    function remove(LeadsStudent) {
        var deferred = $q.defer();
        $http.delete(config.endpoints.sos.LeadsStudent + '/delete/' + LeadsStudent.crm_student_id).success(function (response, status, headers, config) {
            //console.log("Deleted : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function (response, status, headers, config) {
                console.log('Failed to delete LeadsStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
            );
        return deferred.promise;
    }

    /**
     * 获取学生线索详细信息
     * @param LeadsStudent
     */
    // function detail(LeadsStudent) {
    //     debugger;
    //     var deferred = $q.defer();
    //     $http.get(config.endpoints.sos.LeadsStudent + '/detail/' + LeadsStudent.crm_student_id)
    //         .success(function (response, status, headers, config) {
    //             //console.log("Detail : " + JSON.stringify(response));
    //             deferred.resolve(response.data);
    //         })
    //         .error(function (response, status, headers, config) {
    //             console.log('Failed to get Detail : ' + JSON.stringify(response));
    //             deferred.reject(response.error);
    //         })
    //     return deferred.promise;
    // }
    function detail(LeadsStudent) {
        var deferred = $q.defer();
        var params = {
            phone: LeadsStudent.phone,
            studentId: LeadsStudent.crm_student_id
        }
        debugger;
        $http.post(config.endpoints.sos.LeadsStudent + '/detail/', params)
            .success(function (response, status, headers, config) {
                //console.log("Detail : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function (response, status, headers, config) {
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    /**
     * 分配学生线索.
     */
    function saveAllot(AllotCrmLeadsStudentVo) {
        //console.dir(AllotCrmLeadsStudentVo);
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.LeadsStudent + '/saveAllot', AllotCrmLeadsStudentVo).success(function (response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function (response, status, headers, config) {
                console.log('Failed to create AllotLeadsStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
            );
        return deferred.promise;
    }


    return service;
}
]);
