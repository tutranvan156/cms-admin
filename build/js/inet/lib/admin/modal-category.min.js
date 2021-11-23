/**
 * #PACKAGE: admin
 * #MODULE: modal-category
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 16:09 21/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ModalCategory.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ModalCategory
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.ModalCategory');
  iNet.ui.admin.ModalCategory = function (options) {
    var _this = this;

    iNet.apply(this, options || {});
    this.id = this.id || 'category-select';
    this.$modal = {
      modal: $('#modal-category'),
      modal_ok: $('#btn-ok-category'),
      category_group: $('#category-group')
    };
    iNet.ui.admin.ModalCategory.superclass.constructor.call(this);
    this.$modal.modal_ok.click(function () {
      _this.hideModal();
      _this.fireEvent('submit_category', _this.getValue());
    });
    this.$modal.modal.on('hide.bs.modal', function () {
      console.log('hideModal');
    });

  };
  iNet.extend(iNet.ui.admin.ModalCategory, iNet.ui.ViewWidget, {
    setCategory: function (category) {
      this.cate = category;
    },
    getCategory: function () {
      return this.cate || [];
    },
    setValue: function (value) {
      this.categories = value;
    },
    getValue: function () {
      return this.categories || [];
    },
    renderHtml: function () {
      var _this = this;
      _this.$modal.category_group.html('');
      var items = _this.getCategory();
      if (items.length != 0) {
        var dataGroup = _this.groupByKey(items, 'group');
        var index = 0;
        for (var key in dataGroup) {
          _this.$modal.category_group.append(iNet.Template.parse('group-tpl', {
            index: index,
            name: key
          }));
          if (dataGroup[key].length > 0) {
            var htmlCategory = '';
            for (var i = 0; i < dataGroup[key].length; i++) {
              if (dataGroup[key][i].name !== key) {
                htmlCategory += iNet.Template.parse('category-tpl', dataGroup[key][i]);
              }
            }
            $('#group-' + index).next().append(htmlCategory);
          }
          index++;
        }
        $('.inp').each(function () {
          var $el = $(this);
          var index = (_this.getValue()).findIndex(function (item) {
            return item.uuid === $el.val()
          });
          if (index !== -1) {
            $el.prop('checked', true);
          }
        });
        var __category = _this.getValue();
        _this.$modal.category_group.on('click', '.inp', function () {
          var el = this;
          if ($(this).is(':checked')) {
            __category.push({
              uuid: $(el).val(),
              name: $(el).attr('data-name')
            });
            _this.setValue(__category);
            console.log('getValueChecked: ',_this.getValue());
          } else {
            var __index = __category.findIndex(function (item) {
              return item.uuid === $(el).val()
            });
            if (__index !== -1) {
              __category.splice(__index, 1);
              _this.setValue(__category);
              console.log('getValueUnChecked: ',_this.getValue());
            }
          }
        });
      }

    },
    showModal: function () {
      this.$modal.modal.modal('show');
    },
    hideModal: function () {
      this.$modal.modal.modal('hide');
    },
    loadCategory: function (callback) {
      $.getJSON(this.url.list_category, {}, function (data) {
        if (data.type !== 'ERROR') {
          callback && callback(data);
        }
      });
    },
    groupByKey: function (data, key) {
      return data.reduce(function (result, current) {
        result[current[key]] = result[current[key]] || [];
        result[current[key]].push(current);
        return result;
      }, {});
    }
  });
});
