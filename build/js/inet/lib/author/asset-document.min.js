/**
 * #PACKAGE: author
 * #MODULE: asset-document
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:13 01/11/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file AssetDocument.js
 */
$(function () {
  /**
   * @class iNet.ui.author.AssetDocument
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.author.AssetDocument');
  iNet.ui.author.AssetDocument = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'list-document-wg';
    this.gridID = 'list-document';
    this.remote = true;
    this.firstLoad = false;
    this.module = 'media';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

    this.url = {
      list: iNet.getPUrl('cms/asset/list'),
      view: iNet.getPUrl('cms/asset/download')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'description',
        label: 'Mô tả',
        type: 'text',
        sortable: true
      }, {
        property: 'brief',
        label: 'Tên',
        type: 'text',
        sortable: true
      }, {
        property: 'size',
        label: 'Dung lượng',
        type: 'text',
        sortable: true,
        width: 220,
        renderer: function (v) {
          return FileUtils.getSize(v);
        }
      }, {
        property: 'position',
        label: 'Thứ tự',
        type: 'text',
        sortable: true
      }, {
        property: 'created',
        label: 'Ngày tải lên',
        type: 'text',
        sortable: true,
        width: 120,
        renderer: function (v) {
          return new Date(v).format(iNet.dateFormat);
        }
      }, {
        label: '',
        type: 'action',
        align: 'center',
        buttons: [{
          text: _this.getText('delete_file'),
          icon: 'icon-trash',
          labelCls: 'label label-danger',
          fn: function (record) {
            var dialog = _this.confirmDlg(_this.getText('delete_file'), _this.getText('confirm_del_file'), function () {
              AssetAPI.remove(dialog.getData(), function (result) {
                if (result.type !== CMSConfig.TYPE_ERROR) {
                  _this.success(_this.getText('delete_file'), _this.getText('del_file_success'));
                  _this.removeRecord(result);
                } else {
                  _this.error(_this.getText('delete_file'), _this.getText('del_file_unsuccess'));
                }
              });
              this.hide();
            });
            dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('delete_file'));
            dialog.show();
            dialog.setData({uuid: record.uuid, folder: record.folder, file: 1});
          }
        },
          {
            text: _this.getText('edit', 'link'),
            icon: 'icon-edit',
            labelCls: 'label label-primary',
            fn: function (record) {
              _this.fireEvent('edit_document', record);
            }
          },
          {
            text: 'Xem file',
            icon: 'fa fa-eye',
            labelCls: 'label label-success',
            fn: function (record) {
              window.open(_this.url.view + '?code=' + record.code +'&view=true');
            },
            visibled: function (record) {
              return checkPdfFile(record.brief);
            }
          }]
      }],
      delay: 250
    });

    function checkPdfFile(name) {
      var file_type = name.substr(name.lastIndexOf('.')).toLowerCase();
      if (file_type === '.pdf') {
        return true;
      }
      return false;
    }

    this.basicSearch = function () {
      this.id = 'list-document-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.btnUpload = this.getEl().find('#btn-document-upload');
        this.inputUpload = this.getEl().find('#inp-document-upload');
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.$btnSearch = this.getEl().find('.grid-search-btn');
        this.btnUpload.on('click', function () {
          search.inputUpload.trigger('click');
        });
        this.inputUpload.on('change', function () {
          _this.upload(this.files[0]);
        });
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          type: CMSConfig.ASSET_TYPE_DOCUMENT,
          category: _this.getFolder(),
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.inputSearch.val() || ''
        };
      }
    });

    iNet.ui.author.AssetDocument.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.author.AssetDocument, iNet.ui.ListAbstract, {
    setFolder: function (folder) {
      this.folder = folder;
      this.setParams({
        type: CMSConfig.ASSET_TYPE_DOCUMENT,
        pageSize: CMSConfig.PAGE_SIZE,
        pageNumber: 0,
        category: folder
      });
    },
    getFolder: function () {
      return this.folder;
    },
    upload: function (file) {
      var _this = this;
      upload(file, {
        params: {
          type: CMSConfig.ASSET_TYPE_DOCUMENT,
          category: this.getFolder()
        },
        callback: function (result) {
          if (result.type !== CMSConfig.TYPE_ERROR) {
            var elements = result.elements || [];
            if (elements.length > 0) {
              _this.insert(elements[0]);
            }
          }
        },
        onProgress: function (v) {
          console.log(v);
        }
      })
    }
  });

  function upload(file, options) {
    var fd = new FormData();
    fd.append(file.name, file);
    for (var key in options.params) {
      fd.append(key, options.params[key]);
    }
    options.url = iNet.getPUrl('cms/asset/upload');
    options.params = fd;
    options.method = 'POST';
    return $.submitData(options);
  }
});