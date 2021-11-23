// #PACKAGE: chart
// #MODULE: cms-pie-chart
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09/07/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file PieChart
 * @author nbchicong
 */
$(function () {
  iNet.ns('iNet.ui.chart.PieChart');
  iNet.ui.chart.PieChart = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.chartType = this.chartType || 'Pie';
    this.labels = this.labels || [];
    this.pieColor = this.pieColor || ['#97BBCD','#46BFBD','#949FB1','#FDB45C','#4D5360','#F7464A','#DBDBDB'];
    this.pies = [];
    iNet.ui.chart.PieChart.superclass.constructor.call(this);
    this.on('absclick', function (data) {
      var __data = that.getChart().getSegmentsAtEvent(data);
      if (!iNet.isEmpty(__data)) {
        that.fireEvent('click', __data);
      }
    });
  };
  iNet.extend(iNet.ui.chart.PieChart, iNet.ui.chart.ChartAbstract, {
    setLabels: function (labels) {
      this.labels = labels;
    },
    getLabels: function () {
      return this.labels;
    },
    setPieColor: function (pieColor) {
      this.pieColor = pieColor;
    },
    getPieColor: function () {
      return this.pieColor;
    },
    setPies: function (pies) {
      this.pies = pies;
    },
    getPies: function () {
      return this.pies;
    },
    renderPie: function () {
      var __labels = this.getLabels();
      var __pieColor = this.getPieColor();
      var __pies = [];
      for (var i = 0; i < iNet.getSize(__labels); i ++) {
        __pies.push({
          label: __labels[i],
          color: CMSUtils.getRGBAByHex(__pieColor[i], 100),
          highlight: CMSUtils.getRGBAByHex(__pieColor[i], 70)
        });
      }
      this.setPies(__pies);
    },
    applyData: function (datas) {
      var __datas = datas || [];
      var __pies = this.getPies();
      for (var i = 0; i < iNet.getSize(__datas); i ++) {
        __pies[i].value = __datas[i];
      }
    },
    load: function (datas) {
      if (iNet.isDefined(this.getChart()) && !iNet.isEmpty(this.getChart())) this.getChart().destroy();
      this.renderPie();
      this.applyData(datas);
      this.setData(this.getPies());
      this._init();
      this.getClassByType();
    }
  });
});