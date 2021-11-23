// #PACKAGE: utils
// #MODULE: cms
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file CMSUtils
 * @author nbchicong
 */
var CMSAsset = null;
var CMSUploader = null;
var CMSUtils = {
  isEmail: function (value) {
    var pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return pattern.test(value);
  },
  isLink: function (value) {
    var pattern = new RegExp('^((news|(ht|f)tp(s?)):\\/\\/)' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return pattern.test(value);
  },
  isObjectId: function (value) {
    if (value) {
      var len = value.length;
      if (len != 24)
        return false;
      else {
        for(var i = 0; i < len; ++i) {
          var c = value.charAt(i);
          if ((c < '0' || c > '9') && (c < 'a' || c > 'f') && (c < 'A' || c > 'F'))
            return false;
        }
        return true;
      }
    }
    return false;
  },
  getStaticPath: function () {
    return iNet.staticUrl;
  },
  // Get path save image file
  getImagePath: function (imagePath, size) {
    var url = this.getStaticPath() + 'images/';
    if (size)
      url += size + '/';
    return url + imagePath;
  },

  // Get path save file
  getFilePath: function (filePath) {
    return this.getStaticPath() + 'documents/' + filePath;
  },
  getMediaPath: function (file, isFile) {
    isFile = isFile || false;
    if (file) {
      var url = iNet.path + '/' + iNet.firmPrefix + '/cms/asset/' + (isFile ? 'download' : 'photoview') + iNet.extension;
      return url + '?code=' + file.code;
    }
    console.warn('#CMSAdmin > Media file is missed!');
    return null;
  },
  convertWebData: function (data) {
    var __data = data || [];
    return {total: iNet.getSize(__data), items: __data};
  },
  convert2Tree: function (flatData, parentKey, rootValue) {
    var parentIdKey = parentKey || 'parentId';
    var root = rootValue || 'ROOT';
    /**
     * Convert flat data to tree data
     * @param {Array} data
     * @returns {Array}
     */
    function convert2Tree(data) {
      var treeData = [];
      if (data && data.length > 0) {
        var children = [];
        data.forEach(function (item) {
          if (item[parentIdKey]) {
            if (!item.childrens) {
              item.childrens = [];
            }

            if (item[parentIdKey] === root) {
              treeData.push(item);
            }
            else {
              children.push(item);
            }
          }
        });
        convertChildren(children, treeData);
      }
      return treeData;
    }

    /**
     * Find a node in tree data
     * @param {String} id
     * @param {Array} data
     * @returns {Object|*}
     */
    function findNode(id, data) {
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.uuid === id)
          return item;
      }
      return null;
    }

    /**
     * Convert and put Children to tree data
     * @param {Array} data
     * @param {Array} parents
     */
    function convertChildren(data, parents) {
      var temp = [];
      for (var i = 0; i < (data || []).length; i++) {
        var item = data[i];
        if (item[parentIdKey]) {
          var parentId = item[parentIdKey];
          var parent = findNode(parentId, parents);
          if (parent) {
            parent.childrens.push(item);
          }
          else {
            temp.push(item);
          }
        }
      }
      if (temp.length > 0) {
        for (i = 0; i < parents.length; i++) {
          convertChildren(temp, parents[i].childrens);
        }
      }
    }

    return convert2Tree(flatData);
  },
  loadCategory: function (callback) {
    var __fn = callback || iNet.emptyFn;
    $.postJSON(iNet.getUrl('cms/category/list'), {}, function (json) {
      var __results = json || {};
      var __data = [];
      for (var i = 0; i < __results.items.length; i++) {
        var __item = __results.items[i];
        if (__item.group !== __item.name) {
          __data.push(__item);
        }
      }
      __fn(this.convertWebData(__data));
    });
  },
  loadGroup: function (callback) {
    var __fn = callback || iNet.emptyFn;
    $.postJSON(iNet.getPUrl('cms/category/list'), {}, function (json) {
      var __results = json || {};
      var __data = [];
      for (var i = 0; i < __results.items.length; i++) {
        var __item = __results.items[i];
        if (__item.group === __item.name) {
          __data.push(__item);
        }
      }
      __fn(this.convertWebData(__data));
    });
  },
  getColorByStatus: function (status) {
    switch (status.toLowerCase()) {
      case 'created':
        return 'color-green';
      case 'published':
        return 'color-blue';
      case 'internal':
        return 'color-blue';
      default:
        return 'color-dark-orange';
    }
  },
  getLabelBySiteStatus: function (status) {
    var __status = status || 'design';
    switch (__status.toLowerCase()) {
      case 'design':
        return String.format('<span class="label label-warning label-form-control action">{0}</span>', __status.toUpperCase());
      case 'published':
        return String.format('<span class="label label-success label-form-control action">{0}</span>', __status.toUpperCase());
      default:
        String.format('<span class="label label-success label-form-control action">{0}</span>', 'created'.toUpperCase());
    }
  },
  loadMedia: function (type, multiple, callback) {
    var __callback = callback || iNet.emptyFn();
    var __type = type || 'IMAGE';
    var __multiple = multiple || false;
    if (!CMSAsset) {
      CMSAsset = new iNet.ui.author.AssetManager({isSelect: true});
      CMSAsset.on('back', function () {
        CMSAsset.hideModal();
      });
    }
    CMSAsset.on('selected', function (data) {
      var __data = data || [];
      if (__data.length > 0) {
        __callback(__data);
      }
      CMSAsset.hideModal();
    });
    CMSAsset.showMediaLib(__type, __multiple);
  },
  loadUploader: function (type, multiple, accept, callback) {
    var __callback = callback || iNet.emptyFn();
    var __type = type || CMSConfig.ASSET_TYPE_IMAGE;
    var __multiple = multiple || false;
    var __accept = accept || '';
    if (!CMSUploader) {
      CMSUploader = new iNet.ui.author.AssetQuickUploader({type: __type});
    }
    CMSUploader.on('uploaded', function (src, data) {
      var __src = src || '';
      var __data = data || {};
      if (__data.length > 0) {
        __callback(__src, __data);
      }
    });
    CMSUploader.quickUpload(__type, __multiple, __accept);
  },
  getRGBByHex: function (hexColor) {
    var __tmpArr = hexColor.split('#');
    var __hexCode = iNet.getSize(__tmpArr) > 1 ? __tmpArr[1] : __tmpArr[0];
    var __fCode = parseInt(__hexCode.substr(0, 2), 16);
    var __sCode = parseInt(__hexCode.substr(2, 2), 16);
    var __lCode = parseInt(__hexCode.substr(4, 2), 16);
    return 'rgb(' + __fCode + ', ' + __sCode + ', ' + __lCode + ')';
  },
  getRGBAByHex: function (hexColor, percent) {
    var __tmpArr = hexColor.split('#');
    var __hexCode = iNet.getSize(__tmpArr) > 1 ? __tmpArr[1] : __tmpArr[0];
    var __fCode = parseInt(__hexCode.substr(0, 2), 16);
    var __sCode = parseInt(__hexCode.substr(2, 2), 16);
    var __lCode = parseInt(__hexCode.substr(4, 2), 16);
    return 'rgba(' + __fCode + ', ' + __sCode + ', ' + __lCode + ', ' + Math.round(percent) / 100 + ')';
  },
  checkApplicationByName: function (module) {
    var siteInfo = iNet.getLayout().SITE;
    if (siteInfo.theme && siteInfo.theme === module) {
      return true;
    } else if (siteInfo.application && siteInfo.application.length > 0) {
      for (var i = 0; i < siteInfo.application.length; i++) {
        if (siteInfo.application[i].theme === module) {
          return true;
        }
      }
    }
    return false;
  }
};

