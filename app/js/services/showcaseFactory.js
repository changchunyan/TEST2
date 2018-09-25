/**
 * Created by 毅 on 2015/12/20.
 */
'use strict';
/**
 * 返回 selected 和 selectedNode
 */
angular.module('ywsApp').factory('TreeDataFactory', function() {
 function TreeDataFactory(tree, selected) {
     var oThis = this;

     oThis.tree = tree;
     oThis.selected = [];//只存放id
     oThis.selectedNode = [];//存放节点
     oThis.selectAll = selectAll;
     oThis.isSelected = isSelected;
     oThis.updateSelection = updateSelection;
     oThis.ifSelectedAll = ifSelectedAll;

     var _isSelectedAll;

     (function init(){
         if(check_null(selected) && selected.length>0){
             oThis.selected = selected;
         }
       /*
         oThis.selected= [2846];*/
         console.log(oThis.tree);
         console.log( oThis.selected);
         _setTreeSelected(oThis.selected);
         _isSelectedAll = false;
     })();

     function selectAll($event){
         //console.log($event.target);
         var checkbox = $event.target;
         var action = (checkbox.checked ? 'add' : 'remove');
         /*for (var i = 0; i < oThis.tree.length; i++) {
             var entity = oThis.tree[i];
             _updateSelected(action, entity.id);
         }*/
         _selected(action,oThis.tree);
         _isSelectedAll = true;
     }
     function isSelected(check){
         //console.log(check);
        return check;
     }
     function updateSelection($event, tree){
         var checkbox = $event.target;
         var action = (checkbox.checked ? 'add' : 'remove');
         var array = [];
         array.push(tree);
         oThis._selected(action, array);
     }
     /********************************util***********************************************************/

     oThis._updateSelected = _updateSelected;
     oThis._checkIfFather = _checkIfFather;
     oThis._checkIfChild = _checkIfChild;
     oThis._getChildren = _getChildren;
     oThis._getFather = _getFather;

     oThis._selectedFather = _selectedFather;
     oThis._setTreeSelected = _setTreeSelected;
     oThis._setCheckedById = _setCheckedById;
     oThis._getFatherById = _getFatherById;

     oThis._find = _find;
     oThis._selected = _selected;
     oThis._ifSelectedFather = _ifSelectedFather;
     oThis._ifSelected = _ifSelected;


     function _updateSelected(action, node) {
         var id = node.id;
         if (action == 'add' && oThis.selected.indexOf(id) == -1) {
             oThis.selected.push(id);
             oThis.selectedNode.push(node);
         }
         if (action == 'remove' && oThis.selected.indexOf(id) != -1) {
             oThis.selected.splice(oThis.selected.indexOf(id), 1);
             oThis.selectedNode.splice(oThis.selected.indexOf(id), 1);
         }

     }
     function _ifSelectedFather(action,node){
        var father = node.father;
        if(action =='add'){
            for(var i;i<father.items.length;i++){
                if(!oThis._ifSelected(father.items[i].id)){
                    return false;
                }
            }
        }
         if(action =='remove'){
             /*for(var i;i<node.items.length;i++){
                 if(oThis._ifSelected(node.items[i].id)){
                     return true;
                 }
             }*/
             return false;
         }

     }
     function _ifSelected(id){
         var selected = oThis.selected;
         for(var i=0;i<selected.length;i++){
             if(id == selected[i]){
                 return true;
             }
         }
         return false;
     }

     function _selectedFather(action,node){
         var father = node.father;
         if(oThis._ifSelectedFather(action,node)){
             father.check = true;
             oThis._getFatherById(father.id).check = true;
         }else{
             //father.check = false;
             var e = oThis._getFatherById(father.id);
             e.check = false;
         }
     }
     function _checkIfFather(child){
         if(check_null(child.fatherId) && child.fatherId>0){
             return true;
         }else{

         }
         return false;
     }
     function _checkIfChild(father){
         if(check_null(father.items) && father.items.length>0){
             return true;
         }else{

         }
         return false;
     }
     function _getChildren(father){
         var list = [];
         if(oThis._checkIfChild(father)){
             list = angular.copy(father.items);
         }
         return list;
     }
     function _getFather(child){
         var father = {};
         if(oThis._checkIfFather(father)){
             father = child.father;
         }
         return father;
     }

     /**
      *  通过传来的参数来设置tree.check是否显示
      * @param list
      * @private
      */
     function _setTreeSelected(list){
         for(var i=0;i<list.length;i++){
             _setCheckedById(list[i]);
         }
     }
     function _setCheckedById(id){
         for(var i=0;i<tree.length;i++){
             for(var j=0;j<tree[i].items.length;j++){
                 var items = tree[i].items;
                 if(items[j].id == id ){
                     items[j].check = true;
                     oThis.selectedNode.push(items[j]);
                 }
             }
         }
     }
     function _getFatherById(id){
         for(var i=0;i<tree.length;i++){
             if(tree[i].id == id ){
                 //tree[i].check = true;
                 return tree[i];
             }
             for(var j=0;j<tree[i].items.length;j++){
                 var items = tree[i].items;
                 if(items[j].id == id ){
                     //items[j].check = true;
                     return  items[j];
                 }
             }
         }
         return oThis;
     }

     /**
      * 遍历
      * 可能遇到的问题，当父节点和节点的id重复时。会引起bug
      * @param data  Array
      * @param id  int
      * @private
      */
     function _find(data,id){
         var array = data;
         for(var i=0;i<array.length;i++){
            if(id == array.id){
                return array[i];
            }
            if(check_null(array[i].items) && array[i].items>0){
                return oThis._find(array[i].items,id);//使用递归
            }
         }
         return null;
     }

     /**
      * 选中/不选中 包括子节点
      * @param tree
      * @param action
      * @returns {null}
      * @private
      */
     function _selected(action,tree){
         for(var i=0;i<tree.length;i++){
             if(action  == 'add'){
                 tree[i].check = true;
             }else if(action == 'remove'){
                 tree[i].check = false;
                 _isSelectedAll = false;
             }
             if(check_null(tree[i].items) && tree[i].items.length>0){
                 oThis._selected(action,tree[i].items);//使用递归
             }else{
                 oThis._updateSelected(action,tree[i]);
                 //TODO 删除全部子节点 父节点自动移除
                 //oThis._selectedFather(action,tree[i]);
             }
         }
         return oThis;
     }
    function ifSelectedAll() {
         return _isSelectedAll;
     }

 }
 return TreeDataFactory;
 });
