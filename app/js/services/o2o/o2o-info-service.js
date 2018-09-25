angular.module('ywsApp').factory('O2OInfoService', ['$http', '$q', 'config','utilService',function($http, $q, config,utilService) {
    var service = {};

    service.createBanner = createBanner;
    service.updateBanner = updateBanner;
    service.listBanner = listBanner;
    service.TeacherlistBanner=TeacherlistBanner;
    service.createType = createType;
    service.updateType = updateType;
    service.createCourse = createCourse;
    service.updateCourse = updateCourse;
    service.listCourse = listCourse;
    service.recordlist = recordlist;
    service.getAllTeacherOfCourse = getAllTeacherOfCourse;

    service.getCourselistByCourseTypeId = getCourselistByCourseTypeId;

    service.getAllOnlineCourseList = getAllOnlineCourseList;



    function createBanner(){

        var deferred = $q.defer();
              $http.post(config.endpoints.o2o.info+'/banner/create', OmsBanner).success(function(response, status, headers, config) {
                  //console.log("Created : " + JSON.stringify(response));
                  /*if(response.status == 'FAILURE'){
                      //alert(response.data);
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

    function listBanner(param){
        //console.log(param);
          var deferred = $q.defer();

          $http.post(config.endpoints.o2o.info+'/banner/list', param).success(function(response, status, headers, config) {
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

    function TeacherlistBanner(param){
        //console.log(param);
          var deferred = $q.defer();

          $http.post(config.endpoints.o2o.info+'/banner/TeacherBannerlist', param).success(function(response, status, headers, config) {
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

    function updateBanner(OmsBanner){
      //console.log(OmsBanner);
      var deferred = $q.defer();
      $http.post(config.endpoints.o2o.info+'/banner/update', OmsBanner).success(function(response, status, headers, config) {
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

    function createType(recommendCourseType){
      console.log(recommendCourseType);
      var deferred = $q.defer();
      $http.post(config.endpoints.o2o.info+'/recommendCourse/createType', recommendCourseType).success(function(response, status, headers, config) {
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

    //更新推荐类型
    function updateType(recommendCourseType){
        //console.log(recommendCourseType);
      var deferred = $q.defer();
      $http.post(config.endpoints.o2o.info+'/recommendCourse/updateType', recommendCourseType).success(function(response, status, headers, config) {
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

    //创建课程推荐信息
    function createCourse(recommendCourse){
      //console.log(recommendCourse);
      var deferred = $q.defer();
      $http.post(config.endpoints.o2o.info+'/recommendCourse/create', recommendCourse).success(function(response, status, headers, config) {
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

    //更新课程推荐信息
    function updateCourse(recommendCourse){
      //console.log(recommendCourse);
      var deferred = $q.defer();
      $http.post(config.endpoints.o2o.info+'/recommendCourse/update', recommendCourse).success(function(response, status, headers, config) {
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

    //获取课程列表和推荐类型
    function listCourse(start, number, params){
        var deferred = $q.defer();
        var courseFilter = {};
        if(params.search==undefined){
          params.search={};
        }
        if(!params.search.predicateObject){
            params.search.predicateObject = {};
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }else{
            params.search.predicateObject.pageNum = start/number+1;
            params.search.predicateObject.pageSize = number;
        }
        courseFilter.pageNum = params.search.predicateObject.pageNum;
        courseFilter.pageSize = params.search.predicateObject.pageSize;

        courseFilter.cityCode = params.cityCode;


          $http.post(config.endpoints.o2o.info+'/recommendCourse/list', courseFilter).success(function(response, status, headers, config) {
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

  //自动推荐
    function recordlist(params) {
        var deferred = $q.defer();
        var courseFilter = {};
        courseFilter.pageNum = 1;
        courseFilter.pageSize = 10;

        courseFilter.city = params;
        $http.post(config.endpoints.o2o.info+'/recommendCourse/autolist',courseFilter).success(function(response, status, headers, config) {

          deferred.resolve({
            data: response.data,
            numberOfPages: response.data.pages
          });
        }).error(function(response, status, headers, config) {
              console.log('Failed to get recordlist : ' + JSON.stringify(response));
              deferred.reject(response.error);
            }
        );
        return deferred.promise;
      }
    //根据课程类型id获取所有的课程
    function getCourselistByCourseTypeId(courseTypeId){
        var param = {"courseTypeId":courseTypeId};
        var deferred = $q.defer();
        $http.post(config.endpoints.o2o.info+'/recommendCourse/getCourselistByCourseTypeId', param).success(function(response, status, headers, config) {
              //console.log(response.data);
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

    //获取线上课程列表
    function getAllOnlineCourseList(start, number, params,filter){
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

      $http.post(config.endpoints.o2o.info+'/recommendCourse/courseTeacherList', filter).success(function(response, status, headers, config) {
              //console.log(response.data);
              /*if(response.status == 'FAILURE'){
                  alert(response.data);
              }*/
              deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages,
                total:response.data.total
            });
            })
            .error(function(response, status, headers, config) {
              //console.log('Failed to create LeadsStudent : ' + JSON.stringify(response));
              deferred.reject(response.error);
            }
          );
          return deferred.promise;

    }

    //获取课程的所有教师
    function getAllTeacherOfCourse(courseId){
      var param = {"courseId":courseId};
      var deferred = $q.defer();
        $http.post(config.endpoints.o2o.info+'/recommendCourse/getAllTeacherOfCourse', param).success(function(response, status, headers, config) {
              //console.log(response.data);
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


    return service;
    }
]);
