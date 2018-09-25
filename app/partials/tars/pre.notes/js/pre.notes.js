/**
 * Created by 李世明 on 2016/12/6 0006.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:教研系统控制器
 */
'use strict';
angular.module('ywsApp').controller('PreNotesController', ['$scope', '$rootScope', '$location', '$sce', '$modal', '$mtModal', 'TarsServer', '$http', 'SweetAlert', function ($scope, $rootScope, $location, $sce, $modal, $mtModal, TarsServer, $http, SweetAlert) {
    var _version = Date.now(),
        _timer = ''

    $scope.$url = {
        pdf: 'partials/tars/pdf.html?v=' + Date.now()
    }
    /**
     * 试题库管理
     * @type {{cart: {data: Array, addOne: addOne, deleteOne: deleteOne, init: init, getIndex: getIndex}, add: add}}
     */
    $scope.$queLib = {
        //  查询条件
        queTableState: {
            subject: 19,
            question_type: null,
            diffculty: null,
            stage: null,
            paper_type: null,
            state: null,
            analysis: null,
            video: null,
            mastery: null,
            topicId: null,
            seriesId: null,
            year: null,
            region: null,
            prov: null,
            city: null,
            county: null,
            highQual: null,
            countTopic: 1,
            sort: "id",
            keyword: null,
            desc: "DESC",
            page: 1,
            limit: 10
        },
        /**
         * 通过学科对象获取题型列表
         * @param obj
         * 学科对象
         */
        findQueTypeBySubject: function (obj) {
            $scope.queTypeList = TarsServer.findQueTypeBySubject(obj)
        },
        pageFindQustAll: function () {
            TarsServer.pageFindQustAll($scope.$queLib.queTableState).then(function (data) {
                var result = data.data
                $scope.qustList = result.content
                $scope.totalPages = result.totalPage
                $scope.$queLib.comparisonList()
                _newPaging(result, $scope.$queLib.queTableState.page, function (pageNo) {
                    $scope.$queLib.queTableState.page = parseInt(pageNo, 10)
                    if (!_timer) {
                        clearTimeout(_timer)
                    } else {
                        $scope.$queLib.pageFindQustAll()
                    }
                })
            })
        },
        /**
         * 试题框操作相关
         */
        cart: {
            data: [],
            /**
             * 添加一条元素
             */
            addOne: function (obj) {
                this.data.push(obj)
                // console.log(this.data)
            },
            /**
             * 删除一条元素
             */
            deleteOne: function (index) {
                //  删除自身的元素
                this.data.splice(index, 1)
            },
            /**
             * 初始化已选知识点，无论是删除还是添加一律通过此函数判断
             * 如果obj.select==0,那么当前状态为没有选中，则用户的操作是选中操作，反之你懂的
             * @param obj
             */
            init: function (obj) {
                //  操作之前判断该对象是否存在于this.data中
                var index = this.getIndex(obj)
                if (index == -1) {
                    //  添加
                    this.addOne(obj)
                } else {
                    //  删除
                    this.deleteOne(index)
                }
            },
            /**
             * 获取数组的索引，如果该对象存在于数组中则返回改元素的在this.data中的索引，如果不存在则返回-1，判断是否存在的方法：
             * this.data[i].id==obj.id
             * @param obj
             * @returns {*}
             */
            getIndex: function (obj) {
                for (var i = 0, len = this.data.length; i < len; i++) {
                    if (this.data[i].id == obj.id) {
                        return i
                    }
                }
                return -1
            }
        },

        /**
         * 将所选题目放入试题框
         * @param obj
         * 题目对象
         */
        add: function (obj) {
            //除了需要操作自身的对象之外需要深copy在操作，并且先操作试题框数组在操作原对象
            var newObj = angular.copy(obj)
            this.cart.init(obj)
            obj.exist = true
            this.queHover(1)
        },
        /**
         * 删除所选的题目
         * @param obj
         * 题目对象
         */
        delete: function (obj) {
            // 1.把cart对象里的数据删除
            for (var ci = 0, clen = this.cart.data.length; ci < clen; ci++) {
                if (this.cart.data[ci].id === obj.id) {
                    this.cart.data.splice(ci, 1)
                    break;
                }
            }
            // 2.从$scope.qustList中找出obj.id对应的对象并把exist改为false
            for (var qi = 0, qlen = $scope.qustList.length; qi < qlen; qi++) {
                if ($scope.qustList[qi].id === obj.id) {
                    $scope.qustList[qi].exist = false
                    break;
                }
            }
            // 3.移除自身对象（$scope.selectedCart）中的当前数据
            for (var key in $scope.selectedCart) {
                for (var si = 0, slen = $scope.selectedCart[key].length; si < slen; si++) {
                    if ($scope.selectedCart[key][si].id === obj.id) {
                        $scope.selectedCart[key].splice(si, 1)
                        break;
                    }
                }
            }

        },
        commonFor: function (arr, obj) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].id === obj.id) {
                    arr.splice(i, 1)
                }
            }
        },
        /**
         * 鼠标滑倒试题库进行操作
         */
        queHover: function () {
            $scope.skop = false
            $scope.selectedCart = {}
            var _arr = angular.copy(this.cart.data)
            // $scope.selectedCart中的questionType为汉字：选择，填空等等
            for (var i = 0, len = _arr.length; i < len; i++) {
                if (i === 0) {//    如果首次循环则把第一个元素赋值给$scope.selectedCart.questionType数组
                    $scope.selectedCart[_arr[i].questionType] = []
                    $scope.selectedCart[_arr[i].questionType].push(_arr[i])
                } else if ($scope.selectedCart[_arr[i].questionType] && $scope.selectedCart[_arr[i].questionType].length) {
                    // 如果$scope.selectedCart.questionType数组存在则追加数组元素
                    $scope.selectedCart[_arr[i].questionType].push(_arr[i])

                } else {
                    $scope.selectedCart[_arr[i].questionType] = []
                    $scope.selectedCart[_arr[i].questionType].push(_arr[i])
                }
            }
            if (!arguments.length)
                $scope.sque = !$scope.sque
        },
        /**
         * this.cart.data与$scope.qustList比较是否选中
         */
        comparisonList: function () {
            for (var si = 0, slen = $scope.$queLib.cart.data.length; si < slen; si++) {
                for (var qi = 0, qlen = $scope.qustList.length; qi < qlen; qi++) {
                    //  已经在试题框
                    if ($scope.$queLib.cart.data[si].id === $scope.qustList[qi].id) {
                        $scope.qustList[qi].exist = true
                    }
                }
            }
        }
    }

    /**
     * 知识体系模块
     * @type {{clickOpen: clickOpen, clickOpenOne: clickOpenOne, clickSelect: clickSelect, clickClear: clickClear}}
     */
    $scope.$mtTarget = {
        /**
         * 通过课程id获取知识体系
         * @param subjectId
         * 课程idcon
         */
        getModuleTopic: function () {
            var subjectId = this.cwTableState.subject
            TarsServer.findKnowledgeBySubjectId(subjectId).then(function (data) {
                $scope.moduleTopic = data.data.moduleTopic
            })
        },
        /**
         * 通过学科对象获取年级列表
         * @param obj
         * 学科对象
         */
        findGradeBySubject: function (obj) {
            $scope.gradeList = TarsServer.findGradeBySubject(obj)
            // this.getModuleTopic()
            // this.pageFindCwAll()
        },
        /**
         * 返回所有年级科目
         */
        findAllSubject: function () {
            $scope.subjectList = TarsServer.findAllSubject()
        },
        cwTableState: {
            limit: 10,
            page: 1,
            directoryId: '',
            subject: 19,
            query: '',
            stageId: 3,
            subjectId: '',
            versionId: '',
            stateList: ["ENABLED"]
        },
        /**
         * 分页获取备课笔记列表
         * @param tableState
         * 查询和分页信息
         * tableState = {
                limit: 10,每页条数
                page: 1,页码
                grade: 11,年级码
                subject: 4科目码}
         */
        pageFindCwAll: function () {
            if ($scope.nowMap == '备课笔记库') {
                delete $scope.$mtTarget.cwTableState.subject;
            }
            TarsServer.pageFindCwAll($scope.$mtTarget.cwTableState).then(function (data) {
                var result = data.data;
                $scope.cwAllList = result.content.pageList;
                $scope.totalPages = result.totalPages;
                _newPaging(result, $scope.$mtTarget.cwTableState.page, function (pageNo) {

                    $scope.$mtTarget.cwTableState.page = parseInt(pageNo, 10)
                    $scope.$mtTarget.pageFindCwAll()
                })
            })
        },
        getStudyStage: function () {
            TarsServer.getStudyStage().then(function (data) {

                if (data.data.status == "SUCCESS") {
                    $scope.stageList = data.data.data;
                }
            })
        },
        getFindSubjectByStage: function () {
            var params = {
                stage_id: $scope.$mtTarget.cwTableState.stageId
            }

            TarsServer.getFindSubjectByStage(params).then(function (data) {
                if (data.data.success == true) {
                    $scope.noteSubjectList = data.data.list;
                }
            })
        },
        getVersions: function () {
            var params = {
                stage_id: $scope.$mtTarget.cwTableState.stageId,
                subjectId: $scope.$mtTarget.cwTableState.subjectId
            }
            TarsServer.getVersions(params).then(function (data) {
                if (data.data.status == "SUCCESS") {
                    $scope.versionList = data.data.data;
                }
            })
        },
        getGradeList: function () {
            var params = {
                stage_id: $scope.$mtTarget.cwTableState.stageId,
                subjectId: $scope.$mtTarget.cwTableState.subjectId,
                versionId: $scope.$mtTarget.cwTableState.versionId
            }
            TarsServer.getGradeList(params).then(function (data) {
                if (data.data.status == "SUCCESS") {
                    $scope.gradeList = data.data.data[0].directorys;
                }
            })
        },
        getDirectory: function () {
            var params = {
                directory_id: $scope.$mtTarget.cwTableState.directoryId,
            }
            TarsServer.getDirectory(params).then(function (data) {

                if (data.data.status == "SUCCESS") {
                    $scope.KnowledgePointsList = data.data.data.chapters;
                }
            })
        },

        findByCwId: function (id) {
            TarsServer.findByCwId(id).then(function (data) {
                // Pdf.setUrl
            })
        },
        /**
         * 已选知识点操作
         */
        KnowledgePoints: {
            data: [],
            /**
             * 设置知识点第三层id,用于查询试题库列表
             */
            setTopicId: function () {
                $scope.TopicId = ''
                for (var i = 0, len = this.data.length; i < len; i++) {
                    $scope.TopicId += this.data[i].id + ','
                }
            },
            /**
             * 添加一条元素
             */
            addOne: function (obj) {
                this.data.push(obj)
            },
            /**
             * 删除一条元素
             */
            deleteOne: function (index) {
                //  删除自身的元素
                this.data.splice(index, 1)
            },
            /**
             * 初始化已选知识点，无论是删除还是添加一律通过此函数判断
             * 如果obj.select==0,那么当前状态为没有选中，则用户的操作是选中操作，反之你懂的
             * @param obj
             */
            init: function (obj) {
                //  操作之前判断该对象是否存在于this.data中
                var index = this.getIndex(obj)
                if (!obj.select && index == -1) {
                    //  添加
                    this.addOne(obj)
                } else {
                    //  删除
                    this.deleteOne(index)
                }
            },
            /**
             * 获取数组的索引，如果该对象存在于数组中则返回改元素的在this.data中的索引，如果不存在则返回-1，判断是否存在的方法：
             * this.data[i].index1==obj.index1&&this.data[i].index2==obj.index2&&this.data[i].index3==obj.index3
             * @param obj
             * @returns {*}
             */
            getIndex: function (obj) {
                for (var i = 0, len = this.data.length; i < len; i++) {
                    if (this.data[i].index1 == obj.index1 && this.data[i].index2 == obj.index2 && this.data[i].index3 == obj.index3) {
                        return i
                    }
                }
                return -1
            }
        },
        /**
         * 已选知识点浮动框
         */
        knowledgeHover: function () {
            $scope.sque = false
            $scope.skop = !$scope.skop
        },
        /**
         * 展开伸缩按钮事件
         * @param arg
         */
        clickOpen: function (arg, type) {

            if (type == "note") {
                for (var one = 0, oneLen = $scope.KnowledgePointsList.length; one < oneLen; one++) {
                    $scope.KnowledgePointsList[one].open = arg
                    // for (var two = 0, twoLen = $scope.moduleTopic[one].units.length; two < twoLen; two++) {
                    //     $scope.moduleTopic[one].units[two].open = arg
                    // }
                }
                return;
            } else {
                for (var one = 0, oneLen = $scope.moduleTopic.length; one < oneLen; one++) {
                    $scope.moduleTopic[one].open = arg
                    for (var two = 0, twoLen = $scope.moduleTopic[one].units.length; two < twoLen; two++) {
                        $scope.moduleTopic[one].units[two].open = arg
                    }
                }
            }

        },
        /**
         * 打开某组知识点事件
         * @param arg
         */
        clickOpenOne: function (arg) {
            arg.open = !arg.open
        },
        /**
         * 选中或者取消某个特定的知识点，传递三个索引值的目的：
         *      TODO：快速通过索引来定位所属位置，在查看（删除操作）右侧浮动框的时候能到达最佳速度，不需要重新遍历这么大一个对象
         * @param three
         * 所选对象
         * @param oneIndex
         * 所选对象对应一级菜单的索引
         * @param twoIndex
         * 所选对象对应二级菜单的索引
         * @param threeIndex
         * 所选对象对应三级菜单的索引
         */
        clickSelect: function (three, oneIndex, twoIndex, threeIndex) {
            //  深复制，防止对原数组产生干扰，除了直接修改原数组的操作外一律使用newObj对象
            var newObj = angular.copy(three)
            newObj.index1 = oneIndex
            newObj.index2 = twoIndex
            newObj.index3 = threeIndex
            //  去进行操作
            this.KnowledgePoints.init(newObj)
            three.select = !three.select
            /*
             * 去请求数据
             * */
            console.log('我正要去请求数据，这里附带查询条件参数')
            this.KnowledgePoints.setTopicId()
        },
        /**
         * 清除已选
         */
        clickClear: function (type) {
            /*
             * 去请求数据
             * */
            if (type == "note") {
                this.KnowledgePoints.data.length = 0
                var KnowledgePointsList = angular.copy($scope.KnowledgePointsList)
                for (var i1 = 0, len1 = KnowledgePointsList.length; i1 < len1; i1++) {
                    if (KnowledgePointsList[i1].children) {
                        for (var i2 = 0, len2 = KnowledgePointsList[i1].children.length; i2 < len2; i2++) {
                            KnowledgePointsList[i1].children[i2].select = null
                        }
                    } else {
                        KnowledgePointsList[i1].select = null
                    }
                }
                $scope.KnowledgePointsList = angular.copy(KnowledgePointsList)
                this.KnowledgePoints.setTopicId();
                return;
            }


            console.log('我正要去请求数据，这里不带查询条件')
            this.KnowledgePoints.data.length = 0
            var moduleTopic = angular.copy($scope.moduleTopic)
            for (var i1 = 0, len1 = moduleTopic.length; i1 < len1; i1++) {
                for (var i2 = 0, len2 = moduleTopic[i1].units.length; i2 < len2; i2++) {
                    for (var i3 = 0, len3 = moduleTopic[i1].units[i2].topics.length; i3 < len3; i3++) {
                        moduleTopic[i1].units[i2].topics[i3].select = null
                    }
                }
            }
            $scope.moduleTopic = angular.copy(moduleTopic)
            this.KnowledgePoints.setTopicId()
        },
        /**
         * 在已选知识点中操作删除
         * @param obj
         */
        deleteOne: function (obj) {
            //  先去操作已选数组
            this.KnowledgePoints.init(obj)
            //  然后把大数组的三级菜单的select改为0
            $scope.moduleTopic[obj.index1].units[obj.index2].topics[obj.index3].select = 0
            this.KnowledgePoints.setTopicId()
        }
    }
    /**
     * TODO:试卷库和我的组卷
     * @type {{}}
     */
    var a = 1;
    function getPaperList(type) {
        if (type == "paper") {
            if ($scope.$paperLib.Synchronize) {
                $scope.$paperLib.paperTableState.mPaperType = '1';
            } else {
                switch ($scope.$paperLib.paperTableState.stageId) {
                    case '1':
                        $scope.$paperLib.paperTableState.mPaperType = '3';
                        break;
                    case '2':
                        $scope.$paperLib.paperTableState.mPaperType = '4';
                        break;
                    case '3':
                        $scope.$paperLib.paperTableState.mPaperType = '2';
                        break;
                    case 1:
                        $scope.$paperLib.paperTableState.mPaperType = '3';
                        break;
                    case 2:
                        $scope.$paperLib.paperTableState.mPaperType = '4';
                        break;
                    case 3:
                        $scope.$paperLib.paperTableState.mPaperType = '2';
                        break;
                    default:
                        break;
                }
            }
            $scope.$paperLib.getPageFindPapersAll()
        }
    }


    $scope.$paperLib = {
        // 分页查询试卷列表状态信息
        paperTableState: {
            limit: 10,
            page: 1,
            query: "",
            src: 2,
            directoryId: '',
            // subject: 19,
            stageId: 3,
            subjectId: '',
            versionId: '',
            stateList: ["ENABLED"],
            mPaperType: '1',
            m_type: '1',
            mPaperClassificationIdList: '',
            mTypeList: ["1"]
        },
        // 分页查询我的组卷列表状态信息
        paperMyTableState: { limit: 10, page: 1, query: "", grade: 1, subject: '', src: 1, own: 1 },
        /**
         * 试卷列表
         */
        pageFindPaperAll: function () {
            TarsServer.pageFindPaperCwAll($scope.$paperLib.paperTableState).then(function (data) {
                var result = data.data
                $scope.paperAllList = result.content.pageList
                // console.log($scope.paperAllList)
                $scope.totalPages = result.totalPages
                _newPaging(result, $scope.$paperLib.paperTableState.page, function (pageNo) {
                    $scope.$paperLib.paperTableState.page = parseInt(pageNo, 10)
                    $scope.$paperLib.pageFindPaperAll()
                })
            })
        },

        getPageFindPapersAll: function () {
            TarsServer.getPageFindPapersAll($scope.$paperLib.paperTableState).then(function (data) {
                var result = data.data
                $scope.paperAllList = result.content.pageList;
                $scope.totalPages = result.totalPages
                _newPaging(result, $scope.$paperLib.paperTableState.page, function (pageNo) {
                    $scope.$paperLib.paperTableState.page = parseInt(pageNo, 10)
                    $scope.$paperLib.getPageFindPapersAll()
                })
            })
        },


        getStudyStage: function () {
            TarsServer.getStudyStage().then(function (data) {
                if (data.data.status == "SUCCESS") {
                    $scope.paperStageList = data.data.data;
                }
            })
        },
        getFindSubjectByStage: function () {
            var params = {
                stage_id: $scope.$paperLib.paperTableState.stageId
            }
            TarsServer.getFindSubjectByStage(params).then(function (data) {
                if (data.data.success == true) {
                    $scope.paperSubjectList = data.data.list;
                }
            })
        },
        getVersions: function () {
            var params = {
                stage_id: $scope.$paperLib.paperTableState.stageId,
                subjectId: $scope.$paperLib.paperTableState.subjectId
            }
            TarsServer.getVersions(params).then(function (data) {
                if (data.data.status == "SUCCESS") {
                    $scope.paperVersionList = data.data.data;
                }
            })
        },
        getGradeList: function () {
            var params = {
                stage_id: $scope.$paperLib.paperTableState.stageId,
                subjectId: $scope.$paperLib.paperTableState.subjectId,
                versionId: $scope.$paperLib.paperTableState.versionId
            }
            TarsServer.getGradeList(params).then(function (data) {
                if (data.data.status == "SUCCESS") {
                    $scope.paperGradeList = data.data.data[0].directorys;
                }
            })
        },


        getPaperTypeTree: function () {
            var params = {
                stage_id: $scope.$paperLib.paperTableState.stageId,
            }
            TarsServer.getPaperTypeTree(params).then(function (data) {
                if (data.data.status == "SUCCESS") {
                    $scope.KnowledgePointsList1 = data.data.data.list1;
                    $scope.KnowledgePointsList2 = data.data.data.list2;
                    // $scope.KnowledgePointsList = data.data.data.chapters;
                }
            })
        },

        clickOpen: function (arg) {
            if (this.Synchronize) {
                for (var one = 0, oneLen = $scope.KnowledgePointsList1.length; one < oneLen; one++) {
                    $scope.KnowledgePointsList1[one].open = arg
                    if ($scope.KnowledgePointsList1[one].children) {
                        for (var two = 0, twoLen = $scope.KnowledgePointsList1[one].children.length; two < twoLen; two++) {
                            $scope.KnowledgePointsList1[one].children[two].open = arg
                        }
                    }
                }
            } else {
                for (var one = 0, oneLen = $scope.KnowledgePointsList2.length; one < oneLen; one++) {
                    $scope.KnowledgePointsList2[one].open = arg
                    if ($scope.KnowledgePointsList2[one].children) {
                        for (var two = 0, twoLen = $scope.KnowledgePointsList2[one].children.length; two < twoLen; two++) {
                            $scope.KnowledgePointsList2[one].children[two].open = arg
                        }
                    }
                }
            }
        },
        /**
         * 打开某组知识点事件
         * @param arg
         */
        clickOpenOne: function (arg) {
            arg.open = !arg.open
        },
        /**
         * 选中或者取消某个特定的知识点，传递三个索引值的目的：
         *      TODO：快速通过索引来定位所属位置，在查看（删除操作）右侧浮动框的时候能到达最佳速度，不需要重新遍历这么大一个对象
         * @param three
         * 所选对象
         * @param oneIndex
         * 所选对象对应一级菜单的索引
         * @param twoIndex
         * 所选对象对应二级菜单的索引
         * @param threeIndex
         * 所选对象对应三级菜单的索引
         */
        clickSelect: function (three, oneIndex, twoIndex, threeIndex) {
            //  深复制，防止对原数组产生干扰，除了直接修改原数组的操作外一律使用newObj对象
            var newObj = angular.copy(three)
            newObj.index1 = oneIndex
            newObj.index2 = twoIndex
            newObj.index3 = threeIndex
            //  去进行操作
            this.KnowledgePoints.init(newObj)
            three.select = !three.select
            /*
             * 去请求数据
             * */
            console.log('我正要去请求数据，这里附带查询条件参数')
            this.KnowledgePoints.setTopicId()
        },
        /**
         * 清除已选
         */
        clickClear: function (type) {
            /*
             * 去请求数据
             * */
            if (this.Synchronize) {
                this.KnowledgePoints.data.length = 0
                var KnowledgePointsList1 = angular.copy($scope.KnowledgePointsList1)
                for (var i1 = 0, len1 = KnowledgePointsList1.length; i1 < len1; i1++) {
                    if (KnowledgePointsList1[i1].children) {
                        for (var i2 = 0, len2 = KnowledgePointsList1[i1].children.length; i2 < len2; i2++) {
                            KnowledgePointsList1[i1].children[i2].select = null
                        }
                    } else {
                        KnowledgePointsList1[i1].select = null
                    }
                }
                $scope.KnowledgePointsList1 = angular.copy(KnowledgePointsList1)
                this.KnowledgePoints.setTopicId();
            } else {
                this.KnowledgePoints.data.length = 0
                var KnowledgePointsList2 = angular.copy($scope.KnowledgePointsList2)
                for (var i1 = 0, len1 = KnowledgePointsList2.length; i1 < len1; i1++) {
                    if (KnowledgePointsList2[i1].children) {
                        for (var i2 = 0, len2 = KnowledgePointsList2[i1].children.length; i2 < len2; i2++) {
                            KnowledgePointsList2[i1].children[i2].select = null
                        }
                    } else {
                        KnowledgePointsList2[i1].select = null
                    }
                }
                $scope.KnowledgePointsList2 = angular.copy(KnowledgePointsList2)
                this.KnowledgePoints.setTopicId();
            }
        },
        KnowledgePoints: {
            data: [],
            /**
             * 设置知识点第三层id,用于查询试题库列表
             */
            setTopicId: function () {
                $scope.mPaperClassificationIdList = '';
                for (var i = 0, len = this.data.length; i < len; i++) {
                    $scope.mPaperClassificationIdList += this.data[i].dictCode + ','
                }
                console.log($scope.mPaperClassificationIdList)
            },
            /**
             * 添加一条元素
             */
            addOne: function (obj) {
                this.data.push(obj)
            },
            /**
             * 删除一条元素
             */
            deleteOne: function (index) {
                //  删除自身的元素
                this.data.splice(index, 1)
            },
            /**
             * 初始化已选知识点，无论是删除还是添加一律通过此函数判断
             * 如果obj.select==0,那么当前状态为没有选中，则用户的操作是选中操作，反之你懂的
             * @param obj
             */
            init: function (obj) {
                //  操作之前判断该对象是否存在于this.data中
                var index = this.getIndex(obj)
                if (!obj.select && index == -1) {
                    //  添加
                    this.addOne(obj)
                } else {
                    //  删除
                    this.deleteOne(index)
                }
            },
            /**
             * 获取数组的索引，如果该对象存在于数组中则返回改元素的在this.data中的索引，如果不存在则返回-1，判断是否存在的方法：
             * this.data[i].index1==obj.index1&&this.data[i].index2==obj.index2&&this.data[i].index3==obj.index3
             * @param obj
             * @returns {*}
             */
            getIndex: function (obj) {
                for (var i = 0, len = this.data.length; i < len; i++) {
                    if (this.data[i].index1 == obj.index1 && this.data[i].index2 == obj.index2 && this.data[i].index3 == obj.index3) {
                        return i
                    }
                }
                return -1
            }
        },

        switchPaperClass: function (type) {
            this.Synchronize = type;
            this.clickClear();
            getPaperList("paper");
        },

        Synchronize: 1,
        /**
         * 试卷预览
         * @param id
         * 试卷id
         */
        pageFindPaperView: function (id) {
            var _this = this
            TarsServer.pageFindPaperView(id).then(function (data) {
                $scope.paperDetail = data.data
                var imgSrcList = []
                setTimeout(function () {
                    var imgs = $('#mt_download').find("img");
                    for (var i = 0; i < imgs.length; i++) {
                        imgSrcList.push(imgs[i].src)
                    }
                    if (imgSrcList.length) {
                        TarsServer.findImgSrcBase64(imgSrcList).then(function (data) {
                            $scope.imgSrcBase64 = data.data.data
                        })
                    }

                }, 600)
            })
        },
        /**
         * 清除预览数据，返回
         */
        clearPaperDetail: function () {
            $scope.paperDetail = null
        },
        download: function (name) {
            var imgs = $('#mt_download').find("img");
            for (var i = 0; i < imgs.length; i++) {
                $(imgs[i]).attr('src', $scope.imgSrcBase64[i]);
            }
            $('#mt_download').wordExport(name)
        },
        /**
         * 我的试卷列表
         */
        pageFindMyPaperAll: function () {
            TarsServer.pageFindPaperAll($scope.$paperLib.paperMyTableState).then(function (data) {
                var result = data.data
                $scope.myPaperAllList = result.content.pageList
                $scope.totalPages = result.totalPages
                _newPaging(result, $scope.$paperLib.paperMyTableState.page, function (pageNo) {
                    $scope.$paperLib.paperMyTableState.page = parseInt(pageNo, 10)
                    $scope.$paperLib.pageFindMyPaperAll()
                })
            })
        },
        // 创建组卷参数
        paperParam: {
            paper_name: '', paper_grade: '', paper_subject: '', paper_stage: '', qids: ''
        },
        /**
         *  创建组卷
         */
        creatPaper: function () {
            this.paperParam.qids = this.setQids()
            TarsServer.creatPaper(this.paperParam).then(function (data) {
                if (data.data.success) {
                    $scope.mtResultModal.hide()
                    $mtModal.moreModal({
                        scope: $scope,
                        text: '创建组卷成功',
                        status: 1
                    })
                }
            })
        },
        /**
         * 设置题号,用于查询试题库列表
         */
        setQids: function () {
            var _qids = '',
                _arr = angular.copy($scope.$queLib.cart.data)
            for (var i = 0, len = _arr.length; i < len; i++) {
                _qids += _arr[i].id + ','
            }
            return _qids
        },
        /**
         * 打开模态框
         */
        pre: function (el) {
            if (!$scope.$queLib.cart.data.length) {
                $mtModal.moreModal({
                    scope: $scope,
                    text: '请选择试题',
                    status: 0
                })
                return false
            }
            $scope.mtTitle = '课件'
            // $scope.cwDetail = angular.copy(el)
            $scope.mtSrc = 'partials/tars/modal/index.html?v=' + Date.now()
            $mtModal.moreModalHtml({
                scope: $scope,
                hasNext: function () {
                    //保存操作
                    $scope.$paperLib.creatPaper()
                },
                refresh: function () {
                    $scope.getIntegralRuleList($scope.tableState)
                },
                width: '600px',
                height: '230px'
            })
        },
        //以下两个应用于创建组卷下拉选项
        subjectList: [],
        gradeList: [],
        /**
         * 根据学段查出科目
         */
        findSubjectsByStage: function () {
            var _this = this
            //  获取学科
            TarsServer.findSubjectsByStage(_this.paperParam.paper_stage).then(function (data) {
                _this.subjectList = data.data.list
            })
            //  获取年级(通过学段对象)
            var _obj = { stage: _this.paperParam.paper_stage }
            _this.gradeList = TarsServer.findGradeBySubject(_obj)

        }
    }
    /**
     * 弹框相关操作
     * @type {{application: application}}
     * @private
     */
    $scope._modal = {
        /**
         * 控制器公用模态框
         * @param url
         * 加载地址
         */
        modal: function (url) {
            return $modal({
                scope: $scope,
                templateUrl: url + '?' + new Date().getTime(),
                show: true,
                backdrop: "static"
            })
        },
        /**
         * 应用前准备，点击列表中的应用application
         * @param arg
         */
        pre: function (arg) {
            $scope.cwDetail = angular.copy(arg)
            this.stuParam = { objType: 1, packType: 3 }
            if ($scope.coursePlanList && $scope.coursePlanList.length) {
                $scope.coursePlanList.length = 0
                $scope.coursePlanList = null
                this.coursePlanParam.objId = ''
            }
            this.findStudentList()
            if ($scope._type) {
                $scope.preModalTitle = '应用备课笔记';
            } else {
                $scope.preModalTitle = '应用试卷';
            }

            $scope.preModal = this.modal('partials/tars/pre.notes/modal/select.html')
        },
        /**
         * 选择
         * @param arg
         */
        select: function (arg) {
            $scope.coursePlanDetail = angular.copy(arg)
            try {
                $scope.showFileName = $scope.coursePlanDetail.teacherHandouts.filename
                _reppalyName()
            } catch (e) { }
            $scope.coursePlanDetail.newTitle = $scope.coursePlanDetail.title
            $scope.selectModal = this.modal('partials/tars/pre.notes/modal/save.html')
        },
        /**
         * 取消应用
         */
        canlce: function () {
            $mtModal.moreModal({
                scope: $scope,
                text: '确定不应用？',
                hasNext: function () {
                    $scope.selectModal.hide()
                    $scope.mtResultModal.hide()
                }
            })
        },
        /**
         * 参数json中包含objType（1学员2一对多3班级），packType（1课前预习、3备课笔记、4课后作业）

         */
        stuParam: { objType: 1, packType: 3 },
        /**
         * 查询上课对象选择框
         */
        findStudentList: function () {
            TarsServer.courseObjByFilter(this.stuParam).then(function (data) {
                var _data = data.data
                if (_data.status === 'SUCCESS') {
                    $scope.stuList = data.data.data
                }
            })
        },
        coursePlanParam: { packType: 3 },//查询上课对象排课记录参数
        /**
         * 查询上课对象排课记录
         * @param tabelStates
         */
        findCoursePlanByFilter: function (tableState) {
            if (!$scope._modal.coursePlanParam.objId)
                return false
            if (!tableState) {
                tableState = {}
            }
            // this.coursePlanParam = tableState;
            $scope.CoursePlanByFilterTableState = tableState
            tableState.pagination = tableState.pagination || {}
            var pagination = tableState.pagination
            var number = pagination.number || 10;
            var start = pagination.start || 0;
            $scope._modal.coursePlanParam.pageSize = number
            $scope._modal.coursePlanParam.pageNum = start
            TarsServer.findCoursePlanByFilter($scope._modal.coursePlanParam).then(function (result) {
                if (result.data.status === 'SUCCESS') {
                    $scope.coursePlanList = result.data.data.page ? result.data.data.page.list : []
                    for (var i = 0, len = $scope.coursePlanList.length; i < len; i++) {
                        if ($scope.coursePlanList[i].teacherHandouts) {
                            //修改
                            var str = decodeURI(angular.copy($scope.coursePlanList[i].teacherHandouts.url));
                            str = str.split('/')
                            $scope.coursePlanList[i].teacherHandouts.filename = str[str.length - 1]
                            $scope.coursePlanList[i].packId = $scope.coursePlanList[i].teacherHandouts.packId
                        }
                    }
                    tableState.pagination.numberOfPages = result.data.data.page.pages;
                }
            }
            )
        },
        /**
         * 保存或发送备课笔记
         * @param state
         * 保存1，发送0
         */
        savePack: function (state) {
            var _param = angular.copy($scope.coursePlanDetail)
            for (var key in this.saveParam) {
                _param[key] = this.saveParam[key]
            }
            _param.state = state
            _param.url = $scope.cwDetail.path
            var _this = this
            TarsServer.savePack(_param).then(function (data) {
                if (data.data.status == 'SUCCESS') {
                    $scope.selectModal.hide()
                    _this.findCoursePlanByFilter(_this.coursePlanParam)
                    $mtModal.moreModal({
                        scope: $scope,
                        status: 1,
                        text: _param.state ? '保存成功' : '发送成功'
                    })
                }
            })
        },
        //保存或发送参数对象
        saveParam: { type: 3 },
        /**
         * 替换或应用要操作的
         */
        apply: function () {
            $scope.coursePlanDetail.teacherHandouts = $scope.coursePlanDetail.teacherHandouts || {}
            $scope.coursePlanDetail.teacherHandouts.filename = $scope.cwDetail.path
            $scope.showFileName = $scope.cwDetail.name
            _reppalyName()
            this.saveParam.packId = $scope.coursePlanDetail.teacherHandouts.packId
        },
        /**
         * 准备查询上课对象排课记录
         * @param option
         */
        preCoursePlanByFilter: function () {
            for (var i = 0, len = $scope.stuList.length; i < len; i++) {
                if ($scope.stuList[i].objId === this.coursePlanParam.objId) {
                    var _obj = angular.copy($scope.stuList[i])
                    for (var key in _obj) {
                        this.coursePlanParam[key] = _obj[key]
                    }
                    break
                }
            }

            this.findCoursePlanByFilter($scope.CoursePlanByFilterTableState)
        },
        /*
        纠错
        */
        correction: function (el, type) {

            if (!type && type != 0) {
                var correctionPath = $location.absUrl().split("#")[1];
                if (correctionPath == '/tars/pre/notes') {
                    type = 2;
                } else if (correctionPath == '/tars/paper/lib') {
                    type = 1;
                }
            }
            $scope.correction = el;
            $scope.correctionTitle = '纠错';
            this.errorInfo.type = type;
            this.errorInfo.refrenceId = el.id;
            this.errorInfo.refrenceName = el.name;
            //type : 2 备课笔记   1试卷
            TarsServer.getErrorType(type).then(function (response) {
                if (response.data.status == "SUCCESS") {
                    $scope.errorType = response.data.data;
                    console.log($scope.errorType)
                }
            })
            $scope.correctionModal = this.modal('partials/tars/pre.notes/modal/correction.html');
        },
        submitErrorInfo: function () {
            this.errorInfo.errorDesc = UE.getEditor('errorInfoEditor').getAllHtml();
            if (!this.errorInfo.erroryType && this.errorInfo.erroryType != 0) {
                SweetAlert.swal('请选择纠错类型');
                return;
            }
            if (UE.getEditor('errorInfoEditor').getContentTxt().length < 10) {
                SweetAlert.swal('错误描述至少10个字符');
                return;
            }
            TarsServer.submitErrorInfo(this.errorInfo).then(function (response) {
                if (response.data.status == 'SUCCESS') {
                    SweetAlert.swal("您的纠错信息已提交，管理员会及时确认信息并修正资料！");
                    $scope.correctionModal.hide();
                }
            })
        },
        errorInfo: {
            refrenceId: '',
            refrenceName: '',
            type: '',
            erroryType: '3',
            errorDesc: '',
            errorUserId: $rootScope.currentUser.id,
            errorUserName: $rootScope.currentUser.name,
            schoolId: $rootScope.currentUser.school_id,
            schoolName: $rootScope.currentUser.department.name
        }
    }
    /**
     * 获取完整地址
     * @param path
     * 文件名
     * @returns {string}
     * 返回完整地址
     * @private
     */
    $scope.getUrl = function (path) {
        return 'http://7xp08b.com1.z0.glb.clouddn.com/' + path
        // return 'http://developer.qiniu.com/docs/v6/api/reference/fop/third-party/yifangyun_preview.html/' + path

    }
    function _reppalyName() {
        $scope.showFileName = ($scope.showFileName.indexOf('.pdf') > -1 || $scope.showFileName.indexOf('.doc') > -1) ? $scope.showFileName : ($scope.showFileName + '.' + $scope.cwDetail.path.split('.')[1])
    }
    /**
     * 修改下载名字
     * @param str1
     * @param str2
     * @returns {string|*}
     */
    $scope.reName = function (str1, str2) {
        var suffix = str2.split('.')[1]
        str1 = (str1.split('.').length === 1) ? (str1.split('.')[0] + '.' + suffix) : str1
        var sp = str1.split('.'),
            s1Len = sp.length,
            newName = ''
        if (s1Len === 1 || (s1Len >= 2 && sp[s1Len - 1].indexOf('doc') == -1 && sp[s1Len - 1].indexOf('pdf') == -1)) {
            for (var i = 0; i < s1Len; i++) {
                newName += sp[i]
                if (i === s1Len - 1) {
                    newName += '.' + suffix
                }
            }
        } else {
            newName = str1
        }
        return newName
    }
    $scope.downloadReName = function (realName, path, id, tableType) {
        var params = {
            type: 2,
            paperId: id,
            tableType: tableType
        }
        TarsServer.setDownloadTimes(params).then(function (response) {
            window.location.href = $scope.getUrl(path) + '?download/' + $scope.reName(realName, path);
        })
    }
    $scope.Pdf = {
        setUrl: function (el, tableType) {
            var params = {
                type: 1,
                paperId: el.id,
                tableType: tableType
            }
            TarsServer.setViewTimes(params).then(function (response) {
                console.log(response)
            })
            $scope.cwDetail = el;

            var path = '';
            if(el.isConvertToPdf){
                //已经转过pdf
                path = el.path.substring(0, el.path.lastIndexOf(".")) + ".pdf";
            }
            else if(el.path.endsWith(".pdf")){
                //没转过，并且本身就是pdf文件
                path = el.path;
            }
            else{
                //没转过，本身不是pdf文件
                path = el.path + '?yifangyun_preview/v2';
            }

            var pdfUrl = $scope.getUrl(path);

            /**
             * 处理pdf文件直接预览，不需要转
             * @type {string}
             */
            // console.log(pdfUrl)
            // pdfUrl = pdfUrl.indexOf('.pdf') > -1 ? pdfUrl : (pdfUrl + '?yifangyun_preview/v2');
            // pdfUrl = pdfUrl.indexOf('.pdf') > -1 ? pdfUrl : (pdfUrl.slice(0, pdfUrl.lastIndexOf(".")) + ".pdf");
            $scope.pdfUrl = $sce.trustAsResourceUrl(pdfUrl);
        },
        clearUrl: function () {
            $scope.pdfUrl = '';
            if ($scope.nowMap == '备课笔记库') {
                $scope.$mtTarget.pageFindCwAll();
            } else if ($scope.nowMap == '试题库') {
                $scope.$paperLib.getPageFindPapersAll();
            }
        }
    }
    /**
     * 初始化需要加载的模板，包含试题库或者备课笔记库
     * @private
     */
    var _setUrl = function () {
        // console.log($location.url())
        var type = $location.url().indexOf('que')
        $scope.url = type > -1 ? ('partials/tars/que.lib/index.html?v=' + _version) : ('partials/tars/pre.notes/apl.html?v=' + _version)
        $scope.nowMap = type > -1 ? '试题库' : '备课笔记库'
        $scope._type = $location.url().indexOf('pre/notes') > -1 ? 1 : 0
    }
    $scope.getSceHtml = function (str) {
        if (str && str.indexOf('</table>') == -1) {
            return $sce.trustAsHtml(str.replace(/<td( width="[0-9]{1,3}%")+>/g, ''))
            // var h = /((\w+)\s*(([\w]*)=('|&quot;|")?([a-zA-Z0-9|:|\/|=|-|.|\?|&amp;]*)(\5)?)*\])([a-zA-Z0-9|:|\/|=|-|.|\?|&amp;|\s]+)(\[\/\2\])/
        }
        return $sce.trustAsHtml(str)
    }
    /**
     * 统一查询
     * @param arg
     * @private
     */
    function _ngoSeach(arg) {
        if (_timer) {
            clearTimeout(_timer)
        }
        _timer = setTimeout(function () {
            if (arg === 'note') {
                $scope.$mtTarget.pageFindCwAll()
            }
            else {
                $scope.$queLib.pageFindQustAll()
            }
        }, 300)
    }

    /**
     * 监控输入框改变，查询那个试卷库
     */
    $scope.$watch('$paperLib.paperTableState.query', function (newVal, oldVal) {
        if (_timer) {
            clearTimeout(_timer)
        }
        _timer = setTimeout(function () {
            $scope.$paperLib.paperTableState.page = 1
            // $scope.$paperLib.pageFindPaperAll()
            getPaperList('paper')
        }, 300)
    })
    /**
     * 监控备课笔记中点击应用的第一个弹框单选数据改变
     */
    $scope.$watch('_modal.stuParam.objType', function (newVal, oldVal) {
        if (_timer) {
            clearTimeout(_timer)
        }
        _timer = setTimeout(function () {
            if ($scope.coursePlanList) {
                $scope.coursePlanList.length = 0
                $scope.coursePlanList = null
            }
            $scope._modal.findStudentList()
        }, 300)
    })

        // console.log($scope.stk)
        ;
    (function () {
        _setUrl()
        $rootScope.tars = 1
        $scope.$mtTarget.findAllSubject()
        if ($scope.nowMap == '试题库') {
            $scope.$mtTarget.getModuleTopic();
        }
        //  备课笔记监控
        if ($scope._type === 1) {
            /**
             * 监控学科id的变化
             * 需要把当前页码重置为1
             */
            if ($scope.nowMap == '试题库') {
                $scope.$watch('$mtTarget.cwTableState.subject', function (newVal, oldVal) {
                    if (newVal != oldVal && (newVal || newVal == 0) && newVal != '') {
                        $scope.$mtTarget.cwTableState.grade = '';
                        $scope.$mtTarget.cwTableState.page = 1;
                        $scope.$mtTarget.cwTableState.topicId = '';
                        $scope.$mtTarget.findGradeBySubject(TarsServer.findSubjectById(newVal));
                        $scope.$mtTarget.getModuleTopic();
                    }

                })
            }

            // liuhr
            $scope.$watch('$mtTarget.cwTableState.subjectId', function (newVal, oldVal) {
                if (newVal != oldVal && (newVal || newVal == 0) && newVal != '') {
                    $scope.$mtTarget.cwTableState.page = 1;
                    $scope.$mtTarget.cwTableState.versionId = '';
                    $scope.$mtTarget.cwTableState.directoryId = '';
                    $scope.$mtTarget.cwTableState.topicId = '';
                    $scope.$mtTarget.findGradeBySubject(TarsServer.findSubjectById(newVal));
                    // $scope.$mtTarget.getModuleTopic();
                    $scope.$mtTarget.getVersions();
                }
            })

            $scope.$watch('$mtTarget.cwTableState.versionId', function (newVal, oldVal) {

                if (newVal != oldVal && (newVal || newVal == 0) && newVal != '') {
                    $scope.$mtTarget.cwTableState.page = 1;
                    $scope.$mtTarget.cwTableState.directoryId = '';
                    $scope.$mtTarget.cwTableState.topicId = '';
                    // $scope.$mtTarget.findGradeBySubject(TarsServer.findSubjectById(newVal));
                    // $scope.$mtTarget.getModuleTopic();
                    $scope.$mtTarget.getGradeList();
                }
            })
            /**
             * 监听年级变化,监听笔记名称
             * 需要把当前页码重置为1
             */
            $scope.$watch('$mtTarget.cwTableState.directoryId', function (newVal, oldVal) {
                if (newVal != oldVal && (newVal || newVal == 0) && newVal != '') {
                    $scope.$mtTarget.cwTableState.page = 1;
                    $scope.$mtTarget.cwTableState.topicId = '';
                    $scope.$mtTarget.getDirectory()
                }
            })
            $scope.$watch('TopicId', function (newVal, oldVal) {
                $scope.$mtTarget.cwTableState.topicId = newVal
                $scope.$mtTarget.cwTableState.page = 1
            })
            $scope.$watch('$mtTarget.cwTableState.query', function (newVal, oldVal) {
                if (newVal || !newVal && oldVal) {
                    $scope.$mtTarget.cwTableState.page = 1
                    _ngoSeach('note')
                }
            })
            $scope.$watch('$mtTarget.cwTableState.stageId', function (newVal, oldVal) {
                if (newVal || !newVal && oldVal) {
                    $scope.$mtTarget.cwTableState.page = 1;
                    $scope.$mtTarget.cwTableState.subjectId = '';
                    $scope.$mtTarget.cwTableState.versionId = '';
                    $scope.$mtTarget.cwTableState.directoryId = '';
                    $scope.$mtTarget.cwTableState.topicId = '';
                    $scope.$mtTarget.getFindSubjectByStage();
                    _ngoSeach('note')
                }
            })


            /**
             * 监听条件变化，防止多次请求查询
             */
            $scope.$watch('$mtTarget.cwTableState', function () {
                _ngoSeach('note')
            }, true)
        }
        //  试题库监控
        if ($scope._type === 0 && $location.url().indexOf('que/lib') > -1) {
            $scope.selectedCart = {}
            /**
             * 监控学科id的变化
             * 需要把当前页码重置为1
             */
            $scope.$watch('$mtTarget.cwTableState.subject', function (newVal, oldVal) {
                $scope.$queLib.queTableState.grade = ''
                $scope.$queLib.queTableState.subject = newVal
                $scope.$queLib.queTableState.question_type = null
                $scope.$queLib.queTableState.page = 1
                if (!$scope.$queLib.queTableState.diffculty) {
                    $scope.$queLib.queTableState.diffculty = null
                }
                $scope.TopicId = ''
                //  获取题型
                $scope.$queLib.findQueTypeBySubject(TarsServer.findSubjectById(newVal))
                $scope.$mtTarget.getModuleTopic()

            })
            $scope.$watch('$queLib.queTableState.question_type', function (newVal, oldVal) {
                $scope.$queLib.queTableState.question_type = newVal
                $scope.$queLib.queTableState.page = 1
                if (!$scope.$queLib.queTableState.diffculty) {
                    $scope.$queLib.queTableState.diffculty = null
                }
                // _ngoSeach()

            })
            /**
             * 监听条件变化，防止多次请求查询
             */
            $scope.$watch('$queLib.queTableState', function () {
                if (!$scope.$queLib.queTableState.diffculty) {
                    $scope.$queLib.queTableState.diffculty = null
                }
                _ngoSeach()
            }, true)
            $scope.$watch('TopicId', function (newVal, oldVal) {
                $scope.$queLib.queTableState.topicId = newVal
                $scope.$queLib.queTableState.page = 1
                if (!$scope.$queLib.queTableState.diffculty) {
                    $scope.$queLib.queTableState.diffculty = null
                }
            })
        }
        //  我的组卷监控
        if ($location.url().indexOf('/my/que') > -1) {
            $scope.$watch('$paperLib.paperMyTableState.subject', function (newVal, oldVal) {
                $scope.$paperLib.paperMyTableState.grade = ''
                $scope.$paperLib.paperMyTableState.page = 1
                $scope.$mtTarget.findGradeBySubject(TarsServer.findSubjectById(newVal))
            })
            $scope.$watch('$paperLib.paperMyTableState.grade', function (newVal, oldVal) {
                if (newVal || !newVal && oldVal) {
                    $scope.$paperLib.paperMyTableState.page = 1
                }
            })
            $scope.$watch('$paperLib.paperMyTableState', function (newVal, oldVal) {
                if (_timer) {
                    clearTimeout(_timer)
                }
                _timer = setTimeout(function () {
                    $scope.$paperLib.pageFindMyPaperAll()
                }, 300)
            }, true)
        }

        //  试卷库
        if ($location.url().indexOf('/paper/lib') > -1) {

            // liuhr
            $scope.$watch('$paperLib.paperTableState.subjectId', function (newVal, oldVal) {
                if (newVal != oldVal && (newVal || newVal == 0)) {
                    $scope.$paperLib.paperTableState.page = 1;
                    $scope.$paperLib.paperTableState.topicId = '';
                    $scope.$paperLib.paperTableState.versionId = '';
                    $scope.$paperLib.paperTableState.directoryId = '';
                    // $scope.$paperLib.findGradeBySubject(TarsServer.findSubjectById(newVal));
                    // $scope.$paperLib.getModuleTopic();
                    $scope.paperVersionList = [];

                    $scope.$paperLib.getVersions();
                    $scope.$paperLib.getPaperTypeTree();
                }
            })

            $scope.$watch('$paperLib.paperTableState.versionId', function (newVal, oldVal) {
                if (newVal != oldVal && (newVal || newVal == 0) && newVal != '') {
                    $scope.$paperLib.paperTableState.page = 1;
                    $scope.$paperLib.paperTableState.topicId = '';
                    $scope.$paperLib.paperTableState.directoryId = '';
                    // $scope.$paperLib.findGradeBySubject(TarsServer.findSubjectById(newVal));
                    // $scope.$paperLib.getModuleTopic();
                    $scope.paperGradeList = [];
                    $scope.$paperLib.getGradeList();
                    $scope.$paperLib.getPaperTypeTree();
                }
            })



            /**
             * 监听年级变化,监听笔记名称
             * 需要把当前页码重置为1
             */
            $scope.$watch('$paperLib.paperTableState.directoryId', function (newVal, oldVal) {
                if (newVal != oldVal && (newVal || newVal == 0) && newVal != '') {
                    $scope.$paperLib.paperTableState.page = 1;
                    $scope.$paperLib.getPaperTypeTree()
                }
            })
            $scope.$watch('mPaperClassificationIdList', function (newVal, oldVal) {
                $scope.$paperLib.paperTableState.mPaperClassificationIdList = newVal
                $scope.$paperLib.paperTableState.page = 1
            })
            $scope.$watch('$paperLib.paperTableState.query', function (newVal, oldVal) {
                if (newVal || !newVal && oldVal) {
                    // console.log($paperLib.paperTableState.query)
                    $scope.$paperLib.paperTableState.page = 1
                    // _ngoSeach('note')
                }
            })
            $scope.$watch('$paperLib.paperTableState.stageId', function (newVal, oldVal) {
                if (newVal || !newVal && oldVal) {
                    $scope.$paperLib.paperTableState.subjectId = '';
                    $scope.$paperLib.paperTableState.page = 1;
                    $scope.$paperLib.paperTableState.topicId = '';
                    $scope.$paperLib.paperTableState.versionId = '';
                    $scope.$paperLib.paperTableState.directoryId = '';
                    $scope.paperVersionList = [];
                    $scope.paperGradeList = [];
                    $scope.$paperLib.getFindSubjectByStage();
                    $scope.$paperLib.getPaperTypeTree();

                    // _ngoSeach('paper')
                }
            })


            /**
             * 监听条件变化，防止多次请求查询
             */
            $scope.$watch('$paperLib.paperTableState', function () {
                getPaperList('paper')
            }, true)
        }

    })();



    /**
     * 设置浏览次数和下载次数
     */
    // $scope.serDownloadTimes = function () {
    //     var params = {
    //         type: 1,
    //         paperId: ''
    //     }
    //     TarsServer.saveDownloadTimes(params).then(function () {

    //     })
    // }


}])
