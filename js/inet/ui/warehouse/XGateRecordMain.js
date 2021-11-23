// #PACKAGE: warehouse
// #MODULE: xgate-record-main

$(function () {
    var list = new iNet.ui.cmsadmin.ImportHistoryListWidget();
    var detail;

    var createDetailWidget = function(){
        if(!detail) {
            detail= new iNet.ui.cmsadmin.XGateRecordDetailWidget();
            detail.on('back',function(){
                detail.hide();
                list.show();
            });
        }
        return detail;
    };

    list.on('get-detail', function(w, params){
        var __params = params || {};

        var widget = createDetailWidget();
        list.hide();
        widget.getGrid().setParams({
           keywords: "", pageSize: 10, pageNumber: 0
        });
        widget.loadGrid();
        widget.show();

    });
});