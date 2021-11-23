/**
 * #PACKAGE: author
 * #MODULE: asset-folder
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 16:50 04/09/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file AssetFolder.js
 */
$(function () {
  /**
   * @class iNet.ui.author.AssetFolder
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.author.AssetFolder');
  iNet.ui.author.AssetFolder = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'asset-folder';
    this.itemTpl = this.itemTpl || 'folder-item-tpl';
    this.firstLoad = this.firstLoad || false;
    this.folders = [];
    this.seleted = '';
    this.removeDlg = null;
    this.publishDlg = null;
    this.unpublishDlg = null;

    this.toolbar = {
      CREATE: $('#folder-btn-create'),
      REMOVE: $('#folder-btn-remove'),
      PUBLISHED: $('#folder-btn-published'),
      UNPUBLISHED: $('#folder-btn-unpublished')
    };

    this.modal = {
      el: $('#modal-folder'),
      name: $('#modal-folder-name'),
      save: $('#modal-folder-save')
    };

    iNet.ui.author.AssetFolder.superclass.constructor.call(this);

    this.toolbar.CREATE.on('click', function () {
      _this.modal.name.val('');
      _this.modal.el.modal('show');
    });

    this.toolbar.REMOVE.on('click', function () {
      if (!_this.removeDlg) {
        _this.removeDlg = new iNet.ui.dialog.ModalDialog({
          id: 'asset-folder-remove-dlg-' + iNet.generateId(),
          title: iNet.resources.cmsadmin.media.delete_folder,
          content: iNet.resources.cmsadmin.media.confirm_del_folder,
          buttons: [{
            text: iNet.resources.message.button.ok,
            cls: 'btn-primary',
            icon: 'icon-ok icon-white',
            fn: function () {
              this.hide();
              _this.remove(this.getData());
            }
          }, {
            text: iNet.resources.message.button.cancel,
            icon: 'icon-remove',
            fn: function () {
              this.hide();
            }
          }]
        });
      }
      _this.removeDlg.setData(_this.seleted);
      _this.removeDlg.show();
    });

    this.toolbar.PUBLISHED.on('click', function () {
      if (!_this.publishDlg) {
        _this.publishDlg = new iNet.ui.dialog.ModalDialog({
          id: 'asset-folder-publish-dlg-' + iNet.generateId(),
          title: iNet.resources.cmsadmin.media.publish_folder,
          buttons: [{
            text: iNet.resources.message.button.ok,
            cls: 'btn-primary',
            icon: 'icon-ok icon-white',
            fn: function () {
              this.hide();
              _this.publishFolder();
            }
          }, {
            text: iNet.resources.message.button.cancel,
            icon: 'icon-remove',
            fn: function () {
              this.hide();
            }
          }]
        });
      }
      _this.publishDlg.setContent(String.format(iNet.resources.cmsadmin.media.publish_folder_text, _this.seleted));
      _this.publishDlg.show();
    });

    this.toolbar.UNPUBLISHED.on('click', function () {
      if (!_this.unpublishDlg) {
        _this.unpublishDlg = new iNet.ui.dialog.ModalDialog({
          id: 'asset-folder-publish-dlg-' + iNet.generateId(),
          title: iNet.resources.cmsadmin.media.unpublish_folder,
          buttons: [{
            text: iNet.resources.message.button.ok,
            cls: 'btn-primary',
            icon: 'icon-ok icon-white',
            fn: function () {
              this.hide();
              _this.unpublishFolder();
            }
          }, {
            text: iNet.resources.message.button.cancel,
            icon: 'icon-remove',
            fn: function () {
              this.hide();
            }
          }]
        });
      }
      _this.unpublishDlg.setContent(String.format(iNet.resources.cmsadmin.media.unpublish_folder_text, _this.seleted));
      _this.unpublishDlg.show();
    });

    this.modal.save.on('click', function () {
      _this.create(_this.modal.name.val());
    });

    this.init();
    this.getEl().on('change', function () {
      _this.seleted = this.value;
      _this.checkSelected();
      _this.fireEvent('change', this.value);
    });

    if (this.firstLoad) {
      this.loadByType(null);
    }
  };
  iNet.extend(iNet.ui.author.AssetFolder, iNet.ui.CMSComponent, {
    constructor: iNet.ui.author.AssetFolder,
    init: function () {
      if (this.getEl().length <= 0) {
        throw new Error('#Asset Folder > Element is not found with id {' + this.getId() + '}!');
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
    setData: function (data) {
      this.data = data;
    },
    getData: function () {
      return this.data || [];
    },
    setType: function (type) {
      this.assetType = type;
    },
    getType: function () {
      return this.assetType || CMSConfig.ASSET_TYPE_IMAGE;
    },
    loadByType: function (type) {
      var _this = this;
      var assetType = type || CMSConfig.ASSET_TYPE_IMAGE;
      this.setType(assetType);
      AssetAPI.listFolder({type: assetType}, function (results) {
        if (results.type !== CMSConfig.TYPE_ERROR) {
          _this.setData(results.elements || []);
          _this.render();

          AssetAPI.listFolderPublished({type: assetType}, function (foldersPublished) {
            if (foldersPublished.type !== CMSConfig.TYPE_ERROR) {
              mapFolder(this.getData(), foldersPublished, this.folders);
              _this.checkSelected();
            }
          }, {
            mask: _this.getMask(),
            msg: iNet.resources.ajaxLoading.loading
          });
        }
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.loading
      });
    },
    render: function () {
      var _this = this;
      if (this.getData().length > 0) {
        this.seleted = this.getData()[0];
        for (var i = 0; i < this.getData(); i++) {
          this.getEl().append(iNet.Template.parse(_this.itemTpl, {value: this.getData()[i]}));
        }
      }
    },
    selectFirst: function () {
      this.seleted = this.getData()[0];
      this.checkSelected();
    },
    checkSelected: function () {
      FormUtils.showButton(this.toolbar.PUBLISHED, !checkPublished(this.seleted, this.folders));
      FormUtils.showButton(this.toolbar.UNPUBLISHED, checkPublished(this.seleted, this.folders));
    },
    create: function (folderName) {
      var _this = this;
      AssetAPI.createFolder({category: folderName, name: folderName, type: this.getType()}, function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR) {
          _this.seleted = result.name;
          insert(result.name, _this.folders, _this.getData());
          _this.checkSelected();
        }
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.saving
      });
    },
    remove: function (folderName) {
      var _this = this;
      AssetAPI.remove({category: folderName, type: this.getType(), file: 0}, function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR) {
          remove(result.name, _this.folders, _this.getData());
          _this.selectFirst();
        }
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.deleting
      });
    },
    publishFolder: function () {
      var _this = this;
      AssetAPI.publishedFolder({category: this.seleted, type: this.getType(), published: true}, function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR) {
          _this.seleted = result.name;
          published(result.name, true, _this.folders);
          _this.checkSelected();
        }
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.processing
      });
    },
    unpublishFolder: function () {
      var _this = this;
      AssetAPI.publishedFolder({category: this.seleted, type: this.getType(), published: false}, function (result) {
        if (result.type !== CMSConfig.TYPE_ERROR) {
          _this.seleted = result.name;
          published(result.name, false, _this.folders);
          _this.checkSelected();
        }
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.processing
      });
    }
  });

  /**
   * @param {Array} folders
   * @param {Array} foldersPublished
   * @param {Array} maps
   */
  function mapFolder(folders, foldersPublished, maps) {
    if (!iNet.isEmpty(folders) && !iNet.isEmpty(foldersPublished)) {
      for (var i = 0; i < folders.length; i++) {
        var folder = {
          name: folders[i],
          published: false
        };
        for (var j = 0; j < foldersPublished.length; i++) {
          if (folder.name === foldersPublished[j]) {
            folder.published = true;
            break;
          }
        }
        maps.push(folder);
      }
    }
  }

  /**
   * Published a folder by name
   * @param {String} folderName
   * @param {boolean} status
   * @param {Array} folders
   */
  function published(folderName, status, folders) {
    for (var i = 0; i < folders.length; i++) {
      if (folders[i].name === folderName) {
        folders[i].published = status;
        break;
      }
    }
  }

  /**
   * Insert a folder by name
   * @param {String} folderName The folder name remove
   * @param {Array} folders The folder data
   * @param {Array} data The list folder name
   */
  function insert(folderName, folders, data) {
    folders.push({
      name: folderName,
      published: false
    });
    data.push(folderName);
  }

  /**
   * Remove a folder by name
   * @param {String} folderName The folder name remove
   * @param {Array} folders The folder data
   * @param {Array} data The list folder name
   */
  function remove(folderName, folders, data) {
    for (var i = 0; i < folders.length; i++) {
      if (folders[i].name === folderName) {
        folders.splice(i, 1);
        break;
      }
    }
    if (data.indexOf(folderName) !== -1) {
      data.splice(data.indexOf(folderName), 1);
    }
  }

  /**
   *
   * @param {String} selected
   * @param {Array} folders
   * @returns {boolean}
   */
  function checkPublished(selected, folders) {
    for (var i = 0; i < folders.length; i++) {
      if (folders[i].name === selected) {
        return folders[i].published;
      }
    }

    return false;
  }
});