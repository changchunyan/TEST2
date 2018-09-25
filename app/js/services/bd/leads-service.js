'use strict';

/**
 * 招商Leads service层
 * @author philliu@youwinedu.com
 * @version 1.0
 */
angular.module('ywsApp').factory('BdLeadsService',  ['$http', '$q', 'config','$filter', '$timeout',function($http, $q, config, $filter, $timeout) {

    var service = {};
    service.list = list;
    service.listAllByfilter = listAllByfilter;
    service.getDictionary = getDictionary;
    service.save = save;
    service.getBDManagers = getBDManagers;
    service.saveAllot = saveAllot;
    service.detail = detail;
    service.sendApplication = sendApplication;
    service.getBDManagers2 = getBDManagers2;
    service.distribute = distribute;
    service.batchDistribute = batchDistribute;
    service.transList = transList;
    service.findByPhone = findByPhone;

    /**
     * 根据查询条件获取leads列表
     */
    function listAllByfilter(filter){
        var deferred = $q.defer();
        var param = angular.copy(filter);
        param.export = true;
        $http.post(config.endpoints.bd.Leads+'/list',param).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get LeadsStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    /**
     * 获取招商Leads列表.
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
        $http.post(config.endpoints.bd.Leads+'/list',filter).success(function(response, status, headers, config) {
            deferred.resolve({
                data: response.data.list,
                numberOfPages: response.data.pages,
                totalSize:response.data.total
            });
        }).error(function(response, status, headers, config) {
                console.log('Failed to get LeadsStudent : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }


    function getDictionary(type, id) {
        var url = config.endpoints.bd.Common + "/";
        if(type == "CustomerType") {
            url += "getAllCustomerTypes";
        } else if(type == "CustomerStatus") {
            url += "getAllCustomerStatuses";
        } else if(type == "Project") {
            url += "getAllProjects";
        } else if(type == "Media") {
            url += "getAllMedias";
        } else if(type == "Education") {
            url += "getAllEducations";
        } else if(type == "InvestProp") {
            url += "getAllInvestProps";
        } else if(type == "InvestType") {
            url += "getAllInvestTypes";
        } else if(type == "Gender") {
            url += "getAllGenders";
        } else if(type == "Province") {
            url += "getAllProvinces";
        } else if(type == "City") {
            url += "getAllCityByProvinceCode/" + id;
        } else if(type == "Area") {
            url += "getAllAreaByCityCode/" + id;
        }else if(type == "MediaOrigin") {
            url += "getAllMediaOrigins";
        }else if(type == "MediaEffect") {
            url += "getAllMediaEffects";
        }else if(type == "MediaDetail") {
            url += "getMediaDetailsByParentCode/" + id;
        }else if(type == "ProfessionBackground") {
            url += "getAllProfessionBackgrounds";
        }else if(type == "InvestAbility") {
            url += "getAllInvestAbilitys";
        }else if(type == "MARRIED") {
            url += "getAllMarrey";
        }else if(type == "HaveChild") {
            url += "getAllHaveChild";
        }else if(type == "interest") {
            url += "getAllInterest";
        }else if(type == "communicationtype") {
            url += "getAllCommunicationType";
        }else if(type == "joinreason") {
            url += "getAllJoinReason";
        }else if(type == "intention") {
            url += "getAllIntention";
        }

        var deferred = $q.defer();
        $http.get(url)
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

    function save(BdLeadsVo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Leads+'/save', BdLeadsVo)
            .success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function(response, status, headers, config) {
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function getBDManagers() {
        var deferred = $q.defer();
        $http.get(config.endpoints.bd.Leads+'/getBDManagerList')
            .success(function(response, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function(response, status, headers, config) {
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function getBDManagers2(UserInfo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Leads+'/getManagerList', UserInfo)
          .success(function(response, status, headers, config) {
              deferred.resolve(response);
          })
          .error(function(response, status, headers, config) {
              deferred.reject(response.error);
          }
        );
        return deferred.promise;
    }

    function saveAllot(AllotBdLeadsVo) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Leads+'/saveAllot', AllotBdLeadsVo)
            .success(function(response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to create AllotLeads : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function detail(id){
        var deferred = $q.defer();
        $http.get(config.endpoints.bd.Leads + '/detail/' + id)
            .success(function(response, status, headers, config){
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config){
                console.log('Failed to get Detail : ' + JSON.stringify(response));
                deferred.reject(response.error);
            })
        return deferred.promise;
    }

    function transList(id){
        var deferred = $q.defer();
        $http.get(config.endpoints.bd.Leads + '/gettransferlist?id=' + id)
          .success(function(response, status, headers, config){
              deferred.resolve(response);
          })
          .error(function(response, status, headers, config){
              console.log('Failed to get Detail : ' + JSON.stringify(response));
              deferred.reject(response.error);
          })
        return deferred.promise;
    }

    function sendApplication(id) {
        var deferred = $q.defer();
        $http.get(config.endpoints.bd.Leads+'/sendApplication/' + id)
            .success(function(response, status, headers, config) {
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to sendApplication : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function distribute(param) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Leads+'/distribute', param)
          .success(function(response, status, headers, config) {
              deferred.resolve(response);
          })
          .error(function(response, status, headers, config) {
              deferred.reject(response.error);
          }
        );
        return deferred.promise;
    }

    function batchDistribute(param) {
        var deferred = $q.defer();
        $http.post(config.endpoints.bd.Leads+'/distributeall', param)
          .success(function(response, status, headers, config) {
              deferred.resolve(response);
          })
          .error(function(response, status, headers, config) {
              deferred.reject(response.error);
          }
        );
        return deferred.promise;
    }

    function findByPhone(phone) {
        var deferred = $q.defer();
        $http.get(config.endpoints.bd.Leads+'/findbyphone?phone=' + phone)
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
