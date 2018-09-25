'use strict';

angular.module('ywsApp').controller('BdApplicationController', ['$scope', '$location','$filter','CommonService', 'BdApplicationService', 'BdLeadsService', '$modal', '$rootScope', 'SweetAlert',
  'localStorageService','AuthenticationService', "$routeParams",

    function($scope, $location,$filter,CommonService, BdApplicationService, BdLeadsService, $modal, $rootScope, SweetAlert,localStorageService,AuthenticationService, $routeParams) {
        $scope.detail = {};
        $scope.display = function() {


            var promise = BdApplicationService.detail($routeParams.id);
            promise.then(function(data) {
                $scope.detail = data;
                if($scope.detail.education_time) {
                    $scope.detail.education_time = new Date($scope.detail.education_time);
                }
                if($scope.detail.work1_time) {
                    $scope.detail.work1_time = new Date($scope.detail.work1_time);
                }
                if($scope.detail.work2_time) {
                    $scope.detail.work2_time = new Date($scope.detail.work2_time);
                }
                if($scope.detail.work3_time) {
                    $scope.detail.work3_time = new Date($scope.detail.work3_time);
                }
                if($scope.detail.work4_time) {
                    $scope.detail.work4_time = new Date($scope.detail.work4_time);
                }
                if($scope.detail.work5_time) {
                    $scope.detail.work5_time = new Date($scope.detail.work5_time);
                }
                console.dir($scope.detail);
            });
            

        }
        $scope.display();
    }
]);
