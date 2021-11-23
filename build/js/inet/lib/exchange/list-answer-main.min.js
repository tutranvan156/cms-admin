/**
 * #PACKAGE: exchange
 * #MODULE: list-answer-main
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 14:57 30/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListAnswerMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.exchange.ListAnswer}
   */
  var listAnswer = new iNet.ui.exchange.ListAnswer();
  /**
   * @type {iNet.ui.exchange.ListAnswerContent}
   */
  var composer = null;
  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: listAnswer
  });
  history.on('back', function (widget) {
    widget.show();
  });
  listAnswer.show();
  /**
   * @param {iNet.ui.exchange.ListAnswer} parent
   * @returns {iNet.ui.exchange.ListAnswerContent}
   */
  var loadContent = function (parent) {
    if (!composer) {
      composer = new iNet.ui.exchange.ListAnswerContent();
      composer.on(composer.getEvent('back_list'), function () {
        history.back();
      });
      composer.on(composer.getEvent('answered'),function(){
        listAnswer.reload();
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
  listAnswer.on(listAnswer.getEvent('open'),function(record,parent){
    composer=loadContent(parent);
    composer.setUuid(record.uuid);
    composer.setTopic(record.topic);
    composer.setData(record);
  });
});
