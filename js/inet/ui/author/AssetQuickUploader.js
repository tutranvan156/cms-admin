// #PACKAGE: author
// #MODULE: cms-asset-quick-uploader
/**
 * quick upload image/document
 * created by huyendv@inetcloud.vn
 * 15:40 26/06/2015
 */
$(function () {
  iNet.ns('iNet.ui.author.AssetQuickUploader');
  iNet.ui.author.AssetQuickUploader = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.id = this.id || 'quick-upload-wg';
    this.$element = $('#' + this.id);
    this.type = this.type || CMSConfig.ASSET_TYPE_IMAGE;
    this.url = {
      folder: iNet.getPUrl('cms/asset/category'),
      upload: iNet.getPUrl('cms/asset/upload')
    };

    this.$quickUpload = {
      uploader: $('#quick-upload-uploader'),
      folder_modal: $('#quick-upload-folder-modal'),
      folder_select: $('#quick-upload-folder-modal-folder-list'),
      folder_ok: $('#quick-upload-folder-modal-btn-ok')
    };

    iNet.ui.author.AssetQuickUploader.superclass.constructor.call(this);

    this.quickUploadType = '';
    this.selectedFiles = [];
    this.$quickUpload.uploader.on('change', function () {
      if (this.files.length < 1) {
        this.files = [];
        return;
      }
      var __files = this.files || [];
      if (__files.length > 0){
        for (var i = 0; i < __files.length; i++) {
          that.selectedFiles.push(__files.item(i) || {})
        }
        that.$quickUpload.folder_modal.modal('show');
      }
    });
    this.$quickUpload.folder_ok.on('click', function () {
      var __type = that.quickUploadType || 'IMAGE';
      var __category = that.$quickUpload.folder_select.val();
      that.$quickUpload.folder_modal.modal('hide');
      for (var i = 0; i < that.selectedFiles.length; i++){
        var formData = new FormData();
        formData.append(that.selectedFiles[i].name, that.selectedFiles[i]);
        formData.append('type', __type);
        formData.append('category', __category);
        $.submitData({
          url: that.url.upload,
          params: formData,
          method: 'POST',
          callback: function (data) {
            var __data = data.elements || {};
            if (!iNet.isEmpty(__data)) {
              var __src = CMSUtils.getMediaPath(__data[0], that.quickUploadType === CMSConfig.ASSET_TYPE_DOCUMENT);
              that.fireEvent('uploaded', __src, __data);
            }
          },
          onProgress: function (value) {

          },
          onComplete: function (e) {

          },
          onError: function (e) {

          }
        });
      }
    });
    $.getJSON(this.url.folder, {type: this.type}, function (results) {
      var elements = results.elements || [];
      var html = '';
      elements.forEach(function (value) {
        html += '<option value="' + value + '">' + value + '</option>';
      });
      that.$quickUpload.folder_select.html(html);
    });
  };
  iNet.extend(iNet.ui.author.AssetQuickUploader, iNet.ui.CMSComponent, {
    quickUpload: function (type, multiple, accept) {
      this.quickUploadType = type || 'IMAGE';
      this.selectedFiles = [];
      this.$quickUpload.uploader.attr('multiple', multiple || false).attr('accept', accept || '');
      this.$quickUpload.uploader.trigger('click');
    }
  });
});