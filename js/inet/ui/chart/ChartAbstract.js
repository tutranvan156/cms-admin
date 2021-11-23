// #PACKAGE: chart
// #MODULE: cms-chart-abstract
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 25/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ChartAbstract
 * @author nbchicong
 */
$(function () {
  iNet.ns('iNet.ui.chart.ChartAbstract');
  iNet.ui.chart.ChartAbstract = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.id = this.id || null;
    this.chartID = this.chartID || null;
    this.chart = null;
    this.chartContext = null;
    this.chartType = this.chartType || 'line';
    this.chartOptions = {
      scaleShowGridLines: true,
      scaleGridLineColor: 'rgba(0,0,0,.05)',
      scaleGridLineWidth: 1,
      scaleShowHorizontalLines: true,
      scaleShowVerticalLines: true,
      bezierCurve: true,
      bezierCurveTension: 0.4,
      pointDot: true,
      pointDotRadius: 4,
      pointDotStrokeWidth: 1,
      pointHitDetectionRadius: 20,
      datasetStroke: true,
      datasetStrokeWidth: 2,
      datasetFill: true,
      legendTemplate: '<ul class=\'<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };
    if (iNet.isEmpty(this.id)) {
      throw new Error('Container ID is not null');
    }
    if (iNet.isEmpty(this.chartID)) {
      throw new Error('Chart ID is not null');
    }
    this.$container = $(String.format('#{0}', this.id));
    this.$chartEl = $(String.format('#{0}', this.chartID));
    this.getChartEl().on('click', function (e) {
      that.fireEvent('absclick', e, that);
    });
  };
  iNet.extend(iNet.ui.chart.ChartAbstract, iNet.ui.CMSComponent, {
    constructor: iNet.ui.chart.ChartAbstract,
    _init: function () {
      this.setChartContext(this.getChartEl().get(0).getContext('2d'));
      if (iNet.isEmpty(this.getChartContext())) {
        throw new Error('Chart Context is not null');
      } else {
        this.chart = new Chart(this.getChartContext());
      }
    },
    getClassByType: function () {
      switch (this.getChartType().toLocaleLowerCase()) {
        case 'bar': this.setChart(this.chart.Bar(this.getData(), this.getChartOptions())); break;
        case 'radar': this.setChart(this.chart.Radar(this.getData(), this.getChartOptions())); break;
        case 'area': this.setChart(this.chart.PolarArea(this.getData(), this.getChartOptions())); break;
        case 'pie': this.setChart(this.chart.Pie(this.getData(), this.getChartOptions())); break;
        case 'doughnut': this.setChart(this.chart.Doughnut(this.getData(), this.getChartOptions())); break;
        default: this.setChart(this.chart.Line(this.getData(), this.getChartOptions()));
      }
    },
    setChart: function (chart) {
      this.chart = chart;
    },
    getChart: function () {
      return this.chart;
    },
    setChartType: function (type) {
      this.chartType = type;
    },
    getChartType: function () {
      return this.chartType;
    },
    getContainer: function () {
      return this.$container || $(String.format('#{0}', this.id));
    },
    getChartEl: function () {
      return this.$chartEl || $(String.format('#{0}', this.chartID));
    },
    setChartContext: function (context) {
      this.chartContext = context;
    },
    getChartContext: function () {
      return this.chartContext;
    },
    setData: function (data) {
      this.chartData = data;
    },
    getData: function () {
      return this.chartData;
    },
    setChartOptions: function (options) {
      this.chartOptions = options;
    },
    getChartOptions: function () {
      return this.chartOptions;
    },
    setLegendTemplate: function (tpl) {
      this.getChartOptions().legendTemplate = tpl;
    },
    getLegendTemplate: function () {
      return this.getChartOptions().legendTemplate;
    }
  });
});