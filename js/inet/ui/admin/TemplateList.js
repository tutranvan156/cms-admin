// #PACKAGE: admin
// #MODULE: cms-template-list
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Huyen Doan<huyendv@inetcloud.vn>
 * on 14:10 29/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file TemplateList
 * @author huyendv
 */
$(function () {
  /**
   * @class iNet.ui.superad.TemplateList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.superad.TemplateList');
  iNet.ui.superad.TemplateList = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.id = this.id || 'template-list-wg';
    this.$element = $('#' + this.id);
    this.gridID = 'list-template-grid';
    this.module = 'template';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      list: iNet.getPUrl('cms/template/list'),
      del: iNet.getPUrl('cms/template/delete')
    };
    this.$toolbar = {
      CREATE: $('#list-template-toolbar-btn-create')
    };
    this.params = {
      pageSize : 10,
      pageNumber : 0,
      type: ''
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'name',
        label: that.getText('name', that.getModule()),
        type: 'label'
      }, {
        property: 'type',
        label: that.getText('type', that.getModule()),
        type: 'label',
        align: 'center',
        width: 150,
        renderer: function (value) {
          return that.getText(value, that.getModule());
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.del,
          icon: 'icon-trash',
          labelCls: 'label label-important',
          fn: function(record) {
            var __uuid = record.uuid;
            var __name = record.name;
            that.dialog = that.confirmDlg(
              that.getText('del_title', that.getModule()),
              that.getText('del_content', that.getModule()), function () {
                $.postJSON(that.url.del, {template: __uuid}, function (result) {
                  that.dialog.hide();
                  if (iNet.isDefined(result.uuid)) {
                    that.success(that.getText('del_title', that.getModule()), String.format(that.getText('del_success', that.getModule()), __name));
                    that.grid.load();
                  } else {
                    that.error(that.getText('del_title', that.getModule()), String.format(that.getText('del_unsuccess', that.getModule()), __name));
                  }
                }, {
                  mask : that.getMask(),
                  msg : iNet.resources.ajaxLoading.deleting
                });
              }
            );
            that.dialog.setTitle('<i class="fa fa-trash red"></i> ' + that.getText('del_title'));
            that.dialog.show();
          },
          visibled: function () {
            return that.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN);
          }
        }]
      }],
      delay: 250
    });
    this.basicSearch = function () {
      this.id = 'list-template-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.Component, {
      constructor: this.basicSearch,
      intComponent: function () {
        var $type = $('#list-template-type-select');
        $type.on('change', function () {
          that.params.type = $type.val();
          that.grid.load();
        });
      },
      getUrl: function () {
        return that.url.list;
      },
      getId: function () {
        return this.id;
      },
      getData: function () {
        return that.params;
      }
    });
    iNet.ui.superad.TemplateList.superclass.constructor.call(this);
    FormUtils.showButton(this.$toolbar.CREATE, this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN));
    /**
     * @type {iNet.ui.superad.TemplateContent}
     */
    var template = null;
    /**
     * @returns {iNet.ui.superad.TemplateContent}
     */
    var loadTemplateWg = function () {
      if (!template) {
        template = new iNet.ui.superad.TemplateContent();
        template.on(template.getEvent('back'), function () {
          that.show();
          that.grid.load();
        });
      }
      template.passRoles(that);
      template.show();
      that.hide();
      return template;
    };

    this.grid.on('click', function(record){
      var __record = record || {};
      template = loadTemplateWg();
      template.load(__record);
    });

    this.$toolbar.CREATE.on('click', function(){
      template = loadTemplateWg();
      template.load();
    });

    FormUtils.showButton(this.$toolbar.CREATE, this.getSecurity().hasRoles(CMSConfig.ROLE_SUP_ADMIN));

    // active menu
    //var layout = iNet.getLayout();
    //if (layout) {
    //  var menu = layout.window.sideBar;
    //  if (menu) {
    //    menu.activeById('#cms-template');
    //  }
    //}
  };

  iNet.extend(iNet.ui.superad.TemplateList, iNet.ui.ListAbstract);

  var __wg = new iNet.ui.superad.TemplateList();
  __wg.show();
});