// #PACKAGE: chart
// #MODULE: cms-line-chart
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 26/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file LineChart
 * @author nbchicong
 */
$(function () {
  iNet.ns('iNet.ui.chart.LineChart');
  iNet.ui.chart.LineChart = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.chartType = 'Line';
    this.labels = this.labels || [];
    this.dsLabel = this.dsLabel || [];
    this.lineColor = this.lineColor || ['#97BBCD','#46BFBD','#949FB1','#FDB45C','#4D5360','#F7464A','#DBDBDB'];
    this.isFill = this.isFill || false;
    this.lines = [];
    iNet.ui.chart.LineChart.superclass.constructor.call(this);
    this.on('absclick', function (data) {
      var __data = that.getChart().getPointsAtEvent(data);
      if (!iNet.isEmpty(__data)) {
        that.fireEvent('click', __data);
      }
    });
  };
  iNet.extend(iNet.ui.chart.LineChart, iNet.ui.chart.ChartAbstract, {
    setDataSetLabel: function (dsLabel) {
      this.dsLabel = dsLabel;
    },
    getDataSetLabel: function () {
      return this.dsLabel;
    },
    setLabels: function (labels) {
      this.labels = labels;
    },
    getLabels: function () {
      return this.labels;
    },
    setLineColor: function (lineColor) {
      this.lineColor = lineColor;
    },
    getLineColor: function () {
      return this.lineColor;
    },
    setLines: function (lines) {
      this.lines = lines;
    },
    getLines: function () {
      return this.lines;
    },
    renderLine: function () {
      var __labels = this.getDataSetLabel();
      var __lineColor = this.getLineColor();
      var __lines = [];
      for (var i = 0; i < iNet.getSize(__labels); i ++) {
        __lines.push({
          label: __labels[i],
          fillColor: CMSUtils.getRGBAByHex(__lineColor[i], 20),
          strokeColor: CMSUtils.getRGBAByHex(__lineColor[i], 100),
          pointColor: CMSUtils.getRGBAByHex(__lineColor[i], 100),
          pointStrokeColor: '#FFFFFF',
          pointHighlightFill: '#FFFFFF',
          pointHighlightStroke: CMSUtils.getRGBAByHex(__lineColor[i], 100)
        });
      }
      this.setLines(__lines);
    },
    applyData: function (datas) {
      var __datas = datas || [];
      var __lines = this.getLines();
      for (var j = 0; j < iNet.getSize(__datas); j ++) {
        __lines[j].data = [];
        for (var i = 0; i < iNet.getSize(__datas[j]); i ++) {
          __lines[j].data.push(__datas[j][i].value);
        }
      }
    },
    load: function (datas) {
      if (iNet.isDefined(this.getChart()) && !iNet.isEmpty(this.getChart())) this.getChart().destroy();
      this.renderLine();
      this.applyData(datas);
      this.setData({labels: this.getLabels(), datasets: this.getLines()});
      this._init();
      this.getClassByType();
    },
    clear: function () {
      this.setLines([]);
      this.setDataSetLabel([]);
      this.setLabels([]);
    }
  });
});