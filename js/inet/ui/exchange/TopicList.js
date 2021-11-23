/**
 * #PACKAGE: exchange
 * #MODULE: topic-list
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 15:59 25/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file TopicList.js
 */
$(function () {
  /**
   * @class iNet.ui.exchange.TopicList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.exchange.TopicList');
  iNet.ui.exchange.TopicList = function (options) {
    var _this = this, __opts = options || {};
    iNet.apply(this, __opts);
    this.id = 'wg-list-topic';
    this.gridID = 'grid-topic';
    this.module = 'topic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.remote = true;
    this.url = {
      list: iNet.getPUrl('onl/exch/topic/list'),
      save: iNet.getPUrl('onl/exch/topic/save'),
      _delete: iNet.getPUrl('onl/exch/topic/delete')
    };
    this.$toolbar = {
      CREATED: $('#list-topic-btn-create')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'subject',
          label: _this.getText('subject'),
          type: 'label',
          sortable: true,
          width: 250
        }, {
          property: 'brief',
          label: _this.getText('brief'),
          type: 'label',
          sortable: true
        }, {
          property: 'open',
          label: this.getText('status', 'post'),
          width: 70,
          sortable: false,
          type: 'switches',
          typeCls: 'switch-4',
          cls: 'text-center',
          renderer: function (v) {
            return v;
          },
          onChange: function (record, status) {
            record.open = status;
            $.postJSON(_this.url.save, record, function (result) {
              _this.update(result);
            });
          }
        }, {
          property: 'created',
          label: _this.getText('date', 'link'),
          type: 'label',
          sortable: true,
          cls: 'text-center',
          width: 70,
          renderer: function (value) {
            return new Date(value).format('d/m/Y');
          }
        }, {
          label: '',
          type: 'action',
          width: 150,
          align: 'center',
          buttons: [{
            text: _this.getText('list_admin'),
            icon: 'fa fa-user-secret',
            labelCls: 'label label-info',
            fn: function (record) {
              _this.fireEvent(_this.getEvent('list_admin'), record, _this);
            }
          }, {
            text: _this.getText('member'),
            icon: 'fa fa-user',
            labelCls: 'label label-primary',
            fn: function (record) {
              _this.fireEvent(_this.getEvent('list_member'), record, _this);
            }
          }, {
            text: _this.getText('list_question'),
            icon: 'fa fa-question',
            labelCls: 'label label-success',
            fn: function (record) {
              _this.fireEvent(_this.getEvent('list_question'), record, _this);
            }
          }, {
            text: _this.getText('delete', 'link'),
            icon: 'icon-trash',
            labelCls: 'label label-danger',
            fn: function (record) {
              var dialog = _this.confirmDlg(_this.getText('title_delete', 'link'), _this.getText('quesion_delete', 'link'), function () {
                rowRemove(this.getOptions(), record, this);
              });
              dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', 'link'));
              dialog.setOptions({uuid: record.uuid});
              dialog.show();
            }
          }]
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
      this.id = 'list-basic-search-topic';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        this.inputSearch = $('.grid-search-input');
        this.$btnSearch = $('.grid-search-btn');
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
          keywords: this.inputSearch.val() || ''
        };
      }
    });
    iNet.ui.exchange.TopicList.superclass.constructor.call(this);
    this.$toolbar.CREATED.on('click', function () {
      _this.fireEvent(_this.getEvent('create'), _this);
    });
    this.getGrid().on('click', function (record) {
      _this.fireEvent(_this.getEvent('open'), record, _this);
    });
  };
  iNet.extend(iNet.ui.exchange.TopicList, iNet.ui.ListAbstract);
});
