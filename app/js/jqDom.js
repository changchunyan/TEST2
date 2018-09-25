/**
 * Created by 李世明 on 2016/10/13 0013.
 * QQ:1278915838
 * TEL:18518769512
 * TODO:
 */
setTimeout(function () {
    var setI = null;
    $('#resetInputAll').on('click', function () {
        $(".mt-select,.no-media").find('input').val('').end().find('li.option').find('div').html('请选择').end().find('div.three-1').html('不限')
    })
    $('input.three-2').on('click', function () {
        var $this = $(this).parent()
        $this.find('input.three-1').val(8).change()
        $this.find('div.three-1').html('自定义')
        setI = setInterval(function () {
            $this.find('input.three-2').change()
        },100)
    })
    $('.bg-color-blue').click(function () {
        clearInterval(setI)
        setI = null
    })
},1000)