/**
 * #PACKAGE: document
 * #MODULE: legal-doc-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 14:14 08/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file LegalDocMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.document.LegalDocList}
   */
  var list = new iNet.ui.document.LegalDocList();
  /**
   * @type {iNet.ui.document.LegalDocContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: list
  });
  /**
   * @param {iNet.ui.document.LegalDocList} parent
   * @returns {iNet.ui.document.LegalDocContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.document.LegalDocContent();
      composer.on('back', function () {
        history.back();
      });
      composer.on('doc_created', function () {
        list.reload();
      });
      composer.on('doc_updated', function () {
        list.reload();
      });
      composer.on('load', function () {
        list.getGrid().reload();
      });
    }
    if (parent) {
      composer.setParent(parent);
      parent.hide();
    }
    history.push(composer);
    composer.passRoles(parent);
    composer.show();
    return composer;
  };
  history.on('back', function (widget) {
    widget.show();
  });
  list.show();
  list.on('created', function (parent) {
    composer = loadContent(parent);
    composer.setDocId(null);
    composer.setAuthorUnitCode(null);
    composer.load();
  });

  list.on('open', function (record, parent) {
    composer = loadContent(parent);
    composer.setDocId(record.uuid);
    composer.setAuthorUnitCode(record.publisherCode);
    composer.load();
  });
});