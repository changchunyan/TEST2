'use strict';

angular.module('ywsApp').controller('VersionShowController', ['$scope','$sce','VersionManagementService', '$rootScope','$modal', '$mtModal', 'SweetAlert',
            function($scope,$sce,VersionManagementService, $rootScope,$modal, $mtModal, SweetAlert) {
                $scope.getVersionList = getVersionList;
                $scope.showVersion = showVersion;


                $scope.filter = {};
                $scope.versionLists = [];
                $scope.tableState = {};
                $scope.showVertionTitle = ''

                getVersionList($scope.tableState);
                //获取版本列表
                function getVersionList(tableState){
                    if(!tableState.pagination){
                        tableState.pagination={};
                        tableState.search={};
                        tableState.search={predicateObject:{}};
                    }
                    $scope.isLoading = true;
                    var pagination = tableState.pagination;
                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 1000;
                    VersionManagementService.getVersionListByFilter(start, number, tableState,$scope.filter).then(function (result) {
                        $scope.versionLists = result.data;
                        showVersion(0,$scope.versionLists[0].title,$scope.versionLists[0].contentPath);
                        $scope.leadNum = result.totalSize;
                        tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
                        $scope.bdLeadsListTableState = tableState;
                        $scope.isLoading = false;
                    });
                }

                function showVersion(index,title,url) {
                    $scope.showVersionTitle = title;
                    $('.versionLi').removeClass('active');
                    $('.versionLi').eq(index).addClass('active');
                    $(".help_content_right_content").html("");

                    console.log(url);
                    if(url){
                        $(".help_content_right_content").load(url);
                    }

                }
            }
        ]
    )
