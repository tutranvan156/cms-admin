// #PACKAGE: admin
// #MODULE: cms-menu-item-content
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 25/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file MenuItemContent
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.admin.MenuItemContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.MenuItemContent');
  iNet.ui.admin.MenuItemContent = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.id = 'menu-item-content-wg';
    this.module = 'menu';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.avatarBox = new iNet.ui.author.AvatarBoxExt();
    this.url = {
      load: iNet.getPUrl('cms/menuitem/load'),
      save: iNet.getPUrl('cms/menuitem/create'),
      update: iNet.getPUrl('cms/menuitem/update'),
      category: iNet.getPUrl('cms/menuitem/category'),
      group: iNet.getPUrl('cms/menuitem/group'),
      template: iNet.getPUrl('cms/template/type')
    };
    this.$toolbar = {
      BACK: $('#content-btn-back'),
      CREATE: $('#content-btn-create'),
      SAVE: $('#content-btn-save'),
      DESIGN: $('#design-btn-save')
    };
    this.$form = {
      name: $('#txt-menu-name'),
      id: $('#txt-menu-id'),
      group: $('#txt-menu-group'),
      cate: $('#txt-menu-category'),
      template: $('#cbb-template'),
      brief: $('#txt-menu-brief'),
      position: $('#txt-menu-position'),
      content: $('#txt-menu-content')
    };
    this.formValidate = new iNet.ui.form.Validate({
      id: that.id,
      rules: [{
        id: that.$form.name.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, that.getText('name', that.getModule()));
        }
      }, {
        id: that.$form.id.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, that.getText('id', that.getModule()));
        }
      }]
    });
    this.editor = new iNet.ui.common.LittleEditor({id: '#' + this.$form.content.prop('id')});
    iNet.ui.admin.MenuItemContent.superclass.constructor.call(this);
    // init category auto complete
    this.menuCategory = new iNet.ui.form.AutoComplete({
      id: this.$form.cate.prop('id')
    });
    this.menuCategory.constructor.prototype.focusedIn = function () {
      this.query = this.$element.val();
      return this.render(this.getSource()).show();
    };
    // init group auto complete
    this.menuGroup = new iNet.ui.form.AutoComplete({
      id: this.$form.group.prop('id')
    });
    this.menuGroup.constructor.prototype.focusedIn = function () {
      this.query = this.$element.val();
      return this.render(this.getSource()).show();
    };
    this.$toolbar.BACK.click(function () {
      that.hide();
      that.fireEvent(that.getEvent('back'), that);
    });
    this.$toolbar.CREATE.click(function () {
      that.resetData();
    });
    this.$toolbar.DESIGN.click(function () {
      that.fireEvent('design_editor', that.editor.getValue(), that);
    });
    this.$toolbar.SAVE.click(function () {
      if (that.validate()) {
        var __post = that.getData();
        var url = that.url.update;
        if (iNet.isEmpty(__post.uuid) || !iNet.isDefined(__post.uuid)) {
          url = that.url.save;
          delete __post.uuid;
        }
        $.postJSON(url, __post, function (result) {
          var __result = result || {};
          if (iNet.isDefined(__result.attribute.cmsItemID)) {
            if (!iNet.isEmpty(__post.uuid)) {
              that.success(that.getText('update_title', that.getModule()), that.getText('update_success'));
              that.fireEvent(that.getEvent('updated'), __result, that);
            } else {
              that.success(that.getText('create_title', that.getModule()), that.getText('create_success'));
              that.fireEvent(that.getEvent('saved'), __result, that);
              that.setPost(__result);
            }
          } else {
            if (!iNet.isEmpty(__post.uuid)) {
              that.error(that.getText('update_title', that.getModule()), that.getText('update_unsuccess'));
            } else {
              that.error(that.getText('create_title', that.getModule()), that.getText('create_unsuccess'));
            }
          }
        }, {
          mask: that.getMask(),
          msg: iNet.resources.ajaxLoading.saving
        });
      }
    });
    this.$form.cate.on('focusin', function () {
      that.menuCategory.focusedIn();
    });
    this.$form.template.on('change', function () {
      var __uuid = that.$form.template.val() || '';
      if (!iNet.isEmpty(__uuid)) {
        for (var i = 0; i < that.templates.length; i++) {
          if (that.templates[i].uuid == __uuid) {
            that.editor.setValue(that.templates[i].message);
            return;
          }
        }
      } else {
        that.editor.setValue('');
      }
    });
    this.loadTemplate();
  };
  iNet.extend(iNet.ui.admin.MenuItemContent, iNet.ui.WidgetExt, {
    setPost: function (post) {
      this.cache.post = post;
      this.setUUID(post.uuid);
    },
    setUUID: function (uuid) {
      this.cache.uuid = uuid;
    },
    validate: function () {
      return this.formValidate.check();
    },
    setData: function (post) {
      var that = this;
      var __post = post || {};
      var __timer = null;
      this.$form.name.val(__post.subject || '');
      this.$form.id.val(__post.menuID || '');
      this.$form.position.val(__post.position || '');
      this.$form.group.val(__post.group || '');
      this.$form.brief.val(__post.brief || '');
      this.avatarBox.setValue(__post.image);
      if (iNet.isDefined(this.editor.getActiveEditor())) {
        clearTimeout(__timer);
        this.editor.setValue(__post.message || '');
      } else {
        __timer = setTimeout(function () {
          that.editor.setValue(__post.message || '');
        }, 1000);
      }
      this.loadCategory(function () {
        that.menuCategory.setValue(__post.category || '');
      });
      this.loadGroup(function () {
        that.menuGroup.setValue(__post.group || '');
      });
      this.setPost(__post);
      this.resize();
    },
    getData: function () {
      return {
        subject: this.$form.name.val(),
        menuID: this.$form.id.val(),
        menu: this.$form.id.val(),
        group: this.$form.group.val(),
        category: this.$form.cate.val(),
        brief: this.$form.brief.val(),
        image: this.avatarBox.getValue(),
        message: this.editor.getValue(),
        position: this.$form.position.val(),
        uuid: this.getCache().uuid
      };
    },
    resetData: function () {
      this.setData({
        subject: '',
        brief: '',
        menuID: iNet.generateId(),
        category: '',
        group: '',
        message: '',
        uuid: null
      });
      this.avatarBox.setValue('');
    },
    loadCategory: function (callback) {
      var that = this;
      var __fn = callback || iNet.emptyFn;
      $.postJSON(this.url.category, {}, function (result) {
        var __result = result || {};
        that.menuCategory.setSource(__result.elements);
        __fn();
      });
    },
    loadGroup: function (callback) {
      var that = this;
      var __fn = callback || iNet.emptyFn;
      $.postJSON(this.url.group, {}, function (result) {
        var __result = result || {};
        that.menuGroup.setSource(__result.elements);
        __fn();
      });
    },
    loadTemplate: function () {
      var that = this;
      $.postJSON(this.url.template, {type: 'PAGE'}, function (result) {
        var __result = result || {};
        var __opt = '', __list = __result.items || [];
        that.templates = __list;
        for (var i = 0; i < __list.length; i++) {
          __opt = String.format('<option value="{0}">{1}</option>', __list[i].uuid, __list[i].name);
          that.$form.template.append(__opt);
        }
      });
    },
    load: function (post) {
      var that = this;
      $.postJSON(this.url.load, {menu: post.menuID}, function (result) {
        var __result = result || {};
        if (iNet.isDefined(__result.uuid)) {
          var __post = __result;
          that.setData(__post);
        }
      });
    },
    resize: function () {
      $(window).trigger('resize');
    }
  });
});