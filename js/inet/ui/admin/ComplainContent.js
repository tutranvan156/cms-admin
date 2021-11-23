/**
 * #PACKAGE: admin
 * #MODULE: complain-content
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 13:52 11/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ComplainContent.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ComplainContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.ComplainContent');
  iNet.ui.admin.ComplainContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'complain-content-wg';
    this.module = 'complain';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.resourceParent = 'link';
    this.count = 0;
    this.url = {
      created: iNet.getPUrl('cms/complain/create'),
      update: iNet.getPUrl('cms/complain/update'),
      load: iNet.getPUrl('cmsfaq/load')
    };

    this.$toolbar = {
      BACK: $('#complain-btn-back'),
      CREATE: $('#complain-btn-create'),
      SAVE: $('#complain-btn-save')
    };

    this.form = {
      subject: $('#subject-complain'),
      content: $('#content-complain'),
      owner: $('#owner-complain'),
      detailContent: $('#detail-complain'),
      formComplain: $('#form-complain'),
      select: $('#category-complain')
    };

    this.formValidate = new iNet.ui.form.Validate({

      id: _this.id,
      rules: [{
        id: _this.form.select.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_name_type'));
        }
      }, {
        id: _this.form.subject.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_subject'));
        }
      }
      // , {
      //   id: _this.form.owner.prop('id'),
      //   validate: function (v) {
      //     if (iNet.isEmpty(v))
      //       return String.format(iNet.resources.message.field_not_empty, _this.getText('validate_onwer'));
      //   }
      // }
      ]
    });
    this.editor = new iNet.ui.common.LittleEditor({id: '#detail-complain'});
    iNet.ui.admin.ComplainContent.superclass.constructor.call(this);
    this.$toolbar.BACK.on('click', function () {
      _this.resetSelect2(_this.form.select);
      _this.hide();
      _this.fireEvent(_this.getEvent('back'), _this);
      if (_this.count !== 0) {
        _this.fireEvent(_this.getEvent('load'), _this);
        _this.isUpdateCounter = 0;
      }
    });

    this.$toolbar.CREATE.on('click', function () {
      _this.clearDataForm();
    });

    this.$toolbar.SAVE.on('click', function () {
      if (_this.formValidate.check()) {
        if (_this.getComplainId())
          _this.setUrl(_this.url.update);
        else
          _this.setUrl(_this.url.created);
        var formData = new FormData(document.getElementById('form-complain'));
        formData.set('answer', _this.editor.getValue());
        $.submitData({
          url: _this.getUrl(),
          params: formData,
          method: 'POST',
          callback: function (result) {
            if (result.type === 'ERROR') {
              if (_this.getComplainId())
                _this.error(_this.getText('update', _this.resourceParent), _this.getText('update_error', _this.resourceParent));
              else
                _this.error(_this.getText('create', _this.resourceParent), _this.getText('create_error', _this.resourceParent));
            }
            else {
              _this.isUpdateCounter += 1;
              if (_this.getComplainId())
                _this.success(_this.getText('update', _this.resourceParent), _this.getText('update_success', _this.resourceParent));
              else {
                _this.success(_this.getText('create', _this.resourceParent), _this.getText('create_success', _this.resourceParent));
                _this.setComplainId(result.uuid);
              }
            }
          }
        });
      }
    });
  };

  iNet.extend(iNet.ui.admin.ComplainContent, iNet.ui.WidgetExt, {
    setComplainId: function (x) {
      this._id = x;
    },
    getComplainId: function () {
      return this._id;
    },
    setUrl: function (x) {
      this.__url = x;
    },
    getUrl: function () {
      return this.__url;
    },
    clearDataForm: function () {
      this.form.formComplain[0].reset();
      this.setComplainId(null);
    },
    resetSelect2: function (el) {
      el.val('').trigger('change.select2');
    },
    triggerSelect2: function (el, value) {
      el.val(value).trigger('change.select2');
    },
    mapDataForm: function () {
      var _this = this;
      $.get(_this.url.load, {fqa: _this.getComplainId()}, function (result) {
        for (var x in result) {
          if (x === 'answer') {
            _this.editor.setValue(result[x]);
          }
          else if (x === 'category') {
            _this.form.select.append('<option value="' + result[x] + '"></option>');
            _this.form.select.val(result[x]);
            _this.triggerSelect2(_this.form.select, result[x]);
          }
          else {
            $('[name="' + x + '"]').val(result[x]);
          }
        }
      });
    }
  });
});
