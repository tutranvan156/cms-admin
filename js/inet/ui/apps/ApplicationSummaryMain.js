// #PACKAGE: author
// #MODULE: cms-app-summary-main
//
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09/09/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ApplicationSummaryMain
 * @author nbchicong
 */

$(function () {
  /**
   * @type {iNet.ui.apps.ApplicationSummaryList}
   * @private
   */
  var list = new iNet.ui.apps.ApplicationSummaryList();
  /**
   * @type {iNet.ui.apps.ApplicationSummaryDetail}
   * @private
   */
  var detail = null;
  /**
   * @type {iNet.ui.form.History}
   * @private
   */
  var __history = new iNet.ui.form.History({
    id: 'icms-history-app-summary' + iNet.generateId(),
    root: list
  });
  __history.on('back', function(widget){
    widget.show();
  });
  /**
   * @param {iNet.ui.apps.ApplicationSummaryList} parent
   * @returns {iNet.ui.apps.ApplicationSummaryDetail}
   * @private
   */
  var __loadDetailWg = function (parent) {
    if (!detail) {
      detail = new iNet.ui.apps.ApplicationSummaryDetail();
      detail.on(detail.getEvent('back'), function () {
        __history.back();
      });
      detail.on(detail.getEvent('created'), function (recordModel) {
        parent.insert(detail.getModelData(recordModel));
      });
      detail.on(detail.getEvent('updated'), function (recordModel) {
        parent.update(detail.getModelData(recordModel));
      });
    }
    if(parent){
      detail.setParent(parent);
      parent.hide();
    }
    __history.push(detail);
    detail.passRoles(parent);
    detail.show();
    return detail;
  };
  list.on(list.getEvent('create'), function (filterType, parent) {
    detail = __loadDetailWg(parent);
    detail.setFilterType(filterType);
    detail.resetData();
  });
  list.on(list.getEvent('open'), function (record, parent) {
    detail = __loadDetailWg(parent);
    detail.setRecord(record);
  });
});