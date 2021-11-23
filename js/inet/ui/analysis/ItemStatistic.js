// #PACKAGE: analysis
// #MODULE: cms-item-statistic
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09/07/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ItemStatistic
 * @author nbchicong
 */
$(function () {
  var __params = iNet.getParam('data');
  var __item = {};
  if (!iNet.isEmpty(__params)) {
    __item = iNet.Base64.decodeObject(__params);
  }
  var $panel = $('#panel-statistic-item');
  var $itemName = $('#item-name');
  var $dateFrom = $('#statistic-from');
  var $dateTo = $('#statistic-to');
  var $date = $('#statistic-from,#statistic-to');
  var $actionChangeType = $panel.find('[data-action="change-type"]');
  var type = 'day';
  var itemChart = new iNet.ui.chart.LineChart({
    id: 'panel-statistic-item',
    chartID: 'statistic-item',
    isFill: true
  });
  var chartLbl = [];
  var convertData = function (data) {
    var __data = [];
    var __dateFrom = $dateFrom.val().toString().toDate();
    var __dateTo = $dateTo.val().toString().toDate();
    var __first = 0;
    var __last = 0;
    var __now = new Date();
    switch (type) {
      case 'day':
        __first = __dateFrom.getDayOfYear();
        __last = __dateTo.getDayOfYear();
        break;
      case 'week':
        __first = __dateFrom.getWeek();
        __last = __dateTo.getWeek();
        break;
      case 'month':
        __first = __dateFrom.getMonth();
        __last = __dateTo.getMonth();
        break;
    }
    chartLbl = [];
    for (var j = __first, d = 0; j <= __last; j ++, d ++) {
      var __count = 0;
      for (var i = 0; i < data.length; i ++) {
        var item = data[i];
        if (item[type] == j) {
          __count += item.count;
        }
      }
      __data.push({label: j, value: __count});
      if (type == 'day') {
        chartLbl.push(__now.getDateByDayOfYear(j).format('d/m'));
      } else {
        chartLbl.push(j);
      }
    }
    return __data;
  };
  var getModeByType = function (mode) {
    switch (mode) {
      case 'week': return 1; break;
      case 'month': return 0; break;
      case 'day': return 2; break;
    }
  };
  var getDateByType = function (value, mode) {
    var __date = value.toString().toDate();
    switch (mode) {
      case 'week':
          return __date.getWeek();
        break;
      case 'month':
        return __date.getMonth();
        break;
      case 'day':
        return __date.getDayOfYear();
        break;
    }
  };
  var loadData = function () {
    itemChart.setDataSetLabel(['']);
    var __data = {
      mode: getModeByType(type),
      from: getDateByType($dateFrom.val(), type),
      to: getDateByType($dateTo.val(), type)
    };
    if (!iNet.isEmpty(__item)) {
      __data.page = __item.uuid;
      $itemName.text(String.format('"{1}: {0}"', __item.subject, iNet.resources.cmsadmin.statistic.post));
    }
    $.postJSON(iNet.getUrl('cms/analysis/item'), __data, function (results) {
      var __results = results || {};
      var __data = [convertData(__results.items)];
      itemChart.setLabels(chartLbl);
      itemChart.load(__data);
    });
  };

  var __countryData = {};
  var $countyPanel = $('#panel-statistic-country');
  $countyPanel.on('click', 'i', function () {
    $(this).hide();
    $countyPanel.find('strong').html(iNet.resources.cmsadmin.statistic.country);
    loadCountryData();
  });
  var countryChart = new iNet.ui.chart.PieChart({
    id: 'panel-statistic-country',
    chartID: 'statistic-country'
  });
  countryChart.on('click', function (data) {
    var __countryName = (data[0] || {}).label || '';
    var __country = __countryData[__countryName] || '';
    if (!iNet.isEmpty(__country)) {
      $countyPanel.find('i').show();
      $countyPanel.find('strong').html(String.format(iNet.resources.cmsadmin.statistic.city, __countryName));
    } else {
      $countyPanel.find('i').hide();
      $countyPanel.find('strong').html(iNet.resources.cmsadmin.statistic.country);
    }
    loadCountryData(__country);
  });
  var loadCountryData = function (country) {
    var __country = country || '';
    var __data = {
      mode: getModeByType(type),
      from: getDateByType($dateFrom.val(), type),
      to: getDateByType($dateTo.val(), type),
      group: true,
      country: __country
    };
    if (!iNet.isEmpty(__item)) {
      __data.page = __item.uuid;
      $itemName.text(String.format('"{1}: {0}"', __item.subject, iNet.resources.cmsadmin.statistic.post));
    }
    $.postJSON(iNet.getUrl('cms/analysis/country'), __data, function (result) {
      var __result = result || {};
      var __items = __result.items;
      var __labels = [];
      var __datas = [];
      for (var i = 0; i < iNet.getSize(__items); i ++) {
        if (!iNet.isEmpty((__items[i].countryName || ''))) __countryData[__items[i].countryName] = __items[i].countryCode;
        __labels.push(__items[i].countryName || __items[i].city);
        __datas.push(__items[i].count);
      }
      countryChart.setLabels(__labels);
      countryChart.load(__datas);
    });
  };

  var browserChart = new iNet.ui.chart.PieChart({
    id: 'panel-statistic-browser',
    chartID: 'statistic-browser'
  });
  var loadBrowserData = function () {
    var __data = {
      mode: getModeByType(type),
      from: getDateByType($dateFrom.val(), type),
      to: getDateByType($dateTo.val(), type),
      group: true
    };
    if (!iNet.isEmpty(__item)) {
      __data.page = __item.uuid;
      $itemName.text(String.format('"{1}: {0}"', __item.subject, iNet.resources.cmsadmin.statistic.post));
    }
    $.postJSON(iNet.getUrl('cms/analysis/browser'), __data, function (result) {
      var __result = result || {};
      var __items = __result.items;
      var __labels = [];
      var __datas = [];
      for (var i = 0; i < iNet.getSize(__items); i ++) {
        __labels.push(__items[i].browser);
        __datas.push(__items[i].count);
      }
      browserChart.setLabels(__labels);
      browserChart.load(__datas);
    });
  };

  var platformChart = new iNet.ui.chart.PieChart({
    id: 'panel-statistic-platform',
    chartID: 'statistic-platform'
  });
  var loadPlatformData = function () {
    var __data = {
      mode: getModeByType(type),
      from: getDateByType($dateFrom.val(), type),
      to: getDateByType($dateTo.val(), type),
      group: true
    };
    if (!iNet.isEmpty(__item)) {
      __data.page = __item.uuid;
      $itemName.text(String.format('"{1}: {0}"', __item.subject, iNet.resources.cmsadmin.statistic.post));
    }
    $.postJSON(iNet.getUrl('cms/analysis/platform'), __data, function (result) {
      var __result = result || {};
      var __items = __result.items;
      var __labels = [];
      var __datas = [];
      for (var i = 0; i < iNet.getSize(__items); i ++) {
        __labels.push(__items[i].platform);
        __datas.push(__items[i].count);
      }
      platformChart.setLabels(__labels);
      platformChart.load(__datas);
    });
  };

  var now = new Date();
  var dayOfYear = now.getDayOfYear();
  var dayOfWeek = now.getDay();
  var __firstDateOfWeek = now.getDate() - dayOfWeek;
  var __lastDateOfWeek = now.getDate() + (6 - dayOfWeek);
  $date.mask('99/99/9999');
  $dateFrom.val(new Date(now.getFullYear(), now.getMonth(), __firstDateOfWeek).format('d/m/Y')).datepicker({
    format: 'dd/mm/yyyy'
  }).on('changeDate', function (ev) {
    loadData();
    loadBrowserData();
    loadCountryData();
    loadPlatformData();
  });
  $dateTo.val(new Date(now.getFullYear(), now.getMonth(), __lastDateOfWeek).format('d/m/Y')).datepicker({
    format: 'dd/mm/yyyy'
  }).on('changeDate', function (ev) {
    loadData();
    loadBrowserData();
    loadCountryData();
    loadPlatformData();
  });
  $actionChangeType.on('click', function () {
    var $this = $(this);
    type = $this.data('type');
    $this.parent().find('[data-action]').removeClass('active');
    $this.addClass('active');
    loadData();
    loadBrowserData();
    loadCountryData();
    loadPlatformData();
  });
  loadData();
  loadBrowserData();
  loadCountryData();
  loadPlatformData();


  // active menu
  //var layout = iNet.getLayout();
  //if (layout) {
  //  var menu = layout.window.sideBar;
  //  if (menu) {
  //    menu.activeById('#statistic');
  //  }
  //}
});