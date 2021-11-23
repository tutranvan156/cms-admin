/**
 * #PACKAGE: admin
 * #MODULE: unit-detail
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 18:42 24/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file UnitDetail.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.UnitDetail
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.UnitDetail');
  iNet.ui.admin.UnitDetail = function (options) {
    var _this = this;
    this.id = this.id || 'org-detail-wg';
    iNet.apply(this, options || {});
    var count = 0;
    this.$form = {
      formId: $('#form-info-org'),
      name: $('#name-organ')
    };
    this.$toolbar = {
      SAVE: $('#org-detail-btn-save'),
      CREATE: $('#org-detail-btn-create'),
      BACK: $('#org-detail-btn-back')
    };

    this.formValidate = new iNet.ui.form.Validate({
      id: _this.id,
      rules: [{
        id: this.$form.name.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return 'Hãy nhập tên đơn vị';
        }
      }]
    });

    iNet.ui.admin.UnitDetail.superclass.constructor.call(this);
    this.$toolbar.SAVE.click(function () {
      if (_this.validate()) {
        if (_this.getRecord().uuid) {
          UnitAPI.update(_this.getDataForm(), function (result) {
            if (result.type !== "ERROR") {
              count++;
              _this.success('Cập nhật đơn vị', 'Cập nhật đơn vị thành công');
            } else {
              _this.error('Cập nhật đơn vị', 'Cập nhật đơn vị xảy ra lỗi');
            }
          });
        } else {
          UnitAPI.create(_this.getDataForm(), function (result) {
            if (result.type !== "ERROR") {
              count++;
              _this.success('Tạo đơn vị', 'Tạo đơn vị thành công');
              _this.setRecord(result);
              _this.setDataForm();
            } else {
              _this.error('Tạo đơn vị', 'Tạo đơn vị xảy ra lỗi');
            }
          });
        }
      }
    });

    this.$toolbar.CREATE.click(function () {
      _this.resetFrom();
      _this.setRecord({});
    });
    this.$toolbar.BACK.click(function () {
      if (count !== 0) {
        _this.fireEvent('load_unit');
        count = 0;
      }
      _this.fireEvent('back_unit');
      _this.hide();
    });
  }
  iNet.extend(iNet.ui.admin.UnitDetail, iNet.ui.ViewWidget, {
    setParentId: function (id) {
      this.parentId = id;
    },
    getParentId: function () {
      return this.parentId;
    },
    validate: function () {
      return this.formValidate.check();
    },
    resetFrom: function () {
      this.$form.formId.get(0).reset();
    },
    setRecord: function (record) {
      this.record = record;
    },
    getRecord: function () {
      return this.record || {};
    },
    setDataForm: function () {
      var __record = this.getRecord();
      for (var key in __record) {
        if (__record[key]) {
          this.$form.formId.find('[name="' + key + '"]').val(__record[key]);
        }
      }
    },
    getDataForm: function () {
      var dataArray = this.$form.formId.serializeArray();
      var data = {};
      var length = dataArray.length;
      for (var i = 0; i < length; i++) {
        data[dataArray[i].name] = dataArray[i].value;
      }
      data['parent'] = this.getParentId();
      return data;
    }
  });
});