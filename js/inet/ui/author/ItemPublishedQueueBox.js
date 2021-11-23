/**
 * #PACKAGE: author
 * #MODULE: cms-item-published-queue-box
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 17:06 20/06/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file ItemPublishedQueueBox.js
 */
$(function () {
  /**
   * @class iNet.ui.author.ItemPublishedQueueBox
   * @extends iNet.ui.CMSComponent
   */
  iNet.ns('iNet.ui.author.ItemPublishedQueueBox');
  iNet.ui.author.ItemPublishedQueueBox = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'published-box';
    this.data = {};
    this.form = {
      publishDate: $('#txt-published-date')
    };

    this.datePublished = this.form.publishDate.datepicker({
      format: 'dd/mm/yyyy'
    }).on('changeDate', function(ev) {
      //console.debug(_this.getValue());
      _this.datePublished.hide();
    }).data('datepicker');
  };

  iNet.extend(iNet.ui.author.ItemPublishedQueueBox, iNet.ui.CMSComponent, {
    disable: function() {
      this.form.publishDate.attr('disabled', 'disabled');
    },
    enable: function() {
      this.form.publishDate.removeAttr('disabled');
    },
    getValue: function () {
      var dateSelected = this.datePublished.dates[0];
      if (!dateSelected) {
        return {};
      }
      if (compareWithToday(dateSelected) <= 0) {
        console.debug('date selected less than today');
        return {
          code: CMSConfig.MODE_PUBLISHED,
          status: CMSConfig.MODE_PUBLISHED,
          published: dateSelected.getTime()
        };
      } else {
        console.debug('date selected grater than today');
        return {
          code: CMSConfig.MODE_INTERNAL,
          status: CMSConfig.MODE_INTERNAL,
          internal: dateSelected.getTime()
        }
      }
    },
    setValue: function (value) {
      if (!value) {
        this.clear();
      }
      else {
        if(this.datePublished) {
          this.datePublished.update(value ? new Date(value).format('d/m/Y') : value);
        }
      }
    },
    clear: function () {
      if(this.datePublished) {
        this.datePublished.update('');
      }
    }
  });

  /**
   * @param {Date} dateCompare
   */
  function compareWithToday(dateCompare) {
    var date = new Date();
    if (date.getFullYear() === dateCompare.getFullYear()) {
      if (date.getMonth() === dateCompare.getMonth()) {
        if (date.getDate() === dateCompare.getDate()) {
          return 0;
        }
        else {
          return date.getDate() > dateCompare.getDate() ? -1 : 1;
        }
      }
      else {
        return date.getMonth() > dateCompare.getMonth() ? -1 : 1;
      }
    }
    else {
      return date.getFullYear() > dateCompare.getFullYear() ? -1 : 1;
    }
  }
});
