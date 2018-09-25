/**
 * Created by 李世明 on 2016/12/15 0015.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:教研系统服务
 */
'use strict';
angular.module('ywsApp').factory('TarsServer', ['utilService', function (utilService) {
    /**
     * 教研系统api
     * @type {{rootUrl: string, setApi: setApi, cwAll: string, cwPreview: string, paperAll: string, qustAll: string, knowledge: string}}
     * @private
     */
    var _api = {
        rootUrl: 'http://research.youwinedu.com:8080/api',
        // rootUrl: 'http://172.168.101.86/api',
        // rootUrl: 'http://localhost:8081/api',

        yesUrl: oms_server,
        setApi: function (arg, yws) {
            if (yws) {
                return this.yesUrl + this[arg]
            }
            return this.rootUrl + this[arg]
        },
        //备课笔记列表
        cwAll: '/cw/all',
        //备课笔记预览/试卷预览
        cwPreview: '/cw/preview/',
        //试卷列表
        paperAll: '/paper/all',
        //试卷预览
        paperView: '/paper/',
        //题目列表
        qustAll: '/qust/all',
        //知识点列表
        knowledge: '/knowledge/topic/',
        //创建组卷
        paperCreat: '/paper/combo',
        subjectsByStage: '/findSubjectByStage/',
        courseObjByFilter: 'tr/getCourseObjByFilter',
        coursePlanByFilter: 'tr/getCoursePlanByFilter',
        imgToBase64: 'tr/convertImageToBase64',
        savePack: 'tr/savePack',
        //设置下载数量
        setDownloadTimes: '/updateTimes',
        //设置浏览数量
        setViewTimes: '/updateTimes',
        getStudyStage: "/findStages",
        findSubjectByStage: "/findSubjectByStage",
        versions: "/versions",
        gradelist: "/grade/list",
        directory: '/directory/',
        getPaperTypeTree: '/paper/getPaperTypeTree/',
        papersall: '/papers/all',
        cwErrTypeInterface: '/dict/CwErrorType',
        paperErrTypeInterface: '/dict/PaperErrorType',
        error: '/error'
    }, _subject = [
        { id: 19, stage: 3, name: '小学语文' },
        { id: 20, stage: 3, name: '小学数学' },
        { id: 21, stage: 3, name: '小学英语' },
        { id: 1, stage: 1, name: '初中语文' },
        { id: 3, stage: 1, name: '初中数学' },
        { id: 5, stage: 1, name: '初中英语' },
        { id: 7, stage: 1, name: '初中物理' },
        { id: 9, stage: 1, name: '初中化学' },
        { id: 11, stage: 1, name: '初中生物' },
        { id: 17, stage: 1, name: '初中政治' },
        { id: 13, stage: 1, name: '初中历史' },
        { id: 15, stage: 1, name: '初中地理' },
        { id: 2, stage: 2, name: '高中语文' },
        { id: 4, stage: 2, name: '高中数学' },
        { id: 6, stage: 2, name: '高中英语' },
        { id: 8, stage: 2, name: '高中物理' },
        { id: 10, stage: 2, name: '高中化学' },
        { id: 12, stage: 2, name: '高中生物' },
        { id: 18, stage: 2, name: '高中政治' },
        { id: 14, stage: 2, name: '高中历史' },
        { id: 16, stage: 2, name: '高中地理' }
    ], _grade = [
        { id: 1, name: "一年级", stage: 3 },
        { id: 2, name: "二年级", stage: 3 },
        { id: 3, name: "三年级", stage: 3 },
        { id: 4, name: "四年级", stage: 3 },
        { id: 5, name: "五年级", stage: 3 },
        { id: 6, name: "六年级", stage: 3 },
        { id: 7, name: "七年级", stage: 1 },
        { id: 8, name: "八年级", stage: 1 },
        { id: 9, name: "九年级", stage: 1 },
        { id: 10, name: "高一", stage: 2 },
        { id: 11, name: "高二", stage: 2 },
        { id: 12, name: "高三", stage: 2 }
    ], _questions = [{
        "id": "现代文阅读",
        "name": "现代文阅读",
        "_id": 19,
        "stage": 3
    }, { "id": "文言文阅读", "name": "文言文阅读", "_id": 19, "stage": 3 }, {
        "id": "写作",
        "name": "写作",
        "_id": 19,
        "stage": 3
    }, { "id": "选择", "name": "选择", "_id": 19, "stage": 3 }, { "id": "填空", "name": "填空", "_id": 19, "stage": 3 }, {
        "id": "选择填空",
        "name": "选择填空",
        "_id": 19,
        "stage": 3
    }, { "id": "简答", "name": "简答", "_id": 19, "stage": 3 }, { "id": "材料", "name": "材料", "_id": 19, "stage": 3 }, {
        "id": "连线",
        "name": "连线",
        "_id": 19,
        "stage": 3
    }, { "id": "判断", "name": "判断", "_id": 19, "stage": 3 }, { "id": "简答", "name": "简答", "_id": 19, "stage": 3 }, { "id": "选择", "name": "选择", "_id": 20, "stage": 3 }, { "id": "填空", "name": "填空", "_id": 20, "stage": 3 }, {
        "id": "解答",
        "name": "解答",
        "_id": 20,
        "stage": 3
    }, { "id": "判断", "name": "判断", "_id": 20, "stage": 3 }, { "id": "简答", "name": "简答", "_id": 20, "stage": 3 }, { "id": "单项选择", "name": "单项选择", "_id": 21, "stage": 3 }, {
        "id": "填空",
        "name": "填空",
        "_id": 21,
        "stage": 3
    }, { "id": "词汇（运用）", "name": "词汇（运用）", "_id": 21, "stage": 3 }, {
        "id": "句型转换",
        "name": "句型转换",
        "_id": 21,
        "stage": 3
    }, { "id": "信息匹配", "name": "信息匹配", "_id": 21, "stage": 3 }, {
        "id": "填空型完形填空",
        "name": "填空型完形填空",
        "_id": 21,
        "stage": 3
    }, { "id": "填空型阅读理解", "name": "填空型阅读理解", "_id": 21, "stage": 3 }, {
        "id": "改错",
        "name": "改错",
        "_id": 21,
        "stage": 3
    }, { "id": "翻译", "name": "翻译", "_id": 21, "stage": 3 }, { "id": "字母", "name": "字母", "_id": 21, "stage": 3 }, {
        "id": "排序",
        "name": "排序",
        "_id": 21,
        "stage": 3
    }, { "id": "音标（语音）", "name": "音标（语音）", "_id": 21, "stage": 3 }, {
        "id": "连词成句",
        "name": "连词成句",
        "_id": 21,
        "stage": 3
    }, { "id": "判断", "name": "判断", "_id": 21, "stage": 3 }, {
        "id": "短对话选择型听力",
        "name": "短对话选择型听力",
        "_id": 21,
        "stage": 3
    }, { "id": "长对话选择型听力", "name": "长对话选择型听力", "_id": 21, "stage": 3 }, {
        "id": "填空型听力",
        "name": "填空型听力",
        "_id": 21,
        "stage": 3
    }, { "id": "简答", "name": "简答", "_id": 21, "stage": 3 }, {
        "id": "现代文阅读",
        "name": "现代文阅读",
        "_id": 1,
        "stage": 1
    }, { "id": "文言文阅读", "name": "文言文阅读", "_id": 1, "stage": 1 }, {
        "id": "写作",
        "name": "写作",
        "_id": 1,
        "stage": 1
    }, { "id": "选择", "name": "选择", "_id": 1, "stage": 1 }, { "id": "填空", "name": "填空", "_id": 1, "stage": 1 }, {
        "id": "选择填空",
        "name": "选择填空",
        "_id": 1,
        "stage": 1
    }, { "id": "简答", "name": "简答", "_id": 1, "stage": 1 }, { "id": "材料", "name": "材料", "_id": 1, "stage": 1 }, {
        "id": "连线",
        "name": "连线",
        "_id": 1,
        "stage": 1
    }, { "id": "判断", "name": "判断", "_id": 1, "stage": 1 }, { "id": "简答", "name": "简答", "_id": 1, "stage": 1 }, { "id": "选择", "name": "选择", "_id": 3, "stage": 1 }, { "id": "填空", "name": "填空", "_id": 3, "stage": 1 }, {
        "id": "判断",
        "name": "判断",
        "_id": 3,
        "stage": 1
    }, { "id": "解答", "name": "解答", "_id": 3, "stage": 1 }, { "id": "简答", "name": "简答", "_id": 3, "stage": 1 }, { "id": "短对话选择型听力", "name": "短对话选择型听力", "_id": 5, "stage": 1 }, {
        "id": "长对话选择型听力",
        "name": "长对话选择型听力",
        "_id": 5,
        "stage": 1
    }, { "id": "选择型完形填空", "name": "选择型完形填空", "_id": 5, "stage": 1 }, {
        "id": "选择型阅读理解",
        "name": "选择型阅读理解",
        "_id": 5,
        "stage": 1
    }, { "id": "词汇运用", "name": "词汇运用", "_id": 5, "stage": 1 }, {
        "id": "填空",
        "name": "填空",
        "_id": 5,
        "stage": 1
    }, { "id": "句型转换", "name": "句型转换", "_id": 5, "stage": 1 }, {
        "id": "填空型听力",
        "name": "填空型听力",
        "_id": 5,
        "stage": 1
    }, { "id": "单项选择", "name": "单项选择", "_id": 5, "stage": 1 }, {
        "id": "填空型完形填空",
        "name": "填空型完形填空",
        "_id": 5,
        "stage": 1
    }, { "id": "信息匹配", "name": "信息匹配", "_id": 5, "stage": 1 }, {
        "id": "填空型阅读理解",
        "name": "填空型阅读理解",
        "_id": 5,
        "stage": 1
    }, { "id": "改错", "name": "改错", "_id": 5, "stage": 1 }, { "id": "翻译", "name": "翻译", "_id": 5, "stage": 1 }, {
        "id": "书面表达",
        "name": "书面表达",
        "_id": 5,
        "stage": 1
    }, { "id": "简答", "name": "简答", "_id": 5, "stage": 1 }, {
        "id": "选择",
        "name": "选择",
        "_id": 7,
        "stage": 1
    }, { "id": "填空", "name": "填空", "_id": 7, "stage": 1 }, { "id": "实验", "name": "实验", "_id": 7, "stage": 1 }, {
        "id": "作图",
        "name": "作图",
        "_id": 7,
        "stage": 1
    }, { "id": "计算", "name": "计算", "_id": 7, "stage": 1 }, { "id": "简答", "name": "简答", "_id": 7, "stage": 1 }, {
        "id": "信息综合",
        "name": "信息综合",
        "_id": 7,
        "stage": 1
    }, { "id": "其他", "name": "其他", "_id": 7, "stage": 1 }, { "id": "简答", "name": "简答", "_id": 7, "stage": 1 }, { "id": "选择", "name": "选择", "_id": 9, "stage": 1 }, { "id": "选择填空", "name": "选择填空", "_id": 9, "stage": 1 }, {
        "id": "填空",
        "name": "填空",
        "_id": 9,
        "stage": 1
    }, { "id": "简答", "name": "简答", "_id": 9, "stage": 1 }, { "id": "计算", "name": "计算", "_id": 9, "stage": 1 }, {
        "id": "实验",
        "name": "实验",
        "_id": 9,
        "stage": 1
    }, { "id": "判断", "name": "判断", "_id": 9, "stage": 1 }, { "id": "简答", "name": "简答", "_id": 9, "stage": 1 }, { "id": "综合", "name": "综合", "_id": 11, "stage": 1 }, { "id": "探究", "name": "探究", "_id": 11, "stage": 1 }, {
        "id": "选择",
        "name": "选择",
        "_id": 11,
        "stage": 1
    }, { "id": "判断", "name": "判断", "_id": 11, "stage": 1 }, { "id": "连线", "name": "连线", "_id": 11, "stage": 1 }, {
        "id": "填空",
        "name": "填空",
        "_id": 11,
        "stage": 1
    }, { "id": "简答", "name": "简答", "_id": 11, "stage": 1 }, {
        "id": "组合选择",
        "name": "组合选择",
        "_id": 17,
        "stage": 1
    }, { "id": "探究", "name": "探究", "_id": 17, "stage": 1 }, {
        "id": "分析说明",
        "name": "分析说明",
        "_id": 17,
        "stage": 1
    }, { "id": "选择", "name": "选择", "_id": 17, "stage": 1 }, {
        "id": "判断说明",
        "name": "判断说明",
        "_id": 17,
        "stage": 1
    }, { "id": "论述", "name": "论述", "_id": 17, "stage": 1 }, { "id": "简答", "name": "简答", "_id": 17, "stage": 1 }, {
        "id": "填空",
        "name": "填空",
        "_id": 17,
        "stage": 1
    }, { "id": "辨析", "name": "辨析", "_id": 17, "stage": 1 }, { "id": "判断", "name": "判断", "_id": 17, "stage": 1 }, {
        "id": "简答",
        "name": "简答",
        "_id": 17,
        "stage": 1
    }, { "id": "选择", "name": "选择", "_id": 13, "stage": 1 }, {
        "id": "选择搭配",
        "name": "选择搭配",
        "_id": 13,
        "stage": 1
    }, { "id": "填空", "name": "填空", "_id": 13, "stage": 1 }, { "id": "判断", "name": "判断", "_id": 13, "stage": 1 }, {
        "id": "辨析改错",
        "name": "辨析改错",
        "_id": 13,
        "stage": 1
    }, { "id": "连线", "name": "连线", "_id": 13, "stage": 1 }, { "id": "简答", "name": "简答", "_id": 13, "stage": 1 }, {
        "id": "材料",
        "name": "材料",
        "_id": 13,
        "stage": 1
    }, { "id": "简答", "name": "简答", "_id": 13, "stage": 1 }, {
        "id": "组合选择",
        "name": "组合选择",
        "_id": 15,
        "stage": 1
    }, { "id": "组合填空", "name": "组合填空", "_id": 15, "stage": 1 }, {
        "id": "综合",
        "name": "综合",
        "_id": 15,
        "stage": 1
    }, { "id": "组合简答", "name": "组合简答", "_id": 15, "stage": 1 }, {
        "id": "选择",
        "name": "选择",
        "_id": 15,
        "stage": 1
    }, { "id": "填空", "name": "填空", "_id": 15, "stage": 1 }, { "id": "简答", "name": "简答", "_id": 15, "stage": 1 }, {
        "id": "连线",
        "name": "连线",
        "_id": 15,
        "stage": 1
    }, { "id": "简答", "name": "简答", "_id": 15, "stage": 1 }, {
        "id": "现代文阅读",
        "name": "现代文阅读",
        "_id": 2,
        "stage": 2
    }, { "id": "文言文阅读", "name": "文言文阅读", "_id": 2, "stage": 2 }, {
        "id": "写作",
        "name": "写作",
        "_id": 2,
        "stage": 2
    }, { "id": "选择", "name": "选择", "_id": 2, "stage": 2 }, { "id": "选择填空", "name": "选择填空", "_id": 2, "stage": 2 }, {
        "id": "填空",
        "name": "填空",
        "_id": 2,
        "stage": 2
    }, { "id": "简答", "name": "简答", "_id": 2, "stage": 2 }, { "id": "材料", "name": "材料", "_id": 2, "stage": 2 }, {
        "id": "判断",
        "name": "判断",
        "_id": 2,
        "stage": 2
    }, { "id": "简答", "name": "简答", "_id": 2, "stage": 2 }, {
        "id": "选择",
        "name": "选择",
        "_id": 4,
        "stage": 2
    }, { "id": "填空", "name": "填空", "_id": 4, "stage": 2 }, { "id": "解答", "name": "解答", "_id": 4, "stage": 2 }, {
        "id": "简答",
        "name": "简答",
        "_id": 4,
        "stage": 2
    }, {
        "id": "短对话选择型听力",
        "name": "短对话选择型听力",
        "_id": 6,
        "stage": 2
    }, { "id": "长对话选择型听力", "name": "长对话选择型听力", "_id": 6, "stage": 2 }, {
        "id": "选择型完形填空",
        "name": "选择型完形填空",
        "_id": 6,
        "stage": 2
    }, { "id": "选择型阅读理解", "name": "选择型阅读理解", "_id": 6, "stage": 2 }, {
        "id": "词汇运用",
        "name": "词汇运用",
        "_id": 6,
        "stage": 2
    }, { "id": "填空", "name": "填空", "_id": 6, "stage": 2 }, {
        "id": "句型转换",
        "name": "句型转换",
        "_id": 6,
        "stage": 2
    }, { "id": "填空型听力", "name": "填空型听力", "_id": 6, "stage": 2 }, {
        "id": "单项选择",
        "name": "单项选择",
        "_id": 6,
        "stage": 2
    }, { "id": "填空型完形填空", "name": "填空型完形填空", "_id": 6, "stage": 2 }, {
        "id": "信息匹配",
        "name": "信息匹配",
        "_id": 6,
        "stage": 2
    }, { "id": "填空型阅读理解", "name": "填空型阅读理解", "_id": 6, "stage": 2 }, {
        "id": "改错",
        "name": "改错",
        "_id": 6,
        "stage": 2
    }, { "id": "翻译", "name": "翻译", "_id": 6, "stage": 2 }, { "id": "书面表达", "name": "书面表达", "_id": 6, "stage": 2 }, {
        "id": "选择",
        "name": "选择",
        "_id": 6,
        "stage": 2
    }, { "id": "简答", "name": "简答", "_id": 6, "stage": 2 }, {
        "id": "选择",
        "name": "选择",
        "_id": 8,
        "stage": 2
    }, { "id": "填空", "name": "填空", "_id": 8, "stage": 2 }, { "id": "实验", "name": "实验", "_id": 8, "stage": 2 }, {
        "id": "作图",
        "name": "作图",
        "_id": 8,
        "stage": 2
    }, { "id": "计算", "name": "计算", "_id": 8, "stage": 2 }, { "id": "简答", "name": "简答", "_id": 8, "stage": 2 }, { "id": "选择", "name": "选择", "_id": 10, "stage": 2 }, { "id": "填空", "name": "填空", "_id": 10, "stage": 2 }, {
        "id": "简答",
        "name": "简答",
        "_id": 10,
        "stage": 2
    }, { "id": "计算", "name": "计算", "_id": 10, "stage": 2 }, { "id": "实验", "name": "实验", "_id": 10, "stage": 2 }, {
        "id": "判断",
        "name": "判断",
        "_id": 10,
        "stage": 2
    }, { "id": "简答", "name": "简答", "_id": 10, "stage": 2 }, {
        "id": "综合",
        "name": "综合",
        "_id": 12,
        "stage": 2
    }, { "id": "探究", "name": "探究", "_id": 12, "stage": 2 }, { "id": "选择", "name": "选择", "_id": 12, "stage": 2 }, {
        "id": "简答",
        "name": "简答",
        "_id": 12,
        "stage": 2
    }, { "id": "组合选择", "name": "组合选择", "_id": 18, "stage": 2 }, {
        "id": "探究",
        "name": "探究",
        "_id": 18,
        "stage": 2
    }, { "id": "分析说明", "name": "分析说明", "_id": 18, "stage": 2 }, {
        "id": "组合简答",
        "name": "组合简答",
        "_id": 18,
        "stage": 2
    }, { "id": "选择", "name": "选择", "_id": 18, "stage": 2 }, { "id": "论述", "name": "论述", "_id": 18, "stage": 2 }, {
        "id": "简答",
        "name": "简答",
        "_id": 18,
        "stage": 2
    }, { "id": "辨析", "name": "辨析", "_id": 18, "stage": 2 }, { "id": "简答", "name": "简答", "_id": 18, "stage": 2 }, { "id": "选择", "name": "选择", "_id": 14, "stage": 2 }, { "id": "优选", "name": "优选", "_id": 14, "stage": 2 }, {
        "id": "填空",
        "name": "填空",
        "_id": 14,
        "stage": 2
    }, { "id": "判断", "name": "判断", "_id": 14, "stage": 2 }, { "id": "简答", "name": "简答", "_id": 14, "stage": 2 }, {
        "id": "论证",
        "name": "论证",
        "_id": 14,
        "stage": 2
    }, { "id": "材料", "name": "材料", "_id": 14, "stage": 2 }, { "id": "简答", "name": "简答", "_id": 14, "stage": 2 }, { "id": "组合选择", "name": "组合选择", "_id": 16, "stage": 2 }, {
        "id": "组合填空",
        "name": "组合填空",
        "_id": 16,
        "stage": 2
    }, { "id": "综合", "name": "综合", "_id": 16, "stage": 2 }, {
        "id": "组合简答",
        "name": "组合简答",
        "_id": 16,
        "stage": 2
    }, { "id": "选择", "name": "选择", "_id": 16, "stage": 2 }, { "id": "填空", "name": "填空", "_id": 16, "stage": 2 }, {
        "id": "简答",
        "name": "简答",
        "_id": 16,
        "stage": 2
    }, { "id": "判断", "name": "判断", "_id": 16, "stage": 2 }]
    return {
        /**
         * 返回所有年级科目
         * @returns {[*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*]}
         */
        findAllSubject: function () {
            return angular.copy(_subject)
        },
        /**
         * 根据学科id查找学科对象
         * @param id
         * 学科id
         */
        findSubjectById: function (id) {
            var _obj = {}
            for (var i = 0, len = _subject.length; i < len; i++) {
                if (_subject[i].id == id) {
                    _obj = _subject[i]
                }
            }
            // console.log(_obj)
            return angular.copy(_obj)
        },
        /**
         * 通过学科对象获取年级列表
         * @param arg
         * 学科对象
         * @returns {Array}
         */
        findGradeBySubject: function (arg) {
            var __arr = []
            for (var i = 0, len = _grade.length; i < len; i++) {
                if (_grade[i].stage == arg.stage) {
                    __arr.push(_grade[i])
                }
            }
            return angular.copy(__arr)
        },
        /**
         * 通过学科对象获取题型列表
         * @param arg
         * 学科对象
         * @returns {Array}
         */
        findQueTypeBySubject: function (arg) {
            var __arr = []
            for (var i = 0, len = _questions.length; i < len; i++) {
                if (_questions[i].stage == arg.stage && _questions[i]._id == arg.id) {
                    __arr.push(_questions[i])
                }
            }
            return angular.copy(__arr)
        },
        /**
         * 分页获取备课笔记列表
         * @param arg
         * 查询和分页信息
         */
        pageFindCwAll: function (arg) {
            return utilService.postData(_api.setApi('cwAll'), arg)
        },
        /**
         * 备课笔记预览/试卷预览
         * @param id
         * @returns {*|string|Object}
         */
        findByCwId: function (id) {
            return utilService.getData(_api.setApi('cwPreview') + id)
        },
        /**
         * 试卷列表:结构化试卷库
         * @param arg {arg}
         * 分页和查询对象
         * @returns {*}
         */
        pageFindPaperAll: function (arg) {
            return utilService.postData(_api.setApi('paperAll'), arg)
        },
        /**
         * 类似笔记试卷库
         * @param arg {arg}
         * 分页和查询对象
         * @returns {*}
         */
        pageFindPaperCwAll: function (arg) {
            return utilService.postData(_api.setApi('cwAll'), arg)
        },
        /**
         * 试卷预览
         * @param id
         * 试卷id
         * @returns {*}
         */
        pageFindPaperView: function (id) {
            return utilService.getData(_api.setApi('paperView') + id + '?_=' + Date.now())
        },
        /**
         * 获取题目列表
         * @param arg {arg}
         * 分页和查询对象
         * @returns {*}
         */
        pageFindQustAll: function (arg) {
            return utilService.postData(_api.setApi('qustAll'), arg)
        },
        /**
         * 知识点列表
         * @param subjectId
         * 学科id
         * @returns {*|string|Object}
         */
        findKnowledgeBySubjectId: function (subjectId) {
            return utilService.getData(_api.setApi('knowledge') + subjectId)
        },
        /**
         * 创建组卷
         * @param obj
         * 组卷信息
         * @returns {*}
         */
        creatPaper: function (obj) {
            return utilService.postData(_api.setApi('paperCreat'), obj)
        },
        /**
         * 根据学段查出科目
         * @param stage
         * @returns {*|string|Object}
         */
        findSubjectsByStage: function (stage) {
            return utilService.getData(_api.setApi('subjectsByStage') + '?stage_id=' + stage + '&_=' + Date.now())
        },
        /**
         * 创建组卷
         * @param obj
         * 组卷信息
         * @returns {*}
         */
        courseObjByFilter: function (obj) {
            return utilService.postDataHttp2(_api.setApi('courseObjByFilter', 1), obj)
        },
        /**
         * 查询上课对象排课记录
         * @param obj
         * 查询对象
         * @returns {*}
         */
        findCoursePlanByFilter: function (obj) {
            console.log(obj)
            var _param = angular.copy(obj)
            delete _param.pagination
            return utilService.postDataHttp(_api.setApi('coursePlanByFilter', 1), _param)
        },
        /**
         * 获取base64图片
         * @param arr [arr]
         * 查询对象
         * @returns {*}
         */
        findImgSrcBase64: function (arr) {
            return utilService.postDataHttp(_api.setApi('imgToBase64', 1), arr)
        },
        /**
         * 保存或发送备课笔记
         * @param obj
         * 数据对象
         * @returns {*}
         */
        savePack: function (obj) {
            var _param = angular.copy(obj)
            return utilService.postDataHttp(_api.setApi('savePack', 1), _param)
        },
        /*
        设置下载次数和浏览次数
        */
        setDownloadTimes: function (obj) {
            var _params = angular.copy(obj);
            return utilService.postData(_api.setApi('setDownloadTimes'), _params);
        },
        setViewTimes: function (obj) {
            var _params = angular.copy(obj);
            return utilService.postData(_api.setApi('setViewTimes'), _params);
        },
        getStudyStage: function () {
            return utilService.postData(_api.setApi('getStudyStage'), '');
        },
        getFindSubjectByStage: function (obj) {
            var _params = angular.copy(obj);
            return utilService.getData(_api.setApi('findSubjectByStage') + "?&stage_id=" + obj.stage_id);
        },
        getVersions: function (obj) {
            var _params = angular.copy(obj);
            return utilService.getData(_api.setApi('versions') + "?stageId=" + obj.stage_id + "&subjectId=" + obj.subjectId);
        },
        getGradeList: function (obj) {
            var _params = angular.copy(obj);
            return utilService.getData(_api.setApi('gradelist') + "?stageId=" + obj.stage_id + "&subjectId=" + obj.subjectId + "&versionId=" + obj.versionId + "&state=" + '1');
        },
        getDirectory: function (obj) {
            var _params = angular.copy(obj);
            return utilService.getData(_api.setApi('directory') + obj.directory_id);
        },
        getPaperTypeTree: function (obj) {
            var _params = angular.copy(obj);
            return utilService.getData(_api.setApi('getPaperTypeTree') + obj.stage_id);
        },
        getPageFindPapersAll: function (obj) {
            var _params = angular.copy(obj);
            return utilService.postData(_api.setApi('papersall'), _params);
        },
        getErrorType: function (type) {
            var errTypeInterface = '';
            if (type == 2) {
                errTypeInterface = 'cwErrTypeInterface';
            } else if (type == 1) {
                errTypeInterface = 'paperErrTypeInterface';
            }
            console.log(type)
            // var _params = angular.copy(obj);
            return utilService.getData(_api.setApi(errTypeInterface));
        },
        submitErrorInfo: function (obj) {
            var _params = angular.copy(obj);
            return utilService.postData(_api.setApi('error'), _params);
        }
    }
}])
