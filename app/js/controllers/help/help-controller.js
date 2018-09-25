'use strict';

/**
 * The help controller.
 *
 */

angular.module('ywsApp').controller('helpController', ['$scope','$routeParams','$q','SweetAlert','HelpService',function ($scope,$routeParams,$q,SweetAlert,HelpService) {

    $scope.getAllHelp = getAllHelp;
    $scope.showDetail = showDetail;
    $scope.showLiBg = showLiBg;
    $scope.getAllHelp();
    function getAllHelp() {
        var promise = HelpService.getAllHelpInfo();
        promise.then(function(response) {
                if(response.status == "FAILURE"){
                    SweetAlert.swal( response.data,"请重试","error");
                }
                else{
                    $scope.helpMenu = response.data;
                    if($routeParams.v3==1&&$routeParams.detail){
                        var detail = JSON.parse($routeParams.detail)
                        showDetail(detail.contentHtml,detail.contentId,detail.contentTitle)
                        var _openMenu = function(secId) {
                            for(var _i = 0 , _len = $scope.helpMenu.length ; _i<_len ; _i++){
                                for(var _j = 0 , _jlen = $scope.helpMenu[_i].contents.length ; _j<_jlen ; _j++){
                                    console.log($scope.helpMenu[_i].contents[_j].id==secId)
                                    if($scope.helpMenu[_i].contents[_j].id==secId){
                                        $scope.helpMenu[_i].open = true
                                        $scope.helpMenu[_i].contents[_j].first = true
                                        break
                                    }
                                }
                            }
                        }
                        _openMenu(detail.contentId)

                    }else{
                        $scope.helpMenu[0].open = true;
                        $scope.helpMenu[0].contents[0].first = true;
                        $scope.showDetail($scope.helpMenu[0].contents[0].content,1,$scope.helpMenu[0].contents[0].title);
                    }
                }
            },
            function(error) {
            });
    };

    function showDetail(detail,id,title) {
        var helpContentRight = document.getElementsByClassName("help_content_right")[0];
        $scope.helpContentTitle = title;
        $(".help_content_right_content").load("http://"+detail);
        $(".help-thirdMenu").removeClass("active");
        $("._id_"+id).addClass("active");
    }

    function showLiBg(index,e) {
        var e = event || window.event;
        if(e.target.className == "help-subMenu"){
            $scope.helpMenu[index].open = !($scope.helpMenu[index].open);
        }
    }
}
])
