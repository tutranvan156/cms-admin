/**
 * #PACKAGE: exchange
 * #MODULE: topic-main
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 09:03 26/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file TopicMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.exchange.TopicList}
   */
  var listTopic = new iNet.ui.exchange.TopicList();
  /**
   * @type {iNet.ui.exchange.TopicContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.exchange.TopicListAdmin}
   */
  var listAdmin = null;
  /**
   * @type {iNet.ui.exchange.TopicListMember}
   */
  var listMember = null;
  /**
   * @type {iNet.ui.exchange.TopicListQuestion}
   */
  var listQuestion = null;
  /**
   * @type {iNet.ui.exchange.TopicQuestionContent}
   */
  var listQuestionContent = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: listTopic
  });
  history.on('back', function (widget) {
    widget.show();
  });
  listTopic.show();

  /**
   * @param {iNet.ui.exchange.TopicList} parent
   * @returns {iNet.ui.exchange.TopicContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.exchange.TopicContent();
      composer.on(composer.getEvent('back'), function () {
        history.back();
      });
      composer.on(composer.getEvent('save_update'), function () {
        listTopic.reload();
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
  }
  /**
   * Load List Topic Admin
   * @param parent {iNet.ui.exchange.TopicList}
   * @returns {iNet.ui.exchange.TopicListAdmin}
   */
  var loadListAdmin = function (parent) {
    if (!listAdmin) {
      listAdmin = new iNet.ui.exchange.TopicListAdmin();
      listAdmin.on(listAdmin.getEvent('back_list'), function () {
        history.back();
      });
    }
    if (parent) {
      listAdmin.setParent(parent);
      parent.hide();
    }
    history.push(listAdmin);
    listAdmin.passRoles(parent);
    listAdmin.show();
    return listAdmin;
  }
  /**
   * Load List Topic Member
   * @param parent {iNet.ui.exchange.TopicList}
   * @returns {iNet.ui.exchange.TopicListMember}
   */
  var loadListMember = function (parent) {
    if (!listMember) {
      listMember = new iNet.ui.exchange.TopicListMember();
      listMember.on(listMember.getEvent('back_list'), function () {
        history.back();
      });
    }
    if (parent) {
      listMember.setParent(parent);
      parent.hide();
    }
    history.push(listMember);
    listMember.passRoles(parent);
    listMember.show();
    return listMember;
  }
  /**
   * Load List Topic Question
   * @param parent {iNet.ui.exchange.TopicList}
   * @returns {iNet.ui.exchange.TopicListQuestion}
   */
  var loadListQuestion = function (parent) {
    if (!listQuestion) {
      listQuestion = new iNet.ui.exchange.TopicListQuestion();
      listQuestion.on(listQuestion.getEvent('back_list'), function () {
        history.back();
      });
      listQuestion.on(listQuestion.getEvent('question_content'), function (record, parent) {
        listQuestionContent = loadListQuestionContent(parent);
        listQuestionContent.setTopicIdUpdate(null);
        listQuestionContent.setTopicId(record);
        listQuestionContent.resetData();
      });
      listQuestion.on(listQuestion.getEvent('open'),function(record,topicId,parent){
        listQuestionContent=loadListQuestionContent(parent);
        listQuestionContent.setTopicIdUpdate(record.uuid);
        listQuestionContent.setTopicId(topicId);
        listQuestionContent.setData(record);
      });
    }
    if (parent) {
      listQuestion.setParent(parent);
      parent.hide();
    }
    history.push(listQuestion);
    listQuestion.passRoles(parent);
    listQuestion.show();
    return listQuestion;
  }
  /**
   * Load List Topic Question
   * @param parent {iNet.ui.exchange.TopicListQuestion}
   * @returns {iNet.ui.exchange.TopicQuestionContent}
   */
  var loadListQuestionContent = function (parent) {
    if (!listQuestionContent) {
      listQuestionContent = new iNet.ui.exchange.TopicQuestionContent();
      listQuestionContent.on(listQuestionContent.getEvent('back_list'), function () {
        history.back();
      });
      listQuestionContent.on(listQuestionContent.getEvent('saved'), function () {
        listQuestion.reload();
      });
    }
    if (parent) {
      listQuestionContent.setParent(parent);
      parent.hide();
    }
    history.push(listQuestionContent);
    listQuestionContent.passRoles(parent);
    listQuestionContent.show();
    return listQuestionContent;
  }

  listTopic.on(listTopic.getEvent('list_question'), function (record, parent) {
    listQuestion = loadListQuestion(parent);
    listQuestion.setTopicId(record.uuid);
    listQuestion.loadList();
  });

  listTopic.on(listTopic.getEvent('list_member'), function (record, parent) {
    listMember = loadListMember(parent);
    listMember.setTopicId(record.uuid);
    listMember.loadList();
  });

  listTopic.on(listTopic.getEvent('list_admin'), function (record, parent) {
    listAdmin = loadListAdmin(parent);
    listAdmin.setTopicId(record.uuid);
    listAdmin.loadList();
  });

  listTopic.on(listTopic.getEvent('create'), function (parent) {
    composer = loadContent(parent);
    composer.resetData();
  });

  listTopic.on(listTopic.getEvent('open'), function (record, parent) {
    composer = loadContent(parent);
    composer.setData(record);
  });
});
