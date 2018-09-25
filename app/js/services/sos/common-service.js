/**
 * The order service.
 * @author sunqc
 * @version 1.0
 */
angular.module('ywsApp').factory('CommonService', ['$http', '$q', 'config',function($http, $q, config) {
    var service = {};
    //课程类型列表
    service.getCourseTypeIdSelect = getCourseTypeIdSelect;
    //一对一课程列表
    service.getCourseTypeIdSelectOfOne2One = getCourseTypeIdSelectOfOne2One;
    //少年派课程列表
    service.getCourseTypeIdSelectOfShaoNianPai = getCourseTypeIdSelectOfShaoNianPai;
    //年级列表
    service.getGradeIdSelect = getGradeIdSelect;
    //学科列表
    service.getSubjectIdSelect = getSubjectIdSelect;
    //产品类型列表
    service.getProductIdSelect = getProductIdSelect;

    //非线上产品类型列表
    service.getOffLineProductIdSelect = getOffLineProductIdSelect;

    //省列表
    service.getProvinceSelect = getProvinceSelect;
    //城市列表
    service.getCitySelect = getCitySelect;
    //地区列表
    service.getAreaSelect = getAreaSelect;
    //获取字典信息
    service.getDDictionary = getDDictionary;
    //获取大区信息
    service.getDepartmentsOfDistrict = getDepartmentsOfDistrict;
    //获取区域信息
    service.getDepartmentsOfRegion = getDepartmentsOfRegion;

    //获取所有校区的校长信息
    service.getAllSchoolMaster = getAllSchoolMaster;

    //状态列表
    service.getState = getState;
    //一级渠道列表
    service.getMediaChannel = getMediaChannel;

    service.getAllMediaChannel = getAllMediaChannel;

    service.getRestitutionCourseReasonSelect = getRestitutionCourseReasonSelect;

    service.getCourseTeachingTypeSelect = getCourseTeachingTypeSelect;



    //岗位列表
    service.getAllPositionsByOrgId = getAllPositionsByOrgId;

    //岗位下的所有员工列表
    service.getAllUserByOrgIdAndPositionId = getAllUserByOrgIdAndPositionId;

    service.getClassHeadPositions = getClassHeadPositions;

    //机构下校区列表
    service.getAllDepartmentOfSchoolByOrgId =getAllDepartmentOfSchoolByOrgId;

    //所有校区列表
    service.getAllDepartmentOfSchool =getAllDepartmentOfSchool;

    //当前用户所在校区的所有学习顾问和学习顾问主管
    service.getAllUsersBelongGuWen = getAllUsersBelongGuWen;

    //查询学生是否有到访记录
    service.findHaveDaoFang = findHaveDaoFang;
    //查询是否有邀约记录
    service.findHaveYaoYue = findHaveYaoYue;

    //检测电话重复
    service.repeat = repeat;

    service.getWhoCanBuy = getWhoCanBuy;

     /**
     * 检测电话重复.
     */
    function repeat(CrmLeadsStudentVo) {
        //console.dir(CrmLeadsStudentVo);
      var deferred = $q.defer();
      $http.post(config.endpoints.sos.LeadsStudent+'/repeat', CrmLeadsStudentVo).success(function(response, status, headers, config) {
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

    function getWhoCanBuy() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getWhoCanBuy')
            .success(function(response, status, headers, config) {
                deferred.resolve({
                    data: response.data
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
     * 获取学科下拉菜单
     * @return the promise
     */
    function getCourseTeachingTypeSelect() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/courseTeachingType')
            .success(function(response, status, headers, config) {
                //console.log("subjects : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
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
     * 获取学科下拉菜单
     * @return the promise
     */
    function getRestitutionCourseReasonSelect() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/restitutionCourseReason')
            .success(function(response, status, headers, config) {
                //console.log("subjects : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get orders : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }


    /**
     * 获取非线上产品类型列表
     * @returns {*}
     */
    function getOffLineProductIdSelect() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.product+'/getOffLineProductTypeList')
            .success(function(response, status, headers, config) {
                //console.log("subjects : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
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
     *
     * @return the promise
     */
    function getProductIdSelect() {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.product+'/getProductTypeList',{})
            .success(function(response, status, headers, config) {
                //console.log("subjects : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
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
     * 获取学科下拉菜单
     * @return the promise
     */
    function getSubjectIdSelect(searchModal) {
        var deferred = $q.defer();
        if(!searchModal){
        	searchModal = {};
        }
        $http.post(config.endpoints.sos.common+'/teachingSubject' ,searchModal)
            .success(function(response, status, headers, config) {
                //console.log("subjects : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
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
     * 获取年级下拉菜单
     * @return the promise
     */
    function getGradeIdSelect(params) {
        if(!params){
            params={};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/teachingGrade?params='+JSON.stringify(params))
            .success(function(response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get orders : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取课程类型下拉菜单
     * @return the promise
     */
    function getCourseTypeIdSelect(params) {
        if(!params){
            params={};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/teachingCourseType?params='+JSON.stringify(params))
            .success(function(response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get orders : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }



    /**
     * 获取一对一课程类型下拉菜单
     * @return the promise
     */
    function getCourseTypeIdSelectOfOne2One() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getCourseTypeIdSelectOfOne2One')
            .success(function(response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to getCourseTypeIdSelectOfOne2One : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取少年派课程类型下拉菜单
     * @return the promise
     */
    function getCourseTypeIdSelectOfShaoNianPai() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getCourseTypeIdSelectOfShaoNianPai')
            .success(function(response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to getCourseTypeIdSelectOfShaoNianPai : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取省下拉菜单
     * @return the promise
     */
    function getProvinceSelect() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getAllProvinces')
            .success(function(response, status, headers, config) {
                //console.log("Provinces : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get Provinces : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取城市下拉菜单
     * @return the promise
     */
    function getCitySelect(provinceCode) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getAllCityByProvinceCode/' + provinceCode)
            .success(function(response, status, headers, config) {
                //console.log("Cities : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get Cities : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取地区下拉菜单
     * @return the promise
     */
    function getAreaSelect(cityCode) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getAllAreaByCityCode/' + cityCode)
            .success(function(response, status, headers, config) {
                //console.log("Areas : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get Areas : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    //获取字典类型
    function getDDictionary(type) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getDdictionary/' + type)
            .success(function(response, status, headers, config) {
                //console.log("Dictionary : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get Areas : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    //获取大区类型
    function getDepartmentsOfDistrict() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getDepartmentsOfDistrict')
            .success(function(response, status, headers, config) {
                //console.log("getDepartmentsOfDistrict : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get Areas : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    //获取区域类型
    function getDepartmentsOfRegion(filter) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.common+'/getDepartmentsOfRegion',filter)
            .success(function(response, status, headers, config) {
                //console.log("getDepartmentsOfRegion : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get Areas : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }



    //获取所有校区的校长信息
    function getAllSchoolMaster(start, number, params,filter){
        var deferred = $q.defer();

        //console.dir(params.search.predicateObject);
        if(!params.search){
            params.search = {};
        }
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        if(!check_null(filter)){//如果 filter 参数为传递 则初始化filter
            filter ={};
        }
        filter.pageNum = params.search.predicateObject.pageNum;
        filter.pageSize = params.search.predicateObject.pageSize;



        $http.post(config.endpoints.sos.common+'/getAllSchoolMaster',filter)
            .success(function(response, status, headers, config) {
                //console.log("Areas : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get Areas : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取状态下拉菜单
     * @param parentId = 0时获取一级菜单
     * @returns {*}
     */
    function getState(parentId){
        var deferred = $q.defer();
        if(!check_null(parentId)){//添加非空校验
            parentId = 0;
        }
        $http.get(config.endpoints.sos.common+'/getStateByParenId/' + parentId)
            .success(function(response, status, headers, config) {
                //console.log("State : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get State : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取媒体渠道下拉菜单
     * @param parentId = 0时获取一级菜单
     * @returns {*}
     */
    function getMediaChannel(parentId){
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getMedeiaChannelByParentId/' + parentId)
            .success(function(response, status, headers, config) {
                //console.log("MediaChannel : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get MediaChannel : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function getAllMediaChannel(){
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getallmediachannel')
          .success(function(response, status, headers, config) {
              deferred.resolve({
                  data: response.data
              });
          })
          .error(function(response, status, headers, config) {
              deferred.reject(response.error);
          }
        );
        return deferred.promise;
    }

    /**
     * 获取当前机构下所有的岗位信息
     * @returns {*}
     */
    function getAllPositionsByOrgId() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getAllPositionsByOrgIdAndDepartmentsId')
            .success(function(response, status, headers, config) {
                //console.log("Positions : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get Positions : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取校区班主任岗位
     * @returns {*}
     */
    function getClassHeadPositions() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common + '/classHead')
            .success(function(response, status, headers, config) {
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取当前机构岗位下所有员工信息
     * @returns {*}
     */
    function getAllUserByOrgIdAndPositionId(position_id) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getAllUserByOrgIdAndPositionId/' + position_id)
            .success(function(response, status, headers, config) {
                //console.log("users : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get users : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取当前机构下所有的校区信息
     * @returns {*}
     */
    function getAllDepartmentOfSchoolByOrgId() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getAllDepartmentOfSchoolByOrgId')
            .success(function(response, status, headers, config) {
                //console.log("subjects : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get orders : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取集团和加盟商所有的校区信息
     * @returns {*}
     */
    function getAllDepartmentOfSchool() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getAllDepartmentOfSchool')
            .success(function(response, status, headers, config) {
                //console.log("subjects : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get orders : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取当前用户所在学校下所有的学习顾问和学习顾问主管
     * @returns {*}
     */
    function getAllUsersBelongGuWen() {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common+'/getAllUsersBelongGuWen')
            .success(function(response, status, headers, config) {
                //console.log("subjects : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get orders : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 查询学生是否有到访记录
     * filter:{"crm_student_id":1}
     */
    function findHaveDaoFang(filter) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.LeadsStudent+'/findHaveDaoFang',filter)
            .success(function(response, status, headers, config) {
                //console.log("findHaveDaoFang : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get findHaveDaoFang : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
    /**
     * 查询leads是否有邀约记录
     */
    function findHaveYaoYue(filter){
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.LeadsStudent+'/findHaveYaoYue',filter)
            .success(function(response, status, headers, config) {
                //console.log("findHaveDaoFang : " + JSON.stringify(response));
                deferred.resolve({
                    data: response.data
                });
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to get findHaveDaoFang : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    return service;
  }
]);
