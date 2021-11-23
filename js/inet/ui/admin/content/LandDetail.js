
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 17:29 20/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file LandDetail.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.LandDetail
   * @extends iNet.ui.admin.DynamicContentDetail
   */
  iNet.ns('iNet.ui.admin.LandDetail');
  iNet.ui.admin.LandDetail = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'land-detail-wg';
    this.module = 'land';
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.formId = 'form-content';
    this.group = CMSConfig.GROUP_LAND;
    this.form = {
      name: $('#txt-name'),
      type: $('#cbb-type'),
      content: $('#txt-content')
    };

    console.log('formId: ', this.formId);
    this.formValidator = new iNet.ui.form.Validate({
      id: this.formId,
      rules: [{
        id: this.form.name.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('name'));
        }
      }, {
        id: this.form.type.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('type'));
        }
      }]
    });

    iNet.ui.admin.LandDetail.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.admin.LandDetail, iNet.ui.admin.DynamicContentDetail, {
    getFormData: function () {
      var data = new FormData(document.getElementById(this.formId));
      data.append('content', this.getEditor().getValue());
      data.append('group', this.group);
      return data;
    }
  });
});