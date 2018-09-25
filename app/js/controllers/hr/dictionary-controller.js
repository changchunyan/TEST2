'use strict';

/**
 * The dictionary manange controller.
 *
 * @author czq
 * @version 1.0
 */
angular.module('ywsApp').controller('DictionaryController', [
    '$scope', '$modal', '$rootScope', 'SweetAlert','DictionaryService',
    function($scope,   $modal,   $rootScope,   SweetAlert ,DictionaryService) {

        $scope.list = list;
        $scope.update = update;

        $scope.list();
        $('.collapse').collapse();

        /**
         * Get the dictionary parameters.
         */
        function list(){
            var promise = DictionaryService.list();
            promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    $scope.dictionary = response.data;
                }
            }, function(error) {
            });
        }

        /**
         * Update the dictionary parameters.
         */
        function update(){
            var promise = DictionaryService.update($scope.dictionary);
            promise.then(function(data) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    SweetAlert.swal('修改成功', 'success');
                }
            }, function(error) {
            });
        }
    }
]);

