// #PACKAGE: author
// #MODULE: cms-comment-list
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 27/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file CommentList
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.author.CommentList
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.author.CommentList');
  iNet.ui.author.CommentList = function (config) {
    var that = this, __cog = config || {};
    var __status = ['', 'CREATED', 'PUBLISHED'];
    iNet.apply(this, __cog);
    this.id = 'comment-list-wg';
    this.gridID = 'grid-comment';
    this.module = 'comment';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.cache = {
      ttlE: __ttlE,
      ttlC: __ttlC,
      ttlP: __ttlP
    };
    this.url = {
      list: iNet.getPUrl('cms/comment/search'),
      del: iNet.getPUrl('cms/comment/delete')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'itemSubject',
        label: this.getText('post'),
        type: 'label'
      }, {
        property: 'author',
        label: this.getText('author', 'post', ''),
        type: 'label',
        align: 'center',
        cls: 'text-center',
        width: 150
      }, {
        property: 'status',
        label: this.getText('status', 'post', ''),
        sortable: true,
        type: 'text',
        align: 'center',
        cls: 'text-center',
        width: 100,
        renderer: function (v) {
          return String.format('<b class="{1}">{0}</b>', that.getText(v.toLowerCase(), that.getModule()), CMSUtils.getColorByStatus(v));
        }
      }, {
        property: 'created',
        label: this.getText('date', 'post', ''),
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
          fn: function (record) {
            that.confirmDlg(
                that.getText('del_title', that.getModule()),
                that.getText('del_content', that.getModule()), function () {
                  $.postJSON(that.url.del, that.dialog.getOptions(), function (result) {
                    that.dialog.hide();
                    if (iNet.isDefined(result.uuid)) {
                      var __cache = that.getCache();
                      __cache.ttlE -= 1;
                      if (result.status == __status[1]) {
                        __cache.ttlC -= 1;
                      } else {
                        __cache.ttlP -= 1;
                      }
                      that.removeByID(result.uuid);
                      that.updateCount(__cache);
                      that.success(that.getText('del_title', that.getModule()), that.getText('del_success', that.getModule()));
                    } else {
                      that.error(that.getText('del_title', that.getModule()), that.getText('del_unsuccess', that.getModule()));
                    }
                  }, {
                    mask: that.getMask(),
                    msg: iNet.resources.ajaxLoading.deleting
                  });
                }
            ).setOptions({id: record.uuid});
            that.dialog.setTitle('<i class="fa fa-trash red"></i> ' + that.getText('del_title'));
            that.dialog.show();
          }
        }]
      }]
    });
    this.basicSearch = function () {
      this.id = 'list-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.Component, {
      constructor: this.basicSearch,
      intComponent: function () {
        var qSearch = this;
        this.$qSearch = $.getCmp(this.id);
        this.$inputSearch = this.$qSearch.find('.grid-search-input');
        this.$btnViewAll = this.$qSearch.find('#btn-view-all-post');
        this.$btnViewCreated = this.$qSearch.find('#btn-view-created');
        this.$btnViewPosted = this.$qSearch.find('#btn-view-posted');
        this.$btnSearch = this.$qSearch.find('[data-action-search="search"]:first');
        this.$btnViewAll.on('click', function () {
          qSearch.setActive(this);
          qSearch.setStatus(__status[0]);
          qSearch.$btnSearch.trigger('click');
        });
        this.$btnViewCreated.on('click', function () {
          qSearch.setActive(this);
          qSearch.setStatus(__status[1]);
          qSearch.$btnSearch.trigger('click');
        });
        this.$btnViewPosted.on('click', function () {
          qSearch.setActive(this);
          qSearch.setStatus(__status[2]);
          qSearch.$btnSearch.trigger('click');
        });
      },
      updateCount: function (data) {
        this.$btnViewAll.find('span').text(String.format('({0})', data.total));
        this.$btnViewCreated.find('span').text(String.format('({0})', data.created));
        this.$btnViewPosted.find('span').text(String.format('({0})', data.published));
      },
      setActive: function (el) {
        var $el = $(el);
        var $parent = $el.parent();
        $parent.children().removeClass('active');
        $el.addClass('active');
      },
      getUrl: function () {
        return that.url.list;
      },
      getId: function () {
        return this.id;
      },
      setStatus: function (type) {
        this.type = type;
      },
      getStatus: function () {
        return this.type;
      },
      getData: function () {
        return {
          pageSize: 10,
          pageNumber: 0,
          keyword: this.$inputSearch.val(),
          status: this.getStatus()
        };
      }
    });
    iNet.ui.author.CommentList.superclass.constructor.call(this);
    this.grid.on('click', function (record) {
      that.fireEvent(that.getEvent('open'), new iNet.ui.model.Comment(record), that);
    });
  };
  iNet.extend(iNet.ui.author.CommentList, iNet.ui.ListAbstract, {
    updateCount: function (data) {
      var __data = data || this.getCache();
      this.grid.quickSearch.updateCount({
        total: __data.ttlE,
        created: __data.ttlC,
        published: __data.ttlP
      });
    }
  });
});