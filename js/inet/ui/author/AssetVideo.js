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
    this.firstLoad = false;
    this.module = 'video';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

    this.url = {
      list: iNet.getPUrl('cms/asset/list')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'description',
        label: 'Mô tả',
        type: 'text',
        sortable: true
      },{
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
        property: 'created',
        label: 'Ngày tải lên',
        type: 'text',
        sortable: true,
        width: 120,
        renderer: function (v) {
          return new Date(v).format(iNet.dateFormat);
        }
      },{
        property: 'position',
        label: 'Thứ tự',
        type: 'text',
        sortable: true
      },  {
        label: '',
        type: 'action',
        align: 'center',
        buttons: [{
          text: _this.getText('delete', 'link'),
          icon: 'icon-trash',
          labelCls: 'label label-danger'
          // fn: function (record) {
          //   var dialog = _this.confirmDlg(_this.getText('title_delete'), _this.getText('question_remove'), function () {
          //     rowRemove(dialog.getData(), record, this);
          //   });
          //   dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete'));
          //   dialog.show();
          //   dialog.setData({uuid: record.uuid});
          // }
        }, {
          text: 'Sửa',
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
          keyword: this.inputSearch.val() || ''
        };
      }
    });

    iNet.ui.author.AssetVideo.superclass.constructor.call(this);
  };

  iNet.extend(iNet.ui.author.AssetVideo, iNet.ui.ViewWidget, {
    setFolder: function (folder) {
      this.folder = folder;
      this.setParams({
        type: CMSConfig.ASSET_TYPE_VIDEO,
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
          type: CMSConfig.ASSET_TYPE_VIDEO,
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
