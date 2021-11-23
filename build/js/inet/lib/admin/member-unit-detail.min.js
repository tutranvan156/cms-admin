/**
 * #PACKAGE: admin
 * #MODULE: member-unit-detail
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 18:42 24/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file MemberUnitDetail.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.MemberUnitDetail
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.MemberUnitDetail');
  iNet.ui.admin.MemberUnitDetail = function (options) {
    var _this = this;
    this.id = this.id || 'member-detail-wg';
    iNet.apply(this, options || {});
    var count = 0;
    this.$form = {
      formId: $('#form-info-member'),
      name: $('#name-member'),
      upload_file: $('#upload-avatar-member'),
      img_avatar: $('#avatar-box-image')
    };
    this.$toolbar = {
      SAVE: $('#member-detail-btn-save'),
      CREATE: $('#member-detail-btn-create'),
      BACK: $('#member-detail-btn-back'),
      REMOVE_AVATAR: $('#avatar-box-remove-btn'),
      UPLOAD_AVATAR: $('#avatar-box-upload-btn')
    };
    this.formValidate = new iNet.ui.form.Validate({
      id: _this.id,
      rules: [{
        id: this.$form.name.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return 'Hãy nhập tên thành viên';
        }
      }]
    });

    function readFile(input) {

      if (input.files && input.files[0]) {

        var FR = new FileReader();

        FR.addEventListener("load", function (e) {
          _this.$form.img_avatar.attr('src', e.target.result);
        });
        FR.readAsDataURL(input.files[0]);
      }

    }


    iNet.ui.admin.MemberUnitDetail.superclass.constructor.call(this);
    this.$toolbar.SAVE.click(function () {
      if (_this.validate()) {
        if (_this.getRecord().uuid) {
          UnitAPI.memberUpdate(_this.getDataAjax(), function (result) {
            if (result.type !== "ERROR") {
              count++;
              _this.success('Cập nhật thành viên', 'Cập nhật thành viên thành công');
            } else {
              _this.error('Cập nhật thành viên', 'Cập nhật thành viên xảy ra lỗi');
            }
          });
        } else {
          UnitAPI.memberCreate(_this.getDataAjax(), function (result) {
            if (result.type !== "ERROR") {
              count++;
              _this.success('Tạo thành viên', 'Tạo thành viên thành công');
              _this.setRecord(result);
              _this.setDataForm();
            } else {
              _this.error('Tạo thành viên', 'Tạo thành viên xảy ra lỗi');
            }
          });
        }
      }
    });

    this.$form.img_avatar.click(function () {
      _this.$form.upload_file.trigger('click');
    });

    this.$toolbar.CREATE.click(function () {
      _this.resetFrom();
      _this.setRecord({});
    });
    this.$toolbar.BACK.click(function () {
      if (count !== 0) {
        _this.fireEvent('load_member');
        count = 0;
      }
      _this.fireEvent('back_member');
      _this.$form.img_avatar.attr('src', _this.getPathImage("images/cmsadmin/other/no-thumb.png"))
      _this.hide();
    });
    this.$toolbar.UPLOAD_AVATAR.click(function () {
      _this.$form.upload_file.trigger('click');
    });
    this.$toolbar.REMOVE_AVATAR.click(function () {
      _this.$form.upload_file.val('');
      _this.$form.img_avatar.attr('src', _this.getPathImage("images/cmsadmin/other/no-thumb.png"))
    });

    this.$form.upload_file.on('change', function () {
      readFile(this);
    });
  }
  iNet.extend(iNet.ui.admin.MemberUnitDetail, iNet.ui.ViewWidget, {
    setOrgId: function (org) {
      this.$form.formId.find('[name="organization"]').val(org);
    },
    getPathImage: function (urlImg) {
      if (iNet.staticUrl.charAt(iNet.staticUrl.length - 1) !== '/') {
        return iNet.staticUrl + '/' + urlImg;
      } else {
        return iNet.staticUrl + urlImg;
      }
    },
    validate: function () {
      return this.formValidate.check();
    },
    resetFrom: function () {
      this.$form.formId.get(0).reset();
      this.$form.img_avatar.attr('src', this.getPathImage("images/cmsadmin/other/no-thumb.png"));
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
        if (__record[key] && key !== 'avatarImg' && key !== 'avatar') {
          this.$form.formId.find('[name="' + key + '"]').val(__record[key]);
        }
      }
      if (__record['avatarImg']) {
        this.$form.img_avatar.attr('src', __record['avatarImg']);
      } else {
        this.$form.img_avatar.attr('src', this.getPathImage("images/cmsadmin/other/no-thumb.png"))
      }
    },
    getDataAjax: function () {
      var formData = new FormData(document.getElementById('form-info-member'));
      return formData;
    },
    getDataForm: function () {
      var dataArray = this.$form.formId.serializeArray();
      var data = {};
      var length = dataArray.length;
      for (var i = 0; i < length; i++) {
        data[dataArray[i].name] = dataArray[i].value;
      }
      return data;
    }
  });

});