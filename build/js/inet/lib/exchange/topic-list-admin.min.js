/**
 * #PACKAGE: exchange
 * #MODULE: topic-list-admin
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 11:29 28/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListAdmin.js
 */
$(function () {
  /**
   * @class iNet.ui.exchange.TopicListAdmin
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.exchange.TopicListAdmin');
  iNet.ui.exchange.TopicListAdmin = function (options) {
    var _this = this, config = options || {};
    iNet.apply(this, config);
    this.id = 'wg-list-topic-admin';
    this.gridID = 'grid-topic-admin';
    this.module = 'topic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.remote = false;
    this.firstLoad = false;
    this.url = {
      list: iNet.getPUrl('onl/exch/topic/ad/list'),
      save: iNet.getPUrl('onl/exch/topic/ad/save'),
      _delete: iNet.getPUrl('onl/exch/topic/ad/delete')
    };
    this.$btn = {
      BACK: $('#content-btn-back-admin'),
      CREATED: $('#list-topic-admin-btn-create')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'username',
          label: _this.getText('name_admin'),
          type: 'text',
          sortable: true,
          width: 130,
          validate: function (v) {
            if (iNet.isEmpty(v)) {
              return _this.getText('validate_name');
            }
            else if (!iNet.isEmail(v)) {
              return _this.getText('validate_regex');
            }
          }
        }, {
          property: 'fullname',
          label: _this.getText('fullname_admin'),
          type: 'text',
          sortable: true,
          validate: function (v) {
            if (iNet.isEmpty(v)) {
              return _this.getText('validate_fullname');
            }
          }
        }, {
          label: '',
          type: 'action',
          align: 'center',
          buttons: [{
            text: _this.getText('edit', 'link'),
            icon: 'icon-pencil',
            labelCls: 'label label-info',
            fn: function (record) {
              _this.edit(record);
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
              dialog.setOptions({
                uuid: record.uuid,
                topic: _this.getTopicId()
              });
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

    iNet.ui.exchange.TopicListAdmin.superclass.constructor.call(this);
    this.$btn.BACK.on('click', function () {
      _this.setTopicId(null);
      _this.hide();
      _this.fireEvent(_this.getEvent('back_list'), _this);
    });

    this.$btn.CREATED.on('click', function () {
      _this.newRecord();
    });

    this.getGrid().on('save', function (data) {
      data.topic = _this.getTopicId();
      $.postJSON(_this.url.save, data, function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('create', 'link'), _this.getText('create_error', 'link'));
        else {
          _this.insert(result);
          _this.reload();
          _this.success(_this.getText('create', 'link'), _this.getText('create_success', 'link'));
        }
      });
    });
    this.getGrid().on('update', function (newData, oldData) {
      $.postJSON(_this.url.save, $.extend({
        topic: _this.getTopicId(),
        uuid: oldData.uuid
      }, oldData, newData), function (result) {
        if (result.type === 'ERROR')
          _this.error(_this.getText('update', 'link'), _this.getText('update_error', 'link'));
        else {
          _this.update(result);
          _this.reload();
          _this.success(_this.getText('update', 'link'), _this.getText('update_success', 'link'));
        }
      });
    })
  };
  iNet.extend(iNet.ui.exchange.TopicListAdmin, iNet.ui.ListAbstract, {
    setTopicId: function (topicId) {
      this.topicId = topicId;
    },
    getTopicId: function () {
      return this.topicId;
    },
    loadList: function () {
      this.setParams({
        topic: this.getTopicId()
      });
      this.load();
    }
  });
});
