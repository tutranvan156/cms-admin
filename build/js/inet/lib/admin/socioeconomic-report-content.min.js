/**
 * #PACKAGE: admin
 * #MODULE: socioeconomic-report-content
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
   * @class iNet.ui.admin.SocioeconomicReportContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.SocioeconomicReportContent');
  iNet.ui.admin.SocioeconomicReportContent = function (options) {
    console.log('[SocioeconomicReportContent]', this);
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'socioeconomic-content-wg';
    this.formId = 'form-socioeconomic';
    this.module = 'socioeconomic';
    this.attachments = [];
    this.filenames = [];
    this.resourceParent = 'link';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      save: iNet.getPUrl('socioeconomic/save'),
      remove_file: iNet.getPUrl('socioeconomic/rmattach')
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
      content: $('#socioeconomic-content'),
      fileForm: $('#id-input-file-2'),
      listUpload: $('#file-attachments')
    };

    this.form.fileForm.on('change', function () {
      _this.checkingFile(this.files);
      _this.appendFile(_this.attachments);
    });

    this.form.listUpload.on('click', '.remove', function () {
      var thisEl = $(this);
      var name = thisEl.attr('data-name');
      var uuid = _this.getRecordId();
      var attachId = thisEl.attr('data-grid');
      var dialog = _this.confirmDlg(
          _this.getText('title_delete', _this.resourceParent),
          _this.getText('quesion_delete', _this.resourceParent),
          function () {
            dialog.hide();
            if (uuid) {
              $.postJSON(_this.url.remove_file, dialog.getData(), function (result) {
                if (result.type === 'ERROR')
                  _this.error(_this.getText('delete', _this.resourceParent), _this.getText('delete_error', _this.resourceParent));
                else {
                  thisEl.parents('.child-file').remove();
                  _this.success(_this.getText('delete', _this.resourceParent), _this.getText('delete_success', _this.resourceParent));
                  _this.removeFileInList(name);
                }
              });
            } else {
              thisEl.parents('.child-file').remove();
              _this.success(_this.getText('delete', _this.resourceParent), _this.getText('delete_success', _this.resourceParent));
              _this.removeFileInList(name);
            }
          });
      dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', _this.resourceParent));
      dialog.setData({
        uuid: uuid,
        attachId: attachId
      });
      dialog.show();
    });


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
    iNet.ui.admin.SocioeconomicReportContent.superclass.constructor.call(this);
    this.toolbar.BACK.on('click', function () {
      _this.hide();
      _this.form.fileForm.val('');
      _this.form.listUpload.html('');
      _this.fireEvent('back', _this);
    });
    this.toolbar.CREATE.on('click', function () {
      _this.clear();
    });
    this.toolbar.SAVE.on('click', function () {
      if (_this.formValidate.check()) {
        var formData = _this.getFormData();
        // formData.set('content', _this.editor.getValue());
        save(formData, function (result) {
          if (result.type !== CMSConfig.TYPE_ERROR) {
            _this.fireEvent('saved', result, _this);
            _this.success('Lưu báo cáo', 'Lưu báo cáo thành công');
          } else {
            _this.error('Lưu báo cáo', 'Quá trình tạo lưu báo cáo xảy ra lỗi');
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
  iNet.extend(iNet.ui.admin.SocioeconomicReportContent, iNet.ui.WidgetExt, {
    getRecordId: function () {
      return this.recordId || null;
    },
    setRecordId: function (id) {
      this.recordId = id;
    },
    setRecord: function (record) {
      this.setRecordId(record.uuid || null);
      this.attachments = record.attachments || [];
      console.log('[setRecord]', record);
      for (var key in record) {
        if (record.hasOwnProperty(key)) {
          if (key === 'content') {
            setTimeout(function(){
              this.editor.setValue(record[key]);
            }.bind(this), 100)
          } else if (key === 'attachments') {
            this.appendFile(record.attachments || []);
          } else {
            $('[name="' + key + '"]').val(record[key] || '');
          }
        }
      }
      FormUtils.showButton(this.toolbar.DEL, !iNet.isEmpty(this.getRecordId()));
    },
    removeFileInList: function (name) {
      this.attachments = $.grep(this.attachments, function (item) {
        return item.name !== name;
      });
      this.filenames = $.grep(this.filenames, function (item) {
        return item !== name;
      });
    },
    checkingFile: function (files) {
      for (var i = 0; i < (files || []).length; i++) {
        var file = files[i];
        if (this.filenames.indexOf(file.name) === -1) {
          this.filenames.push(file.name);
          this.attachments.push(file);
        }
      }
    },
    appendFile: function (listFile) {
      this.form.listUpload.empty();
      var html = '';
      for (var i = 0; i < listFile.length; i++) {
        listFile[i].name = listFile[i].name || listFile[i].file;
        html += iNet.Template.parse('list-file-script', listFile[i]);
      }
      this.form.listUpload.append(html);
    },
    clear: function () {
      document.getElementById(this.formId).reset();
      this.formValidate.clear();
      this.editor.setValue('');
      this.setRecordId(null);
      this.form.listUpload.empty();
      FormUtils.showButton(this.toolbar.DEL, false);
    },
    getFormData: function () {
      var fd = new FormData(document.getElementById(this.formId));
      for (var i = 0; i < this.attachments.length; i++) {
        fd.append(this.attachments[i].name, this.attachments[i]);
      }

      // fd.append('promulgationDate', new Date(this.convertDate(this.form.promulDate.val())).getTime());
      //
      // if (this.form.dateEffec.val())
      //   fd.append('effectedDate', new Date(this.convertDate(this.form.dateEffec.val())).getTime());

      // fd.append('timeExpiredComment', '0');
      // fd.append('allowComment', 'false');
      // fd.append('draft', 'false');
      return fd;
    }
  });

  var optionHtml = '';
  $.getJSON(iNet.getPUrl('socioeconomic/category/search'), {group: CMSConfig.GROUP_ECONOMY_REPORT}, function (results) {
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
