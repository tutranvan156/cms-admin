// #PACKAGE: financial
// #MODULE: financial-report-main

$(function () {
    var list = new iNet.ui.cmsadmin.FinancialReportListWidget();
    var wg;

    var createFinancialWidget = function () {
        if (!wg) {
            wg = new iNet.ui.cmsadmin.FinancialReportWidget();

            wg.on('back', function () {
                list.show();
                list.getGrid().load();
                wg.clearForm();
                wg.clearArrayFile();
            });
        }
        return wg;
    };

    list.on('create', function (w, params) {
        var __params = params || {};
        console.log(__params);
        var widget = createFinancialWidget();
        list.hide();
        widget.show();
    });

    list.on('open', function (record) {
        var widget = createFinancialWidget();
        widget.setReportData(record);
        widget.setFile(record);
        list.hide();
        widget.show();
    })
});