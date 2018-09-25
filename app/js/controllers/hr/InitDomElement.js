/**
 * Created by zhiqing on 2015/11/11.
 */

   /* $('.selectpicker').selectpicker({noneSelectedText: "---请选择---"});
    $('.selectpicker').selectpicker('val', $('.selectpicker').attr('value'));
    $(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii'});*/
function pause(){
    window.setTimeout("show()",20);
}
function show(){
    $('.selectpicker').selectpicker({noneSelectedText:'---请选择---'});
    //$('.selectpicker').selectpicker('val',$('.selectpicker').attr('value'));
    /*$(".form_datetime").datetimepicker({format: 'yyyy-mm-dd hh:ii:ss'});*/
}
window.load=pause();
