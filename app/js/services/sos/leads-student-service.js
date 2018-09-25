'use strict';

/**
 * 学生线索service层
 * @author zhangyf@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').factory('LeadsStudentService', ['$http', '$q', 'config', '$filter', '$timeout', 'utilService',
    function ($http, $q, config, $filter, $timeout, utilService) {

    var service = {};
    var oThis = this;
    service.list = list;
    service.getMyStudentList = getMyStudentList;
    service.getSchoolLeadStudents=getSchoolLeadStudents;
    service.listByMobile = listByMobile;
    service.schoolList = schoolList;
    service.create = create;
    service.saveCallRecord = saveCallRecord;
    service.callLeadStu = callLeadStu;
    service.update = update;
    service.remove = remove;
    service.detail = detail;
    service.saveAllot = saveAllot;
    service.saveAllotNetwork = saveAllotNetwork;
    service.saveBatchAllot = saveBatchAllot;
    service.schoolListAll = schoolListAll;
    service.findAllEmployeesOfCurrentUserSchool = findAllEmployeesOfCurrentUserSchool;
    service.findAllPositionOfCurrentUserSchool = findAllPositionOfCurrentUserSchool;

    service.callNumber = callNumber;
    service.getStudent = getStudent;

    service.updatePhoneException = updatePhoneException;//更改电话异常状态
    service.updateLeadsStudent = updateLeadsStudent;//更新意向客户信息
    service.findPhoneException = findPhoneException;//查询电话异常状态
    service.getOrderInfoByLeadsId = getOrderInfoByLeadsId; //判断leads是否有订单

    service.doSmartImport = doSmartImport;
    service.receiveList = receiveList;
    service.updateExceptionStatus = updateExceptionStatus;// 批量更新leads 的异常无效状态
    service.uploadExcelDoc = uploadExcelDoc;  //导入excel文档
    service.exportLeadsInfo = exportLeadsInfo; //导出leads
    /**
     * 更改电话异常状态
     * @param list
     */
    function updatePhoneException(list){
        var url = config.endpoints.sos.updatePhoneException;
        return utilService.postDataHttp(url,list);
    }

    /**
     * 更新意向客户信息
     * @param obj
     */
    function updateLeadsStudent(obj){
        var url = config.endpoints.sos.updateLeadsStudent;
        return utilService.postDataHttp(url,obj);
    }

    /**
     * 查询电话异常状态
     * @param list
     * @returns {*}
     */
    function findPhoneException(list){
        var url = config.endpoints.sos.findPhoneException;
        return utilService.postDataHttp(url,list);
    }

    function getStudent(phone){
        var json = {'phone':phone};
        var url = config.endpoints.sos.InvitationCommunication+'/viewphone';//改
        return oThis.postHttp(url,json);
    }

    function callNumber(phone,id){
        var json =
        {
            'phone':phone,
            'crm_student_id':id
        };
        var url = config.endpoints.sos.InvitationCommunication+'/cloudCallCenter';
        return oThis.postHttp(url,json);
    }
    oThis.postHttp = postHttp;
    function postHttp(url,obj){
        var deferred = $q.defer();
        $http.post(url,obj)
            .success(function(response, status, headers, config) {
                deferred.resolve({
                    data: response
                });
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to get orders : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }


    /**
     * 获取学生线索列表.
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
      $http.post(config.endpoints.sos.LeadsStudent+'/list',filter).success(function(response, status, headers, config) {
        //console.log(response);
        deferred.resolve({
          data: response.data.list,
          numberOfPages: response.data.pages,
          total:response.data.total
        });
      }).error(function(response, status, headers, config) {
            console.log('Failed to get LeadsStudent : ' + JSON.stringify(response));
            deferred.reject(response.error);
          }
      );
      return deferred.promise;
    }
        /**
         * 获取我的意向客户列表（优化后）
         */
        function getMyStudentList(start, number, params,filter) {
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
            $http.post(config.endpoints.sos.LeadsStudent+'/my',filter).success(function(response, status, headers, config) {
                //console.log(response);
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages,
                    total:response.data.total
                });
            }).error(function(response, status, headers, config) {
                    console.log('Failed to get LeadsStudent : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }
        /**
         * 获取学生线索列表.
         */
    function listByMobile(start, number,filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);

        filter.pageNum = start;
        filter.pageSize = number;
        $http.post(config.endpoints.sos.LeadsStudent+'/list',filter).success(function(response, status, headers, config) {
            //console.log(response);
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages,
                total:response.data.total
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get LeadsStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取校区学生线索列表.
     */
    function schoolList(start, number, params,filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        params = params||{}
        params.search = params.search||{}
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
        //console.dir(filter);
        $http.post(config.endpoints.sos.LeadsStudent+'/schoolList',filter).success(function(response, status, headers, config) {
            //console.log(response);
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages,
                total:response.data.total
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get schoolLeadsStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
        /**
         * 获取校区学生线索列表.
         */
        function getSchoolLeadStudents(start, number, params,filter) {
            var deferred = $q.defer();
            //console.dir(params.search.predicateObject);
            params = params||{}
            params.search = params.search||{}
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
            //console.dir(filter);
            $http.post(config.endpoints.sos.LeadsStudent+'/school',filter).success(function(response, status, headers, config) {
                //console.log(response);
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages,
                    total:response.data.total
                });
            }).error(function(response, status, headers, config) {
                    console.log('Failed to get schoolLeadsStudent : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }
    /**
     * 获取领取学生线索列表.
     */
    function receiveList(params) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.LeadsStudent+'/receiveList',params)
	        .success(function(response, status, headers, config) {
	            deferred.resolve({
	                data: response.data.list,
	                numberOfPages: response.data.pages,
	                total: response.data.total
	            });
	        }).error(function(response, status, headers, config) {
	                console.log('Failed to get receiveLeadsStudent : ' + JSON.stringify(response));
	                deferred.reject(response.error);
	        }
        );
        return deferred.promise;
    }

    /**
     * 获取校区学生线索和客户列表.
     */
    function schoolListAll(start, number, params,filter) {
        var deferred = $q.defer();
        //console.dir(params.search.predicateObject);
        params = params||{}
        params.search = params.search||{}
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
        $http.post(config.endpoints.sos.LeadsStudent+'/schoolListAll',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages
            });
        }).error(function(response, status, headers, config) {
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
      $http.post(config.endpoints.sos.LeadsStudent+'/create', CrmLeadsStudentVo).success(function(response, status, headers, config) {
          //console.log("Created : " + JSON.stringify(response));
          /*if(response.status == 'FAILURE'){
              alert(response.data);
          }*/
          deferred.resolve(response);
        })
        .error(function(response, status, headers, config) {
          //console.log('Failed to create LeadsStudent : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }


        /**
         * 创建通话记录.
         */
        function saveCallRecord(CrmStudentCallRecord) {
            //console.dir(CrmLeadsStudentVo);
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.crmStudentCallRecord+'/create', CrmStudentCallRecord).success(function(response, status, headers, config) {
                    //console.log("Created : " + JSON.stringify(response));
                    /*if(response.status == 'FAILURE'){
                     alert(response.data);
                     }*/
                    deferred.resolve(response);
                })
                .error(function(response, status, headers, config) {
                        //console.log('Failed to create LeadsStudent : ' + JSON.stringify(response));
                        deferred.reject(response.error);
                    }
                );
            return deferred.promise;
        }



        /**
         * 打电话
         */
        function callLeadStu(phone,crmStudentId) {
            //console.dir(CrmLeadsStudentVo);
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.crmStudentCallRecord+'/call?phone=' + phone + '&crmStudentId='+ crmStudentId).success(function(response, status, headers, config) {
                    //console.log("Created : " + JSON.stringify(response));
                    /*if(response.status == 'FAILURE'){
                     alert(response.data);
                     }*/
                    deferred.resolve(response);
                })
                .error(function(response, status, headers, config) {
                        //console.log('Failed to create LeadsStudent : ' + JSON.stringify(response));
                        deferred.reject(response.error);
                    }
                );
            return deferred.promise;
        }

      function doSmartImport(key) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.LeadsStudent+'/dosmartimport?key=' + key).success(function(response, status, headers, config) {
          deferred.resolve(response);
        })
          .error(function(response, status, headers, config) {
            deferred.reject(response);
          }
        );
        return deferred.promise;
      }

    /**
     * 更新学生线索.
     */
    function update(CrmLeadsStudentVo) {
      var deferred = $q.defer();
      $http.post(config.endpoints.sos.LeadsStudent + '/update/', CrmLeadsStudentVo).success(function(response, status, headers, config) {
          //console.log("Updated : " + JSON.stringify(response));
          deferred.resolve(response);
        })
        .error(function(response, status, headers, config) {
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
      $http.delete(config.endpoints.sos.LeadsStudent + '/delete/' + LeadsStudent.crm_student_id).success(function(response, status, headers, config) {
          //console.log("Deleted : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
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
    function detail(LeadsStudent) {

        var deferred = $q.defer();
        var params = {
            phone: LeadsStudent.phone,
            studentId: LeadsStudent.crm_student_id
        }
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
        $http.post(config.endpoints.sos.LeadsStudent+'/saveAllot', AllotCrmLeadsStudentVo).success(function(response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            deferred.resolve(response.data);
        })
            .error(function(response, status, headers, config) {
                console.log('Failed to create AllotLeadsStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

      function saveAllotNetwork(AllotCrmLeadsStudentVo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.LeadsStudent+'/saveAllot', AllotCrmLeadsStudentVo).success(function(response, status, headers, config) {
          deferred.resolve(response);
        })
          .error(function(response, status, headers, config) {
            console.log('Failed to create AllotLeadsStudent : ' + JSON.stringify(response));
            deferred.reject(response);
          }
        );
        return deferred.promise;
      }

    /**
     * 保存批量分配学生线索.
     */
    function saveBatchAllot(batchAllotParam) {
        //console.dir(batchAllotParam);
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.LeadsStudent+'/saveBatchAllot', batchAllotParam).success(function(response, status, headers, config) {
            //console.log("Created : " + JSON.stringify(response));
            //deferred.resolve(response.data);
          deferred.resolve(response);
        })
            .error(function(response, status, headers, config) {
                console.log('Failed to batchAllotParam : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }



    /**
     * 查询当前用户校区的所有岗位
     **/
    function findAllPositionOfCurrentUserSchool(){
      var deferred = $q.defer();
        $http.get(config.endpoints.sos.LeadsStudent + '/findAllPositionOfCurrentUserSchool')
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
     * 判断leads是否有订单
     */
    function getOrderInfoByLeadsId(leadsId){
    	var deferred = $q.defer();
        $http.get(config.endpoints.sos.LeadsStudent + '/getOrderInfoByLeads?leadsId='+leadsId)
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
     * 查询当前登录用户学校的所有岗位的员工信息
     **/
    function findAllEmployeesOfCurrentUserSchool(start, number, params,filter){
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
        filter.pageSize = params.search.predicateObject.pageSize
        $http.post(config.endpoints.sos.LeadsStudent + '/findAllEmployeesOfCurrentUserSchool/', filter)
            .success(function(response, status, headers, config){
                //console.log("Detail : " + JSON.stringify(response));
                deferred.resolve({
                  data: response.data.list,
                  numberOfPages: response.data.pages
                });
            })
            .error(function(response, status, headers, config){
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }
    
    /**
     * 批量更新leads的异常状态
     */
    function updateExceptionStatus(crmStudentList){
        var deferred = $q.defer();
    	 $http.put(config.endpoints.sos.LeadsStudent + '/updateCrmStudentBatch/', crmStudentList)
         .success(function(response, status, headers, config){
        	 deferred.resolve(response);
         })
         .error(function(response, status, headers, config){
             console.log('Failed to get Detail : ' + JSON.stringify(response));
             deferred.reject(response.error);
         })
         return deferred.promise;
    }

    /**
     * 导入excel文档
     */
    function uploadExcelDoc(params){
        var deferred = $q.defer();

        $http.post(config.endpoints.sos.LeadsStudent + '/importLeadsNew/',params)
            .success(function(response, status, headers, config){
                deferred.resolve(response);
            })
            .error(function(response, status, headers, config){
                deferred.reject(response.error);
            })
        return deferred.promise;
    }
    /**
     * 导出leads调用的接口
     */
    function exportLeadsInfo(filter) {
        var deferred = $q.defer();
        // 不查询分页信息查询全部
        filter.pageNum = 0;
        filter.pageSize = 0;
        $http.post(config.endpoints.sos.LeadsStudent+'/exportLeadsInfo',filter).success(function(response, status, headers, config) {
            console.log(response)
            deferred.resolve({
                data: response.data
            });

        }).error(function(response, status, headers, config) {
                console.log('Failed to get schoolLeadsStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    return service;
  }
]);
