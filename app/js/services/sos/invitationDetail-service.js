'use strict';

/**
 * The InvitationDetail  service.
 *
 * @author wangzhihang@youwinedu.com
 * @version 1.0
 */

angular.module('ywsApp').factory('InvitationDetailService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};
    service.list = list;
    service.create = create;
    service.update = update;
    service.remove = remove;
    service.createWithLead = createWithLead;
    service.visit = visit;

    service.viewlist = viewlist;
    service.listBrand = listBrand;

    service.getNumber = getNumber;

    /**
     * Gets the list of InvitationDetail.
     * @return the InvitationDetail
     */
    function list(start, number, params,filter) {
      var deferred = $q.defer();

      if(!params.search.predicateObject){
          params.search.predicateObject = {};
          params.search.predicateObject.start = start;
          params.search.predicateObject.number = number;
          filter.start = params.search.predicateObject.start;
          filter.number = params.search.predicateObject.number;
      }else{
          params.search.predicateObject.start = start;
          params.search.predicateObject.number = number;
          filter.start = params.search.predicateObject.start;
          filter.number = params.search.predicateObject.number;
      }
      $http.post(config.endpoints.sos.InvitationDetail+'/list',filter).success(function(response, status, headers, config) {
        deferred.resolve({
          data: response.data.list,
          numberOfPages: response.data.pages
        });
      }).error(function(response, status, headers, config) {
            console.log('Failed to get InvitationDetail : ' + JSON.stringify(response));
            deferred.reject(response.error);
          }
      );
      return deferred.promise;
    }
    /**
     * 品牌中心-邀约列表
     */
    function listBrand(start, number, params) {
        var deferred = $q.defer();
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        $http.post(config.endpoints.sos.InvitationDetail+'/listBrand',params.search.predicateObject).success(function(response, status, headers, config) {
          deferred.resolve({
            data: response.data.list,
            numberOfPages: response.data.pages
          });
        }).error(function(response, status, headers, config) {
              console.log('Failed to get InvitationDetail : ' + JSON.stringify(response));
              deferred.reject(response.error);
            }
        );
        return deferred.promise;
      }

    /**
     * 显示页面详情邀约.
     * @return the InvitationDetail
     */
    function viewlist(start, number, params) {
      var deferred = $q.defer();

      if(!params.search.predicateObject){
          params.search.predicateObject = {};
          params.search.predicateObject.pageNum = start/number+1;
          params.search.predicateObject.pageSize = number;
      }else{
          params.search.predicateObject.pageNum = start/number+1;
          params.search.predicateObject.pageSize = number;
      }
      $http.post(config.endpoints.sos.InvitationDetail+'/viewlist',params.search.predicateObject).success(function(response, status, headers, config) {
        deferred.resolve({
          data: response.data.list,
          numberOfPages: response.data.pages
        });
      }).error(function(response, status, headers, config) {
            console.log('Failed to get InvitationDetail : ' + JSON.stringify(response));
            deferred.reject(response.error);
          }
      );
      return deferred.promise;
    }

    /**
     * Creates a InvitationDetail.
     * @param InvitationDetail to create
     * @return the InvitationDetail
     */
    function create(CrmInvitationDetailVo) {
      var deferred = $q.defer();
      $http.post(config.endpoints.sos.InvitationDetail, CrmInvitationDetailVo).success(function(response, status, headers, config) {
          //console.log("Created : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to create InvitationDetail : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

  function createWithLead(CrmInvitationDetailVo) {
    var deferred = $q.defer();
    $http.post(config.endpoints.sos.InvitationDetail + "/addwithlead", CrmInvitationDetailVo).success(function(response, status, headers, config) {
      deferred.resolve(response);
    })
      .error(function(response, status, headers, config) {
        deferred.reject(response);
      }
    );
    return deferred.promise;
  }

    /**
     * Updates a InvitationDetail.
     * @param InvitationDetail the InvitationDetail to update
     * @return the promise
     */
    function update(CrmInvitationDetailVo) {
      var deferred = $q.defer();
      $http.put(config.endpoints.sos.InvitationDetail + '/' + CrmInvitationDetailVo.id, CrmInvitationDetailVo).success(function(response, status, headers, config) {
          //console.log("Updated : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to update InvitationDetail : ' + JSON.stringify(response));
          deferred.reject(response.update);
        }
      );
      return deferred.promise;
    }

    /**
     * Deletes the InvitationDetail.
     * @param InvitationDetail the InvitationDetail to delete
     */
    function remove(CrmInvitationDetailVo) {
      var deferred = $q.defer();
      var filter = {};
      filter.crmInvitationDetailId = CrmInvitationDetailVo.id;
      filter.type = CrmInvitationDetailVo.type;
      filter.personId = CrmInvitationDetailVo.crm_student_id;
      $http.put(config.endpoints.sos.InvitationDetail + '/delete', filter).success(function(response, status, headers, config) {
          //console.log("Deleted : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to delete InvitationDetail : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }


    /**
     * vist the InvitationDetail.
     * @param InvitationDetail the InvitationDetail to vist
     */
    function visit(CrmInvitationDetailVo) {
    	var deferred = $q.defer();
        $http.post(config.endpoints.sos.InvitationDetail + '/visit', CrmInvitationDetailVo).success(function(response, status, headers, config) {
            //console.log("vist : " + JSON.stringify(response));
            deferred.resolve(response.data);
          })
          .error(function(response, status, headers, config) {
            console.log('Failed to vist InvitationDetail : ' + JSON.stringify(response));
            deferred.reject(response.update);
          }
        );
        return deferred.promise;
    }

    function getNumber(){
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.InvitationCommunication + '/phoneInvitationCommunication').success(function(response, status, headers, config) {
            //console.log("vist : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function(response, status, headers, config) {
                console.log('Failed to vist InvitationDetail : ' + JSON.stringify(response));
                deferred.reject(response.update);
            }
        );
        return deferred.promise;
    }

    return service;
  }
]);
