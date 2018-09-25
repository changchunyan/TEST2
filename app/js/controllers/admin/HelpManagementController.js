'use strict';

angular.module('ywsApp').controller('HelpManagementController', ['$scope','$sce', '$rootScope','$modal', 'HelpManagerService', '$mtModal', 'SweetAlert',
  function($scope,$sce, $rootScope,$modal,HelpManagerService, $mtModal, SweetAlert) {

    // =====================================
      $scope.helpContentLists = [];
      $scope.helpTopicLists = [];
      $scope.helpTopicListAll = [];
      $scope.contentListTableState = {};
      $scope.topicListTableState = {};
      $scope.contentFilter = {};
      $scope.topicFilter = {};
      $scope.getContests = getContests;
      $scope.getTopics = getTopics;
      $scope.getAllTopic = getAllTopic;
      $scope.newHelpTheme = {};
      // $scope.newDate = {};
      $scope.neworder={};
      // 添加帮助内容保存时向后台发送的数据包
      $scope.ContentBag={};

      $scope.helpObj = {};
      $scope.willdelet={};
      $scope.editorTheme="";

      $scope.setSelectedHelp=setSelectedHelp;
      setSelectedHelp(1);

      // 添加新的帮助主题
      $scope.saveAddTheme=saveAddTheme;
      function getAllTopic(){
          HelpManagerService.allTopic().then(function (result) {
              //$scope.getAllSelected();
              $scope.helpTopicListAll = result.data;
              
          });
      }
      $scope.getAllTopic();

      $scope.refListView = function() {
          $scope.contentListTableState.pagination.start = 0;
          $scope.getContests($scope.contentListTableState);

          $scope.topicListTableState.pagination.start = 0;
          $scope.getTopics($scope.topicListTableState);
      }

      function getContests(tableState){
          if(!tableState.pagination){
              tableState.pagination={};
              tableState.search={};
              tableState.search={predicateObject:{}};
          }
          $scope.contentListTableState = tableState;
      
      
          $scope.isLoading = true;
          var pagination = tableState.pagination;
          var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
          var number = pagination.number || 10;
          HelpManagerService.contentList(start, number, tableState,$scope.contentFilter).then(function (result) {
              //$scope.getAllSelected();
              $scope.helpContentLists = result.data;
              $scope.leadNum = result.totalSize;
              tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
              $scope.bdLeadsListTableState = tableState;
              $scope.isLoading = false;
          });
      
      }


      function getTopics(tableState){
          if(!tableState.pagination){
              tableState.pagination={};
              tableState.search={};
              tableState.search={predicateObject:{}};
          }
          $scope.topicListTableState = tableState;
      
      
          $scope.isLoading = true;
          var pagination = tableState.pagination;
          var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
          var number = pagination.number || 10;
          HelpManagerService.topicList(start, number, tableState,$scope.topicFilter).then(function (result) {
              //$scope.getAllSelected();
              $scope.helpTopicLists = result.data;
              $scope.leadNum = result.totalSize;
              tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
              $scope.bdLeadsListTableState = tableState;
              $scope.isLoading = false;
          });
      
      }


      



    // 点击添加帮助内容弹出添加框

    $scope.showTheAddHelpBox=function () {
        angular.element("#creathelp").css("transform","translateY(0px)");
        angular.element(document).remove($('.modal-backdrop .in'));
    }
      // 取消添加帮助内容
      $scope.cancelHelpAdd=function () {
          angular.element("#creathelp").css("transform","translateY(-1000px)");
          angular.element("#helpTheme").val('');
          angular.element('#summernote').summernote('code','在此处输入内容');
          angular.element("#belongTheme").val('');
      }
      // 取消编辑然后编辑框弹回
      $scope.cancleeditor=function () {
          angular.element("#editorhelp").css("transform","translateY(-1000px)");
      }
    $scope.showAddThemeModal=function () {
        angular.element("#addHelpThemebox").css("transform","translateY(0px)");

    }
    // 取消添加主题
      $scope.cancelAddTheme=function () {
           angular.element("#addHelpThemebox").css("transform","translateY(-1000px)");
           angular.element("#addnewhelptheme").val('');
      }
     // 切换帮助内容和帮助主题tab页
     function setSelectedHelp(num) {
         
         $scope.ishelp=num;
     }
    // **********重点来了 编辑完添加帮助内容以后 将数据打包发送给后台
       $scope.SaveContent=function () {
           var helpTheme = $("#helpTheme").val().trim();
           var belongTheme = document.getElementById("belongTheme").value;
            if(helpTheme && belongTheme){
                var contentBag={};
                // $scope.uploadLoading=true;
                contentBag.title=$scope.ContentBag.title;
                contentBag.helpTopicId=$scope.helpTopicId;
                contentBag.Timetamp=new Date().getTime();
                contentBag.content=$('#summernote').summernote('code');
                //contentBag.mes=$scope.ContentBag.mes;

                //console.log(contentBag.mes);
                HelpManagerService.SaveHelpContent(contentBag,contentBag.helpTopicId).then(function () {

                })
                setTimeout(function () {
                    $("#creathelp").css("transform","translateY(-1000px)");
                    $("#helpTheme").val('');
                    $('#summernote').summernote('code','在此处输入内容');
                    $scope.getContests($scope.bdLeadsListTableState);
                },1000)
            }else{
                SweetAlert.swal({
                        title: "帮助主题和帮助标题不能为空！",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: ' #fe9900',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        closeOnConfirm: true
                    }, function (confirm) {
                        if (confirm) {

                        }
                    }
                );
            }

       }
       //添加主题saveTopic()
       
       $scope.saveTopic=function () {
           var addnewhelptheme = $("#addnewhelptheme").val().trim();

           if(addnewhelptheme){
               var HelpTopic = {};
               HelpTopic.title = $scope.help_topic_title;
               HelpManagerService.saveTopic(HelpTopic).then(function () {
                   $("#addHelpThemebox").css("transform","translateY(-1000px)");
                   $("#addnewhelptheme").val("");
                   $scope.getTopics($scope.bdLeadsListTableState);
                   $scope.getAllTopic();
               })
           }else {
               SweetAlert.swal({
                       title: "帮助主题不能为空！",
                       type: "warning",
                       showCancelButton: true,
                       confirmButtonColor: ' #fe9900',
                       confirmButtonText: '确定',
                       cancelButtonText: '取消',
                       closeOnConfirm: true
                   }, function (confirm) {
                       if (confirm) {

                       }
                   }
               )

           }

       }
    
      // 在帮助内容管理下 输入排序并且鼠标离开时将修改后的数据进行更新操作
       $scope.BlurAndOrder=function (row,index) {

           var neworerdate=parseInt($(".neworerdate").eq(index).val());
           if(neworerdate>=0){
               row.order_rule=neworerdate;
               var HelpContent = {};
               HelpContent.id = row.contentId;
               HelpContent.orderRule = row.order_rule;
               HelpManagerService.updateContent(HelpContent).then(function () {
                   $scope.getContests($scope.bdLeadsListTableState);
               });
           }else{
               var HelpContent = {};
               HelpContent.id = row.contentId;
               HelpContent.orderRule = row.order_rule;
               HelpManagerService.updateContent(HelpContent).then(function () {
                   $scope.getContests($scope.bdLeadsListTableState);
               });

           }



       }
      // 在帮助主题管理下 输入排序并且鼠标离开时将修改后的数据进行更新操作
      $scope.ThemeBlurAndOrder=function (row,index) {
          var newThemeid=parseInt($(".Themeorderinput").eq(index).val());
          if(newThemeid>=0){
              row.ordeRule=newThemeid;
              var ThemeHelpContent = {};
              ThemeHelpContent.id = row.id;
              ThemeHelpContent.orderRule = row.ordeRule;
              HelpManagerService.updateTopic(ThemeHelpContent).then(function () {
                  $scope.getTopics($scope.bdLeadsListTableState)
              });
          }else {
              var ThemeHelpContent = {};
              ThemeHelpContent.id = row.id;
              ThemeHelpContent.orderRule =row.orderRule;
              HelpManagerService.updateTopic(ThemeHelpContent).then(function () {
                  $scope.getTopics($scope.bdLeadsListTableState)
              });

          }


          }
      
       
      //  点击帮助内容管理中的任意一个选项后面的操作按钮中的  查看按钮都会弹出查看模态框
      $scope.showHelpView = function (row) {
          $scope.modalTitle = '查看帮助内容';
          $scope.modal = $modal({
              scope: $scope,
              templateUrl: 'partials/admin/modal.helpContentDetail.html',
              show: true
          });
          $scope.showTopic = row.topicTitle;
          $scope.showTitle = row.contentTitle;
          $scope.showContent = $sce.trustAsResourceUrl("http://"+row.contentHtml);

      }

          //  点击帮助内容管理中的任意一个选项后面的操作按钮中的  编辑按钮都会弹出编辑模态框
           $scope.changehelpdata={};
          $scope.changeHelpInfo = function (row) {
              $("#editorhelp").css("transform","translateY(0px)");
              $(document).remove($('.modal-backdrop .in'));
              // 将本条row封装到$scope的一个对象上
              $scope.changehelpdata=angular.copy(row);
              var timetamp=new Date().getTime();
              $('.note-editable').eq(1).load("http://" + $scope.changehelpdata.contentHtml+'?'+timetamp);
          }
          // 编辑以后  将本条信息发送给后台并更新页面
           $scope.SaveEditorHelp=function () {
               var editorhelp={};
               editorhelp.id=$scope.changehelpdata.contentId;
               editorhelp.title=$scope.changehelpdata.contentTitle;
               editorhelp.helpTopicId = $scope.changehelpdata.topicId;
               editorhelp.content=$('#summernote2').summernote('code');
               editorhelp.ext = "help_content_img_change";
               var newT=editorhelp.title.trim();
               if(newT){
                   HelpManagerService.updateContent(editorhelp);
                   setTimeout(function () {
                       $("#editorhelp").css("transform","translateY(-1000px)");
                       $scope.getContests($scope.bdLeadsListTableState);
                   },1000)
                   // setTimeout(function () {
                   //     $(body).css("overflow", "auto");
                   // },1000)
               }else {
                   SweetAlert.swal({
                           title: "帮助标题不能为空！",
                           type: "warning",
                           showCancelButton: true,
                           confirmButtonColor: ' #fe9900',
                           confirmButtonText: '确定',
                           cancelButtonText: '取消',
                           closeOnConfirm: true
                       }, function (confirm) {
                           if (confirm) {

                           }
                       }
                   )
               }
           }
          // 点击主题管理标签下的编辑按钮时弹出的模态框
          $scope.changeThemeHelpInfo = function (row) {
              $scope.changeTopicFilter = angular.copy(row);
              $mtModal.modal('partials/admin/help/modal.html',$scope)
              // $(".editorTheme-modal").css("display","block");
             // $("#willeditorTheme").val(row.title);

          }
           // 编辑完成以后点击保存后发送
           $scope.sureToSaveTheme=function () {
               var newTheme={};
               newTheme.id=$scope.changeTopicFilter.id;
               newTheme.title=$scope.changeTopicFilter.title;
               var newT=newTheme.title.trim();
               if(newT){
                   HelpManagerService.updateTopic(newTheme).then(function () {
                       $scope.getTopics($scope.bdLeadsListTableState);

                   });
                   $scope.editorThemehide();
                   setTimeout(function () {
                       $(body).css("overflow", "auto");
                   },1000)
               }else{
                   SweetAlert.swal({
                           title: "帮助主题不能为空！",
                           type: "warning",
                           showCancelButton: true,
                           confirmButtonColor: ' #fe9900',
                           confirmButtonText: '确定',
                           cancelButtonText: '取消',
                           closeOnConfirm: true
                       }, function (confirm) {
                           if (confirm) {

                           }
                       }
                   )
               }


           }
      // 点击关闭和取消关闭编辑框
           $scope.editorThemehide=function () {
               $(".editorTheme-modal").css("display","none");
           }
          $scope.changeInfoSave = function () {
              $hide();
              console.log($('#summernote2').summernote('code'))
          }
          //  点击帮助内容管理中的任意一个选项后面的操作按钮中的  删除按钮都会弹出确认模态框

          $scope.removeHelp = function (detail,i) {
              $scope.willdelet=detail;
              console.log(detail);
              if(detail.id==undefined){
        		  $scope.helpObj.id = detail.contentId;
        	  }else{
        		  if(detail.contents!=""){
        			  SweetAlert.swal('该主题有帮助内容,无法删除！');
        			  return;
        		  }
            	  $scope.helpObj.id = detail.id;
        	  }
        	  $scope.helpObj.isDeleted = 1;
              SweetAlert.swal({
                      title: "确定要删除吗？",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: ' #fe9900',
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      closeOnConfirm: true
                  }, function (confirm) {
                	  
                      if (confirm) {


                          console.log(1);
                          if(i==0){
                        	  HelpManagerService.updateContent($scope.helpObj).then(function () {
                              $scope.refListView();
                          });

                          //重新查询页面 下面一样
                      }else{
                          HelpManagerService.updateTopic($scope.helpObj).then(function () {
                              $scope.refListView();
                          });
                      }

                      }
                  }
              );
          }

     

  }
])

