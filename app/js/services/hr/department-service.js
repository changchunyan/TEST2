/**
 * The deparment service.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'DepartmentService', ['$http', '$q', 'config',
        function ($http, $q, config) {
            var service = {};
            service.list = list;
            service.listV2 = listV2;
            service.addRoot = addRoot;
            service.addChild = addChild;
            service.remove = remove;
            service.edit = edit;
            service.getAllProvince = getAllProvince;
            service.getCityByProvince = getCityByProvince;
            service.getAreaByCity = getAreaByCity;
            service.getSchoolsByArea = getSchoolsByArea;
            service.getAllDistrict = getAllDistrict;
            service.getDistrictsByType = getDistrictsByType;
            service.getDeparmentById = getDeparmentById;
            service.checkIsRoot = checkIsRoot;
            service.getDepartmentByFilter = getDepartmentByFilter;
            service.queryAll = queryAll;
            service.getParentDepartmentTree = getParentDepartmentTree;
            service.getDistrictDepartmentTree = getDistrictDepartmentTree;
            /**
             * 根据部门获取所属项目的科目的集合列表 
             */
            service.getSubjectListByDepartmentTree = getSubjectListByDepartmentTree;
            /**
             * 判断上级节点是否有所属项目id，有的话则不允许更改
             */
            service.getParentDepartmentProjectSetting = getParentDepartmentProjectSetting;

            /**
             * 获取父级部门的组织架构（如果有的话，无父级就是本部门的）
             */
            function getParentDepartmentTree() {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getParentDepartmentTree")
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            function getDepartmentByFilter(filter) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getDepartmentByFilter?filter=" + JSON.stringify(filter))
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            function checkIsRoot(departmentId) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/checkIsRoot?departmentId=" + departmentId)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            /**
             * Get all district.
             */
            function getAllDistrict() {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getAllDistrict")
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }


            /**
             * Gets all provinces.
             * @return the promise
             */
            function getAllProvince() {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getAllProvince")
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            /**
             * Gets cities by province code.
             * @param pcode the province code
             * @returns the promise
             */
            function getCityByProvince(pcode) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getCityByProvince?pcode=" + pcode)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            /**
             * Gets areas by city code.
             * @param ccode the city code
             * @returns the promise
             */
            function getAreaByCity(ccode) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getAreaByCity?ccode=" + ccode)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            /**
             * Gets the list of deparments.
             * @return the promise
             */
            function list(organizationId) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            /**
             * Gets the list of deparments.
             * @return the promise
             */
            function listV2(organizationId) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + '/changeSchool')
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            /**
             * Adds child department for the given parent.
             * @param parent the parent node
             * @param child the child node
             * @return the promise
             */
            function addChild(parent, child) {
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.department + '/' + parent.id, child)
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
             * Adds department as root.
             * @param root the root node
             * @return the promise
             */
            function addRoot(root) {
                var deferred = $q.defer();
                $http.post(config.endpoints.hr.department, root)
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
             * Removes department.
             * @param department the department
             * @return the promise
             */
            function remove(department) {
                var deferred = $q.defer();
                $http.delete(config.endpoints.hr.department + '/' + department.id)
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
             * Edits department.
             * @param department the department
             * @return the promise
             */
            function edit(department) {
                var deferred = $q.defer();
                $http.put(config.endpoints.hr.department + '/' + department.id, department)
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
             * 获取相关区域的校�?
             */
            function getSchoolsByRegion(provinceCode, cityCode) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getSchoolsByRegion?provinceCode=" + provinceCode + "&cityCode=" + cityCode)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            /**
             * 获取相关区域的校�?
             */
            function getSchoolsByArea(areaId, organizationId) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getSchoolsByArea?organizationId=" + organizationId + "&areaId=" + areaId)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            /**
             * 根据校区性质获取大区列表
             */
            function getDistrictsByType(schoolNature, organizationId) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getDistrictsByType?organizationId=" + organizationId + "&schoolNature=" + schoolNature)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            /**
             * 获取部门信息
             */
            function getDeparmentById(organizationId, departmentId) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/queryById?organizationId=" + organizationId + "&departmentId=" + departmentId)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            /**
             * 查询部门集合
             */
            function queryAll(filter) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/queryAll?filter=" + JSON.stringify(filter))
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            /**
             * 获取大区的机构树
             */
            function getDistrictDepartmentTree(changePlatForm) {
            	if(typeof(changePlatForm)=="undefined") {
            		changePlatForm=false;
            	}
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getDistrictDepartmentTree?changePlatForm="+changePlatForm)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            /**
             * 获取部门所属项目的科目的列表集合
             */
            function getSubjectListByDepartmentTree(departmentId) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getSubjectsByDepartment?departmentId=" + departmentId)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            /**
             * 获取上级部门是否有所属项目id
             */
            function getParentDepartmentProjectSetting(departmentId) {
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.department + "/getParentDepartmentProjectSetting?departmentId=" + departmentId)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            return service;
        }
    ]);
