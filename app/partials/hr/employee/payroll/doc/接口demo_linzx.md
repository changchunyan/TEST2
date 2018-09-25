1:getSalaryListTableByCurrentUserSchool

curl -i -X GET \
   -H "Authorization:bearer MTMwNToxN2M2OTE3My01M2IxLTRiOTUtYjZhMS03NDM2YzQ2ZTZiYTg=" \
 'http://127.0.0.1:8080/salary'

 {"status":"SUCCESS","error":null,"data":[{"school_id":1,"issue_date":1527063482000,"month_id":"201804","count":3,"state":1,"create_at":1526991851000},{"school_id":1,"issue_date":1526991860000,"month_id":"201803","count":3,"state":1,"create_at":1526991851000},{"school_id":1,"issue_date":1526991860000,"month_id":"201802","count":2,"state":1,"create_at":1526991851000},{"school_id":1,"issue_date":1526991860000,"month_id":"201801","count":1,"state":1,"create_at":1526991851000}]}





2:createByMonth

curl -i -X POST \
   -H "Authorization:bearer MTMwNToxN2M2OTE3My01M2IxLTRiOTUtYjZhMS03NDM2YzQ2ZTZiYTg=" \
   -H "Content-Type:multipart/form-data" \
   -F "file=@\"./工资条导入模板.xlsx\";type=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;filename=\"工资条导入模板.xlsx\"" \
 'http://127.0.0.1:8080/salary/201805'


 {"status":"SUCCESS","error":null,"data":"201805"}


3.getSalaryListByMonthId

curl -i -X GET \
   -H "Authorization:bearer MTMwNToxN2M2OTE3My01M2IxLTRiOTUtYjZhMS03NDM2YzQ2ZTZiYTg=" \
 'http://127.0.0.1:8080/salary/201801'


 {"status":"SUCCESS","error":null,"data":[{"id":5,"monthId":"201801","userId":1,"account":"1","userName":"1","positionName":"1","schoolId":1,"basePay":0.00,"performancePay":0.00,"allowance":0.00,"bonus":0.00,"reissue":0.00,"dayoff":0.00,"fineLate":0.00,"penalty":0.00,"findSuit":0.00,"insurance":0.00,"housingFund":0.00,"insuranceFundSum":0.00,"grossPay":0.00,"finalPay":0.00,"tax":0.00,"remark":null,"state":1,"issueDate":1526991860000,"createAt":1526991851000,"createBy":null,"updateAt":1526991845000,"updateBy":0,"isDeleted":0}]}



4.updateSalaryRowBySalaryRowId

curl -i -X PUT \
   -H "Authorization:bearer MTMwNToxN2M2OTE3My01M2IxLTRiOTUtYjZhMS03NDM2YzQ2ZTZiYTg=" \
   -H "Content-Type:application/json" \
   -d \
'{"id":3,
 "monthId":"201802",
 "userId":2,"account":"1111","userName":"2",
 "positionName":"2","schoolId":1,"basePay":0,
 "performancePay":0,"allowance":0,"bonus":0,"reissue":0,
 "dayoff":0,"fineLate":0,"penalty":1.1,"findSuit":0,"insurance":0,
 "housingFund":0,"insuranceFundSum":0,"grossPay":0,"finalPay":0,
 "tax":0,"remark":"","state":1,"updateBy":0,"isDeleted":0}' \
 'http://127.0.0.1:8080/salary/row'



 {"status":"SUCCESS","error":null,"data":null}



5.batchUpdateSalaryRowIssueStateByCurrentUserSchool


curl -i -X PUT \
   -H "Authorization:bearer MTMwNToxN2M2OTE3My01M2IxLTRiOTUtYjZhMS03NDM2YzQ2ZTZiYTg=" \
 'http://127.0.0.1:8080/salary/batchIssue/201804'


 {"status":"SUCCESS","error":null,"data":null}



6.download salary_template

curl -i -X GET \
   -H "Authorization:bearer MTMwNToxN2M2OTE3My01M2IxLTRiOTUtYjZhMS03NDM2YzQ2ZTZiYTg=" \
 'http://127.0.0.1:8080/salary/template'