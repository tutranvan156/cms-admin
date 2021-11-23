// #PACKAGE: admin
// #MODULE: cms-category
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 15/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file Category
 * @author nbchicong
 */
$(function(){
  /**
   * @class iNet.ui.superad.Category
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.superad.Category');
  iNet.ui.superad.Category = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.id = this.id || 'wg-category';
    this.module = 'category';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.dataGroup = iNet.ConfigHeader.dataGroup || [];
    console.log("dataGroup" , this.dataGroup);
    this.dataCate = iNet.ConfigHeader.dataCate || [];
    console.log("dataCate" , this.dataCate);

    this.selectedGroup = '';
    this.url = {
      list: iNet.getPUrl('cms/category/list'),
      create: iNet.getPUrl('cms/category/modify'),
      del: iNet.getPUrl('cms/category/delete')
    };
    this.$toolbar = {
      CREATE_GROUP: $('#category-btn-create-group'),
      CREATE_CATEGORY: $('#category-btn-create-cate')
    };
    this.$form = {
      modal: $('#category-create-modal'),
      modal_title: $('#category-create-title'),
      modal_name_lbl: $('#category-create-name-lbl'),
      modal_name_txt: $('#category-create-name-txt'),
      modal_ok: $('#category-create-ok-btn'),
      group: $('#group-list'),
      category: $('#cate-list'),
      category_group: $('#category-group-lbl'),
      list_ddblue:$('.dd-item.item-blue2'),
      list_green:$('.dd-item.item-green')
    };
    /*FormUtils.showButton(this.$toolbar.CREATE_GROUP, this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN));
    FormUtils.showButton(this.$toolbar.CREATE_CATEGORY, this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN));
    if (!this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN)) {
      this.$form.group.find('a[data-action="edit"]').hide();
      this.$form.group.find('a[data-action="delete"]').hide();
    }*/
    this.formValidate = new iNet.ui.form.Validate({
      id:'category-create-modal',
      rules:[{
        id: that.$form.modal_name_txt.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, that.getText('validate_date', that.getModule()));
        }
      }]
    });

    iNet.ui.superad.Category.superclass.constructor.call(this);

    this.$toolbar.CREATE_GROUP.on('click', function () {
      that.createGroup();
    });
    this.$toolbar.CREATE_CATEGORY.on('click', function () {
      that.createCategory();
    });
    this.$form.group.on('click', 'li[data-action="select"]', function () {
      var __uuid = $(this).attr('data-id');
      that.$form.group.find('.dd-handle').removeClass('group-active');
      $(this).find('.dd-handle').addClass('group-active');
      that.$form.category_group.html(String.format(that.getText('group', that.getModule()), that.getGroup(__uuid).name));
      that.loadCategory(__uuid);
    });
    this.$form.group.on('click', 'a[data-action="edit"]', function () {
      var __uuid = $(this).parents('li[data-action="select"]').attr('data-id');
      that.updateGroup(__uuid);
    });
    this.$form.group.on('click', 'a[data-action="delete"]', function () {
      var __uuid = $(this).parents('li[data-action="select"]').attr('data-id');
      that.deleteGroup(__uuid);
    });
    this.$form.category.on('click', 'a[data-action="edit"]', function () {
      var __uuid = $(this).parents('li[data-action="select"]').attr('data-id');
      that.updateCategory(__uuid);
    });
    this.$form.category.on('click', 'a[data-action="delete"]', function () {
      var __uuid = $(this).parents('li[data-action="select"]').attr('data-id');
      that.deleteCategory(__uuid);
    });
    this.$form.modal_name_txt.on('keyup', function (e) {
      if (e.which === 13) {
        that.$form.modal_ok.click();
      }
    });
    this.$form.modal_ok.on('click', function () {
      if(that.formValidate.check()) {
        var __type = that.$form.modal.attr('data-type') || 'group';
        var __uuid = that.$form.modal.attr('data-uuid') || '';
        var __group = that.$form.modal.attr('data-group') || '';
        var __name = that.$form.modal_name_txt.val();
        var __data = {uuid: __uuid, group: __group, name: __name};

        if (__type === "group") {
          __data.group = __data.name;
          if (!iNet.isEmpty(__uuid)) {
            that.save(__data, __type, function (data) {
              that.changeGroup(data);
            });
          } else {
            that.save(__data, __type, function (data) {
              that.addGroup(data, __name, that.$form.list_ddblue);
            });
          }
        } else {
          if (!iNet.isEmpty(__uuid)) {
            that.save(__data, __type, function (data) {
              that.changeCategory(data);
            });
          } else {
            that.save(__data, __type, function (data) {
              that.addCategory(data, __name);
            });
          }
        }
      }
    });

    this.init();
  };
  iNet.extend(iNet.ui.superad.Category, iNet.ui.WidgetExt, {
    init: function () {
      var __first = this.$form.group.find('li[data-action="select"]:first');
      if (!iNet.isEmpty(__first)) __first.click();
      FormUtils.showButton(this.$toolbar.CREATE_CATEGORY, this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN));
      FormUtils.showButton(this.$toolbar.CREATE_GROUP, this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN));
    },
    getGroup: function (uuid) {
      for (var i = 0; i < this.dataGroup.length; i++) {
        if (this.dataGroup[i].uuid == uuid) {
          return this.dataGroup[i];
        }
      }
    },
    setGroup: function (data) {
      for (var i = 0; i < this.dataGroup.length; i++) {
        if (this.dataGroup[i].uuid === data.uuid) {
          this.dataGroup[i] = data;
          break;
        }
      }
    },
    removeGroup: function (uuid) {
      this.dataGroup = $.grep(this.dataGroup, function (n) {return n.uuid !== uuid});
    },
    getCategory: function (uuid) {
      for (var i = 0; i < this.dataCate.length; i++) {
        if (this.dataCate[i].uuid === uuid) {
          return this.dataCate[i];
        }
      }
    },
    setCategory: function (data) {
      for (var i = 0; i < this.dataCate.length; i++) {
        if (this.dataCate[i].uuid === data.uuid) {
          this.dataCate[i] = data;
          break;
        }
      }
    },
    removeCategory: function (uuid) {
      this.dataCate = $.grep(this.dataCate, function (n) {return n.uuid !== uuid});
    },
    createGroup: function () {
      this.$form.modal_title.html(this.getText('create_title', 'group'));
      this.$form.modal_name_lbl.html(this.getText('name', 'group'));
      this.$form.modal_name_txt.val(this.getText('new_name', 'group'));
      this.$form.modal.attr('data-type', 'group');
      this.$form.modal.attr('data-uuid', '');
      this.$form.modal.attr('data-group', '');
      this.$form.modal.modal('show');
    },
    updateGroup: function (uuid) {
      var __group = this.getGroup(uuid) || {};
      if (!iNet.isEmpty(__group)) {
        this.$form.modal_title.html(this.getText('update_title', 'group'));
        this.$form.modal_name_lbl.html(this.getText('name', 'group'));
        this.$form.modal_name_txt.val(__group.name);
        this.$form.modal.attr('data-type', 'group');
        this.$form.modal.attr('data-uuid', __group.uuid);
        this.$form.modal.attr('data-group', __group.name);
        this.$form.modal.modal('show');
      }
    },
    deleteGroup: function (uuid) {
      var that = this;
      var __uuid = uuid || '';
      var __group = that.getGroup(__uuid);
      if (!iNet.isEmpty(__uuid)) {
        if (!that.confirmDeleteGroup) {
          var __dialogId = 'dialog-delete-group-' + iNet.alphaGenerateId();
          that.__dialogContentGroup = '<label for="confirm-' + __dialogId + '">{0}</label>';
          that.confirmDeleteGroup = new iNet.ui.dialog.ModalDialog({
            id: __dialogId,
            title: that.getText('del_title', 'group'),
            buttons: [{
              text: iNet.resources.message.button.ok,
              cls: 'btn-primary',
              icon: 'icon-ok icon-white',
              fn: function () {
                var __opts = that.confirmDeleteGroup.getOptions();
                $.postJSON(that.url.del, {uuid: __opts.uuid}, function (result) {
                  var __result = result || {};
                  if (__result.type !== 'ERROR') {
                    that.success(that.getText('del_title', 'group'), String.format(that.getText('del_success', 'group'), __opts.name));
                    that.$form.group.find('li[data-id="' + __opts.uuid + '"]').remove();
                    that.removeGroup(__opts.uuid);
                    if (that.selectedGroup === __opts.name) that.init();
                  } else {
                    that.success(that.getText('del_title', 'group'), String.format(that.getText('del_unsuccess', 'group'), __opts.name));
                  }
                  that.confirmDeleteGroup.hide();
                });
              }
            }, {
              text: iNet.resources.message.button.cancel,
              icon: 'icon-remove',
              fn: function () {
                that.confirmDeleteGroup.hide();
              }
            }]
          });
        }
        var __data = {uuid: __uuid, name: __group.name};
        that.confirmDeleteGroup.setOptions(__data);
        that.confirmDeleteGroup.setContent(String.format(that.__dialogContentGroup, String.format(that.getText('del_content', 'group'), __group.name)));
        that.confirmDeleteGroup.show();
      }
    },
    addGroup: function (data,value,list) {
      var __count=0;
      var __data = data || {};
      var __html = String.format('<li class="dd-item item-blue2" data-id="{0}" data-action="select">', __data.uuid);
      __html += String.format('<div class="dd-handle"><span>{0}</span>', __data.name);
      if (this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN)) {
        __html += '<div class="pull-right action-buttons">';
        __html += '<a class="blue hide" href="javascript:;" data-action="edit"><i class="ace-icon fa fa-pencil bigger-130"></i></a>';
        __html += '<a class="red" href="javascript:;" data-action="delete"><i class="ace-icon fa fa-trash-o bigger-130"></i></a>';
        __html += '</div>';
      }
      __html +='</div></li>';
      list.each(function(){
        if($(this).find('span').text()===value){
          __count+=1;
        }
      });
      if(__count===0) {
        this.$form.group.append(__html);
        $(__html).trigger('click');
        var __uuid = __data.uuid;
        this.$form.group.find('.dd-handle').removeClass('group-active');
        $('[data-id="' + __uuid + '"]').find('.dd-handle').addClass('group-active');
        console.log("__uuid", __uuid);
        console.log("this.getGroup(__uuid)", this.getGroup(__uuid));
        this.$form.category_group.html(String.format(this.getText('group', this.getModule()), this.getGroup(__uuid).name));
        this.loadCategory(__uuid);
      }
    },
    changeGroup: function (data) {
      var __data = data || {};
      if (!iNet.isEmpty(__data.uuid)) {
        var $group = this.$form.group.find('li[data-id="' + __data.uuid + '"]');
        $group.find('.dd-handle span').html(__data.name);
      }
    },
    loadCategory: function (group) {
      var __group = group || '';
      this.clearCategory();
      var __groupName = (this.getGroup(__group) || {}).name;
      this.selectedGroup = __groupName;
      for (var i = 0; i < this.dataCate.length; i++) {
        if (this.dataCate[i].group === __groupName) {
          this.addCategory(this.dataCate[i])
        }
      }
    },
    clearCategory: function () {
      this.$form.category.html('');
    },
    createCategory: function () {
      var dataGroup=$('#group-list').find('li:last');
      var spanText=$(dataGroup).find('span');
      var nameCategory=$(spanText).text();
      if(this.selectedGroup=='') {
          this.selectedGroup = nameCategory;
      }
      this.$form.modal_title.html(this.getText('create_title', 'category'));
      this.$form.modal_name_lbl.html(this.getText('name', 'category'));
      this.$form.modal_name_txt.val(this.getText('new_name', 'category'));
      this.$form.modal.attr('data-type', 'category');
      this.$form.modal.attr('data-uuid', '');
      this.$form.modal.attr('data-group', this.selectedGroup);
      this.$form.modal.modal('show');
    },
    updateCategory: function (uuid) {
      var __category = this.getCategory(uuid) || {};
      if (!iNet.isEmpty(__category)) {
        this.$form.modal_title.html(this.getText('update_title', 'category'));
        this.$form.modal_name_lbl.html(this.getText('name', 'category'));
        this.$form.modal_name_txt.val(__category.name);
        this.$form.modal.attr('data-type', 'category');
        this.$form.modal.attr('data-uuid', __category.uuid);
        this.$form.modal.attr('data-group', __category.group);
        this.$form.modal.modal('show');
      }
    },
    deleteCategory: function (uuid) {
      var that = this;
      var __uuid = uuid || '';
      var __category = that.getCategory(__uuid);
      if (!iNet.isEmpty(__uuid)) {
        if (!that.confirmDeleteCategory) {
          var __dialogId = 'dialog-delete-category-' + iNet.alphaGenerateId();
          that.__dialogContentCategory = '<label for="confirm-' + __dialogId + '">{0}</label>';
          that.confirmDeleteCategory = new iNet.ui.dialog.ModalDialog({
            id: __dialogId,
            title: that.getText('del_title', 'category'),
            buttons: [{
              text: iNet.resources.message.button.ok,
              cls: 'btn-primary',
              icon: 'icon-ok icon-white',
              fn: function () {
                var __opts = that.confirmDeleteCategory.getOptions();
                $.postJSON(that.url.del, {uuid: __opts.uuid}, function (result) {
                  var __result = result || {};
                  if (__result.type !== 'ERROR') {
                    that.success(that.getText('del_title', 'category'), String.format(that.getText('del_success', 'category'), __opts.name));
                    that.$form.category.find('li[data-id="' + __opts.uuid + '"]').remove();
                    that.removeCategory(__opts.uuid);
                  } else {
                    that.success(that.getText('del_title', 'category'), String.format(that.getText('del_unsuccess', 'category'), __opts.name));
                  }
                  that.confirmDeleteCategory.hide();
                });
              }
            }, {
              text: iNet.resources.message.button.cancel,
              icon: 'icon-remove',
              fn: function () {
                that.confirmDeleteCategory.hide();
              }
            }]
          });
        }
        var __data = {uuid: __uuid, name: __category.name};
        that.confirmDeleteCategory.setOptions(__data);
        that.confirmDeleteCategory.setContent(String.format(that.__dialogContentCategory, String.format(that.getText('del_content', 'category'), __category.name)));
        that.confirmDeleteCategory.show();
      }
    },
    addCategory: function (data,value) {
      var __count=0;
      var __data = data || {};
      var __html = String.format('<li class="dd-item item-green" data-id="{0}" data-action="select">', __data.uuid);
      __html += String.format('<div class="dd-handle"><span>{0}</span>', __data.name);
      if (this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN)) {
        __html += '<div class="pull-right action-buttons">';
        __html += '<a class="blue" href="javascript:;" data-action="edit"><i class="ace-icon fa fa-pencil bigger-130"></i></a>';
        __html += '<a class="red" href="javascript:;" data-action="delete"><i class="ace-icon fa fa-trash-o bigger-130"></i></a>';
        __html += '</div>';
      }
      __html += '</div></li>';
      $('.dd-item.item-green').each(function(){
        if($(this).find('span').text()===value){
          __count+=1;
        }
      });
      if(__count===0)
       this.$form.category.append(__html);
    },
    changeCategory: function (data) {
      var __data = data || {};
      if (!iNet.isEmpty(__data.uuid)) {
        var $group = this.$form.category.find('li[data-id="' + __data.uuid + '"]');
        $group.find('.dd-handle span').html(__data.name);
      }
    },
    save: function (data, type, callback) {
      var that = this;
      var __type = type || 'group';
      var __data = data || {};
      var __callback = callback || iNet.emptyFn();
      var isUpdate = !iNet.isEmpty(__data.uuid);
      isUpdate ? iNet.emptyFn() : delete __data.uuid;
      $.postJSON(that.url.create, data, function(result) {
        var __result = result || {};
        if (iNet.isDefined(__result.uuid) && !iNet.isEmpty(__result.uuid)) {
          if (!isUpdate) {
            that.success(that.getText('create_title', __type), String.format(that.getText('create_success', __type), __result.name));
            if (__type === 'group') {
              that.dataGroup.push({uuid: __result.uuid, group: __result.group, name: __result.name});
            } else {
              that.dataCate.push({uuid: __result.uuid, group: __result.group, name: __result.name});
            }
          } else {
            that.success(
                that.getText('update_title', __type),
                String.format(that.getText('update_success', __type), __result.name)
            );
            if (__type === 'group') {
              that.setGroup(__result);
            } else {
              that.setCategory(__result);
            }
          }
          that.$form.modal.modal('hide');
          __callback(__result);
        } else {
          if (!isUpdate) {
            that.error(that.getText('create_title', __type), String.format(that.getText('create_unsuccess', __type), __data.name));
          } else {
            that.error(
                that.getText('update_title', __type),
                String.format(that.getText('update_unsuccess', __type), __data.name)
            );
          }
        }
      });
    }
  });
});
