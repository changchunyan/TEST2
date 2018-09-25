/**
 * The employee service.
 *
 * @author ywu
 * @version 1.0
 */
angular.module('ywsApp').factory(
  'EmployeeService', ['$http', '$q', 'config',
  function($http, $q, config) {

        var service = {};
        service.add = add;
        service.getEmployeesByFilters = getEmployeesByFilters;
        service.remove = remove;
        service.update = update;
        service.resetPassword = resetPassword;
        service.getAllSubjects = getAllSubjects;
        service.getAllDictData = getAllDictData;
        service.checkLandline = checkLandline;
        service.getDuplicateEmployees = getDuplicateEmployees;
        service.getAllEmployeesByFilters = getAllEmployeesByFilters;
        service.getEmployeeChanges = getEmployeeChanges;
        service.saveChange = saveChange;
        service.saveOutboundphone = saveOutboundphone;
        service.delOutboundphone = delOutboundphone;
        service.trained = trained;
        service.deleteChangeByEmployeeId = deleteChangeByEmployeeId;
        service.getTeachingGrade = getTeachingGrade;
        
        function trained(employeeId){
        	var deferred = $q.defer();
            $http.post(config.endpoints.hr.employee + "/trained", employeeId)
              .success(function(response, status, headers, config) {
                deferred.resolve(response);
              })
              .error(function(response, status, headers, config) {
                deferred.reject(response);
              }
            );
            return deferred.promise;
        }

        function saveChange(change){
        	var deferred = $q.defer();
            $http.post(config.endpoints.hr.employee + "/saveChange", change)
              .success(function(response, status, headers, config) {
                deferred.resolve(response);
              })
              .error(function(response, status, headers, config) {
                deferred.reject(response);
              }
            );
            return deferred.promise;
        }
        
        function deleteChangeByEmployeeId(employeeId){
        	var deferred = $q.defer();
            $http.post(config.endpoints.hr.employee + "/deleteChangeByEmployeeId", employeeId)
              .success(function(response, status, headers, config) {
                deferred.resolve(response);
              })
              .error(function(response, status, headers, config) {
                deferred.reject(response);
              }
            );
            return deferred.promise;
        }
        
        function getEmployeeChanges(filter, start, number){
        	var deferred = $q.defer();
            $http.get(config.endpoints.hr.employee + "/getEmployeeChanges?filter=" + JSON.stringify(filter)
            		+ '&start=' + start + '&number=' + number)
                .success(function(response, status, headers, config) {
                    deferred.resolve(response);
                })
                .error(function(response, status, headers, config) {
                    deferred.reject(response);
                });
            return deferred.promise;
        }

      function getDuplicateEmployees(employee,start,number){
          var deferred = $q.defer();
          var temp = {} ;
          if(employee.landline != undefined){
              temp.landline = employee.landline;
          }
          if(employee.mobile != undefined){
              temp.mobile = employee.mobile;
          }
          if(employee.existId != undefined){
              temp.existId = employee.existId;
          }
          if(employee.employmentStatus != undefined){
              temp.employmentStatus = employee.employmentStatus;
          }
          $http.get(config.endpoints.hr.employee + "/getDuplicateEmployees?employee=" + JSON.stringify(temp)
              + '&start=' + start + '&number=' + number)
              .success(function(response, status, headers, config) {
                  deferred.resolve(response);
              })
              .error(function(response, status, headers, config) {
                  deferred.reject(response);
              });
          return deferred.promise;
      }

      /**
       * Check if the landline has exists.
       * @param landline the landline
       */
      function checkLandline(landline){
          var deferred = $q.defer();
          $http.get(config.endpoints.hr.employee + "/checkLandline", landline)
              .success(function(response, status, headers, config) {
                  deferred.resolve(response);
              })
              .error(function(response, status, headers, config) {
                  deferred.reject(response);
              }
          );
          return deferred.promise;
      }

      function getAllEmployeesByFilters(employee,start,number){
          var deferred = $q.defer();
          var temp = {} ;
          if(employee.user != undefined){
              for(var each in employee.user){
                  if(each == "name" && employee.user.name != "") {
                      temp.userName = employee.user.name;
                  }
                  if(each == "account" && employee.user.account != ""){
                      temp.account = employee.user.account;
                  }
              }
          }
          if(employee.mobile != undefined && employee.mobile != ""){
              temp.mobile = employee.mobile;
          }
          if(employee.employmentStatus != undefined){
              temp.employmentStatus = employee.employmentStatus;
          }
        if(employee.resignationReasonType != undefined){
          temp.resignationReasonType = employee.resignationReasonType;
        }
        if(employee.hiringDateBegin != undefined){
          temp.hiringDateBegin = employee.hiringDateBegin;
        }
        if(employee.hiringDateEnd != undefined){
          temp.hiringDateEnd = employee.hiringDateEnd;
        }
        if(employee.resignationDateBegin != undefined){
          temp.resignationDateBegin = employee.resignationDateBegin;
        }
        if(employee.resignationDateEnd != undefined){
          temp.resignationDateEnd = employee.resignationDateEnd;
        }
        if(employee.total != undefined){
          temp.total = employee.total;
        }
          $http.get(config.endpoints.hr.employee + "/getAllEmployeesByFilters?employee=" + JSON.stringify(temp)
              + '&start=' + start + '&number=' + number)
              .success(function(response, status, headers, config) {
                  deferred.resolve(response);
              })
              .error(function(response, status, headers, config) {
                  deferred.reject(response);
              });
          return deferred.promise;
      }

    function getEmployeesByFilters(employee,start,number){
    	var deferred = $q.defer();
    	var temp = {} ;
    	if(employee.user != undefined){
    		for(var each in employee.user){
    			if(each == "name" && employee.user.name != "") {
    				temp.userName = employee.user.name;
    			}
    			if(each == "id" && employee.user.id != ""){
    				temp.userId = employee.user.id;
    			}
    		}
    	}
    	if(employee.department != undefined){
    		for(var each in employee.department){
    			if(each == "id" && employee.department.id != "") {
    				temp.departmentId = employee.department.id;
    			}
    		}
    	}
    	if(employee.position != undefined){
    		for(var each in employee.position){
    			if(each == "id" && employee.position.id != "") {
    				temp.positionId = employee.position.id;
    			}
    		}
    	}
    	if(employee.age != undefined && employee.age != ""){
    		temp.age = employee.age;
    	}
    	if(employee.registeredResidenceType != undefined ){
    		temp.registeredResidenceType = employee.registeredResidenceType;
    	}
    	if(employee.educationDegree != undefined){
    		temp.educationDegree = employee.educationDegree;
    	}
    	if(employee.employmentLevel != undefined){
    		temp.employmentLevel = employee.employmentLevel;
    	}
    	//星级
    	if(employee.starLevel != undefined){
    		temp.starLevel = employee.starLevel;	
    	}
    	if(employee.subject != undefined){
    		temp.subject = employee.subject;
    	}
    	if(employee.workingYears != undefined && employee.workingYears != ""){
    		temp.workingYears = employee.workingYears;
    	}
    	if(employee.hiringDateBegin != undefined && employee.hiringDateBegin != null){
    		temp.hiringDateBegin = employee.hiringDateBegin;
    	}
    	if(employee.hiringDateEnd != undefined && employee.hiringDateEnd != null){
    		temp.hiringDateEnd = employee.hiringDateEnd;
    	}
    	if(employee.contractType != undefined){
    		temp.contractType = employee.contractType;
    	}
    	if(employee.employmentType != undefined){
    		temp.employmentType = employee.employmentType;
    	}
    	if(employee.employer != undefined){
    		temp.employer = employee.employer;
    	}
    	if(employee.employmentStatus != undefined){
    		temp.employmentStatus = employee.employmentStatus;
    	}
    	if(employee.landline != undefined){
    		temp.landline = employee.landline;
    	}
    	if(employee.mobile != undefined && employee.mobile != ""){
    		temp.mobile = employee.mobile;
    	}
    	if(employee.id != undefined && employee.id != ""){
    		temp.id = employee.id;
    	}
    	if(employee.total != undefined){
    		temp.total = employee.total;
    	}
    	if(employee.talentId != undefined && employee.talentId != ""){
    		temp.talentId = employee.talentId;
    	}
    	$http.get(config.endpoints.hr.employee + "/getEmployeesByFilters?employee=" + JSON.stringify(temp)
			+ '&start=' + start + '&number=' + number)
			.success(function(response, status, headers, config) {
				deferred.resolve(response);
			})
			.error(function(response, status, headers, config) {
				deferred.reject(response);
			});
			return deferred.promise;
    	}

    /**
     * Adds employee.
     * @param employee the employee
     * @return the promise
     */
    function add(employee) {
      var deferred = $q.defer();
      $http.post(config.endpoints.hr.employee, employee)
        .success(function(response, status, headers, config) {
          deferred.resolve(response);
        })
        .error(function(response, status, headers, config) {
          deferred.reject(response);
        }
      );
      return deferred.promise;
    }

    /**
     * update employee
     * @param employee
     * @returns {*}
     */
    function update(employee){
      var deferred = $q.defer();
        $http.put(config.endpoints.hr.employee + '/' + employee.id, employee)
          .success(function(response, status, headers, config) {
            deferred.resolve(response);
          })
          .error(function(response, status, headers, config) {
            deferred.reject(response);
          }
      );
      return deferred.promise;
    }



      function saveOutboundphone(employee,id){
          var deferred = $q.defer();
          $http.post(config.endpoints.hr.employee + '/updateOutboundphone/' + id, employee)
              .success(function(response, status, headers, config) {
                  deferred.resolve(response);
              })
              .error(function(response, status, headers, config) {
                      deferred.reject(response);
                  }
              );
          return deferred.promise;
      }

      function delOutboundphone(employee,id){
          var deferred = $q.defer();
          $http.post(config.endpoints.hr.employee + '/delOutboundphone/' + id, employee)
              .success(function(response, status, headers, config) {
                  deferred.resolve(response);
              })
              .error(function(response, status, headers, config) {
                      deferred.reject(response);
                  }
              );
          return deferred.promise;
      }


    function remove(employee){
      var deferred = $q.defer();
      $http.delete(config.endpoints.hr.employee + '/' + employee.id)
          .success(function(response, status, headers, config) {
            deferred.resolve(response);
          })
          .error(function(response, status, headers, config) {
            deferred.reject(response);
          }
      );
      return deferred.promise;
    }

      /**
       * Set the employee's password to default password.
       * @param employee
       */
    function resetPassword(employee){
        var deferred = $q.defer();
          $http.post(config.endpoints.hr.employee + '/resetPassword', employee)
              .success(function(response, status, headers, config) {
                  deferred.resolve(response);
              })
              .error(function(response, status, headers, config) {
                  deferred.reject(response);
              }
          );
        return deferred.promise;
    }

      /**
       * Gets the list of subjects.
       * @return the promise
       */
      function getAllSubjects() {
          var deferred = $q.defer();
          $http.get(config.endpoints.hr.employee + "/getAllSubjects")
              .success(function(response, status, headers, config) {
                  deferred.resolve(response);
              })
              .error(function(response, status, headers, config) {
                  deferred.reject(response);
              }
          );
          return deferred.promise;
      }

      function getAllDictData(){
          var deferred = $q.defer();
          $http.get(config.endpoints.hr.employee + "/getAllDictData")
              .success(function(response, status, headers, config){
                  deferred.resolve(response);
              })
              .error(function(response, status, headers, config){
                  deferred.reject(response);
              }
          );
          return deferred.promise;
      }

      function getTeachingGrade(){
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.common + "/teachingGrade?params={}")
            .success(function(response, status, headers, config){
                deferred.resolve(response);
            })
            .error(function(response, status, headers, config){
                deferred.reject(response);
            }
        );
        return deferred.promise;
    }

      

    return service;
  }
]);
