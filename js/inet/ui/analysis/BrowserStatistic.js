// #PACKAGE: analysis
// #MODULE: cms-browser-statistic
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09/07/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file BrowserStatistic
 * @author nbchicong
 */
$(function () {
  var platformChart = new iNet.ui.chart.PieChart({
    id: 'panel-statistic-browser',
    chartID: 'statistic-browser'
  });
  var loadData = function () {
    $.postJSON(iNet.getUrl('cms/analysis/browser'), {}, function (result) {
      var __result = result || {};
      var __items = __result.items;
      var __labels = [];
      var __datas = [];
      for (var i = 0; i < iNet.getSize(__items); i ++) {
        __labels.push(__items[i].browser);
        __datas.push(__items[i].count);
      }
      platformChart.setLabels(__labels);
      platformChart.load(__datas);
    });
  };
  loadData();
});