/**
 * The OrderTransferService service.
 * @author sunqc
 * @version 1.0
 */
angular.module('ywsApp').factory('OrderTransferService', ['$http', '$q', 'config',function($http, $q, config) {
    var service = {};
    service.saveTransfer = saveTransfer;
    service.remove = remove;
    service.editTransfer = editTransfer;
    service.editTransferBack = editTransferBack;
    service.saveTransferTopup = saveTransferTopup;
    service.removeTopup = removeTopup;
    service.editTransferTopup = editTransferTopup;
    service.editTransferBackTopup = editTransferBackTopup;
    service.getPage = getPage;
    service.isMtMTransfer = isMtMTransfer;

    function isMtMTransfer(orderNo) {
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order + '/isMtMTransfer?orderNo='+orderNo)
            .success(function(response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to update order : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function getPage(start, number,orderFlag,filter) {
        //;
        if(!filter){
            filter={};
        }
        var deferred = $q.defer();
        $http.get(config.endpoints.sos.order+ '?start=' + start+'&number='+number+'&orderFlag='+orderFlag+'&orderJson='+JSON.stringify(filter))
            .success(function(response, status, headers, config) {
                //console.log("orders : " + JSON.stringify(response));
                //deferred.resolve(response.data);
                deferred.resolve({
                    data: response.data.list,
                    numberOfPages: response.data.pages
                });
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to get orders : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function saveTransfer(obj) {
      var deferred = $q.defer();
        if(obj.TransferOrders!=null){
            obj.TransferOrders = angular.toJson(obj.TransferOrders);
        }
      $http.post(config.endpoints.sos.order+'/transfer/', obj)
        .success(function(response, status, headers, config) {
          //console.log("Created order : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to create order : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

    function editTransfer(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/transfer', obj)
            .success(function(response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to update order : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function editTransferBack(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/transferBack', obj)
            .success(function(response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to update order : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function remove(obj) {
      var deferred = $q.defer();
      $http.delete(config.endpoints.sos.order + '/' + obj.id)
        .success(function(response, status, headers, config) {
          //console.log("Deleted order: " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          console.log('Failed to delete order : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

    function saveTransferTopup(obj) {
        var deferred = $q.defer();
        $http.post(config.endpoints.sos.order+'/transferTopup/', obj)
            .success(function(response, status, headers, config) {
                //console.log("Created order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to create order : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function editTransferTopup(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/transferTopup', obj)
            .success(function(response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to update order : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function editTransferBackTopup(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.sos.order + '/transferBackTopup', obj)
            .success(function(response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to update order : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    function removeTopup(obj) {
        var deferred = $q.defer();
        $http.delete(config.endpoints.sos.order + '/Topup/' + obj.id)
            .success(function(response, status, headers, config) {
                //console.log("Deleted order: " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                console.log('Failed to delete order : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }

    return service;
  }
]);