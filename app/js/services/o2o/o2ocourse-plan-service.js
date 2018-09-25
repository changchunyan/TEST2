'use strict';

/**
 * The CoursePlan  service.
 *
 * @author wangzhihang@youwinedu.com
 * @version 1.0
 */

angular.module('ywsApp').factory('O2oCoursePlanService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};
    service.list = list;
    service.recordlist=recordlist;
    service.create = create;
    service.update = update;
    service.remove = remove;
    service.Studentlist = Studentlist;
    service.StudentRecordList = StudentRecordList;

    service.consume = consume;
    service.auditPass = auditPass;

    /**
     * Gets the list of InvitationCommunication.
     * @return the InvitationCommunication
     */
    function list(start, number, params) {
      var deferred = $q.defer();

      if(!params.search.predicateObject){
          params.search.predicateObject = {};
          params.search.predicateObject.pageNum = start/number+1;
          params.search.predicateObject.pageSize = number;
      }else{
          params.search.predicateObject.pageNum = start/number+1;
          params.search.predicateObject.pageSize = number;
      }
      $http.post(config.endpoints.sos.course_plan+'/O2OCoursePlanlist',params.search.predicateObject).success(function(response, status, headers, config) {
        deferred.resolve({
          data: response.data.list,
          numberOfPages: response.data.pages
        });
      }).error(function(response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
          }
      );
      return deferred.promise;
    }

    /**
     * 单个学生排课详情
     * @return the InvitationCommunication
     */
    function Studentlist(start, number, params) {
      var deferred = $q.defer();

      if(!params.search.predicateObject){
          params.search.predicateObject = {};
          params.search.predicateObject.pageNum = start/number+1;
          params.search.predicateObject.pageSize = number;
      }else{
          params.search.predicateObject.pageNum = start/number+1;
          params.search.predicateObject.pageSize = number;
      }
      $http.post(config.endpoints.sos.course_plan+'/StudentPlanlist',params.search.predicateObject).success(function(response, status, headers, config) {
        deferred.resolve({
          data: response.data.list,
          numberOfPages: response.data.pages
        });
      }).error(function(response, status, headers, config) {
            console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.error);
          }
      );
      return deferred.promise;
    }

    //O2O已消课
    function recordlist(start, number, params) {
        var deferred = $q.defer();

        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan+'/O2OCoursePlanRecordlist',params.search.predicateObject).success(function(response, status, headers, config) {
          deferred.resolve({
            data: response.data.list,
            numberOfPages: response.data.pages
          });
        }).error(function(response, status, headers, config) {
              console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
              deferred.reject(response.error);
            }
        );
        return deferred.promise;
      }


    function StudentRecordList(start, number, params) {
        var deferred = $q.defer();

        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.course_plan+'/StudentPlanRecordlist',params.search.predicateObject).success(function(response, status, headers, config) {
          deferred.resolve({
            data: response.data.list,
            numberOfPages: response.data.pages
          });
        }).error(function(response, status, headers, config) {
              console.log('Failed to get CoursePlan : ' + JSON.stringify(response));
              deferred.reject(response.error);
            }
        );
        return deferred.promise;
      }
    /**
     * Creates a InvitationCommunication.
     * @param InvitationCommunication to create
     * @return the InvitationCommunication
     */
    function create(CrmInvitationCommunicationVo) {
      var deferred = $q.defer();
      $http.post(config.endpoints.sos.InvitationCommunication, CrmInvitationCommunicationVo).success(function(response, status, headers, config) {
          //console.log("Created : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to create InvitationCommunication : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

    /**
     * 逻辑删除排课
     */
    function update(OmsCoursePlanVo) {
      var deferred = $q.defer();
      $http.put(config.endpoints.sos.CoursePlan + '/' + OmsCoursePlanVo.id, OmsCoursePlanVo).success(function(response, status, headers, config) {
          //console.log("Updated : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          //console.log('Failed to update InvitationCommunication : ' + JSON.stringify(response));
          deferred.reject(response.update);
        }
      );
      return deferred.promise;
    }

    /**
     * 逻辑删除排课
     */
    function remove(OmsCoursePlan) {
      var deferred = $q.defer();

      $http.delete(config.endpoints.sos.course_plan + '/' + OmsCoursePlan.id).success(function(response, status, headers, config) {
          //console.log("Deleted : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to delete CoursePlan : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

    /**
     * 审核不通过原因
     */
    function consume(omsCoursePlan) {
    	var deferred = $q.defer();
        var data = {//数据格式化
            omsCoursePlanId:omsCoursePlan.id,
            remark:omsCoursePlan.courseText,
            responsible:omsCoursePlan.courseTypeRadio
        };
        console.log(data);
        $http.post(config.endpoints.sos.course_plan + '/auditUnPass', data).success(function(response, status, headers, config) {
            deferred.resolve(response.data);
          })
          .error(function(response, status, headers, config) {
            console.log('Failed to consume OmsCoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.update);
          }
        );
        return deferred.promise;
    }

    //评论审核
    function auditPass(omsCoursePlan) {
      var deferred = $q.defer();
        $http.post(config.endpoints.sos.course_plan + '/auditPass', omsCoursePlan).success(function(response, status, headers, config) {
            deferred.resolve(response.data);
          })
          .error(function(response, status, headers, config) {
            console.log('Failed to auditPass OmsCoursePlan : ' + JSON.stringify(response));
            deferred.reject(response.update);
          }
        );
        return deferred.promise;
    }





    return service;
  }
]);
