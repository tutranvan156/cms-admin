/**
 * #PACKAGE: author
 * #MODULE: asset-video
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 14:51 25/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file AssetVideo.js
 */
$(function () {
  /**
   * @class iNet.ui.author.AssetVideo
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.author.AssetVideo');
  iNet.ui.author.AssetVideo = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'list-video-wg';
    this.gridID = 'list-video';
    this.remote = true;
    this.loading = null;
    this.firstLoad = false;
    this.module = 'media';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

    this.url = {
      list: iNet.getPUrl('cms/asset/list')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'link',
        label: 'Ảnh đại diện',
        type: 'text',
        renderer: function (v) {
          if (v) {
            return '<img width="50" src="' + v + '"/>';
          } else {
            return '<span class="label label-danger">Chưa có ảnh</span>'
          }
        },
        width: 150
      }, {
        property: 'description',
        label: 'Mô tả',
        type: 'text',
        sortable: true
      }, {
        property: 'brief',
        label: 'Tên',
        type: 'text',
        sortable: true,
        renderer: function (v) {
          return '<span>' + v + '</span>';
        }
      }, {
        property: 'size',
        label: 'Dung lượng',
        type: 'text',
        sortable: true,
        width: 150,
        renderer: function (v) {
          return FileUtils.getSize(v);
        }
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
          text: _this.getText('delete', 'link'),
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
        }, {
          text: _this.getText('edit', 'link'),
          icon: 'icon-edit',
          labelCls: 'label label-primary',
          fn: function (record) {
            _this.fireEvent('edit_video', record);
          }
        }]
      }],
      delay: 250
    });

    this.basicSearch = function () {
      this.id = 'list-video-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.btnUpload = this.getEl().find('#btn-video-upload');
        this.inputUpload = this.getEl().find('#inp-video-upload');
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
          type: CMSConfig.ASSET_TYPE_VIDEO,
          category: _this.getFolder(),
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keyword: this.inputSearch.val() || '',
          order: '-created'
        };
      }
    });

    iNet.ui.author.AssetVideo.superclass.constructor.call(this);
  };

  iNet.extend(iNet.ui.author.AssetVideo, iNet.ui.ListAbstract, {
    setFolder: function (folder) {
      this.folder = folder;
      this.setParams({
        type: CMSConfig.ASSET_TYPE_VIDEO,
        pageSize: CMSConfig.PAGE_SIZE,
        pageNumber: 0,
        category: folder,
        order: '-created'
      });
    },
    getFolder: function () {
      return this.folder;
    },
    upload: function (file) {
      var _this = this;
      this.loading = new iNet.ui.form.LoadingItem({
        maskBody: $(String.format('#{0}', this.id)),
        msg: 'Đang tải video ...'
      });

      upload(file, {
        params: {
          type: CMSConfig.ASSET_TYPE_VIDEO,
          category: this.getFolder()
        },
        callback: function (result) {
          if (result.type !== CMSConfig.TYPE_ERROR) {
            var elements = result.elements || [];
            if (elements.length > 0) {
              _this.insert(elements[0]);
            }
          } else {
          }
          _this.loading.destroy();
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
