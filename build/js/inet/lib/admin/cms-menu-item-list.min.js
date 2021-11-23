// #PACKAGE: admin
// #MODULE: cms-menu-item-list
//
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 25/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file MenuItemList
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.admin.MenuItemList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.admin.MenuItemList');
  iNet.ui.admin.MenuItemList = function (config) {
    var that = this;
    iNet.apply(this, config || {});
    this.id = 'menu-item-list-wg';
    this.gridID = 'list-menu';
    this.remote = true;
    this.url = {
      list: iNet.getPUrl('cms/menuitem/list'),
      del: iNet.getPUrl('cms/menuitem/delete')
    };
    this.$toolbar = {
      CREATE: $('#list-menu-btn-create')
    };
    this.module = 'menu';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'subject',
        label: this.getText('name'),
        type: 'text'
      }, {
        property: 'menuID',
        label: this.getText('id'),
        sortable: true,
        type: 'text',
        width: 200
      }, {
        property: 'created',
        label: this.getText('date', 'post'),
        sortable: true,
        type: 'text',
        width: 150,
        renderer: function (v) {
          return new Date(v).format(iNet.fullDateFormat);
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: iNet.resources.message.button.del,
          icon: 'icon-trash',
          labelCls: 'label label-important',
          fn: function(record) {
            that.dialog=that.confirmDlg(that.getText('del_title', that.getModule()),
              String.format(that.getText('del_content', that.getModule()), record.subject), function () {
              $.postJSON(that.url.del, that.dialog.getOptions(), function(result) {
                if(iNet.isDefined(result.uuid)){
                  that.removeRecord(record);
                  that.success(that.getText('del_title', that.getModule()), that.getText('del_success', that.getModule()));
                } else {
                  that.error(that.getText('del_title', that.getModule()), that.getText('del_unsuccess', that.getModule()));
                }
                that.dialog.hide();
              }, {
                mask: that.getMask(),
                msg: iNet.resources.ajaxLoading.deleting
              });
            });
            that.dialog.setOptions({menu: record.menuID});
            that.dialog.setTitle('<i class="fa fa-trash red"></i> ' + that.getText('del_title'));
            that.dialog.show();
          }
        }]
      }],
      delay: 250
    });

    this.basicSearch = function () {
      this.id = 'list-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.AbstractSearchForm, {
      intComponent: function () {
        this.$inputSearch = this.getEl().find('.grid-search-input');
      },
      getUrl: function () {
        return that.url.list;
      },
      getData: function () {
        return {
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keywords: this.$inputSearch.val()
        };
      }
    });

    iNet.ui.admin.MenuItemList.superclass.constructor.call(this);

    this.$toolbar.CREATE.on('click', function () {
      that.fireEvent(that.getEvent('create'), that);
    });
    this.getGrid().on('click', function (record) {
      that.fireEvent(that.getEvent('open'), record, that);
    });

    //Remove searched, cleared & changed  events handler when implement basic search to grid
    that.getGrid().$searchcontrol.off('searched cleared');
    that.getGrid().$filtercontrol.off('changed');
  };
  iNet.extend(iNet.ui.admin.MenuItemList, iNet.ui.ListAbstract);
});
