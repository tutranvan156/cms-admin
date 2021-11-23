/**
 * #PACKAGE: admin
 * #MODULE: socioeconomic-data-category
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09:57 23/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file SocioeconomicDataCategory.js
 */
$(function () {
  var level = 0;
  /**
   * @class iNet.ui.admin.SocioeconomicDataCategory
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.SocioeconomicDataCategory');
  iNet.ui.admin.SocioeconomicDataCategory = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'socioeconomic-report-category-wg';
    this.gridID = 'category-list';
    this.remote = true;
    this.module = 'socioeconomic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.params = {category: 'ROOT'};
    this.parents = {0: 'ROOT'};
    this.url = {
      list: iNet.getPUrl('socioeconomic/category/search'),
      save: iNet.getPUrl('socioeconomic/category/save'),
      del: iNet.getPUrl('socioeconomic/category/remove')
    };
    this.$toolbar = {
      BACK: $('#btn-category-back'),
      CREATED: $('#btn-category-create')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'name',
        label: this.getText('cate_name'),
        type: 'text',
        validate: function (v) {
          if (!v) {
            return 'Bạn chưa nhập tên chuyên mục'
          }
        }
      }, {
        property: 'createdDate',
        label: this.getText('createdDate'),
        type: 'label',
        width: 120,
        renderer: function (v) {
          return new Date(v).format(iNet.dateFormat);
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.edit,
          icon: 'fa fa-pencil',
          labelCls: 'label label-info',
          fn: function (record) {
            _this.edit(record);
          }
        }, {
          text: 'Chuyên mục con',
          icon: 'fa fa-share-alt',
          fn: function (record) {
            _this.setParents(record.uuid);
            _this.setParams({
              category: record.uuid
            });
            _this.load();
          }
        }, {
          text: iNet.resources.message.button.del,
          icon: 'icon-trash',
          labelCls: 'label label-important',
          fn: function (record) {
            var dialog = _this.confirmDlg(
                _this.getText('title_delete'),
                _this.getText('question_delete'), function () {
                  rowRemove(dialog.getData(), record, this);
                }
            );
            dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete'));
            dialog.show();
            dialog.setData({uuid: record.uuid});
          },
          visibled: function () {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_ECONOMY);
          }
        }]
      }]
    });
    /**
     * @constructor
     * @class BasicSearch
     * @extends iNet.ui.grid.AbstractSearchForm
     */
    this.basicSearch = function () {
      this.id = 'list-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.AbstractSearchForm, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.$btnSearch = this.getEl().find('.grid-search-btn');
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          group: CMSConfig.GROUP_ECONOMY_DATA,
          category: 'ROOT',
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.inputSearch.val() || '',
          order: "-createdDate"
        };
      }
    });

    function rowRemove(params, record, _dialog) {
      _dialog.hide();
      remove(params, function (result) {
        if (result.type === CMSConfig.TYPE_ERROR)
          _this.error(_this.getText('title_delete'), _this.getText('delete_error'));
        else {
          _this.removeRecord(record);
          _this.success(_this.getText('title_delete'), _this.getText('delete_success'));
        }
      });
    }

    iNet.ui.admin.SocioeconomicDataCategory.superclass.constructor.call(this);

    this.$toolbar.CREATED.on('click', function () {
      _this.newRecord();
    });
    this.$toolbar.BACK.on('click', function () {
      delete _this.parents[(level--)];
      _this.setParams({category: _this.getParentId()});
      _this.load();
    });
    this.getGrid().on('save', function (record) {
      record.group = CMSConfig.GROUP_ECONOMY_DATA;
      record.parentId = _this.getParentId();
      save(record, function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR) {
          _this.insert(result);
          _this.success('Tạo mới', 'Tạo mới chuyên mục thành công');
        } else {
          _this.error('Tạo mới', 'Quá trình tạo mới chuyên mục xảy ra lỗi');
        }
      });
    });
    this.getGrid().on('update', function (record, oldData) {
      record.group = CMSConfig.GROUP_ECONOMY_DATA;
      record.parentId = _this.getParentId();
      save($.extend({}, oldData, record), function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR) {
          _this.update(result);
          _this.success('Cập nhật', 'Cập nhật chuyên mục thành công');
        } else {
          _this.error('Cập nhật', 'Quá trình cập nhật chuyên mục xảy ra lỗi');
        }
      });
    });
    this.getGrid().on('loaded', function () {
      FormUtils.showButton(_this.$toolbar.BACK, _this.getParentId() !== 'ROOT');
    });
  };
  iNet.extend(iNet.ui.admin.SocioeconomicDataCategory, iNet.ui.ListAbstract, {
    setParents: function (parentId) {
      this.parents[(++level)] = parentId;
    },
    getParents: function () {
      return this.parents;
    },
    getParentId: function () {
      return this.parents[level] || 'ROOT';
    }
  });

  function save(params, callback) {
    $.postJSON(iNet.getPUrl('socioeconomic/category/save'), params, function (results) {
      callback && callback(results);
    });
  }

  function remove(params, callback) {
    $.postJSON(iNet.getPUrl('socioeconomic/category/remove'), params, function (results) {
      callback && callback(results);
    });
  }

  new iNet.ui.admin.SocioeconomicDataCategory();
});