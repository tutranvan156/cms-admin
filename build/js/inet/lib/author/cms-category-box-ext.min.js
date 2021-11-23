// #PACKAGE: author
// #MODULE: cms-category-box-ext
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 18/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file CategoryBoxExt
 * @author nbchicong
 */
$(function () {
  iNet.ns('iNet.ui.author.CategoryBoxExt');
  iNet.ui.author.CategoryBoxExt = function (config) {
    var that = this, __cog = config || {}, timer = null;
    iNet.apply(this, __cog);
    this.id = this.id || 'category-box';
    this.currentSelected = [];
    this.groupHTML = '<div class="checkbox" style="padding-left:10px">' +
        '<label>' +
        '<b> {0}</b>' +
        '</label></div>';

    this.itemHTML = '<div class="checkbox">' +
        '<label>' +
        '<input name="{0}" type="checkbox" class="inp" value="{1}">' +
        '<span class="lbl"> {2}</span>' +
        '</label></div>';

    this.url = {
      list: iNet.getPUrl('cms/category/list'),
      create: iNet.getPUrl('cms/category/modify')
    };
    this.$toolbar = {
      CREATE: $('#btn-show-add-new-category'),
      SAVE: $('#btn-save-category'),
      CANCEL: $('#btn-hide-this-box')
    };
    this.$form = {
      boxContainer: $('#add-new-category-box'),
      cateBody: $('#list-cate-body'),
      name: $('#txt-category-input-name'),
      search: $('#txt-cate-box-input-search'),
      group: $('#cbb-group-input-name')
    };
    this.$toolbar.CREATE.on('click', function () {
      if (that.$form.boxContainer.is(':hidden')) {
        that.showNewBox();
      } else {
        that.hideNewBox();
      }
    });
    this.$toolbar.CANCEL.on('click', function () {
      that.hideNewBox();
    });
    this.$toolbar.SAVE.on('click', function () {
      $.postJSON(that.url.create, {name: that.$form.name.val(), group: that.$form.group.val()}, function (result) {
        var __result = result || {};
        if (iNet.isDefined(__result.uuid)) {
          that.insertItem(__result);
        } else {
        }
      });
    });
    this.$form.search.on('keyup', function () {
      var keyword = this.value;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        that.load({keyword: keyword});
      }, 300);
    });
    this.$form.cateBody.on('click', '.inp', function () {
      console.log('cate change value: ', this.value, this.checked);
      var index = that.currentSelected.indexOf(this.value);
      if (this.checked) {
        if (index === -1) {
          that.currentSelected.push(this.value);
        }
      } else {
        if (index !== -1) {
          that.currentSelected.splice(index, 1);
        }
      }
    });
    this.load();
  };
  iNet.extend(iNet.ui.author.CategoryBoxExt, iNet.ui.CMSComponent, {
    load: function (params) {
      var _this = this;
      var __params = {};
      if (params) {
        __params = params;
      }
      $.getJSON(this.url.list, __params, function (results) {
        var groups = convertData(results.items || []);
        var html = '';
        groups.forEach(function (group) {
          html += _this.renderGroup(group);
          (group.categories || []).forEach(function (category) {
            html += _this.renderItem(category);
          });
        });
        _this.$form.cateBody.html(html);
        if (_this.currentSelected.length > 0) {
          _this.setValue(_this.currentSelected);
        }
      });
    },
    clear: function () {
      this.currentSelected = [];
      this.$form.cateBody.find('input[type="checkbox"]').prop('checked', false);
    },
    setValue: function (value) {
      if (value) {
        this.currentSelected = value;
        var $radios = this.$form.cateBody.find('input[type="checkbox"]');
        $radios.each(function () {
          if (value.indexOf($(this).val()) !== -1) {
            $(this).prop('checked', true);
          } else {
            $(this).prop('checked', false);
          }
        });
      }
    },
    getValue: function () {
      // var $categoryEl = this.$form.cateBody.find('input[type="checkbox"]:checked');
      // var arrChecked = [];
      // $categoryEl.each(function () {
      //   arrChecked.push($(this).val());
      // });
      return this.currentSelected.join(',');
    },
    renderGroup: function (data) {
      return String.format(this.groupHTML, data.name);
    },
    renderItem: function (data) {
      return String.format(this.itemHTML, data.uuid, data.uuid, data.name);
    },
    insertItem: function (data) {
      $(this.renderItem(data)).appendTo(this.$form.cateBody);
    },
    showNewBox: function () {
      this.$form.boxContainer.show();
    },
    hideNewBox: function () {
      this.$form.boxContainer.hide();
    },
    enable: function () {
      this.$toolbar.CREATE.removeClass('disabled').removeAttr('disabled');
      this.$form.cateBody.find('[name="category"]').removeClass('disabled').removeAttr('disabled');
    },
    disable: function () {
      this.$toolbar.CREATE.addClass('disabled').attr('disabled', 'disabled');
      this.$form.cateBody.find('[name="category"]').addClass('disabled').attr('disabled', 'disabled');
    },
    readOnly: function () {
      FormUtils.showButton(this.$toolbar.CREATE, false);
      FormUtils.showButton(this.$toolbar.SAVE, false);
    }
  });

  function getGroupKey(name) {
    return name.removeAccents().replaceSpace('_').toUpperCase();
  }

  function convertData(items) {
    var groups = [];
    var categories = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      item.groupKey = getGroupKey(item.group);
      if (item.name === item.group) {
        item.categories = [];
        groups.push(item);
      } else {
        categories.push(item);
      }
    }

    function put2Group(category) {
      var putted = false;
      groups.forEach(function (group) {
        if (group.groupKey === category.groupKey) {
          putted = true;
          group.categories.push(category);
        }
      });
      if (!putted) {
        groups.push({
          language: category.language,
          site: category.site,
          name: category.group,
          groupKey: getGroupKey(category.group),
          categories: [category]
        });
      }
    }

    categories.forEach(function (category) {
      put2Group(category);
    });
    return groups;
  }
});