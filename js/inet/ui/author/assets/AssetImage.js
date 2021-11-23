/**
 * #PACKAGE: inet-ui
 * #MODULE: AssetImage
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 17:47 04/09/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file AssetImage.js
 */
$(function () {
  /**
   * @class iNet.ui.author.AssetImage
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.author.AssetImage');
  iNet.ui.author.AssetImage = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'asset-images';
    this.itemTpl = this.itemTpl || 'image-item-tpl';
    this.seleted = '';
    this.submiter = {};
    this.store = new Hashtable();
    this.previews = new Hashtable();
    this.files = new Hashtable();

    this.toolbar = {
      UPLOAD: $('#asset-images-upload'),
      BACK: $('#asset-images-back'),
      SELECT: $('#asset-images-select')
    };

    this.folder = new iNet.ui.author.AssetFolder();

    iNet.ui.author.AssetImage.superclass.constructor.call(this);

    this.init();
    this.getEl().on('change', function () {
      _this.seleted = this.value;
      _this.checkSelected();
      _this.fireEvent('change', this.value);
    });

    this.folder.on('change', function () {

    });

    if (this.firstLoad) {
      this.loadByType(null);
    }
  };
  iNet.extend(iNet.ui.author.AssetImage, iNet.ui.WidgetExt, {
    init: function () {
      if (this.getEl().length <= 0) {
        throw new Error('#Asset Image > Element is not found with id {' + this.getId() +'}!');
      }
    },
    getId: function () {
      return this.id;
    },
    getEl: function () {
      return $('#' + this.getId());
    },
    getMask: function () {
      return $('body');
    },
    setStore: function (data) {
      this.store = data;
    },
    getStore: function () {
      return this.store;
    },
    getType: function () {
      return CMSConfig.ASSET_TYPE_IMAGE;
    },
    setFolder: function(folder) {
      this.folder = folder;
    },
    getFolder: function() {
      return this.folder;
    },
    load: function (folder) {
      var _this = this;
      this.setFolder(folder);
      AssetAPI.list({
        type: CMSConfig.ASSET_TYPE_IMAGE,
        category: folder,
        order: '-created'
      }, function (results) {
        if (results.type !== CMSConfig.TYPE_ERROR) {
          _this.render(results.items || []);
        }
      });
    },
    render: function (items) {
      var _this = this;
      (items || []).forEach(function (item) {
        push(item, _this.getStore());
        this.renderItem(item);
      });
    },
    renderItem: function (item) {
      this.getEl().append(iNet.Template.parse(this.itemTpl, item));
    },
    /**
     * @param {Array} files
     */
    preUpload: function (files) {
      var _this = this;
      readFiles(0, files, function (data) {
        push(data, _this.getStore());
        _this.getEl().append(iNet.Template.parse(_this.itemTpl, data));
      });
    },
    upload: function () {
      if (this.files.length > 0) {
        this.preUpload(this.files.values());
        var _this = this;
        var idx = 0;
        uploadSingle(idx, this.files, this.submiter, {
          callback: function (result) {
            idx++;
            if (result.type !== CMSConfig.TYPE_ERROR) {
              var elements = result.elements || [];
              if (elements.length > 0) {
                _this.renderItem(elements[0]);
              }
            }
          },
          onProgress: function (value) {
            getProgressElByIndex(idx).css({width: String.format("{0}%", value)});
          },
          onComplete: function (e) {
          },
          onError: function (e) {
          }
        }, {type: CMSConfig.ASSET_TYPE_IMAGE});
      }
    }
  });

  /**
   * @param {Number} index
   * @param {Array} files
   * @param {Function} callback
   */
  function readFiles(index, files, callback) {
    var reader = new FileReader();
    reader.onload = function() {
      callback && callback(renderPreviewData(index, reader.result));
      readFiles(index++, files, callback);
    };
    reader.readAsDataURL(files[index]);
  }

  /**
   * @param {Number} index
   * @param {FileList} files
   * @param {Object} requests
   * @param {Object} options
   */
  function uploadSingle(index, files, requests, options) {
    var file = files[index];
    if (file) {
      var fd = new FormData();
      fd.append(file.filename, file);
      for (var key in options.params) {
        if (options.params.hasOwnProperty(key)) {
          fd.append(key, options.params[key]);
        }
      }
      requests[getRequestByIndex(index)] = AssetAPI.upload(fd, function (result) {
        options.callback(result);
        uploadSingle(index++, files, requests, options);
      }, options);
    }
  }

  function renderPreviewData(index, data) {
    return {
      id: iNet.generateId(),
      src: data,
      index: index
    }
  }

  /**
   * @param {Number} index
   * @returns {string}
   */
  function getRequestByIndex(index) {
    return 'upload-request-' + index;
  }

  /**
   * @param {Number} index
   * @returns {jQuery|HTMLElement}
   */
  function getProgressElByIndex(index) {
    return $('#upload-progress-' + index);
  }

  /**
   * @param {Array} items
   * @param {Hashtable} store
   */
  function pushAll(items, store) {
    items.forEach(function (item) {
      if (!item.id) {
        item.id = item.uuid;
      }
      push(item, store);
    });
  }

  /**
   * @param {Object} item
   * @param {Hashtable} store
   */
  function push(item, store) {
    if (!item.id) {
      item.id = item.uuid;
    }
    pop(item, store);
    store.put(item.id, item);
  }

  /**
   * @param {Object} item
   * @param {Hashtable} store
   */
  function pop(item, store) {
    if (!item.id) {
      item.id = item.uuid;
    }
    if (contains(item, store)) {
      store.remove(item.id);
    }
  }

  /**
   * @param {String} key
   * @param {Hashtable} store
   */
  function get(key, store) {
    return store.get(key);
  }

  /**
   * @param {Object} item
   * @param {Hashtable} store
   */
  function contains(item, store) {
    if (!item.id) {
      item.id = item.uuid;
    }
    return store.containsKey(item.id);
  }
});