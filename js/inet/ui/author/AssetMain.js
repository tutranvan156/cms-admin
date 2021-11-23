// #PACKAGE: author
// #MODULE: cms-asset-main
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.author.AssetManager}
   */
  var wgFile = null;
  var $wgToolbar = $('#wg-toolbar');
  var $wgType = $('#wg-type');
  var isSelect = typeof isSelect !== 'undefined' ? isSelect : false;
  var isEdit = typeof isEdit !== 'undefined' ? isEdit : false;

  var $form = {
      image: $('#type-image'),
      document: $('#type-document'),
      video: $('#type-video'),
      limit: $('#type-list-limit-lbl'),
      add_more: $('#type-list-add-more'),
      upload: $('#file-uploader'),
      image_folder: $('#type-image-total-folder'),
      image_file: $('#type-image-total-file'),
      image_size: $('#type-image-total-size'),
      document_folder: $('#type-document-total-folder'),
      document_file: $('#type-document-total-file'),
      document_size: $('#type-document-total-size'),
      video_size: $('#type-video-total-size'),
      video_file: $('#type-video-total-file'),
      video_folder: $('#type-video-total-folder')

  };

  var loadFile = function () {
    if (!wgFile) {
      wgFile = new iNet.ui.author.AssetManager({
        isEdit: isEdit,
        isSelect: isSelect
      });
      wgFile.on('back', function () {
        $wgToolbar.hide();
        $wgType.show();
        loadLimit();
      });
    }
    $wgToolbar.show();
    $wgType.hide();
    wgFile.show();
    return wgFile;
  };

  $form.image.on('click', function () {
    $form.upload.attr('accept', 'image/*');
    var __files = loadFile();
    __files.setType(__files.mediaType.image);
    __files.init();
    __files.$toolbar.total.show();
    __files.$toolbar.upload_other.hide();
  });

  $form.document.on('click', function () {
    $form.upload.removeAttr('accept');
    var __files = loadFile();
    __files.setType(__files.mediaType.document);
    __files.init();
    __files.$toolbar.total.hide();
    __files.$toolbar.upload_other.show();
  });

  $form.video.on('click', function () {
    $form.upload.attr('accept', 'video/*');
    $form.upload.attr('data-max-size', 20480000);
    var __files = loadFile();
    __files.setType(__files.mediaType.video);
    __files.init();
    __files.$toolbar.total.hide();
    __files.$toolbar.upload_other.show();
  });

  $form.add_more.on('click', function () {

  });

  var loadLimit = function () {
    $.postJSON(iNet.getPUrl('cms/summary/media'), {}, function (result) {
      var __result = result || {};
      if (__result.type !== 'ERROR') {
        var __list = __result.elements || [];
        var __total = 0;
        for (var i = 0; i < __list.length; i++) {
          __total += __list[i].size;
          if (__list[i].type === 'IMAGE') {
            $form.image_folder.html(__list[i].folder);
            $form.image_file.html(__list[i].file);
            $form.image_size.html(FileUtils.getSize(__list[i].size));
          } else if (__list[i].type === 'DOCUMENT') {
            $form.document_folder.html(__list[i].folder);
            $form.document_file.html(__list[i].file);
            $form.document_size.html(FileUtils.getSize(__list[i].size));
          }
          else if (__list[i].type === 'VIDEO') {
              $form.video_folder.html(__list[i].folder);
              $form.video_file.html(__list[i].file);
              $form.video_size.html(FileUtils.getSize(__list[i].size));
          }
        }
        var __limit = String.format(iNet.resources.cmsadmin.media.limit, FileUtils.getSize(__total));
        $form.limit.html(__limit);
      }
    })
  };

  loadLimit();
});