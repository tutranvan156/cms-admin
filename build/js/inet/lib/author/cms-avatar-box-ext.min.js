// #PACKAGE: author
// #MODULE: cms-avatar-box-ext
$(function () {
  /**
   * @class iNet.ui.author.AvatarBoxExt
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.author.AvatarBoxExt');
  iNet.ui.author.AvatarBoxExt = function (config) {
    var that = this, __cog = config || {};
    var prefix = iNet.firmPrefix || iNet.prefix;
    iNet.apply(this, __cog);
    this.id = this.id || 'avatar-box';
    this.$element = $('#' + this.id);
    this.isEnable = true;
    this.url = {
      create: iNet.getPUrl('cms/avatar/modify'),
      view: iNet.path + '/' + prefix + '/cms/asset/photoview' + iNet.extension
    };
    this.$toolbar = {
      SELECT: $('#avatar-box-select-btn'),
      UPLOAD: $('#avatar-box-upload-btn'),
      REMOVE: $('#avatar-box-remove-btn')
    };
    this.$form = {
      image: $('#avatar-box-image')
    };
    this.$toolbar.SELECT.on('click', function () {
      CMSUtils.loadMedia('IMAGE', false, function (data) {
        var __data = data || [];
        if (__data.length > 0) {
          var __src = that.url.view + '?code=' + __data[0].code;

          that.setValue(__src);
        }
      });
    });
    this.$form.image.on('click', function () {
      if (that.isEnable) {
        console.log('view...');
        CMSUtils.loadMedia('IMAGE', false, function (data) {
          var __data = data || [];
          if (__data.length > 0) {
            var __src = that.url.view + '?code=' + __data[0].code;
            that.setValue(__src);
          }
        });
      }
    });
    this.$toolbar.UPLOAD.on('click', function () {
      CMSUtils.loadUploader('IMAGE', false, 'image/*', function (src) {
        var __src = src || '';
        if (!iNet.isEmpty(__src)) {
          that.setValue(__src);
        }
      });
    });
    this.$toolbar.REMOVE.on('click', function () {
      that.clear();
      that.setValue('');
    });
    that.setValue('');
  };
  iNet.extend(iNet.ui.author.AvatarBoxExt, iNet.ui.CMSComponent, {
    setValue: function (value) {
      var __value = value || '';
      if (!iNet.isEmpty(__value)) {
        this.value = __value;
      } else {
        __value = (iNet.resourceCtx && iNet.resourceCtx.blankIMG) ? iNet.resourceCtx.blankIMG : iNet.blankIMG;
      }
      this.$form.image.attr('src', __value);
    },
    getValue: function () {
      return this.value || '';
    },
    clear: function () {
      this.value = '';
    },
    setUrl: function (url) {
      this.imageUrl = url;
    },
    getUrl: function () {
      return this.imageUrl || '';
    },
    show: function () {
      this.$element.show();
    },
    hide: function () {
      this.$element.hide();
    },
    disable: function () {
      this.$toolbar.SELECT.attr('disabled', 'disabled');
      this.$toolbar.UPLOAD.attr('disabled', 'disabled');
      this.isEnable = false;
    },
    enable: function () {
      this.$toolbar.SELECT.removeAttr('disabled');
      this.$toolbar.UPLOAD.removeAttr('disabled');
      this.isEnable = true;
    }
  });
});
