/**
 * The employee role management service.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').factory(
    'EmployeeRoleService', ['$http', '$q', 'config',
        function($http, $q, config) {
            var service = {};
            service.list = list;
            service.getEmployeeRoleByFilters = getEmployeeRoleByFilters;
            service.update = update;

            function list(){
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.employee_role)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            /**
             * Save the employee role.
             * @param employee_role
             */
            function update(employee_role){
                var deferred = $q.defer();
                $http.put(config.endpoints.hr.employee_role + '/' + employee_role.id ,employee_role)
                    .success(function (response, status, headers, config) {
                        deferred.resolve(response);
                    })
                    .error(function (response, status, headers, config) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            /**
             * Get the employees by filters
             * @param employee
             */
            function getEmployeeRoleByFilters(employee_role,start,number) {
                var para = {};
                if(employee_role.position != undefined){
                    para.positionName = employee_role.position.name;
                }
                if(employee_role.department != undefined){
                    para.departmentName = employee_role.department.name;
                }
                if(employee_role.id != undefined){
                    para.id = employee_role.id;
                }
                if(employee_role.name != undefined){
                    para.name = employee_role.name;
                }
                var deferred = $q.defer();
                $http.get(config.endpoints.hr.employee_role + "/getEmployeeRoleByFilters?employee_role="
                    + JSON.stringify(para) +  '&start=' + start + '&number=' + number)
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
