/**
 * #PACKAGE: review
 * #MODULE: cms-contact-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:01 29/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file ContactContentList.js
 */
$(function () {
  /**
   * @class iNet.ui.review.ContactContentList
   * @extends iNet.ui.author.FQAList
   */
  iNet.ns('iNet.ui.review.ContactContentList');
  iNet.ui.review.ContactContentList = function (options) {
    var _this = this;
    var __status = ['', 'CREATED', 'PUBLISHED'];
    iNet.apply(this, options || {});
    this.module = 'fqa';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.group = CMSConfig.GROUP_CONTACT;
    this.remote = true;

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'subject',
        label: this.getText('subject', this.getModule()),
        type: 'label'
      }, {
        property: 'owner',
        label: this.getText('owner', this.getModule()),
        type: 'label',
        align: 'center',
        cls: 'text-center',
        width: 150
      }, {
        property: 'status',
        label: this.getText('status', this.getModule()),
        sortable: true,
        type: 'text',
        align: 'center',
        cls: 'text-center',
        width: 100,
        renderer: function (v) {
          return String.format('<b class="{1}">{0}</b>', _this.getText(v.toLowerCase(), _this.getModule()), CMSUtils.getColorByStatus(v));
        }
      }, {
        property: 'created',
        label: this.getText('date', this.getModule()),
        sortable: true,
        type: 'text',
        width: 150,
        renderer: function (v) {
          return new Date(v).format(iNet.fullDateFormat);
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.del,
          icon: 'icon-trash',
          labelCls: 'label label-important',
          visibled: function (record) {
            return record.status === __status[1] && _this.getSecurity().hasRoles([CMSConfig.ROLE_ADMIN, CMSConfig.ROLE_FQA_REVIEWER]);
          },
          fn: function(record) {
            var dialog = _this.confirmDlg(
                _this.getText('del_title', _this.getModule()),
                _this.getText('del_content', _this.getModule()), function () {
                  var _this=this;
                  $.postJSON(_this.url.del, this.getOptions(), function (result) {
                    if (iNet.isDefined(result.uuid)) {
                      _this.removeByID(result.uuid);
                      _this.success(_this.getText('del_title', _this.getModule()), _this.getText('del_success', _this.getModule()));
                      _this.hide();
                    } else {
                      _this.error(_this.getText('del_title', _this.getModule()), _this.getText('del_unsuccess', _this.getModule()));
                    }
                  }, {
                    mask : _this.getMask(),
                    msg : iNet.resources.ajaxLoading.deleting
                  });
                }
            );
            dialog.setOptions({fqa: record.uuid});
            dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
            dialog.show();
          }
        }]
      }]
    });

    iNet.ui.review.ContactContentList.superclass.constructor.call(this);
  };

  iNet.extend(iNet.ui.review.ContactContentList, iNet.ui.author.FQAList);
});