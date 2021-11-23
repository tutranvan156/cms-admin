// #PACKAGE: author
// #MODULE: cms-item-reference-box-ext
$(function () {
  /**
   * @class iNet.ui.author.ItemReferenceBoxExt
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.author.ItemReferenceBoxExt');
  iNet.ui.author.ItemReferenceBoxExt = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.id = this.id || 'reference-box';
    this.$element = $('#' + this.id);
    this.isEnable = true;
    this.references = [];
    this.url = {
      add: iNet.getPUrl('cms/item/addref'),
      remove: iNet.getPUrl('cms/item/removeref')
    };
    this.$form = {
      reference: $('#list-reference-body'),
      reference_add: $('#list-reference-add')
    };

    var loadPostSelector = function () {
      if (!that.postSelector) {
        that.postSelector = new iNet.ui.author.ItemSelector();
        that.postSelector.on('selected', function (data) {
          var __data = data || [];
          for (var i = 0; i < __data.length; i++) {
            if (!iNet.isEmpty(that.getUuid())) {
              that.saveReference(__data[i]);
            } else {
              that.references.push(__data[i]);
              that.addReference(__data[i]);
            }
          }
          that.postSelector.hide();
        });
      }
      return that.postSelector;
    };
    this.$form.reference_add.on('click', function () {
      var __postSelector = loadPostSelector();
      __postSelector.show();
    });
    this.$form.reference.on('click', 'div span i', function () {
      if (that.isEnable) {
        var __id = $(this).data('id');
        that.removeReference(__id, $(this).parent().parent());
      }
    });
  };
  iNet.extend(iNet.ui.author.ItemReferenceBoxExt, iNet.ui.CMSComponent, {
    setUuid: function (uuid) {
      this.uuid = uuid || '';
    },
    getUuid: function () {
      return this.uuid || '';
    },
    setValue: function (references) {
      var __references = references || [];
      this.loadReference(__references);
    },
    getValue: function () {
      return this.references || [];
    },
    show: function () {
      this.$element.show();
    },
    hide: function () {
      this.$element.hide();
    },
    loadReference: function (data) {
      var __data = data || [];
      this.$form.reference.html('');
      for (var i = 0; i < __data.length; i++) {
        this.addReference(__data[i]);
      }
    },
    saveReference: function (data) {
      var that = this;
      var __data = data || {};
      var __params = {
        uuid: that.getUuid(),
        ref: __data.uuid,
        subject: __data.subject
      };
      $.postJSON(that.url.add, __params, function(result) {
        var __result = result || {};
        that.fireEvent('added', result);
        if (__result.type != 'ERROR') {
          that.addReference(__data);
        }
      });
    },
    addReference: function (data) {
      var __data = data || {};
      var __html = String.format('<div class="row-fluid" style="padding: 0 10px;"><span><i class="icon-remove red" style="cursor: pointer;" data-id="{0}"></i></span> <span>{1}</span></div>', __data.uuid, __data.subject);
      this.$form.reference.append(__html);
    },
    removeReference: function (id, item) {
      var that = this;
      var __uuid = id || '';
      if (!iNet.isEmpty(that.getUuid()) && !iNet.isEmpty(__uuid)) {
        var __params = {
          uuid: that.getUuid(),
          ref: __uuid
        };
        $.postJSON(that.url.remove, __params, function(result) {
          var __result = result || {};
          that.fireEvent('removed', result);
          if (__result.type != 'ERROR') {
            that.references = $.grep(that.references, function(n) {return n.uuid != __uuid;});
            item.remove();
          }
        });
      } else {
        that.references = $.grep(this.references, function(n) {return n.uuid != __uuid;});
        item.remove();
      }
    },
    enable: function () {
      this.$form.reference_add.removeClass('disabled').removeAttr('disabled');
      this.isEnable = true;
    },
    disable: function () {
      this.$form.reference_add.addClass('disabled').attr('disabled', 'disabled');
      this.isEnable = false;
    }
  });
});