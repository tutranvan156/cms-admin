// #PACKAGE: jquery.scrollto-153420150730
// #MODULE: jquery.scrollto
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 30/07/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file jquery.scrollto
 * @author nbchicong
 */
$(function () {
  $.fn.scrollTo = function (target, options, callback) {
    if (typeof options == 'function' && arguments.length == 2) {
      callback = options;
      options = target;
    }
    var settings = $.extend({
      scrollTarget: target,
      offsetTop: 0,
      duration: 500,
      easing: 'swing'
    }, options);
    return this.each(function () {
      var scrollPane = $(this);
      var scrollTarget = (typeof settings.scrollTarget == 'number') ? settings.scrollTarget : $(settings.scrollTarget);
      var scrollY = (typeof scrollTarget == 'number') ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
      scrollPane.animate({scrollTop: scrollY}, parseInt(settings.duration), settings.easing, function () {
        if (typeof callback == 'function') {
          callback.call(this);
        }
      });
    });
  }
});