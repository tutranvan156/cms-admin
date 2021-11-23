// #PACKAGE: admin
// #MODULE: cms-review-permission
/**
 * PHAN QUYEN DUYET BAI VIET
 * Created by Huyen Doan<huyendv@inetcloud.vn> on 02/07/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ReviewPermission
 * @author huyendv
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @class iNet.ui.admin.ReviewPermission
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.ReviewPermission');
  iNet.ui.admin.ReviewPermission = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.id = this.id || 'review-permission-wg';

    this.$element = $('#' + this.id);
    this.module = 'review';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.userSelectors = {};
    this.statusList = new Hashtable();
    this.url = {
      wfList: iNet.getPUrl('cms/workflow/list'),
      wfCreate: iNet.getPUrl('cms/workflow/create'),
      wfUpdate: iNet.getPUrl('cms/workflow/update'),
      wfUpdatePath: iNet.getPUrl('cms/workflow/path'),
      wfUpdateXY: iNet.getPUrl('cms/workflow/nodexy'),
      wfDelete: iNet.getPUrl('cms/workflow/delete')
    };
    //iNet.JSON.encode
    this.$toolbar = {
      CREATE: $('#review-permission-toolbar-btn-create'),
      DEL: $('#review-permission-toolbar-btn-delete')
    };

    this.$form = {
      status: $('#review-permission-status'),
      category: $('#category-list-popover'),
      category_close: $('#cate-list-close-btn'),
      category_save: $('#category-list-save-btn'),
      connection_modal: $('#review-permission-connection-modal'),
      connection_name: $('#review-permission-connection-name'),
      connection_ok: $('#review-permission-connection-btn-ok'),
      connection_del: $('#review-permission-connection-btn-del'),
      connection_cancel: $('#review-permission-connection-btn-cancel'),
      node_modal: $('#review-permission-node-modal'),
      node_modal_name: $('#review-permission-node-name'),
      node_modal_ok: $('#review-permission-node-btn-ok'),
      node_modal_cancel: $('#review-permission-node-btn-cancel')
    };
    this.selectedConnection = null;
    //FormUtils.showButton(this.$toolbar.CREATE, this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN));
    //FormUtils.showButton(this.$toolbar.DEL, this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN));

    this.virtual = new iNet.ui.admin.VirtualWorkflow();
    this.nodeTemp = {
      id: 'temp',
      "name": that.getText('new_status', that.getModule()),
      "type": "OR",
      start: true,
      endway: false,
      x: 0,
      y: 0,
      attribute: []
    };
    this.nodeSelected = {};
    this.nodeList = [];

    iNet.ui.admin.ReviewPermission.superclass.constructor.call(this);

    this.virtual.on('dragstop', function (ui) {
      var uuid = ui.helper.attr("id"); //map id ui --> code property's node
      var x = ui.position.left;
      var y = ui.position.top;
      var __data = {
        x: parseInt(x),
        y: parseInt(y)
      };

      if (uuid == 'temp') {
        return;
      }

      $.each(that.nodeList, function (i, node) {
        if (node.code == uuid) {
          __data.code = node.code;
          $.postJSON(that.url.wfUpdateXY, __data, function (result) {
            var __result = result || {};
            if (__result.type != 'ERROR') {
              that.updateNode(__result);
            }
          });
        }
      });
    });
    this.virtual.on('connectionclick', function (connection) {
      that.selectedConnection = connection || {};
      that.$toolbar.DEL.hide();
      var __source = connection.sourceId;
      var __target = connection.targetId;
      var __uuid = that.getNodeUuid(__source);
      var __node = that.statusList.get(__uuid);
      var __label = __node.paths[__target];
      if (!iNet.isEmpty(connection)) {
        that.$form.connection_del.show();
        that.$form.connection_name.val(__label);
        that.$form.connection_modal.modal('show');
      }
    });
    this.virtual.on('nodeclick', function (event, node) {
      var __code = $(node).prop('id');
      that.setCurrentCode(__code);
      that.expandStatus(that.getNodeUuid(__code));
      that.$toolbar.DEL.show();
    });
    this.virtual.on('connectiondragstop', function (connection) {
      that.selectedConnection = connection || {};
      that.$toolbar.DEL.hide();
      if (!iNet.isEmpty(connection.connector || "")) {
        that.$form.connection_del.hide();
        that.$form.connection_name.val(connection.label);
        that.$form.connection_modal.modal('show');
      }
    });

    this.cnnValidate = new iNet.ui.form.Validate({
      id: that.$form.connection_modal.prop('id'),
      rules: [{
        id: this.$form.connection_name.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return iNet.resources.message.field_not_empty;
        }
      }]
    });

    this.$form.node_modal_ok.on('click', function () {
      var nodeName = that.$form.node_modal_name.val();
      if (!nodeName) {
        that.error('review_node_permission', 'node_name_is_null_or_empty');
        // that.$form.node_modal_name.val('');
        // that.$form.node_modal.modal('hide');
        return;
      }
      that.createStatus(nodeName);
    });

    this.$form.connection_ok.on('click', function () {
      if (that.cnnValidate.check())
        that.createConnection(that.$form.connection_name.val());
    });
    this.$form.connection_del.on('click', function () {
      that.deleteConnection();
    });
    this.$form.connection_cancel.on('click', function () {
      var __name = that.$form.connection_name.val();
      if (iNet.isEmpty(__name)) {
        that.virtual.detach(that.selectedConnection);
      }
    });

    this.$form.status.on('click', 'button[data-action="status-expand"]', function () {
      var __show = $(this).parents('div[data-action="status"]').attr('data-show') == 'true';
      that.$form.status.find('div[data-action="status"] .panel-body').hide();
      that.$form.status.find('div[data-action="status"] button[data-action="status-expand"] i').removeClass('icon-double-angle-up').addClass('icon-double-angle-down');
      that.$form.status.find('div[data-action="status"]').attr('data-show', false);
      if (!__show) {
        var $parent = $(this).parents('div[data-action="status"]');
        var __uuid = $parent.attr('data-info');
        var __node = that.statusList.get(__uuid);
        if (__node.type == "END") {
          $parent.find('div[data-action="status-end"] input').prop('checked', true);
          if (iNet.isEmpty(__node.paths)) {
            $parent.find('div[data-action="status-end"] input').attr('disabled', 'disabled');
          } else {
            $parent.find('div[data-action="status-end"] input').removeAttr('disabled');
          }
        } else {
          $parent.find('div[data-action="status-end"] input').prop('checked', false);
          if (__node.type == "START") {
            $parent.find('div[data-action="status-end"] input').attr('disabled', 'disabled');
          } else {
            $parent.find('div[data-action="status-end"] input').removeAttr('disabled');
          }
        }
        that.setCurrentUuid(__uuid);
        $parent.attr('data-show', true);
        $parent.find('.panel-body').show();
        $parent.find('button[data-action="status-expand"] i').removeClass('icon-double-angle-down').addClass('icon-double-angle-up');
      }
    });
    this.$form.status.on('click', 'button[data-action="brief-edit"]', function () {
      $(this).hide();
      var $parent = $(this).parents('.status-title');
      $parent.find('strong[data-action="brief-view"]').hide();
      $parent.find('input[data-action="brief-input"]').show();
      $parent.find('button[data-action="brief-save"]').show();
    });
    this.$form.status.on('click', 'button[data-action="brief-save"]', function () {
      $(this).hide();
      var $parent = $(this).parents('.status-title');
      var $brief = $parent.find('input[data-action="brief-input"]');
      $brief.hide();
      $parent.find('strong[data-action="brief-view"]').show();
      $parent.find('button[data-action="brief-edit"]').show();
      var __uuid = $parent.parents('div[data-action="status"]').attr('data-info');
      var __data = that.statusList.get(__uuid) || {};
      __data.brief = $brief.val() || '';
      that.updateStatus(__data);
    });
    this.$form.status.on('change', 'div[data-action="status-end"] input', function () {
      var __check = $(this).prop('checked');
      var $parent = $(this).parents('div[data-action="status"]');
      var __uuid = $parent.attr('data-info');
      var __node = that.statusList.get(__uuid);
      if (__check) {
        __node.type = "END";
      } else if (!that.checkStartNode(__node.code)) {
        __node.type = "BRIDGE";
      } else {
        __node.type = "START";
      }
      that.updateStatus(__node);
    });
    this.$form.status.on('click', '.user-item', function () {
      /*var __usercode = $(this).parent().attr('data-id');
      that.setCurrentUser(__usercode);
      var __status = that.statusList.get(that.getCurrentUuid());
      var __attribute = __status.attribute || [];
      for (var i = 0; i < __attribute.length; i++) {
        if (__attribute[i].usercode == __usercode) {
          that.setCateSelected(__attribute[i].category);
          break;
        }
      }
      that.$form.category.show();/
      */
    });
    this.$form.status.on('click', '.user-item-remove', function () {
      var __username = $(this).parent().attr('data-id');
      that.removeUser(__username);
    });
    this.$form.category_close.on('click', function () {
      that.$form.category.hide();
    });
    this.$form.category_save.on('click', function () {
      that.$form.category.hide();
      that.saveCategory();
    });

    this.$toolbar.CREATE.on('click', function () {
      that.$form.node_modal.modal('show');
    });
    this.$toolbar.DEL.on('click', function () {
      that.dialog = that.confirmDlg(
          that.getText('remove_title', that.getModule()),
          that.getText('remove_content', that.getModule()), function () {
            this.hide();
            $.postJSON(that.url.wfDelete, {uuid: that.getCache().uuid}, function (result) {
              var __result = result || {};
              if (!iNet.isDefined(__result.uuid)) {
                that.success(that.getText('remove_title', that.getModule()), that.getText('delete_success', that.getModule()));
                that.deleteStatus();
                that.loadStatusList();
              } else {
                that.error(that.getText('remove_title', that.getModule()), that.getText('delete_error', that.getModule()));
              }
            }, {
              mask: that.getMask(),
              msg: iNet.resources.ajaxLoading.deleting
            });
          }).show();
    });
    this.init();
  };

  iNet.extend(iNet.ui.admin.ReviewPermission, iNet.ui.WidgetExt, {
    init: function () {
      this.loadStatusList();
    },
    setCurrentUuid: function (uuid) {
      this.currentUuid = uuid || '';
    },
    getCurrentUuid: function () {
      return this.currentUuid || '';
    },
    setCurrentCode: function (code) {
      this.currentCode = code || '';
    },
    getCurrentCode: function () {
      return this.currentCode || '';
    },
    setCurrentUser: function (username) {
      this.currentUser = username || '';
    },
    getCurrentUser: function () {
      return this.currentUser || '';
    },
    getNodeUuid: function (code) {
      var __uuid = '';
      for (var i = 0; i < this.nodeList.length; i++) {
        if (this.nodeList[i].code == code) {
          __uuid = this.nodeList[i].uuid;
        }
      }
      return __uuid;
    },
    setCateSelected: function (data) {
      var __list = this.$form.category.find('div[data-action="cate"]');
      __list.find('[name="form-field-checkbox"]:checked').prop('checked', false);
      var __data = data || [];
      if (__data.length > 0) {
        for (var i = 0; i < __list.length; i++) {
          if (__data.indexOf($(__list[i]).attr('data-id')))
            $(__list[i]).find('[name="form-field-checkbox"]:checked').prop('checked', true);
        }
      }
    },
    getCateSelected: function () {
      var __list = this.$form.category.find('div[data-action="cate"]');
      var __data = [];
      for (var i = 0; i < __list.length; i++) {
        var __check = $(__list[i]).find('[name="form-field-checkbox"]:checked');
        if (__check.val()) {
          __data.push($(__list[i]).attr('data-id'));
        }
      }
      return __data;
    },
    loadStatusList: function () {
      var me = this;
      this.clearStatus();
      $.postJSON(this.url.wfList, {}, function (result) {
        var __result = result || {};
        if ((__result.total || 0) > 0) {
          me.nodeList = __result.items || [];
          $.each(me.nodeList, function (i, node) {
            if (!iNet.isEmpty(node.uuid)) {
              me.statusList.put(node.uuid, node);
              me.addStatus(node);
            }
          });
          me.reloadNodes();
        }
      });
    },
    reloadNodes: function () {
      var that = this;
      that.virtual.reset();
      $.each(that.nodeList, function (i, node) {
        if (!iNet.isEmpty(node.uuid)) {
          that.addNode(node);
        }
      });

      $.each(that.nodeList, function (i, node) {
        var __connection = node.paths || {};
        var __sourceID = node.code;
        var __connectionID = node.uuid || "";

        if (!iNet.isEmpty(__sourceID) && !iNet.isEmpty(__connectionID)) {
          for (var key in __connection) {
            that.virtual.connect(__sourceID, key, __connection[key], __connectionID);
          }
        }
      });
    },
    addNode: function (node) {
      var __nodeData = {};
      __nodeData.id = node.code;
      __nodeData.name = node.brief;
      __nodeData.start = (node.type == "START");
      __nodeData.endway = (node.type == "END");
      __nodeData.x = node.x;
      __nodeData.y = node.y;

      this.virtual.addNode(__nodeData);
      this.virtual.moveNode(__nodeData.id, __nodeData.x, __nodeData.y);
    },
    updateNode: function (node) {
      this.statusList.put(node.uuid, node);
      for (var i = 0; i < this.nodeList.length; i++) {
        if (this.nodeList[i].uuid == node.uuid) {
          this.nodeList[i] = node;
          break;
        }
      }
    },
    deleteNode: function (code) {
      this.virtual.removeNode(code);
    },
    updateConnection: function (connection, uuid, source, target, label) {
      var __uuid = uuid || '';
      var __source = source || '';
      var __target = target || '';
      var __label = label || '';
      this.virtual.detach(connection);
      this.virtual.connect(__source, __target, __label, __uuid);
    },
    addStatus: function (data) {
      var that = this;
      var __data = data || {};
      if (!iNet.isEmpty(__data)) {
        var __html = String.format('<div class="panel panel-default" data-action="status" data-show="false" data-info="{0}">', __data.uuid);
        __html += '<div class="panel-heading" style="cursor: pointer;"><div class="status-title">';
        __html += String.format('<strong data-action="brief-view" class="status-name">{0}</strong>', __data.brief);
        __html += String.format('<input type="text" data-action="brief-input" class="form-control status-name" value="{0}" style="display: none;">', __data.brief);
        __html += '<span style="float: right;">';
        __html += '<button data-action="brief-save" class="btn btn-default btn-sm" style="display: none;"><i class="icon-ok"></i></button>';
        __html += '<button data-action="brief-edit" class="btn btn-default btn-sm"><i class="icon-pencil"></i></button>';
        __html += '<button data-action="status-expand" class="btn btn-default btn-sm"><i class="icon-double-angle-down fa-lg"></i></button>';
        __html += '</span></div></div>';
        __html += '<div class="panel-body" style="padding: 5px; display: none;">';
        __html += String.format('<div data-list="{0}">', __data.uuid);
        var __users = __data.attribute || [];
        for (var i = 0; i < __users.length; i++) {
          __html += that.renderUser(__users[i]);
        }
        __html += '</div>';
        __html += String.format('<div id="review-permission-user-selector-{0}"></div>', __data.uuid);
        __html += String.format('<div class="checkbox" data-action="status-end"><label><input name="form-field-checkbox" type="checkbox" class="ace"><span class="lbl"> {0}</span></label></div>', this.getText('allow_publish', this.getModule()));
        __html += '</div>';
        __html += '</div>';
        that.$form.status.append(__html);
        that.userSelectors[__data.uuid] = new iNet.ui.form.SelectUserPopover({
          id: 'review-permission-user-selector-' + __data.uuid,
          title: that.getText('permission_add', that.getModule()),
          linkTitle: that.getText('permission_add', that.getModule()),
          placement: 'left',
          singleSelect: false,
          hideGroup: true,
          url: iNet.getLayout().CMSConfig.SITE ? iNet.getPUrl('cmsfirm/member/list') : iNet.getUrl('system/account/role')
        });
        that.userSelectors[__data.uuid].on('add', function (user) {
          var __user = user || {};
          this.clear();
          this.hidePopover();
          that.addUser(__user);
        });
      }
    },
    updateStatusNode: function (node) {
      var that = this;
      var __node = node || {};
      var __uuid = node.uuid || '';
      if (!iNet.isEmpty(__uuid)) {
        var $status = this.$form.status.find('div[data-info="' + __uuid + '"]');
        $status.find('strong[data-action="brief-view"]').html(__node.brief || '');
        var __users = __node.attribute || [];
        var $user_list = $status.find('div[data-list="' + __uuid + '"]');
        $user_list.html('');
        for (var i = 0; i < __users.length; i++) {
          var __html = that.renderUser(__users[i]);
          $user_list.append(__html);
        }
      }
    },
    removeStatus: function (uuid) {
      var __uuid = uuid || '';
      this.statusList.remove(__uuid);
      this.nodeList = $.grep(this.nodeList, function (n) {
        return n.uuid != __uuid
      });
      this.$form.status.find('div[data-info="' + __uuid + '"]').remove();
    },
    expandStatus: function (uuid) {
      var __uuid = uuid || '';
      this.setCurrentUuid(__uuid);
      this.$form.status.find('div[data-info="' + __uuid + '"]').find('button[data-action="status-expand"]').click();
    },
    clearStatus: function () {
      this.$form.status.html('');
    },
    renderUser: function (data) {
      var __data = data || {};
      var __url = iNet.getPUrl('system/userprofile/photo') + '?thumbnail=28&usercode=' + __data.usercode;
      var __html = String.format('<div data-action="user" data-id="{0}" class="user-box-group-item" href="javascript:;" style="width: 100% !important;">', __data.usercode);
      __html += '<div class="user-item" style="width: calc(100% - 20px);">';
      __html += '<div class="user-box-group-item-avatar">';
      __html += String.format('<img class="user-box-group-item-img" style="background-image: url(\'{0}\');">', __url);
      __html += '</div>';
      __html += String.format('<div class="user-box-group-item-info"><div class="user-box-group-item-name" title="{0}">{0}</div></div>', __data.fullname);
      __html += '</div>';
      __html += '<div class="user-item-remove"><i class="icon-remove red"></i></div>';
      __html += '</div>';
      return __html;
    },
    createStatus: function (nodeName) {
      var that = this;
      $.postJSON(that.url.wfCreate, {brief: nodeName}, function (result) {
        var __result = result || {};
        if (__result.type != 'ERROR') {
          //that.success(that.getText('create', that.getModule()), that.getText('create_success', that.getModule()));
          that.statusList.put(__result.uuid, __result);
          that.nodeList.push(__result);
          that.addNode(__result);
          that.addStatus(__result);
          that.$toolbar.DEL.hide();
          that.$form.node_modal.modal('hide');
        } else {
          that.error(that.getText('create', that.getModule()), that.getText('create_error', that.getModule()));
        }
      });
    },
    updateStatus: function (data) {
      var that = this;
      var __data = data || {};
      if (!iNet.isEmpty(__data)) {
        __data.attribute = iNet.JSON.encode(__data.attribute || []);
        $.postJSON(that.url.wfUpdate, __data, function (result) {
          var __result = result || {};
          if (__result.type != 'ERROR') {
            //that.success(that.getText('update', that.getModule()), that.getText('update_success', that.getModule()));
            that.updateNode(__result);
            that.updateStatusNode(__result);
            that.reloadNodes();
          } else {
            that.error(that.getText('update', that.getModule()), that.getText('update_error', that.getModule()));
          }
        });
      }
    },
    deleteStatus: function () {
      var that = this;
      var __code = that.getCurrentCode() || '';
      if (!iNet.isEmpty(__code)) {
        $.postJSON(that.url.wfDelete, {code: __code}, function (result) {
          var __result = result || {};
          if (__result.type != 'ERROR') {
            //that.success(that.getText('delete', that.getModule()), that.getText('delete_success', that.getModule()));
            that.deleteNode(__code);
            that.removeStatus(that.getNodeUuid(__code));
            that.$toolbar.DEL.hide();
          } else {
            that.error(that.getText('delete', that.getModule()), that.getText('delete_error', that.getModule()));
          }
        });
      }
    },
    createConnection: function (name) {
      var that = this;
      var __name = name || '';
      var __params = {
        code: that.selectedConnection.sourceId,
        target: that.selectedConnection.targetId,
        label: __name
      };
      $.postJSON(that.url.wfUpdatePath, __params, function (result) {
        var __result = result || {};
        if (__result.type != 'ERROR') {
          var __uuid = that.getNodeUuid(__params.target);
          var __target = that.statusList.get(__uuid);
          that.updateNode(__result);
          that.reloadNodes();
          // if (__result.type == "END") {
          //   __result.type = "BRIDGE";
          //   that.updateStatus(__result);
          // }
          // if (__target.type == "START" && !iNet.isEmpty(__target.paths)) {
          //   __target.type = "BRIDGE";
          //   that.updateStatus(__target);
          // } else if (__target.type == "START" && iNet.isEmpty(__target.paths)) {
          //   __target.type = "END";
          //   that.updateStatus(__target);
          // }
          that.$form.connection_modal.modal('hide');
        }
      });
    },
    deleteConnection: function () {
      var that = this;
      var __params = {
        code: that.selectedConnection.sourceId,
        target: that.selectedConnection.targetId
      };
      $.postJSON(that.url.wfDelete, __params, function (result) {
        var __result = result || {};
        if (__result.type != 'ERROR') {
          var __items = __result.items || [];
          for (var i = 0; i < __items.length; i++) {
            that.updateNode(__items[i]);
          }
          that.reloadNodes();
          // var __sid = that.getNodeUuid(__params.code);
          // var __source = that.statusList.get(__sid);
          // if (iNet.isEmpty(__source.paths)) {
          //   __source.type = "END";
          //   that.updateStatus(__source);
          // }
          // var __tid = that.getNodeUuid(__params.target);
          // var __target = that.statusList.get(__tid);
          // if (that.checkStartNode(__target.code)) {
          //   __target.type = "START";
          //   that.updateStatus(__target);
          // }
          that.$form.connection_modal.modal('hide');
        }
      });
    },
    checkStartNode: function (code) {
      for (var i = 0; i < this.nodeList.length; i++) {
        if (!iNet.isEmpty(this.nodeList[i].paths[code])) {
          return false;
        }
      }
      return true;
    },
    addUser: function (data) {
      var that = this;
      var __data = data || {};
      var __uuid = that.getCurrentUuid() || '';
      var __node = that.statusList.get(__uuid) || {};
      var __user = {usercode: __data.username, fullname: __data.fullname};
      var __attibute = __node.attribute || [];
      __attibute.push(__user);
      __node.attribute = iNet.JSON.encode(__attibute);
      $.postJSON(that.url.wfUpdate, __node, function (result) {
        var __result = result || {};
        if (__result.type != 'ERROR') {
          var $status = that.$form.status.find('div[data-info="' + __uuid + '"]');
          $status.find('[data-list="' + __uuid + '"]').append(that.renderUser(__user));
          that.statusList.put(__uuid, __result);
        }
      });
    },
    removeUser: function (usercode) {
      var __usercode = usercode || '';
      var __status = this.statusList.get(this.getCurrentUuid());
      var __attribute = __status.attribute || [];
      __status.attribute = $.grep(__attribute, function (n) {
        return n.usercode != __usercode
      });
      this.updateStatus(__status);
    },
    saveCategory: function () {
      var that = this;
      var __uuid = this.getCurrentUuid();
      var __user = this.getCurrentUser();
      var __categories = this.getCateSelected().join(',');
      var __node = this.statusList.get(__uuid);
      var __attribute = __node.attribute || [];
      for (var i = 0; i < __attribute.length; i++) {
        if (__attribute[i].usercode == __user) {
          __attribute[i].category = __categories;
          break;
        }
      }
      $.postJSON(that.url.wfUpdate, __node, function (result) {
        var __result = result || {};
        if (__result.type != 'ERROR') {
          that.updateNode(__result);
        }
      });
    }
  });

  var __wg = new iNet.ui.admin.ReviewPermission();
  __wg.show();

  // active menu
  //var layout = iNet.getLayout();
  //if (layout) {
  //  var menu = layout.window.sideBar;
  //  if (menu) {
  //    menu.activeById('#cms-review-permission');
  //  }
  //}
});
