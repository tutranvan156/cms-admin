/**
 * #PACKAGE: admin
 * #MODULE: modal-page-content
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 18:42 24/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ModalPageContent.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ModalPageContent
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.ModalPageContent');
  iNet.ui.admin.ModalPageContent = function (options) {
    var $this = this;
    this.id = this.id || 'page-content-modal';
    iNet.apply(this, options || {});
    this.url = {
      list: iNet.getPUrl('cms/menuitem/list'),
      page_content: iNet.getPUrl('cmsfirm/theme/service'),
      list_category: iNet.getPUrl('cms/category/list')
    };
    this.$modal = {
      modal: $('#page-content-modal'),
      ok: $('#btn-save-content'),
      cancel: $('#btn-cancel-content'),
      selectPage: $('#page-content-list'),
      typeOpen: $('#page-content-open'),
      typePage: $('#type-page-content-list')
    };
    // this.loadContentPage(CMSConfig.TYPE_PAGE.PAGE_CONTENT, function (data) {
    //   if (data.type !== 'ERROR') {
    //     var elements = data.elements || [];
    //     if (elements.length != 0)
    //       $this.setContentPage(elements[0]);
    //   }
    // });

    this.renderListPage();

    iNet.ui.admin.ModalPageContent.superclass.constructor.call(this);
    this.$modal.typePage.on('change', function () {
      $this.renderListPage();
    });
    this.$modal.ok.on('click', function () {
      if ($this.$modal.selectPage.val()) {
        $this.hideModal();
        var obj = {
          menuID: $this.$modal.selectPage.val(),
          type: $this.$modal.typeOpen.val(),
          text: $this.getTextSelect() || $this.$modal.selectPage.find('option:selected').text(),
          typePage: $this.$modal.typePage.val()
        };
        $this.fireEvent('insert_link', obj);
      } else {

      }
    });
  };
  iNet.extend(iNet.ui.admin.ModalPageContent, iNet.ui.ViewWidget, {
    renderListPage: function () {
      var $this = this;
      var url;
      if (this.$modal.typePage.val() === CMSConfig.TYPE_PAGE.PAGE_CONTENT) {
        url = this.url.list;
      } else {
        url = this.url.list_category;
      }
      this.listPage(url, function (data) {
        if (data.type !== "ERROR") {
          var items = data.items || [];
          var html = '<option value="">--- Chọn một trang ---</option>';
          for (var i = 0; i < items.length; i++) {
            var id = items[i].menuID || items[i].uuid;
            var name = items[i].subject || items[i].name;
            html += '<option value="' + id + '">' + name + '</option>';
          }
          $this.$modal.selectPage.html(html);
          $this.$modal.selectPage.select2();
          $this.$modal.selectPage.on('change', function () {
          });
        }
      });
    },
    setContentPage: function (page) {
      this.page = page;
    },
    getContentPage: function () {
      return this.page;
    },
    // loadPageByType: function (type, callback) {
    //   $.getJSON(this.url.page_content, {service: type}, function (data) {
    //     callback && callback(data);
    //   });
    // },
    setTextSelect: function (text) {
      this.hightlight = text;
    },
    getTextSelect: function () {
      return this.hightlight;
    },
    listPage: function (url, callback) {
      $.getJSON(url, {
        pageSize: -1,
        pageNumber: 0
      }, function (data) {
        callback && callback(data);
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.deleting
      });
    },
    showModal: function () {
      this.$modal.modal.modal('show');
    },
    hideModal: function () {
      this.$modal.modal.modal('hide');
    }
  });
});
