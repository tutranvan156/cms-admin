/**
 * #PACKAGE: exchange
 * #MODULE: list-answer
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 14:36 30/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListAnswer.js
 */
$(function () {
  /**
   * @class iNet.ui.exchange.ListAnswer
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.exchange.ListAnswer');
  iNet.ui.exchange.ListAnswer = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id='wg-list-answer-main';
    this.gridID='grid-list-answer-main';
    this.module='topic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.remote=true;
    this.url={
      list: iNet.getPUrl('onl/exch/question/member')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'fullname',
          label: _this.getText('name_create_question'),
          type: 'text',
          sortable: true,
          width: 170
        }, {
          property: 'content',
          label: _this.getText('detail_question'),
          type: 'text',
          sortable: true,
          width: 170
        }, {
          property: 'status',
          label: _this.getText('status', 'fqa'),
          type: 'text',
          sortable: true,
          width: 170,
          renderer:function(value){
            if(value==='CREATED')
              return 'Vừa tạo';
            else if(value==='PROCESS')
              return 'Đang xử lý';
            else if(value==='REVIEW')
              return 'Đang chờ duyệt';
            else if(value==='REJECT')
              return 'Từ chối';
            else if(value==='PUBLISHED')
              return 'Đã xuất bản';
          }
        }, {
          property: 'created',
          label: _this.getText('date', 'link'),
          type: 'text',
          sortable: true,
          width: 100,
          renderer: function (v) {
            var _date = new Date(v);
            return _date.format('d/m/Y');
          }
        // }, {
        //   label: '',
        //   type: 'action',
        //   width: 100,
        //   align: 'center',
        //   buttons: [{
        //     text: _this.getText('delete', 'link'),
        //     icon: 'icon-trash',
        //     labelCls: 'label label-danger',
        //     fn: function (record) {
        //       var dialog = _this.confirmDlg(_this.getText('title_delete', 'link'), _this.getText('quesion_delete', 'link'), function () {
        //         rowRemove(this.getOptions(), record, this);
        //       });
        //       dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', 'link'));
        //       dialog.setOptions({
        //         uuid: record.uuid,
        //         topic:record.topic
        //       });
        //       dialog.show();
        //     }
        //   }]
        }],
      delay: 250
    });
    function rowRemove(_uuid, record, _dialog) {
      _dialog.hide();
      $.postJSON(_this.url._delete, _uuid, function (result) {
        if (result.success === false)
          _this.error(_this.getText('delete', 'link'), _this.getText('delete_error', 'link'));
        else {
          _this.removeRecord(record);
          _this.success(_this.getText('delete', 'link'), _this.getText('delete_success', 'link'));
        }
      });
    }
    this.basicSearch = function () {
      this.id = 'list-basic-search-answer-all';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.selectType = $('#selected-type-question');
        this.btnSearch = this.getEl().find('.grid-search-btn');

      },
      getId: function () {
        return this.id;
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keywords: this.inputSearch.val()
        };
      }
    });
    iNet.ui.exchange.ListAnswer.superclass.constructor.call(this);
    this.getGrid().on('click',function(record){
      _this.fireEvent(_this.getEvent('open'),record,_this);
    });
  };
  iNet.extend(iNet.ui.exchange.ListAnswer, iNet.ui.ListAbstract, {});
});