(function ($) {
  $.unlink = function (el) {
    var $el = $(el);
    var link = $el.find('a');
    var linkStore = new iNet.ui.CMSHashStore();
    linkStore.setType('link');
    for (var i=0; i<link.length; i++) {
      var id = iNet.generateUUID(),
          $item = $(link[i]);
      linkStore.setItem({id: id, value: $item.attr('href')});
      $item.attr('href', 'javascript:;').attr('data-linkid', id);
    }
    return linkStore;
  };
  $.relink = function (el, store) {
    var $el = $(el);
    var link = $el.find('a');
    for (var i=0; i<link.length; i++) {
      var $item = $(link[i]);
      var href = store.getItem(String.format(store.getFormatID(), store.getType(), $item.data('linkid')));
      $item.attr('href', href).removeAttr('data-linkid');
    }
  };
  $.submitData = function (data, index) {
    index = index || 0;
    var __default = {
      url: '',
      params: {},
      method: 'POST',
      callback: iNet.emptyFn,
      onProgress: iNet.emptyFn,
      onComplete: iNet.emptyFn,
      onError: iNet.emptyFn
    };
    var __options = $.extend(__default, data);
    var httpRequest;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
      try {
        httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
      }
    }
    if (!httpRequest) {
      return false;
    }
    var updateProgress = function (e){
      if (e.lengthComputable) {
        __options.onProgress(e.loaded*100/e.total, index);
      } else {
        __options.onProgress(e.position*100/e.totalSize, index);
      }
    };
    var transferComplete = function (e) {
      __options.onComplete(e, index);
    };
    var transferFailed = function (e) {
      __options.onError(e, index);
    };
    var transferCanceled = function (e) {
      //console.log('cancel - ', e);
    };
    httpRequest.upload.onprogress = updateProgress;
    httpRequest.upload.onload = transferComplete;
    httpRequest.upload.onerror = transferFailed;
    //httpRequest.addEventListener("progress", updateProgress, false);
    //httpRequest.addEventListener("load", transferComplete, false);
    //httpRequest.addEventListener("error", transferFailed, false);
    //httpRequest.addEventListener("abort", transferCanceled, false);
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          __options.callback(JSON.parse(httpRequest.responseText), index);
        } else {
        }
      }
    };
    httpRequest.open(__options.method || 'POST', __options.url, true);
    httpRequest.send(__options.params || {});
    return httpRequest;
  }
})(jQuery);
