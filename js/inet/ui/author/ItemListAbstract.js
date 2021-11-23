// #PACKAGE: author
// #MODULE: cms-item-list-abstract
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ItemListAbstract
 * @author nbchicong
 */
$(function () {
  if (!iNet) {
    throw new Error('iNet Core is not defined!');
  }
  /**
   * @class iNet.ui.author.ItemListAbstract
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.author.ItemListAbstract');
  iNet.ui.author.ItemListAbstract = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.id = this.id || 'wg-list-post';
    this.remote = this.remote || true;
    this.module = 'post';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.idProperty = this.idProperty || 'uuid';
    this.dataCate = typeof dataCate === 'undefined' ? [] : dataCate;
    this.gridID = this.gridID || 'grid-post';
    this.$toolbar = {
      CREATE: $('#list-toolbar-btn-create')
    };
    iNet.ui.author.ItemListAbstract.superclass.constructor.call(this);
    this.grid.on('click', function(record){
      that.fireEvent(that.getEvent('open'), record, that);
    });
    this.$toolbar.CREATE.on('click', function(){
      that.fireEvent(that.getEvent('create'), that);
    });
  };
  iNet.extend(iNet.ui.author.ItemListAbstract, iNet.ui.ListAbstract, {
    constructor: iNet.ui.author.ItemListAbstract,
    getStatusText: function (item) {
      if (ItemUtils.isPending(item)) {
        return 'Chờ duyệt';
      }
      return this.getText(item.status.toLowerCase());
    },
    renderCategories: function (cates) {
      var text = '<ul class="list-default no-margin-bottom">';
      (cates || []).forEach(function (value) {
        for (var i = 0; i < this.dataCate.length; i++) {
          if (this.dataCate[i].value === value) {
            text += '<li>' + this.dataCate[i].name + '</li>';
            break;
          }
        }
      });
      text += '</ul>';
      return text;
    }
  });
});