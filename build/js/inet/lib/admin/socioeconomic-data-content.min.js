/**
 * #PACKAGE: admin
 * #MODULE: socioeconomic-data-content
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:51 23/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file SocioeconomicDataContent.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.SocioeconomicDataContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.SocioeconomicDataContent');
  iNet.ui.admin.SocioeconomicDataContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'socioeconomic-content-wg';
    this.formId = 'form-socioeconomic';
    this.module = 'socioeconomic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      save: iNet.getPUrl('socioeconomic/save')
    };
    this.toolbar = {
      BACK: $('#btn-content-back'),
      CREATE: $('#btn-content-create'),
      SAVE: $('#btn-content-save'),
      DEL: $('#btn-content-delete')
    };

    this.form = {
      category: $('#socioeconomic-category'),
      title: $('#socioeconomic-title'),
      content: $('#socioeconomic-content')
    };

    this.formValidate = new iNet.ui.form.Validate({
      id: _this.id,
      rules: [{
        id: _this.form.category.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('category'));
        }
      }, {
        id: _this.form.title.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('title'));
        }
      }]
    });
    this.editor = new iNet.ui.common.LittleEditor({id: '#' + this.form.content.prop('id')});
    iNet.ui.admin.SocioeconomicDataContent.superclass.constructor.call(this);
    this.toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back', _this);
    });
    this.toolbar.CREATE.on('click', function () {
      _this.clear();
    });
    this.toolbar.SAVE.on('click', function () {
      if (_this.formValidate.check()) {
        var formData = new FormData(document.getElementById(_this.formId));
        formData.set('content', _this.editor.getValue());
        save(formData, function (result) {
          if (result.type !== CMSConfig.TYPE_ERROR) {
            _this.fireEvent('saved', result, _this);
            _this.success('Lưu số liệu', 'Lưu số liệu thành công');
          }
          else {
            _this.error('Lưu số liệu', 'Quá trình tạo lưu số liệu xảy ra lỗi');
          }
        });
      }
    });
    this.toolbar.DEL.on('click', function () {
      var dialog = _this.confirmDlg(
          _this.getText('title_delete'),
          _this.getText('question_delete'),
          function () {
            dialog.hide();
            remove(dialog.getData(), function (result) {
              if (result.type === CMSConfig.TYPE_ERROR)
                _this.error(_this.getText('title_delete'), _this.getText('delete_error'));
              else {
                _this.fireEvent('deleted', result, _this);
                _this.success(_this.getText('title_delete'), _this.getText('delete_success'));
              }
            });
          }
      );
      dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete'));
      dialog.show();
      dialog.setData({uuid: _this.getRecordId()});
    });
  };
  iNet.extend(iNet.ui.admin.SocioeconomicDataContent, iNet.ui.WidgetExt, {
    getRecordId: function () {
      return this.recordId || null;
    },
    setRecordId: function (id) {
      this.recordId = id;
    },
    setRecord: function (record) {
      //console.log('[setRecord]', record);
      this.setRecordId(record.uuid || null);
      for (var key in record) {
        if (record.hasOwnProperty(key)) {
          if (key === 'content') {
            this.editor.setValue(record['content']);
          }
          else {
            $('[name="' + key + '"]').val(record[key] || '');
          }
        }
      }
      FormUtils.showButton(this.toolbar.DEL, !iNet.isEmpty(this.getRecordId()));
    },
    clear: function () {
      document.getElementById(this.formId).reset();
      this.formValidate.clear();
      this.editor.setValue('');
      this.setRecordId(null);
      FormUtils.showButton(this.toolbar.DEL, false);
    }
  });

  var optionHtml = '';
  $.getJSON(iNet.getPUrl('socioeconomic/category/search'), {group: CMSConfig.GROUP_ECONOMY_DATA}, function (results) {
    renderOption(CMSUtils.convert2Tree(results.items || []), '');
    var option = '<option value="">--- Chọn chuyên mục ---</option>' + optionHtml;
    $('#socioeconomic-category').html(option);
  });

  function renderOption(data, pre) {
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      optionHtml += '<option value="' + item.uuid + '">' + pre + item.name + '</option>';
      if (item.childrens && item.childrens.length > 0) {
        renderOption(item.childrens, pre + '-');
      }
    }
  }

  function save(params, callback) {
    $.submitData({
      url: iNet.getPUrl('socioeconomic/save'),
      params: params,
      method: 'POST',
      callback: function (results) {
        callback && callback(results);
      }
    });
  }

  function remove(params, callback) {
    $.postJSON(iNet.getPUrl('socioeconomic/remove'), params, function (results) {
      callback && callback(results);
    });
  }
});
