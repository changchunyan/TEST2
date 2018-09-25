/**
 * Created by 李世明 on 2018/5/24.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:
 */
angular.module('ywsApp').factory(
    'EmployeePayrollService', ['utilService',
        function (utilService) {
            return {
                // 获取工资表列表
                findPayrollItems: function (start, number) {
                    return utilService.getHttp2(hr_server + '/salary?start=' + start + '&number=' + number)
                },
                // 获取工资表列表
                download: function (params) {
                    return utilService.download(hr_server + '/salary/template/' + params)
                },
                // 获取工资表列表
                downloadTem: function () {
                    return utilService.get(hr_server + '/salary/employees')
                },
                // 获取工资条列表
                findPayrollItemDetailList: function (id) {
                    return utilService.get(hr_server + '/salary/' + id)
                },
                // 获取我的工资条列表
                findMePayrollList: function () {
                    return utilService.get(hr_server + 'salary/employee')
                },
                // 获取我的校区
                findMeSchoolName: function (schoolId) {
                    return utilService.get(hr_server + '/departments/queryById?organizationId=1&departmentId=' + schoolId)
                },
                // 保存编辑后员工的工资单，然后刷新列表
                savePayrollByRow: function (obj) {
                    return utilService.putHttp(hr_server + '/salary/row', obj)
                },
                // 发送工资条
                sendPayrollById: function (id) {
                    return utilService.putHttp(hr_server + '/salary/batchIssue/' + id)
                },
                // 确认导入数据
                uploadExcelDoc: function (id, data) {
                    return utilService.postHttp(hr_server + '/salary/' + id, data)
                },
                // 确认导入数据
                savePayrollMouth: function (id) {
                    return utilService.get(hr_server + '/salary/new/' + id)
                }
            }
        }
    ])