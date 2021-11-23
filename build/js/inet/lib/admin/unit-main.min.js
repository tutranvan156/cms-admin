/**
 * #PACKAGE: admin
 * #MODULE: unit-main
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:00 29/03/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file UnitMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   * @type {iNet.ui.admin.UnitList}
   */
  var listUnit = new iNet.ui.admin.UnitList();

  /**
   * @type {iNet.ui.admin.MemberUnitList}
   */
  var listMember = null;

  /**
   * @type{iNet.ui.admin.UnitDetail}
   * */

  var contentUnit = null;

  /**
   * @type{iNet.ui.admin.MemberUnitDetail}
   * */

  var contentMember = null;

  /**
   * @type {iNet.ui.form.History}
   */
  var history = new iNet.ui.form.History({
    id: 'unit-history'
  });

  /**
   * @param parent {iNet.ui.admin.UnitList}
   * @returns {iNet.ui.admin.MemberUnitList}
   */
  function initListMember(parent) {
    if (!listMember) {
      listMember = new iNet.ui.admin.MemberUnitList();
      listMember.on('back', function () {
        history.back();
      });
      listMember.on('create', function (member, org) {
        contentMember = loadContentMember(member);
        contentMember.resetFrom();
        contentMember.setRecord({});
        contentMember.setOrgId(org);
      });
      listMember.on('edit', function (member, record) {
        contentMember = loadContentMember(member);
        contentMember.setRecord(record);
        contentMember.setDataForm();
      });
    }
    if (parent) {
      listMember.setParent(parent);
      parent.hide();
    }
    history.push(listMember);
    listMember.show();
    return listMember;
  }

  function loadContentMember(parent) {
    if (!contentMember) {
      contentMember = new iNet.ui.admin.MemberUnitDetail();
      contentMember.on('back_member', function () {
        history.back();
      });
      contentMember.on('load_member', function () {
        listMember.load();
      });
    }
    if (parent) {
      contentMember.setParent(parent);
      parent.hide();
    }
    history.push(contentMember);
    contentMember.show();
    return contentMember;
  }

  function loadContentOrg(parent) {
    if (!contentUnit) {
      contentUnit = new iNet.ui.admin.UnitDetail();
      contentUnit.on('back_unit', function () {
        history.back();
      });
      contentUnit.on('load_unit', function () {
        listUnit.load();
      });

    }
    if (parent) {
      contentUnit.setParent(parent);
      parent.hide();
    }
    history.push(contentUnit);
    contentUnit.show();
    return contentUnit;
  }

  history.setRoot(listUnit);
  history.on('back', function (widget) {
    widget.show();
  });

  listUnit.on('create', function (parent, parentId) {
    contentUnit = loadContentOrg(parent);
    contentUnit.setParentId(parentId);
    contentUnit.setRecord({});
    contentUnit.resetFrom();
  });

  listUnit.on('view_unit', function (parent, record) {
    contentUnit = loadContentOrg(parent);
    contentUnit.setRecord(record);
    contentUnit.setDataForm();
    contentUnit.setParentId(record.parent);
  });

  listUnit.on('view_members', function (record, parentClass) {
    listMember = initListMember(parentClass);
    listMember.setOrgId(record.uuid).load();
  });
});