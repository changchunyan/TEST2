/**
 * Created by 李世明 on 2018/8/14.
 * QQ:1278915838
 * TEL:18518769512
 * TODO: 年级统计和渠道统计打印模板
 */
// 报表
var baobiaoTemplate = function (dataList, $scope) {
    return (
        '<tbody>' +
        (function () {
            var html = ''
            for (var i = 0, len = dataList.length; i < len; i++) {
                var model = dataList[i]
                html += '<tr>' +
                    '            <td>' +
                    ($scope.isBranch() ? (
                        '<span>' + model.schoolNature + '</span>'
                    ) : (
                        '<span>' + model.parent_name + '</span>'))

                    +
                    '            </td>' +
                    '            <td>' +
                    ($scope.isBranch() ? (
                        '<span>' + model.cityName + '</span>'
                    ) : (
                        '<span>' + model.school_name + '</span>')) +
                    '            </td>' +
                    '' +
                    (
                        function () {
                            var html = ''
                            var newTitles = $scope.newTitles[$scope.searchModel.channelParentId || $scope.searchModel.depType]
                            for (var i = 0, len = newTitles.length; i < len; i++) {
                                var item = newTitles[i]
                                model[item] = model[item] || {}
                                html += '       <td colspan="5" style="padding:0;border-right: 0;width: 20%;"><table class="table table-bordered table-striped " style="height: 40px;"><tbody><tr>' +
                                    (item != '合计' ? (
                                        '<td style="width: 20%;">' + (model[item][1] || 0) + '</td>' +
                                        '<td style="width: 20%;">' + (model[item][2] || 0) + '</td>' +
                                        '<td style="width: 20%;">' + (model[item][3] || 0) + '</td>' +
                                        '<td style="width: 20%;">' + (model[item][4] || 0) + '</td>' +
                                        '<td style="width: 20%;">' + (model[item][5] || 0) + '</td>'
                                    ) : (
                                        '<td style="width: 20%;">' + $scope.totalSmallByName(1, model) + '</td>' +
                                        '<td style="width: 20%;">' + $scope.totalSmallByName(2, model) + '</td>' +
                                        '<td style="width: 20%;">' + $scope.totalSmallByName(3, model) + '</td>' +
                                        '<td style="width: 20%;">' + $scope.totalSmallByName(4, model) + '</td>' +
                                        '<td style="width: 20%;">' + $scope.totalSmallByName(5, model) + '</td>'
                                    ))
                                    +
                                    '</tr></tbody></table></td>'
                            }
                            return html
                        }
                    )()

                    +
                    '        </tr>'
            }
            return html
        })() +
        '</tbody>' +
        '<tfoot>' +
        (dataList && dataList.length ? (
            '<tr>' +
            '            <td colspan="2" style="height: 40px;">总计</td>'
            +

            (
                function () {
                    var html = ''
                    var newTitles = $scope.newTitles[$scope.searchModel.channelParentId || $scope.searchModel.depType]
                    for (var i = 0, len = newTitles.length; i < len; i++) {
                        var item = newTitles[i]
                        html += '       <td colspan="5" style="padding:0;border-right: 0;width: 20%;"><table class="table table-bordered table-striped " style="height: 40px;"><tbody><tr>' +
                            (item != '合计' ? (
                                '<td style="width: 20%;">' + ($scope.totalAllByName(1, dataList, item)) + '</td>' +
                                '<td style="width: 20%;">' + ($scope.totalAllByName(2, dataList, item)) + '</td>' +
                                '<td style="width: 20%;">' + ($scope.totalAllByName(3, dataList, item)) + '</td>' +
                                '<td style="width: 20%;">' + ($scope.totalAllByName(4, dataList, item)) + '</td>' +
                                '<td style="width: 20%;">' + ($scope.totalAllByName(5, dataList, item)) + '</td>'
                            ) : (
                                '<td style="width: 20%;">' + $scope.totalAllByName(1, dataList) + '</td>' +
                                '<td style="width: 20%;">' + $scope.totalAllByName(2, dataList) + '</td>' +
                                '<td style="width: 20%;">' + $scope.totalAllByName(3, dataList) + '</td>' +
                                '<td style="width: 20%;">' + $scope.totalAllByName(4, dataList) + '</td>' +
                                '<td style="width: 20%;">' + $scope.totalAllByName(5, dataList) + '</td>'
                            ))
                            +
                            '</tr></tbody></table></td>'
                    }
                    return html
                }
            )()
            +
            '        </tr>'
        ) : ('暂无数据'))
        +
        '</tfoot>')
}
// depType
var detailTemplate = function (dataList, $scope) {
    return (
        '<tbody>' +
        (function () {
            var html = ''
            for (var i = 0, len = dataList.length; i < len; i++) {
                var model = dataList[i]
                html += '<tr>' +
                    '            <td>' + model.schoolNature + '</td>' +
                    '            <td>' + model.branch_name + '</td>' +
                    '            <td>' + model.parent_name + '</td>' +
                    '            <td>' + model.school_name + '</td>' +
                    '' +
                    (
                        function () {
                            var html = ''
                            var newTitles = $scope.newTitles[$scope.searchModel.channelParentId || $scope.searchModel.depType]
                            for (var i = 0, len = newTitles.length; i < len; i++) {
                                var item = newTitles[i]
                                model[item] = model[item] || {}
                                html += '       <td colspan="5" style="padding:0;border-right: 0;width: 20%;"><table class="table table-bordered table-striped " style="height: 40px;"><tbody><tr>' +
                                    (item != '合计' ? (
                                        '<td style="width: 20%;">' + (model[item][1] || 0) + '</td>' +
                                        '<td style="width: 20%;">' + (model[item][2] || 0) + '</td>' +
                                        '<td style="width: 20%;">' + (model[item][3] || 0) + '</td>' +
                                        '<td style="width: 20%;">' + (model[item][4] || 0) + '</td>' +
                                        '<td style="width: 20%;">' + (model[item][5] || 0) + '</td>'
                                    ) : (
                                        '<td style="width: 20%;">' + $scope.totalSmallByName(1, model) + '</td>' +
                                        '<td style="width: 20%;">' + $scope.totalSmallByName(2, model) + '</td>' +
                                        '<td style="width: 20%;">' + $scope.totalSmallByName(3, model) + '</td>' +
                                        '<td style="width: 20%;">' + $scope.totalSmallByName(4, model) + '</td>' +
                                        '<td style="width: 20%;">' + $scope.totalSmallByName(5, model) + '</td>'
                                    ))
                                    +
                                    '</tr></tbody></table></td>'
                            }
                            return html
                        }
                    )()

                    +
                    '        </tr>'
            }
            return html
        })()
        + '</tbody>'
        + '<tfoot>' +
        (dataList && dataList.length ? (
            '<tr>' +
            '            <td colspan="4" style="height: 40px;">总计</td>'
            +

            (
                function () {
                    var html = ''
                    var newTitles = $scope.newTitles[$scope.searchModel.channelParentId || $scope.searchModel.depType]
                    for (var i = 0, len = newTitles.length; i < len; i++) {
                        var item = newTitles[i]
                        html += '       <td colspan="5" style="padding:0;border-right: 0;width: 20%;"><table class="table table-bordered table-striped " style="height: 40px;"><tbody><tr>' +
                            (item != '合计' ? (
                                '<td style="width: 20%;">' + ($scope.totalAllByName(1, dataList, item)) + '</td>' +
                                '<td style="width: 20%;">' + ($scope.totalAllByName(2, dataList, item)) + '</td>' +
                                '<td style="width: 20%;">' + ($scope.totalAllByName(3, dataList, item)) + '</td>' +
                                '<td style="width: 20%;">' + ($scope.totalAllByName(4, dataList, item)) + '</td>' +
                                '<td style="width: 20%;">' + ($scope.totalAllByName(5, dataList, item)) + '</td>'
                            ) : (
                                '<td style="width: 20%;">' + $scope.totalAllByName(1, dataList) + '</td>' +
                                '<td style="width: 20%;">' + $scope.totalAllByName(2, dataList) + '</td>' +
                                '<td style="width: 20%;">' + $scope.totalAllByName(3, dataList) + '</td>' +
                                '<td style="width: 20%;">' + $scope.totalAllByName(4, dataList) + '</td>' +
                                '<td style="width: 20%;">' + $scope.totalAllByName(5, dataList) + '</td>'
                            ))
                            +
                            '</tr></tbody></table></td>'
                    }
                    return html
                }
            )()
            +
            '        </tr>'
        ) : ('暂无数据'))
        +
        '</tfoot>')
}

// 渠道统计模板
var marketTemplate = function ($scope, id, data) {
    var dataList = data || JSON.parse(window.sessionStorage.getItem('__exp__'))
    var html = '<div><table class="table table-bordered table-striped mini-w100"><thead>' + $('#' + id).find('thead').html() + ' </thead>'
    if (id == 'exportableDetail') {
        html += detailTemplate(dataList, $scope)
    } else {
        // 报表
        html += baobiaoTemplate(dataList, $scope)
    }
    return $(html + '</table></div>')
}
