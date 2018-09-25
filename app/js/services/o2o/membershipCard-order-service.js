/**
 * The order service.
 * @author sunqc
 * @version 1.0
 */
angular.module('ywsApp').factory('MembershipCardOrderService', ['$http', '$q', 'config',function($http, $q, config) {
    var service = {};
    service.add = add;
    service.remove = remove;
    service.edit = edit;
    service.getPage = getPage;
    　
      function getPage(start, number,orderFlag,order) {
          if(!order){
              order={};
          }
          var deferred = $q.defer();
          $http.get(config.endpoints.o2o.order+ '?start=' + start+'&number='+number+'&params='+JSON.stringify(order))
              .success(function(response, status, headers, config) {
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
  　 　　
    function add(obj) {
      var deferred = $q.defer();
      $http.post(config.endpoints.sos.order, obj)
        .success(function(response, status, headers, config) {
          //console.log("Created order : " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          //console.log('Failed to create order : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }
　
    function edit(obj) {
        var deferred = $q.defer();
        $http.put(config.endpoints.o2o.order + '/' + obj.orderNo, obj)
            .success(function(response, status, headers, config) {
                //console.log("Updated order : " + JSON.stringify(response));
                deferred.resolve(response.data);
            })
            .error(function(response, status, headers, config) {
                //console.log('Failed to update order : ' + JSON.stringify(response));
                deferred.reject(response.error);
            }
        );
        return deferred.promise;
    }
　
    function remove(obj) {
      var deferred = $q.defer();
      $http.delete(config.endpoints.o2o.order + '/' + obj.id)
        .success(function(response, status, headers, config) {
          //console.log("Deleted order: " + JSON.stringify(response));
          deferred.resolve(response.data);
        })
        .error(function(response, status, headers, config) {
          //console.log('Failed to delete order : ' + JSON.stringify(response));
          deferred.reject(response.error);
        }
      );
      return deferred.promise;
    }

    return service;
  }
]);