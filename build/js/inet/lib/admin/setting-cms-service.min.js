/**
 * #PACKAGE: admin
 * #MODULE: setting-cms-service
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 16:46 16/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file Setting.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.Setting
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.Setting');
  iNet.ui.admin.Setting = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'page-setting';
    this.module = 'setting';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    var params = {};
    this.url = {
      save: iNet.getPUrl('cms/system/create'),
      load: iNet.getPUrl('cms/system/load')
    };
    // this.checkFormatValue = '';
    this.checkReviewComment = false;
    this.checkAllowedComment = false;
    // this.settingSite = {
    //   siteTitle: $('#title-site'),
    //   siteDescription: $('#site-description')
    // };
    // this.settingCms = {
    //   sizePage: $('#size-page'),
    //   recentlyPage: $('#recently-page'),
    //   mostlyPage: $('#mostly-page'),
    //   popularPage: $('#popular-page')
    // };
    this.settingRss = {
      typeRss: $('#type-rss'),
      titleRss: $('#title-rss'),
      linkRss: $('#link-rss'),
      desRss: $('#des-rss'),
      copyRss: $('#copy-rss'),
      speechAPI: $('#speech-api'),
      speechAPIKey: $('#speech-api-key'),
      speechVoice: $('#speech-voice'),
      uploadFolder: $('#upload-folder')
    };
    // this.settingMedia = {
    //   smWidth: $('#sm-width'),
    //   smHeight: $('#sm-height'),
    //   imgWidth: $('#img-width'),
    //   imgHeight: $('#img-height'),
    //   lgWidth: $('#lg-width'),
    //   lgHeight: $('#lg-height')
    // };
    // this.settingGoogle = {
    //   analyCode: $('#analy-code'),
    //   verCode: $('#ver-code')
    // };
    this.settingCheck = {
      checkFormat: $('.check-format'),
      checkComment: $('.check-comment'),
      valueFormatRadio: $('#value-format-radio')
    };
    this.settingShared = {
      newsShared: $('#chk-news-shared')
    };
    this.$toolbar = {
      SAVE: $('#toolbar-btn-save')
    };

    // var check = $('[name=dateformat]');
    // (check).each(function () {
    //   $(this).on('change', function () {
    //     if (this.checked) {
    //       $(this).addClass('checked');
    //       var textVal = $(this).parent('label').find('input[type=text]');
    //       if (textVal.length !== 0) {
    //         textVal.on('keyup', function () {
    //           _this.checkFormatValue = textVal.val();
    //           console.log('spantext: ', _this.checkFormatValue);
    //         });
    //       }
    //       else {
    //         var spanValue = $(this).parent('label').find('span');
    //         console.log('spantext: ', spanValue.text());
    //         _this.checkFormatValue = spanValue.text();
    //       }
    //     }
    //   });
    // });
    var reviewComment = $('[name=comment-viewcheck]');
    var allowedComment = $('[name=commentcheck]');

    /**
     * @type {iNet.ui.admin.RSSUrlList}
     */
    this.rssList = new iNet.ui.admin.RSSUrlList();

    this.prefixShared = new iNet.ui.admin.PortalSharedList();

    this.portalGroup = new iNet.ui.admin.PortalGroupList();

    this.speechSynthesis = new iNet.ui.admin.SpeechSynthesisList();

    this.subportalList = new iNet.ui.admin.SubPortalConfigList();

    iNet.ui.admin.Setting.superclass.constructor.call(this);

    $.postJSON(_this.url.load, {}, function (result) {
      // var dateformat = result.dateFormat || '';
      // _this.settingCms.sizePage.val(result.pageSize || '');
      // _this.settingCms.recentlyPage.val(result.recently || '');
      // _this.settingCms.popularPage.val(result.popular || '');
      // _this.settingCms.mostlyPage.val(result.mostly || '');
      _this.settingRss.copyRss.val(result.rssCopyright || '');
      _this.settingRss.desRss.val(result.rssDescription || '');
      _this.settingRss.linkRss.val(result.rssLink || '');
      _this.settingRss.titleRss.val(result.rssTitle || '');

      _this.settingRss.speechAPI.val(result.speechAPI || '');
      _this.settingRss.speechAPIKey.val(result.speechAPIKey || '');
      _this.settingRss.speechVoice.val(result.speechVoice || '');

      _this.settingRss.uploadFolder.val(result.uploadFolder || '');
      // _this.settingSite.siteDescription.val(result.siteDescription || '');
      // _this.settingSite.siteTitle.val(result.siteTitle || '');
      // _this.settingMedia.lgWidth.val(result.lgImgWidth || '');
      // _this.settingMedia.lgHeight.val(result.lgImgHeight || '');
      // _this.settingMedia.imgHeight.val(result.imgHeight || '');
      // _this.settingMedia.imgWidth.val(result.imgWidth || '');
      // _this.settingMedia.smHeight.val(result.smImgHeight || '');
      // _this.settingMedia.smWidth.val(result.smImgWidth || '');
      // _this.settingGoogle.analyCode.val(result.ggAnalyticCode || '');
      // _this.settingGoogle.verCode.val(result.ggSiteVerification || '');
      // if (dateformat !== '') {
      //   var spanText = $("span:contains(" + dateformat + ")");
      //   if (spanText.length !== 0) {
      //     var inputRadio = spanText.prev();
      //     inputRadio.prop('checked', true);
      //   }
      //   else {
      //     _this.settingCheck.valueFormatRadio.val(dateformat);
      //     var radioText = _this.settingCheck.valueFormatRadio.prev();
      //     radioText.prop('checked', true);
      //   }
      // }
      if (result.reviewComment === true) {
        reviewComment.prop('checked', true);
        _this.checkReviewComment = true;
      }
      if (result.allowedComment === true) {
        allowedComment.prop('checked', true);
        _this.checkAllowedComment = true;
      }

      // var loadRadio = $("input[name='dateformat']:checked");
      // if (loadRadio.length !== 0) {
      //   var inputVal = loadRadio.next('input');
      //   if (inputVal.length > 0) {
      //     _this.checkFormatValue = inputVal.val();
      //   }
      //   else {
      //     _this.checkFormatValue = loadRadio.next('span').text();
      //   }
      // }

      var rssUrls = result.rssUrls || [];
      _this.rssList.setSourceData(rssUrls).loadData();
    });
    reviewComment.on('change', function () {
      _this.checkReviewComment = this.checked;
    });

    allowedComment.on('change', function () {
      _this.checkAllowedComment = this.checked;
    });
    this.$toolbar.SAVE.on('click', function () {
      // params.pageSize = _this.settingCms.sizePage.val();
      // params.recently = _this.settingCms.recentlyPage.val();
      // params.mostly = _this.settingCms.mostlyPage.val();
      // params.popular = _this.settingCms.popularPage.val();
      // params.smImgWidth = _this.settingMedia.smWidth.val();
      // params.smImgHeight = _this.settingMedia.smHeight.val();
      // params.imgWidth = _this.settingMedia.imgWidth.val();
      // params.imgHeight = _this.settingMedia.imgHeight.val();
      // params.lgImgWidth = _this.settingMedia.lgWidth.val();
      // params.lgImgHeight = _this.settingMedia.lgHeight.val();
      params.rssTitle = _this.settingRss.titleRss.val();
      params.rssLink = _this.settingRss.linkRss.val();
      params.rssDescription = _this.settingRss.desRss.val();
      params.rssCopyright = _this.settingRss.copyRss.val();

      params.speechAPI = _this.settingRss.speechAPI.val();
      params.speechAPIKey = _this.settingRss.speechAPIKey.val();
      params.speechVoice = _this.settingRss.speechVoice.val();
      // params.siteTitle = _this.settingSite.siteTitle.val();
      // params.siteDescription = _this.settingSite.siteDescription.val();
      // params.dateFormat = _this.checkFormatValue;
      params.reviewComment = _this.checkReviewComment;
      params.allowedComment = _this.checkAllowedComment;
      if (_this.settingRss.uploadFolder.val()) {
        params.uploadFolder = _this.settingRss.uploadFolder.val();
      }
      // console.log('dateformat: ', _this.checkFormatValue);
      params.urls = JSON.stringify(_this.rssList.getData());
      $.postJSON(_this.url.save, params, function (result) {
        _this.success('Cài đặt', 'Quá trình cài đặt thành công');
      });
      _this.prefixShared.save();
      _this.portalGroup.save();
      _this.speechSynthesis.save();
      _this.subportalList.save();
    });
  };
  iNet.extend(iNet.ui.admin.Setting, iNet.ui.WidgetExt);
  new iNet.ui.admin.Setting();
});
