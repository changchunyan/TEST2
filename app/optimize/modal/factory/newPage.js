/**
 * Created by 李世明 on 2016/12/17 0017.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:教研系统分页
 */
'use strict';
angular.module('ywsApp').factory('NewPageServer', function () {
    /**
     * 新的分页初始化
     * @param result
     * 包含{totalPages,totalElements,currentPage}
     *      总页数，总记录数，当前页码
     * @param page
     * 用于判断当前页码是否为第一页
     * @param fun
     * 点击页码选项或者分页相关操作时的回掉函数
     * @private
     */
    var _newPaging = function (result, page, fun) {
        debugger;
        if (result.totalPages >= 2 && page == 1) {
            $(function () {
                $.fn.jpagebar({
                    renderTo: $("#mt_page"),
                    totalpage: result.totalPages,
                    totalcount: result.totalElements,
                    pagebarCssName: 'mt-page',
                    currentPage: result.currentPage,
                    onClickPage: function (pageNo) {
                        $.fn.setCurrentPage(this, pageNo);
                        fun(pageNo)
                    }
                });
            });
        }
    }
    var server = {}
    return server.newPaging = _newPaging
})