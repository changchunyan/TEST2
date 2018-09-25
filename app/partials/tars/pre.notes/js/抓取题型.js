var _arr_new = [],
    _subject = [
        {id: 19, stage: 3, name: '小学语文'},
        {id: 20, stage: 3, name: '小学数学'},
        {id: 21, stage: 3, name: '小学英语'},
        {id: 1, stage: 1, name: '初中语文'},
        {id: 3, stage: 1, name: '初中数学'},
        {id: 5, stage: 1, name: '初中英语'},
        {id: 7, stage: 1, name: '初中物理'},
        {id: 9, stage: 1, name: '初中化学'},
        {id: 11, stage: 1, name: '初中生物'},
        {id: 17, stage: 1, name: '初中政治'},
        {id: 13, stage: 1, name: '初中历史'},
        {id: 15, stage: 1, name: '初中地理'},
        {id: 2, stage: 2, name: '高中语文'},
        {id: 4, stage: 2, name: '高中数学'},
        {id: 6, stage: 2, name: '高中英语'},
        {id: 8, stage: 2, name: '高中物理'},
        {id: 10, stage: 2, name: '高中化学'},
        {id: 12, stage: 2, name: '高中生物'},
        {id: 18, stage: 2, name: '高中政治'},
        {id: 14, stage: 2, name: '高中历史'},
        {id: 16, stage: 2, name: '高中地理'}
    ]

/**
 * 拼装_questions数据
 * @param id
 *  dom id
 * @param _id
 *  _subject中每个元素所对应的id
 * @param s
 *  _subject中每个元素所对应的stage
 */
function getOption(id, _id, s) {
    var _option = $(id).find('option')
    for (var i = 0, len = _option.length; i < len; i++) {
        var one = {
            id: _option[i].value,
            name: _option[i].value,
            _id: _id,
            stage: s
        }
        _arr_new.push(one)
    }
}

function setDta() {
    for (var i = 0, len = _subject.length; i < len; i++) {
        (function (i) {
            $('#subject').val(_subject[i].id)
            $('#subject').change()
            getOption('#question_type', _subject[i].id, _subject[i].stage)
        })(i)
    }
}
setDta()
var _arr = []
for(var i = 0 , len = _arr_new.length; i<len ; i++){
    if(_arr_new[i].id!=''&&_arr_new[i].name!=''){
        _arr.push(_arr_new[i])
    }
}
console.log(_arr.length,_arr_new.length)
console.log(JSON.stringify(_arr))
// 将最后的执行结果直接复制给'app/partials/tars/pre.notes/js/server.js'文件中_questions即可