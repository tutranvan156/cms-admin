/**
 * #PACKAGE: admin
 * #MODULE: content-plugin
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:29 21/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ContentPlugin.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ContentPlugin
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.ContentPlugin');
  iNet.ui.admin.ContentPlugin = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'wg-content-plugin';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.module = 'layout';
    this.gridID = 'list-content-plugin';
    this.firstLoad = false;
    this.remote = false;
    this.categoryModal = null;
    this.url = {
      update: iNet.getPUrl('cms/plugindynamic/change'),
      load_plugin: iNet.getPUrl('cms/plugindynamic/load'),
      list_category: iNet.getPUrl('cms/category/list')
    };
    this.dataAsset = {
      cateCMS: [],
      imgCMS: [],
      menuCMS: [],
      videoCMS: [],
      fileCMS: []
    };
    this.$key = {
      cateCMS: 'Nội dung thể loại bài viết',
      imgCMS: 'Nội dung thư mục hình ảnh',
      menuCMS: 'Nội dung danh sách menu',
      videoCMS: 'Nội dung thư mục video',
      fileCMS: 'Nội dung thư mục tập tin'
    };
    this.$toolbar = {
      BACK: $('#content-plugin-btn-back')
    };
    this.initGrid = function () {
      _this.dataSource = new iNet.ui.grid.DataSource({
        columns: [
          {
            property: 'name',
            label: 'Tên thư mục',
            type: 'text',
            sortable: true
          }, {
            property: 'items',
            label: 'Danh mục',
            type: 'text',
            sortable: true,
            renderer: function (v, record) {
              console.log("v: ", v);
              console.log("record: ", record);
              if (v.length !== 0 && record.type !== PluginKey.menuCMS) {
                var text = '<ul class="list-default no-margin-bottom">';
                v.forEach(function (value) {
                  text += '<li>' + value.name + '' +
                      '<span data-uuid="' + value.uuid + '" data-type="' + record.type + '" class="item-content label label-danger pull-right">' +
                      '<i class="fa fa-trash" aria-hidden="true"></i>' +
                      '</span>' +
                      '</li>';
                });
                text += '</ul>';
                return text;
              } else if (v.length !== 0 && record.type === PluginKey.menuCMS) {
                var tree = _this.unflatten(v);
                var sub = _this.renderTreeMenu(tree, record);
                return sub[0].outerHTML;
              }

              return '<span class="label label-danger">Chưa có nội dung nào được chọn</span>';
            }
          }, {
            label: '',
            type: 'action',
            width: 60,
            align: 'center',
            buttons: [{
              text: iNet.resources.message.button.edit,
              icon: 'fa fa-edit',
              labelCls: 'label label-primary',
              fn: function (record) {
                var uuid = [];
                if (_this.dataAsset[record.type]) {
                  for (var i = 0; i < _this.dataAsset[record.type].length; i++) {
                    uuid.push(_this.dataAsset[record.type][i].uuid);
                  }
                }
                if (record.type === PluginKey.videoCMS) {
                  _this.fireEvent('add_content', _this, 'VIDEO', uuid);
                } else if (record.type === PluginKey.fileCMS) {
                  _this.fireEvent('add_content', _this, 'DOCUMENT', uuid);
                } else if (record.type === PluginKey.imgCMS) {
                  _this.fireEvent('add_content', _this, 'IMAGE', uuid);
                } else if (record.type === PluginKey.cateCMS) {
                  if (_this.getCategory().length === 0) {
                    _this.listCategory(function (data) {
                      if (data.type !== CMSConfig.TYPE_ERROR) {
                        _this.setCategory(data.items || []);
                        _this.initModalCategory(record);
                      }
                    });
                  } else {
                    _this.initModalCategory(record);
                  }
                } else if (record.type === PluginKey.menuCMS) {
                  _this.fireEvent('add_menu', _this, _this.dataAsset[record.type] || []);
                }
              }
            }]
          }
        ],
        delay: 250
      });
      _this.$grid = $(String.format('#{0}', this.gridID));
      var convertData = function (data) {
        console.log(">> data:", data);
        var plugin = data || {};
        console.log(">> plugin:", plugin);
        var items = [];
        var asset = plugin.asset || {};
        var dataAsset = plugin.assetData || [];
        _this.setAssetData(asset);
        var length = _this.getPluginType().length;
        for (var i = 0; i < length; i++) {
          var key = _this.getPluginType()[i];
          var obj = {};
          if (_this.$key.hasOwnProperty(key)) {
            obj['name'] = _this.$key[key];
            _this.dataAsset[key] = dataAsset[key];
            obj['items'] = _this.dataAsset[key];
            obj['type'] = PluginKey[key];
            items.push(obj);
          }
        }
        return items;
      };
      _this.convertData = _this.convertData || convertData;


      iNet.ui.admin.BasicSearch = function () {
        this.url = _this.url.load_plugin;
        this.id = 'list-basic-content-search';
        iNet.ui.admin.BasicSearch.superclass.constructor.call(this);
      };
      iNet.extend(iNet.ui.admin.BasicSearch, iNet.ui.grid.AbstractSearchForm, {
        intComponent: function () {
          this.inputSearch = this.getEl().find('.grid-search-input');
          this.btnSearch = this.getEl().find('.grid-search-btn');
        },
        getId: function () {
          return this.id;
        },
        getUrl: function () {
          return _this.url.list;
        },
        getData: function () {
          return _this.getParams();
        }
      });

      _this.grid = new iNet.ui.grid.Grid({
        id: _this.$grid.prop('id'),
        url: _this.url.load_plugin,
        dataSource: _this.dataSource,
        basicSearch: iNet.ui.admin.BasicSearch,
        convertData: _this.convertData,
        stretchHeight: false,
        params: _this.getParams(),
        remotePaging: _this.remote,
        firstLoad: _this.firstLoad,
        editable: false,
        idProperty: 'uuid'
      });

      _this.grid.on('loaded', function () {

      });
      _this.grid.getEl().off('click', '.item-content').on('click', '.item-content', function () {

        removeContent($(this).attr('data-type'), $(this).attr('data-uuid'), $(this));
      });
    };

    iNet.ui.admin.ContentPlugin.superclass.constructor.call(this);

    this.$toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back_plugin', _this);
    });

    function removeContent(key, uuid, el) {
      var dialog = _this.confirmDlg(
          'Xóa thể loại bài viết',
          'Bạn có chắc chắn muốn xóa mục đã chọn?', function () {
            this.hide();
            el.parents('li:first').remove();
            var index = _this.dataAsset[key].findIndex(function (item) {
              return item.uuid === uuid;
            });
            if (index !== -1) {
              _this.dataAsset[key].splice(index, 1);
              _this.fireEvent('update', _this.dataAsset[key], key);
            }
          }
      );
      dialog.setTitle('<i class="fa fa-times-circle-o red"></i> Xóa thể loại');
      dialog.setData({});
      dialog.show();
    }

    this.on('update', function (data, type) {
      var categories = [];
      for (var i = 0; i < data.length; i++) {
        categories.push(data[i].uuid);
      }
      var params = {
        area: _this.getArea(),
        page: _this.getNamePage(),
        plugin: _this.getPlugin()
      };
      console.log("update: {}", categories);
      if(categories && categories.length > 0){
        params[type] = categories.join('|');
      } else
        params[type] = "remove";

          _this.updateCategoryPlugin(params, function (dataUpdate) {
        if (dataUpdate.type !== CMSConfig.TYPE_ERROR) {
          _this.grid.load();
        }
      });
    });
  };
  iNet.extend(iNet.ui.admin.ContentPlugin, iNet.ui.ViewWidget, {
    renderTreeMenu: function (tree, record) {
      if (!tree || !tree.length) {
        return;
      }
      var list = $('<ul class="list-default no-margin-bottom">');
      for (var i = 0; i < tree.length; i++) { // Don't use for..in for arrays
        var comment = tree[i];
        var item = $('<li>').text(comment.name);

        item.append(
            $('<span>')
                .attr('class', 'item-content label label-danger pull-right')
                .attr('data-uuid', comment.uuid)
                .attr('data-type', record.type)
                .append('<i class="fa fa-trash" aria-hidden="true"></i>'));
        list.append(item);
        var childrenList = this.renderTreeMenu(comment.children, record);
        if (childrenList) {
          item.append(childrenList);
        }
      }
      return list;
    },
    unflatten: function (data) {
      var tree = [],
          mappedArr = {},
          arrElem,
          mappedElem, attribute;
      for (var i = 0, len = data.length; i < len; i++) {
        arrElem = data[i];
        mappedArr[arrElem.uuid] = arrElem;
        mappedArr[arrElem.uuid]['children'] = [];
      }
      for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
          mappedElem = mappedArr[id];
          attribute = mappedElem.attribute || {};
          if (attribute['referenceParent'] && mappedArr[attribute['referenceParent']]) {
            mappedArr[attribute['referenceParent']]['children'].push(mappedElem);
          } else {
            tree.push(mappedElem);
          }
        }
      }
      return tree;
    },
    initModalCategory: function (record) {
      var _this = this;
      if (!this.categoryModal) {
        this.categoryModal = new iNet.ui.admin.ModalCategory();
      }
      this.categoryModal.setValue(this.dataAsset[record.type]);
      this.categoryModal.setCategory(this.getCategory());
      this.categoryModal.renderHtml();
      this.categoryModal.showModal();
      this.categoryModal.on('submit_category', function (category) {
        if (category.length !== 0) {
          _this.fireEvent('update', category, PluginKey.cateCMS);
        }
      });
    },
    setPluginType: function (types) {
      this.pluginTypes = types;
    },
    getPluginType: function () {
      return this.pluginTypes || [];
    },
    setPlugin: function (plugin) {
      this.plugin = plugin;
    },
    getPlugin: function () {
      return this.plugin;
    },
    setPage: function (page) {
      this.page = page;
    },
    getPage: function () {
      return this.page || '';
    },
    setArea: function (area) {
      this.area = area;
    },
    getArea: function () {
      return this.area || '';
    },
    setAssetData: function (asset) {
      this.asset = asset;
    },
    getAssetData: function () {
      return this.asset || {};
    },
    setCategory: function (category) {
      this.categories = category;
    },
    getCategory: function () {
      return this.categories || [];
    },
    setNamePage: function (name) {
      this.namePage = name;
    },
    getNamePage: function () {
      return this.namePage || '';
    },

    setDataTypeRow: function (data, type) {
      data.forEach(function (item) {
        item.type = type
      });
    },
    listCategory: function () {
      var _this = this;
      $.getJSON(this.url.list_category, {}, function (data) {
        if (data.type !== CMSConfig.TYPE_ERROR) {
          var items = data.items || [];
          _this.setCategory(items);
        }
      });
    },

    updateCategoryPlugin: function (params, callback) {
      $.postJSON(this.url.update, params, function (data) {
        callback && callback(data);
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.saving
      });
    },
    getParams: function () {
      return {
        plugin: this.getPlugin(),
        page: this.getNamePage(),
        area: this.getArea()
      }
    },
    loadPlugin: function () {
      this.initGrid();
      this.grid.load();
    }
  });
})
;
