'use strict';


/**
 * 学生一对多信息service
 * @author zhangyf@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').factory('CustomerStudentGroupService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};
    service.list = list;
    service.create = create;
    service.update = update;
    service.remove = remove;
    service.detail = detail;
    service.getStudentListForAddGroup = getStudentListForAddGroup;
    //service.dissolveOneStudentGroup = dissolveOneStudentGroup;
    service.saveGroupAllot = saveGroupAllot;
    service.listGroupStudents = listGroupStudents;
    service.getGroupCoursePlanList = getGroupCoursePlanList;
    service.yiduiduoshitingSearch = yiduiduoshitingSearch;
    /**
     * 查询一对多排课记录
     */
    function getGroupCoursePlanList(start, number, params,filter){
        var deferred = $q.defer();
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize;
        $http.post(config.endpoints.sos.CustomerStudentGroup+'/getGroupCoursePlanList',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get CustomerStudentGroup : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 一对多列表
     */
    function list(start, number, params,filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize;
        $http.post(config.endpoints.sos.CustomerStudentGroup+'/list',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get CustomerStudentGroup : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 一对多列表
     */
    function listGroupStudents(start, number, params,filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize;
        $http.post(config.endpoints.sos.CustomerStudentGroup+'/listGroupCrm',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get CustomerStudentGroup : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    /**
     * 一对多学生列表
     */
    function getStudentListForAddGroup(start, number, params,filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize
        $http.post(config.endpoints.sos.CustomerStudentGroup+'/getStudentListForAddGroup',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get CustomerStudentGroup : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 创建一对多
     */
    function create(CrmCustomerStudentGroupVo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.CustomerStudentGroup+'/create', CrmCustomerStudentGroupVo).success(function(response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function(response, status, headers, config) {
                    console.log('Failed to create CustomerStudentGroup : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 更新一对多
     */
    function update(groupForUpdate) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.CustomerStudentGroup+'/update', groupForUpdate).success(function(response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function(response, status, headers, config) {
                    console.log('Failed to update CustomerStudentGroup : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 解散一对多信息
     */
    /*function dissolveOneStudentGroup(group_id) {
     var deferred = $q.defer();
     $http.post(config.endpoints.sos.CustomerStudentGroup + '/dissolveOneStudentGroup/' + group_id).success(function(response, status, headers, config) {
     console.log("Updated : " + JSON.stringify(response));
     deferred.resolve(response.data);
     })
     .error(function(response, status, headers, config) {
     console.log('Failed to dissolve CustomerStudentGroup : ' + JSON.stringify(response));
     deferred.reject(response.update);
     }
     );
     return deferred.promise;
     }*/


    /**
     * 删除一对多
     * @param CustomerStudentGroup
     * @returns {*}
     */
    function remove(CustomerStudentGroup) {
        var deferred = $q.defer();
        $http.delete(config.endpoints.sos.CustomerStudentGroup + '/delete/' + CustomerStudentGroup.id).success(function(response, status, headers, config) {
            //console.log("Deleted : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function(response, status, headers, config) {
                    console.log('Failed to delete CustomerStudentGroup : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 删除一对多学生
     * @param CustomerStudentGroup
     * @returns {*}
     */
    service.removeOneStudentOfGroup = removeOneStudentOfGroup;
    function removeOneStudentOfGroup(CustomerGroupStudent) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.CustomerStudentGroup + '/removeOneStudentOfGroup' , CustomerGroupStudent).success(function(response, status, headers, config) {
            //console.log("Deleted : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function(response, status, headers, config) {
                    console.log('Failed to delete CustomerStudentGroup : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
        return deferred.promise;
    }

    /**
     * 一对多详情
     * @param CustomerStudentGroup
     */
    function detail(CustomerStudentGroup){
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.CustomerStudentGroup + '/detail/' + CustomerStudentGroup.id)
            .success(function(response, status, headers, config){
                //console.log("Detail : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config){
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    /**
     * 保存一对多分配
     * @param CustomerStudentGroup
     */
    function saveGroupAllot(CustomerStudentGroupAllot){
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.CustomerStudentGroup + '/saveGroupAllot',CustomerStudentGroupAllot)
            .success(function(response, status, headers, config){
                //console.log("Detail : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config){
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    /**
     * 一对多试听列表
     */
    function yiduiduoshitingSearch(start, number, params,filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize

        console.log(filter)
        $http.post(config.endpoints.sos.CustomerStudent+'/yiduiduoshitingSearch',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
                // console.log('Failed to get CustomerStudentGroup : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    return service;
}
]);
