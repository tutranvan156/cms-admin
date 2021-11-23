/**
 * #PACKAGE: exchange
 * #MODULE: list-question-main
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 15:39 29/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListQuestionMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.exchange.ListAllQuestion}
   */
  var listAllQuestion = new iNet.ui.exchange.ListAllQuestion();
  /**
   * @type {iNet.ui.exchange.ListQuestionMainContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.exchange.ListModalMember}
   */
  var modal = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: listAllQuestion
  });
  history.on('back', function (widget) {
    widget.show();
  });
  listAllQuestion.show();
  /**
   * @param {iNet.ui.exchange.ListAllQuestion} parent
   * @returns {iNet.ui.exchange.ListQuestionMainContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.exchange.ListQuestionMainContent();
      composer.on(composer.getEvent('back_list'), function () {
        history.back();
      });
      composer.on(composer.getEvent('open_modal'),function(record,uuid,parent){
        modal=loadModal(parent);
        modal.setTopic(record);
        modal.setUuid(uuid);
        history.back();
        modal.loadList();
      });
      composer.on(composer.getEvent('saved'),function(){
        listAllQuestion.reload();
      });
      composer.on(composer.getEvent('deleted'),function(){
        composer.hide();
        listAllQuestion.reload();
        history.back();
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
   * @param {iNet.ui.exchange.ListAllQuestion} parent
   * @returns {iNet.ui.exchange.ListModalMember}
   */
  var loadModal = function (parent) {
    if (!modal) {
      modal = new iNet.ui.exchange.ListModalMember();
      modal.on(modal.getEvent('sended'),function(){
        parent.hide();
        history.back();
        listAllQuestion.reload();
      });
    }
    if (parent) {
      modal.setParent(parent);
      parent.hide();
    }
    history.push(modal);
    modal.passRoles(parent);
    modal.show();
    return modal;
  }
  listAllQuestion.on(listAllQuestion.getEvent('open'),function(record,parent){
    composer=loadContent(parent);
    composer.setTopicIdUpdate(record.topic);
    composer.setUuid(record.uuid);
    composer.setStatusQuestion(record.status);
    composer.setData(record);
  });

});
