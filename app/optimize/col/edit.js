/**
 * Created by 李世明 on 2016/12/2 0002.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:
 */
angular.module('ywsApp').factory('ColEdit', [function () {
    var test = function (_top) {
        this.$scope.$editColCss = {
            'top': _top
        }
    }
    var _localName = ''
    var _this = {
        $scope: '',
        /**
         * 判断是否有数据
         * @param $scope
         * 当前引用的作用域
         * @param localName
         * 本地存储的键名
         */
        isHasData:function ($scope,localName) {
            $scope.$editColCss = ''
            $scope.colListLength = $scope.$editColList.length
            //  当前状态是否全选
            $scope.isAll = false
            if (localStorage[localName]=='undefined'||!localStorage[localName]||JSON.parse(localStorage[localName]).length!=$scope.colListLength) {
                this.localSave($scope.$editColList)
            }
            this.$scope = $scope
            _localName = localName
        },

        /**
         * 打开或关闭编辑列
         * @param arg
         */
        showCol: function (arg) {
            if (arg) {
                this.reastPosition()
                window.reastPosition = this.reastPosition
            }
            this.$scope._showCol = arg
            console.log(this.$scope._showCol)
        },
        reastPosition: function () {
            //  获取列表的位置
            var $mtList = angular.element('.mt-list').eq(0),
                //  获取选中框
                $editCol = angular.element('.edit-col').eq(0),
                // _top = $mtList.offset().top - 20 + 'px'
                _top = $mtList.offset().top - 20 + 'px'
            window._top_ = _top
            //  重置选择框位置
            test.apply(_this, [_top])
        },
        initCol: function ($scope) {
            $scope = $scope||this.$scope
            $scope.lEditColList = JSON.parse(localStorage[_localName])
            var selectMax = 0
            for (var li = 0; li < $scope.colListLength; li++) {
                var id = $scope.lEditColList[li].id,
                    isShow = $scope.lEditColList[li].select
                if (isShow) {
                    selectMax = selectMax + 1
                }
                if (li === $scope.colListLength - 1) {
                    $scope.isAll = selectMax === $scope.colListLength ? true : false
                }
                this.editCol(id, isShow)
                /*(function (index, isShow) {
                    this.editCol(index, isShow)
                    editCol.apply(_this,index, isShow)
                })(id, isShow)*/
            }
            //待优化：reastPosition函数中的this指向的时window，加大了内存的消耗
            // window.$scope = $scope
            //    已解决
        },
        editCol: function (index, isShow) {
            var $isShowCol = angular.element('.isShowCol').eq(0),
                $tr = $isShowCol.find('tbody tr'),
                max = _localName==='_editColList'?($tr.length- 1):$tr.length//$tr.length//- 1
            if (isShow) {
                $isShowCol.find('tr th').eq(index).removeClass('hide')
                hideOrShow()
            } else {
                $isShowCol.find('tr th').eq(index).addClass('hide')
                hideOrShow()
            }
            function hideOrShow() {
                for (var i = 0; i < max; i++) {
                    if (isShow && $tr[i].cells[index]) {
                        $tr[i].cells[index].hidden = false
                    } else if ($tr[i].cells[index]) {
                        $tr[i].cells[index].hidden = true
                    }
                }
            }
        },
        reastCol: function () {
            this.$scope.lEditColList = this.$scope.$editColList
            this.localSave(this.$scope.lEditColList)
            this.initCol()
        },
        /**
         * 保存到本地
         * @param datas
         */
        localSave: function (datas) {
            localStorage.setItem(_localName, JSON.stringify(datas))
        },
        /**
         * 选择显示
         * @param index
         * 对应的下标
         */
        selectCol: function (index) {
            var selectMax = 0
            this.$scope.lEditColList[index].select = this.$scope.lEditColList[index].select ? 0 : 1
            this.editCol(this.$scope.lEditColList[index].id, this.$scope.lEditColList[index].select)
            for (var li = 0; li < this.$scope.colListLength; li++) {
                var isShow = this.$scope.lEditColList[li].select
                if (isShow) {
                    selectMax = selectMax + 1
                }
                if (li === this.$scope.colListLength - 1) {
                    this.$scope.isAll = selectMax === this.$scope.colListLength ? true : false
                    this.localSave(this.$scope.lEditColList)
                }
            }
        },
        /**
         * 全选
         */
        selectColAll: function () {
            for (var i = 0; i < this.$scope.colListLength; i++) {
                if (this.$scope.isAll) {
                    this.$scope.lEditColList[i].select = 0
                    this.editCol(this.$scope.lEditColList[i].id, 0)
                    if (i === this.$scope.colListLength - 1) {
                        this.$scope.isAll = false
                        this.localSave(this.$scope.lEditColList)
                    }
                } else {
                    this.$scope.lEditColList[i].select = 1
                    this.editCol(this.$scope.lEditColList[i].id, 1)
                    if (i === this.$scope.colListLength - 1) {
                        this.$scope.isAll = true
                        this.localSave(this.$scope.lEditColList)
                    }
                }
            }
        }
    }
    return _this
}])
