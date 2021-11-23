/**
 * #PACKAGE: admin
 * #MODULE: firm-site-main
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 16:42 04/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file FirmSiteMain.js
 */
$(function () {
  /**
   * @type {iNet.ui.admin.FirmSiteList}
   */
  var list = new iNet.ui.admin.FirmSiteList();

  /**
   * @type {iNet.ui.admin.FirmMemberList}
   */
  var memberList = null;

  /**
   * @type {iNet.ui.form.History}
   */
  var siteHistory = new iNet.ui.form.History({
    id: 'sphere-history-' + iNet.alphaGenerateId()
  });

  /**
   *
   * @param {iNet.ui.admin.FirmSiteList} parent
   * @returns {iNet.ui.admin.FirmMemberList}
   */
  function initMemberList(parent) {
    if (!memberList) {
      memberList = new iNet.ui.admin.FirmMemberList();
      memberList.on('back', function () {
        siteHistory.back();
      });
    }
    if (parent) {
      memberList.setParent(parent);
      parent.hide();
    }
    siteHistory.push(memberList);
    memberList.show();
    return memberList;
  }

  siteHistory.setRoot(list);
  siteHistory.on('back', function(widget) {
    widget.show();
  });

  list.on('member_list', function (record, parent) {
    memberList = initMemberList(parent);
    memberList.setPrefix(record.prefix || '');
    memberList.load();
  });
});
