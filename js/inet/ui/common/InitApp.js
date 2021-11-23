// #PACKAGE: common
// #MODULE: cms-init
$(function() {
  CMSConfig.APP = new iNet.app.Application({
    title: CMSConfig.MODULE_NAME,
    header: new iNet.ui.common.Header({
      title: CMSConfig.MODULE_NAME,
      iconCls: 'icon-rss',
      autoDetect: true
    })
  });
  if (iNet.firmPrefix && iNet.path !== ('/' + iNet.firmPrefix))
    CMSApi.loadFirm(iNet.firmPrefix, function (data) {
      var btnViewSite = $('#btn-view-site');
      if (data.type === CMSConfig.TYPE_ERROR) {
        btnViewSite.hide();
      }
      else if(data.uuid) {
        window.SITE = data;
        CMSConfig.SITE = data;
        CMSApi.loadConfig();
        CMSApi.loadConstants();

        var iframe = document.getElementById('iframe-content');
        (iframe.contentWindow || iframe.contentDocument).CMSConfig = CMSConfig;

        (data.application || []).forEach(function (app) {
          if (app.theme === iNet.currentTheme) {
            data.pageIndex = app.pageIndex;
          }
        });
        var href = btnViewSite.attr('href');
        href = href.replace(/{(\w+)}/g, function (str, key) {
          return (typeof data[key] !== 'undefined') ? data[key] : '';
        });
        btnViewSite.attr('href', href).show();
      }
    });

  $('#app-name').html(CMSConfig.MODULE_NAME);
  $('#app-version').html(CMSConfig.VERSION + '(' + CMSConfig.BUILD_TIME + ')');

  var windowEl = $(window);
  windowEl.on('resize', function () {
    sideBar.getEl().css('max-height', (windowEl.height() - 44));
  });
  windowEl.resize();
});
