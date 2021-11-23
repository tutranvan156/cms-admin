/**
 * #PACKAGE: author
 * #MODULE: cms-fqa-category
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 11:04 25/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file FQACategory.js
 */
$(function () {
  /**
   * @class iNet.ui.author.FQACategory
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.author.FQACategory');
  iNet.ui.author.FQACategory = function (options) {
    var _this = this, config = options || {};
    iNet.apply(this, config);
    this.id = 'wg-list';
    this.module = 'fqa';
    this.remote = true;
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.group = this.group || CMSConfig.GROUP_FQA;
    this.params = this.params || {group: this.group};
    this.arrGroup = [];
    this.url = {
      list: iNet.getPUrl('fqa/cate/list'),
      save: iNet.getPUrl('fqa/cate/save'),
      _delete: iNet.getPUrl('fqa/cate/delete'),
      group: iNet.getPUrl('fqa/cate/group')
    };
    // this.dropDown={
    //   select:$('#selected-type-fqa')
    // };
    this.$btn = {
      CREATED: $('#list-btn-create')
    };

    // _this.dropDown.select.append(optionSelect);
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'name',
          label: _this.getText('name'),
          type: 'text',
          sortable: true,
          validate: function (v) {
            if (iNet.isEmpty(v)) {
              return String.format(iNet.resources.message.field_not_empty, 'NAME');
            }
          }
        },
        // {
        //   property: 'group',
        //   label: _this.getText('group'),
        //   type: 'typeahead',
        //   editData: _this.arrGroup,
        //   sortable: true,
        //   width: 130
        // },
        {
          property: 'created',
          label: _this.getText('date', 'link'),
          type: 'label',
          sortable: true,
          width: 100,
          renderer: function (value) {
            var val = new Date(value);
            return val.format('d/m/Y');
          }
        },
        {
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
      this.id = 'list-basic-search-fqa';
    };
    iNet.extend(this.basicSearch, iNet.Component, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.inputSearch = $('.grid-search-input');
        this.selectType = $('#selected-type-fqa');
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
          pageSize: 10,
          pageNumber: 0,
          keyword: this.inputSearch.val() || '',
          group: _this.group || CMSConfig.GROUP_FQA
        };
      }
    });
    iNet.ui.author.FQACategory.superclass.constructor.call(this);
    this.$btn.CREATED.on('click', function () {
      _this.newRecord();
    });
    this.getGrid().on('save', function (data) {
      data.group = _this.group;
      $.postJSON(_this.url.save, data, function (result) {
        if (result.success === false)
          _this.error(_this.getText('create', 'link'), _this.getText('create_error', 'link'));
        else {
          _this.insert(result.data);
          _this.reload();
          _this.success(_this.getText('create', 'link'), _this.getText('create_success', 'link'));
        }
      });
    });
    this.getGrid().on('update', function (newData, oldData) {
      newData.group = _this.group;
      $.postJSON(_this.url.save, $.extend({}, oldData, newData), function (result) {
        if (result.success === false)
          _this.error(_this.getText('update', 'link'), _this.getText('update_error', 'link'));
        else {
          _this.update(result.data);
          _this.success(_this.getText('update', 'link'), _this.getText('update_success', 'link'));
        }
      });
    });
  };
  iNet.extend(iNet.ui.author.FQACategory, iNet.ui.ListAbstract);

  var groupRef = typeof group === 'undefined' ? CMSConfig.GROUP_FQA : group;
  new iNet.ui.author.FQACategory({group: groupRef});
});
