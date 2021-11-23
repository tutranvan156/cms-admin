/**
 * #PACKAGE: document
 * #MODULE: publish-content
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 13:55 19/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file PublishContent.js
 */
$(function () {
  /**
   * @class iNet.ui.document.PublishContent
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.document.PublishContent');
  iNet.ui.document.PublishContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'published-content-wg';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.resourceParent = 'link';

    this.$btn = {
      BACK: $('#published-btn-back'),
      PROMULGATION: $('#content-draft-promulgation')
    };

    this.$form = {
      listUpload: $('#file-attachments')
    };

    this.url = {
      download: iNet.getPUrl('steering/document/download'),
      load: iNet.getPUrl('steering/document/load')
    };
    this.$form.listUpload.on('click', '.btn-download', function () {
      var thisEl = $(this);
      var attachId = thisEl.attr('data-grid');
      $.download(_this.url.download, {uuid: _this.getUUID(), contentId: attachId, publisherCode: _this.getCode()});
    });

    iNet.ui.document.PublishContent.superclass.constructor.call(this);
    this.$btn.BACK.click(function () {
      _this.hide();
      _this.fireEvent(_this.getEvent('back_list'), _this);
    });

    this.$btn.PROMULGATION.click(function () {
      _this.hide();
      _this.fireEvent(_this.getEvent('promulgation'), _this.getRecord(), _this);
    });
  };
  iNet.extend(iNet.ui.document.PublishContent, iNet.ui.ViewWidget, {
    showBtnPromulgation: function () {
      this.$btn.PROMULGATION.show();
    },
    hideBtnPromulgation: function () {
      this.$btn.PROMULGATION.css('display', 'none');
    },
    setData: function (data) {
      var _this = this;
      $.postJSON(this.url.load, {uuid: data.uuid, publisherCode: data.publisherCode}, function (record) {
        if (record.receivers.length > 0) {
          record['organName'] = record.receivers[0].organName;
        }
        record.receiveDate = new Date(record.receiveDate).format('d/m/Y');
        if (record.publicStatus) {
          _this.hideBtnPromulgation();
        }
        else {
          _this.showBtnPromulgation();
        }
        _this.setRecord(record);
        _this.setUuid(record.uuid);
        _this.setCode(record.publisherCode);
        _this.attachments = record.attachments || [];
        _this.appendFile(record.attachments || []);
        for (var x in record) {
          if (x !== 'attachments')
            $('[name=' + x + ']').val(record[x]);
        }
      });

    },
    setRecord: function (x) {
      this.record = x;
    },
    getRecord: function () {
      return this.record;
    },
    setUuid: function (x) {
      this.uuid = x;
    },
    getUUID: function () {
      return this.uuid || '';
    },
    setCode: function (x) {
      this.code = x;
    },
    getCode: function () {
      return this.code || '';
    },
    appendFile: function (listFile) {
      this.$form.listUpload.empty();
      var html = '';
      for (var i = 0; i < listFile.length; i++) {
        listFile[i].name = listFile[i].name || listFile[i].file;
        html += iNet.Template.parse('list-file-script', listFile[i]);
      }
      this.$form.listUpload.append(html);
    }
  });
});
