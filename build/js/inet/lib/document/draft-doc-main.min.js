/**
 * #PACKAGE: document
 * #MODULE: draft-doc-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:59 16/01/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file DraftDocMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.document.LegalDraftDocList}
   */
  var list = new iNet.ui.document.LegalDraftDocList();
  /**
   * @type {iNet.ui.document.DraftDocContent}
   */
  var draft = null;
  /**
   * @type {iNet.ui.document.LegalDocContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.document.DraftCommentList}
   */
  var listComment = null;
  /**
   * @type {iNet.ui.document.DraftCommentContent}
   */
  var commentContent = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: list
  });
  history.on('back', function (widget) {
    widget.show();
  });
  list.show();

  /**
   * @param {iNet.ui.document.DraftDocContent} parent
   * @returns {iNet.ui.document.LegalDocContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.document.LegalDocContent({
        transfer: true
      });
      composer.on('back', function () {
        composer.clearDataForm();
        composer.clearArrayFile();
        history.back();
      });
      composer.on('doc_created', function () {
        list.reload();
      });
      composer.on('doc_updated', function () {
        list.reload();
      });
      composer.on('draft_updated', function () {
        draft.load();
        list.reload();
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

  /**
   * @param {iNet.ui.document.LegalDocList} parent
   * @returns {iNet.ui.document.DraftDocContent}
   */
  var loadDraftContent = function (parent) {
    if (!draft) {
      draft = new iNet.ui.document.DraftDocContent();
      draft.on('back', function () {
        history.back();
      });
      draft.on('load', function () {
        list.getGrid().reload();
      });
      draft.on('doc_created', function () {
        list.getGrid().reload();
      });
      draft.on('doc_updated', function () {
        list.getGrid().reload();
      });
      draft.on('view_comment', function (parents, record) {
        listComment = loadListComment(parents);
        listComment.setUuid(record.uuid);
        listComment.setAuthorUnitCode(record.authorUnitCode);
        listComment.load();
      });
      draft.on('promulgation', function (id, code, parent) {
        composer = loadContent(parent);
        composer.setDocId(id);
        composer.setAuthorUnitCode(code);
        composer.setDraftDoc(false);
        composer.load();
        composer.transferFrom(id);
      });
    }
    if (parent) {
      draft.setParent(parent);
      parent.hide();
    }
    history.push(draft);
    draft.passRoles(parent);
    draft.show();
    return draft;
  };

  /**
   * @param {iNet.ui.document.DraftDocContent} parent
   * @returns {iNet.ui.document.DraftCommentList}
   */
  var loadListComment = function (parent) {
    if (!listComment) {
      listComment = new iNet.ui.document.DraftCommentList();
      listComment.on('back_content', function () {
        history.back();
      });
      listComment.on('view_content', function (data, parents) {
        commentContent = loadCommentContent(parents);
        // commentContent.setFqaId(record.uuid);
        commentContent.load(data);
      });
    }
    if (parent) {
      listComment.setParent(parent);
      parent.hide();
    }
    history.push(listComment);
    listComment.passRoles(parent);
    listComment.show();
    return listComment;
  };
  /**
   * @param {iNet.ui.document.DraftCommentList} parent
   * @returns {iNet.ui.document.DraftCommentContent}
   */
  var loadCommentContent = function (parent) {
    if (!commentContent) {
      commentContent = new iNet.ui.document.DraftCommentContent();
      commentContent.on('back_list', function () {
        history.back();
      });
    }
    if (parent) {
      commentContent.setParent(parent);
      parent.hide();
    }
    history.push(commentContent);
    commentContent.passRoles(parent);
    commentContent.show();
    return commentContent;
  };
  list.on('created', function (parent, data) {
    draft = loadDraftContent(parent);
    draft.setDocId(null);
    draft.setOrgId(data.orgId);
    draft.setOrgName(data.orgName);
    draft.setAuthorUnitCode(null);
    draft.load();
  });

  list.on('view_comment', function (record, parents) {
    console.log('record_comment: ', record);
    listComment = loadListComment(parents);
    listComment.setUuid(record.uuid);
    listComment.setAuthorUnitCode(record.authorUnitCode);
    listComment.load();
  });

  list.on('open', function (record, parent) {
    console.log('event open a legal document: ', record, record.uuid);
    draft = loadDraftContent(parent);
    draft.setDocId(record.uuid);
    draft.setOrgId(record.orgId);
    draft.setOrgName(record.orgName);
    draft.setAuthorUnitCode(record.authorUnitCode);
    draft.load();
  });
});