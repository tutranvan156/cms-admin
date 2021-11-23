// #PACKAGE: analysis
// #MODULE: cms-dashboard
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 22/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file Dashboard
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.analysis.Dashboard
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.analysis.Dashboard');
  iNet.ui.analysis.Dashboard = function (config) {
    var _this = this;
    var layout = iNet.getLayout();
    iNet.apply(this, config || {});
    this.id = 'dashboard-wg';
    // var listLink='';
    this.chartLbl = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.params = {};
    this.url = {
      load: iNet.getUrl('cms/analysis/item'),
      list: iNet.getPUrl('cms/firm/dashboard')
    };
    this.simpleChart = new iNet.ui.chart.LineChart({
      id: 'panel-quick-statistic',
      chartID: 'statistic-chart',
      isFill: true
    });
    this.$info = {
      dashboardWg: $('#dashboard-wg'),
      numberPost: $('.number-post'),
      numComment: $('.num-comment'),
      numPage: $('.num-page'),
      numPagePulished: $('.num-page-pulished'),
      numPageUnpulished: $('.num-page-unpulished'),
      numPostCate: $('.num-post-cate'),
      listCate: $('.tree'),
      questionAll: $('.number-question'),
      questionCreated: $('.number-question-created'),
      questionPublish: $('.number-question-published'),
      exchangeAll: $('.number-exchange'),
      write: $('.product-list-in-box'),
      listComment: $('.comment-center'),
      noComment: $('.no-comment')
    };

    this.form = {
      categories: $('#cbb-categories'),
      members: $('#cbb-members'),
      timeFrom: $('#txt-time-from'),
      timeTo: $('#txt-time-to'),
      rangeDate: $('.input-daterange')
    };

    this.$dashboard={
      //thống kê bài viết
      dashboardBook:$('.dashboard-book'),
      dashboardAllPost:$('.dashboard-all-post'),
      dashboardPublished:$('.dashboard-published'),
      dashboardUnpublished:$('.dashboard-unpublished'),
      dashboardPage:$('.dashboard-page'),
      //thống kê câu hỏi
      dashboardQuestion:$('.dashboard-question'),
      dashboardAllQuestion:$('.dashboard-all-question'),
      dashboardQuestionPublished:$('.dashboard-question-published'),
      dashboardQuestionCreated:$('.dashboard-question-created'),
      //Thống kê giao lưu
      dashboardExchange:$('.dashboard-exchange'),
      dashboardComment:$('.dashboard-comment'),
      dashboardGroup:$('.dashboard-group'),
      dashboardWrite:$('.dashboard-write')
    };

    this.link = {
      linkPulished: $('#link-pulished'),
      linkUnPulished: $('#link-unpulished'),
      linkNumPost: $('#link-all-post'),
      linkNumPage: $('#link-num-page')
    };

    iNet.ui.analysis.Dashboard.superclass.constructor.call(this);

    this.link.linkNumPost.on('click', function () {
      layout.sideBar.selectMenuId('cms-post');
      layout.paramMenu = {'status': 'all'};
    });
    this.link.linkNumPage.on('click', function () {
      layout.sideBar.selectMenuId('menu-item');
    });
    this.link.linkPulished.on('click', function () {
      layout.paramMenu = {'status': CMSConfig.MODE_PUBLISHED};
      layout.sideBar.selectMenuId('cms-post');
    });
    this.link.linkUnPulished.on('click', function () {
      layout.paramMenu = {'status': CMSConfig.MODE_CREATED};
      layout.sideBar.selectMenuId('cms-post');
    });
    this.getEl().on('click', '[data-action="view-queue-parent"]', function () {
      var cateStatus = $(this).attr('data-ref');
      layout.sideBar.selectMenuId('cms-post');
      layout.paramMenu = {'statusCate': cateStatus, 'pulished': ''};
    });
    this.getEl().on('click', '[data-action="view-queue-pulished"]', function () {
      var cateStatus = $(this).attr('data-child');
      layout.sideBar.selectMenuId('cms-post');
      layout.paramMenu = {'statusCate': cateStatus, 'pulished': CMSConfig.MODE_PUBLISHED};
    });
    this.getEl().on('click', '[data-action="view-queue-created"]', function () {
      var cateStatus = $(this).attr('data-child');
      layout.sideBar.selectMenuId('cms-post');
      layout.paramMenu = {'statusCate': cateStatus, 'pulished': CMSConfig.MODE_CREATED};
    });

    this.form.categories.on('change', function () {
      //console.log('categories change');
      _this.params.categories = this.value;
      _this.load();
    });
    this.form.members.on('change', function () {
      //console.log('member change');
      _this.params.writer = this.value;
      _this.load();
    });
    this.form.rangeDate.datepicker({
      format: 'dd/mm/yyyy',
      todayBtn: 'linked',
      clearBtn: true,
      autoclose: true,
      todayHighlight: true
    }).on('changeDate', function (e) {
      //console.log(e, e.date, e.dates);
      if (e.target.name === 'start') {
        _this.params.pubFrom = e.date.getTime();
      }
      if (e.target.name === 'end') {
        _this.params.pubTo = e.date.getTime();
      }
      _this.load();
    });
    new iNet.ui.author.ItemQuickComposeBoxExt();
    // that.loadChart();
    this.load();
  };
  iNet.extend(iNet.ui.analysis.Dashboard, iNet.ui.WidgetExt, {
    load: function() {
      var _this = this;
      var html = '';
      var best = '';
      var treeCateItemId = 'tree-category-item';
      var bestWrite = 'list-best-write';
      $.postJSON(this.url.list, this.params, function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR) {
          //show thống kê bài viết
          if (result.numPosts) {
            _this.$info.numberPost.text(result.numPosts);
            _this.$dashboard.dashboardAllPost.show();
            _this.$dashboard.dashboardBook.show();
          }
          if (result.numPages) {
            _this.$info.numPage.text(result.numPages);
            _this.$dashboard.dashboardPage.show();
            _this.$dashboard.dashboardBook.show();
          }
          if (result.numPublished) {
            _this.$info.numPagePulished.text(result.numPublished);
            _this.$dashboard.dashboardPublished.show();
            _this.$dashboard.dashboardBook.show();
          }
          if (result.numQueue) {
            _this.$info.numPageUnpulished.text(result.numQueue);
            _this.$dashboard.dashboardUnpublished.show();
            _this.$dashboard.dashboardBook.show();
          }
          //show thống kê câu hỏi
          if (result.numFqa && result.numFqa !== 0) {
            _this.$info.questionAll.text(result.numFqa);
            _this.$dashboard.dashboardAllQuestion.show();
            _this.$dashboard.dashboardQuestion.show();
          }
          if (result.numFqaPublished && result.numFqaPublished !== 0) {
            _this.$info.questionPublish.text(result.numFqaPublished);
            _this.$dashboard.dashboardQuestionPublished.show();
            _this.$dashboard.dashboardQuestion.show();
          }
          if (result.numFqaCreated && result.numFqaCreated !== 0) {
            _this.$info.questionCreated.text(result.numFqaCreated);
            _this.$dashboard.dashboardQuestionCreated.show();
            _this.$dashboard.dashboardQuestion.show();

          }

          if (result.numOnlExch && result.numOnlExch !== 0) {
            _this.$dashboard.dashboardExchange.show();
            _this.$info.exchangeAll.text(result.numOnlExch);
          }
          if (result.numComments && result.numComments !== 0) {
            // _this.$info.listComment.css('display', '');
            _this.$dashboard.dashboardComment.show();
            _this.$info.numComment.text(result.numComments);
          }
          else {
            _this.$dashboard.dashboardComment.hide();
          }
          if (result.numEntriesCate && result.numEntriesCate.length > 0) {
            _this.$dashboard.dashboardGroup.show();
            (result.numEntriesCate).forEach(function (item) {
              html += iNet.Template.parse(treeCateItemId, item);
            });
            _this.$info.listCate.html(html);
          }
          else {
            _this.$dashboard.dashboardGroup.hide();
          }
          if (result.popular && result.popular.length > 0) {
            _this.$dashboard.dashboardWrite.show();
            (result.popular).forEach(function (itemCount) {
              best += iNet.Template.parse(bestWrite, itemCount);
            });
            _this.$info.write.html(best);
          }
        }
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.loading
      });
    },
    convertDataChart: function (data) {
      var now = new Date();
      var dayOfYear = now.getDayOfYear();
      var dayOfWeek = now.getDay();
      var __first = dayOfYear - dayOfWeek;
      var __last = dayOfYear + (6 - dayOfWeek);
      var __data = [];
      for (var j = __first, d = 0; j <= __last; j++, d++) {
        var itemHour;
        var __count = 0;
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          itemHour = item.day;
          if (itemHour === j) {
            __count += item.count;
          }
        }
        __data.push({label: this.chartLbl[d], value: __count});
      }
      return __data;
    },
    loadChart: function () {
      var that = this;
      this.simpleChart.setLabels(this.chartLbl);
      this.simpleChart.setDataSetLabel(['Count Hit On Week']);
      $.postJSON(this.url.load, {mode: 'week'}, function (results) {
        var __results = results || {};
        that.simpleChart.load([that.convertDataChart(__results.items)]);
      });
    }
  });
  var dashboard = new iNet.ui.analysis.Dashboard();
  function loadCategories(callback) {
    $.getJSON(iNet.gerPUrl('cms/category/list'), {}, function (results) {
      if (results.type !== CMSConfig.TYPE_ERROR) {
        callback && callback(results);
      }
    });
  }
});
