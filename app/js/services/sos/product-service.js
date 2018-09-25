/**
 * The dictionary management service.
 *
 * @author zhangyf@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').factory('ProductService', ['$http', '$q', 'config','SweetAlert', function($http, $q, config, SweetAlert) {
        var service = {};
        service.getCourseList = getCourseList;//产品列表
        service.getOnLineCourseList=getOnLineCourseList;
        service.getOnLineCourseListForSchool=getOnLineCourseListForSchool;
        service.getCouponSelectList = getCouponSelectList;
        service.getCourseListByName = getCourseListByName;
        service.getProductTypeList = getProductTypeList;//产品类型列表
        service.getCourseTypeList = getCourseTypeList;//课程类型列表
        service.getCourseTypeByFilter = getCourseTypeByFilter;//根据条件过滤课程类型列表
        service.getFavorableList = getFavorableList;//获取某课程类型的优惠列表
        service.getCourse = getCourse;//产品
        service.getProjectList=getProjectList;//项目管理
        service.addCourse = addCourse;//添加课程
        service.importCourse = importCourse;//导入课程
        service.addFavorable = addFavorable;//添加优惠
        service.createProductType = createProductType;//创建产品类型
        service.updateProductType = updateProductType;//更新产品类型
        service.updateProductTypeForDelete = updateProductTypeForDelete;//删除产品类型
        service.createCourseType = createCourseType;//创建课程类型
        service.updateCourseType = updateCourseType;//更新课程类型
        service.updateCourseTypeForDelete = updateCourseTypeForDelete;//删除课程类型
        service.createCourse = createCourse;//创建课程
        service.updateCourse = updateCourse;//更新课程
        service.updateCourseForDelete = updateCourseForDelete;//删除课程
        service.createFavorable = createFavorable;//创建优惠
        service.updateFavorable = updateFavorable;//更新优惠
        service.updateFavorableForDelete = updateFavorableForDelete;//删除优惠
        service.getCoefficientList = getCoefficientList; //获取参数列表
        service.saveCoefficient = saveCoefficient;

        function getCourse(params){
            var deferred = $q.defer();
            $http.get(config.endpoints.sos.product+'/'+params)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to getCourseList : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function getProjectList(){
            var deferred = $q.defer();
            var params={};
            $http.post(config.endpoints.sos.product+'/getProjectList',params)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to getCourseList : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }


        function getCourseList(start, number, params,filter){
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
            $http.post(config.endpoints.sos.product+'/getCourseList',filter)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data.list,
                        numberOfPages: response.data.pages
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to getCourseList : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function getOnLineCourseList(start, number, params,filter){
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
            $http.post(config.endpoints.sos.product+'/getCourseListOnline',filter)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data.list,
                        numberOfPages: response.data.pages
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to getCourseList : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

         function getOnLineCourseListForSchool(start, number, params,filter){
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
            $http.post(config.endpoints.sos.product+'/getCourseListForSchool',filter)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data.list,
                        numberOfPages: response.data.pages
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to getCourseList : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

	  function getCouponSelectList(start, number,filter) {
		    var deferred = $q.defer();
		    filter.pageNum = start/number+1;
		    filter.pageSize = number;
		    $http.post(config.endpoints.sos.product+'/getCouponSelectList',filter).success(function(response, status, headers, config) {
		      deferred.resolve(response);
		    }).error(function(response, status, headers, config) {
		        console.log('Failed to get getCouponSelectList : ' + JSON.stringify(response));
		        deferred.reject(response);
		      }
		    );
		    return deferred.promise;
	  }

	  function getCourseListByName(name){
	    var deferred = $q.defer();
	    var filter = {};
	    filter.pageNum = 1;
	    filter.pageSize = 10;
	    if( name == null || name == undefined ){
	      name = "";
	    }
	    filter.courseName = name;
	    filter.offLine = "offLine";
	    $http.post(config.endpoints.sos.product+'/getCourseList',filter)
	      .success(function(response, status, headers, config) {
	        deferred.resolve({
	          data: response.data.list,
	          numberOfPages: response.data.pages
	        });
	      })
	      .error(function(response, status, headers, config) {
	        console.log('Failed to getCourseList : ' + JSON.stringify(response));
	        deferred.reject(response.error);
	      }
	    );
	    return deferred.promise;
	  }

        function getProductTypeList(start, number, params,filter){
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
            $http.post(config.endpoints.sos.product+'/getProductTypeList',filter)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to getProductTypeList : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function getCourseTypeList(start, number, params,filter){
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
            $http.post(config.endpoints.sos.product+'/getCourseTypeList',filter)
                .success(function(response, status, headers, config) {
                    //console.log("subjects : " + JSON.stringify(response));
                    deferred.resolve({
                        data: response.data.list,
                        numberOfPages: response.data.pages
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to getCourseTypeList : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function getFavorableList(start, number, params,filter){
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
            $http.post(config.endpoints.sos.product+'/getFavorableList',filter)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data.list,
                        numberOfPages: response.data.pages
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to getFavorableList : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function addCourse(){
            var deferred = $q.defer();
            $http.get(config.endpoints.sos.product+'/addCourse')
                .success(function(response, status, headers, config) {
                    console.log("subjects : " + JSON.stringify(response));
                    deferred.resolve({
                        data: response.data
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to addCourse : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function importCourse(){
            var deferred = $q.defer();
            $http.get(config.endpoints.sos.product+'/importCourse')
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to importCourse : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function addFavorable(){
            var deferred = $q.defer();
            $http.get(config.endpoints.sos.product+'/addFavorable')
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to addFavorable : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function createProductType(ProductType){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/createProductType', ProductType).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to create createProductType : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function updateProductType(ProductType){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/updateProductType', ProductType).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to updateProductType : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function updateProductTypeForDelete(ProductType){
            var deferred = $q.defer();
            // 处理400请求参数问题
            ProductType.projectNames = null;
            $http.post(config.endpoints.sos.product+'/updateProductTypeForDelete', ProductType).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to updateProductTypeForDelete : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function getCourseTypeByFilter(param) {
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/getCourseTypeByFilter',param)
                .success(function(response, status, headers, config) {
                    deferred.resolve({
                        data: response.data
                    });
                })
                .error(function(response, status, headers, config) {
                    console.log('Failed to getCourseTypeByFilter : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function createCourseType(CourseType){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/createCourseType', CourseType).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to create createCourseType : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function updateCourseType(CourseType){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/updateCourseType', CourseType).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to updateCourseType : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function updateCourseTypeForDelete(CourseType){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/updateCourseTypeForDelete', CourseType).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to updateCourseTypeForDelete : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function createCourse(Course){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/createCourse', Course).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to create createCourse : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function updateCourse(Course){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/updateCourse', Course).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to create updateCourse : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function updateCourseForDelete(Course){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/updateCourseForDelete', Course).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to updateCourseForDelete : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function createFavorable(Favorable){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/createFavorable', Favorable).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to create createFavorable : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function updateFavorable(Favorable){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/updateFavorable', Favorable).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
                .error(function(response, status, headers, config) {
                    console.log('Failed to updateFavorable : ' + JSON.stringify(response));
                    deferred.reject(response.error);
                }
            );
            return deferred.promise;
        }

        function updateFavorableForDelete(Favorable){
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product+'/updateFavorableForDelete', Favorable).success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to updateFavorableForDelete : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
            );
            return deferred.promise;
        }

        function getAllGrades() {
            var deferred = $q.defer();
            $http.post(config.endpoints.sos.product + "/getAllGrades")
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
        function getAllSubjects() {
        	var deferred = $q.defer();
        	$http.post(config.endpoints.sos.product + "/getAllSubjects")
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
         * 获取一对多系数列表
         */
        function getCoefficientList(filter){
        	var deferred = $q.defer();
        	$http.post(config.endpoints.sos.product + "/getCoefficientList",filter)
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
         * 保存一对多系数
         */
        function saveCoefficient(coefficientList){
        	var deferred = $q.defer();
        	$http.post(config.endpoints.sos.product + "/saveCoefficient",coefficientList)
        	.success(function(response, status, headers, config) {
        		deferred.resolve(response);
        	})
        	.error(function(response, status, headers, config) {
        		deferred.reject(response.error);
        	}
        	);
        	return deferred.promise;
        }

        return service;
    }
]);
