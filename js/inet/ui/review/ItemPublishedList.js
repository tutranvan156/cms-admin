// #PACKAGE: review
// #MODULE: cms-item-published-list
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 15/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ListPublished
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.review.ItemPublishedList
   * @extends iNet.ui.author.ItemListAbstract
   */
  iNet.ns('iNet.ui.review.ItemPublishedList');
  iNet.ui.review.ItemPublishedList = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.module = 'published';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.cache = {};
    this.url = {
      list: iNet.getPUrl('cms/item/published'),
      remove: iNet.getPUrl('cms/item/retrieve'),
      hot: iNet.getPUrl('cms/hotnews/update')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'subject',
        label: this.getText('name', 'post'),
        sortable: true,
        type: 'text'
      }, {
        property: 'categories',
        label: this.getText('name', 'category'),
        width: 150,
        sortable: true,
        type: 'text',
        editData: this.dataCate,
        cls: 'hidden-320',
        renderer: function (v, item) {
          if (v) {
            return that.renderCategories(v);
          }
          // return v ? v.join(',') : item.category;
          return v ? v.join(',') : '<span class="label label-danger">Chưa có thể loại nào</span>';
        }
      }, {
        property: 'comment',
        label: '<span class="fa fa-comment"></span>',
        type: 'label',
        align: 'center',
        cls: 'text-center',
        width: 40,
        renderer: function (v) {
          return String.format('<span class="badge badge-yellow">{0}</span>', v);
        }
      }/*, {
        property: 'comment',
        label: '<span class="icon-thumbs-up"></span>',
        type: 'label',
        align: 'center',
        cls: 'text-center',
        width: 40,
        renderer: function (v) {
          return '0';
        }
      }*/, {
        property: 'writername',
        label: this.getText('owner', 'fqa'),
        sortable: true,
        type: 'text',
        width: 180
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
          text: this.getText('hot', this.getModule()),
          icon: 'fa fa-star-o',
          labelCls: 'label label-primary',
          fn: function (record) {
            that.updateHot(record.uuid, true);
          },
          visibled: function (record) {
            return !record.hotnews
                && (that.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN)
                    || that.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER));
          }
        }, {
          text: this.getText('hot_del', this.getModule()),
          icon: 'fa fa-star',
          labelCls: 'label label-important',
          fn: function (record) {
            that.updateHot(record.uuid, false);
          },
          visibled: function (record) {
            return record.hotnews
                && (that.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN)
                    || that.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER));
          }
        }, {
          text: this.getText('unpublish', this.getModule()),
          icon: 'icon-remove',
          labelCls: 'label label-important',
          visibled: function () {
            return that.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN)
                || that.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER);
          },
          fn: function (record) {
            var dialog = that.confirmDlg(
                that.getText('remove_title', that.getModule()), that.getText('remove_content', that.getModule()),
                function () {
                  this.hide();
                  $.postJSON(that.url.remove, dialog.getOptions(), function (result) {
                    var __result = result || {};
                    if (iNet.isDefined(__result.uuid)) {
                      that.success(that.getText('remove_title', that.getModule()), that.getText('remove_success', that.getModule()));
                      that.removeByID(record.uuid);
                    } else {
                      that.error(that.getText('remove_title', that.getModule()), that.getText('remove_unsuccess', that.getModule()));
                    }
                  }, {
                    mask: that.getMask(),
                    msg: iNet.resources.ajaxLoading.deleting
                  });
                }
            );
            dialog.setOptions({uuid: record.uuid});
            dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + that.getText('remove_title'));
            dialog.show();
          }
        }]
      }],
      delay: 250
    });
    this.basicSearch = function () {
      this.id = 'list-published-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.Component, {
      constructor: this.basicSearch,
      intComponent: function () {
        var qSearch = this;
        this.$qSearch = $.getCmp(this.id);
        this.$inputSearch = $('#wg-list-published-keyword-txt');
        this.$groupSearch = $('#list-published-category-select');
        this.$btnViewAll = $('#list-published-all-btn');
        this.$btnViewHot = $('#list-published-hot-btn');
        this.$selectLanguagePublished = $('#select-language-published');
        this.$btnSearch = this.$qSearch.find('#wg-list-published-search-btn');
        this.$groupSearch.on('change', function () {
          qSearch.setCate($(this).val());
          qSearch.$btnSearch.trigger('click');
        });
        this.$selectLanguagePublished.on('change', function () {
          qSearch.$btnSearch.trigger('click');
        });
        this.$btnViewAll.on('click', function () {
          qSearch.setActive(this);
          qSearch.setCate('');
          qSearch.setHotnew(false);
          qSearch.$groupSearch.val('');
          qSearch.$btnSearch.trigger('click');
        });
        this.$btnViewHot.on('click', function () {
          qSearch.setActive(this);
          qSearch.setHotnew(true);
          qSearch.$btnSearch.trigger('click');
        });
        this.setCate(qSearch.$groupSearch.val());
      },
      updateCount: function (data) {
        //this.$btnViewAll.find('span').text(String.format('({0})', data.total));
        //this.$btnViewHot.find('span').text(String.format('({0})', data.created));
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
      setCate: function (cate) {
        this.cate = cate;
      },
      getCate: function () {
        return this.cate;
      },
      setHotnew: function (type) {
        this.type = type;
      },
      getHotnew: function () {
        return this.type;
      },
      getData: function () {
        return {
          pageSize: 10,
          pageNumber: 0,
          keyword: this.$inputSearch.val() || '',
          category: this.getCate(),
          hotnews: this.getHotnew(),
          language: this.$selectLanguagePublished.val()
        };
      }
    });
    iNet.ui.review.ItemPublishedList.superclass.constructor.call(this);
    FormUtils.showButton(this.$toolbar.CREATE, false);
  };
  iNet.extend(iNet.ui.review.ItemPublishedList, iNet.ui.author.ItemListAbstract, {
    setId: function (id) {
      this.cache.id = id;
    },
    openStatistic: function (record) {
      var __params = String.format('data={0}&type={1}&author={2}', iNet.Base64.encodeObject(record), this.getModule(), iNet.siteId);
      window.location.href = iNet.urlAppend(this.url.statistic, __params);
    },
    updateHot: function (uuid, isHot) {
      var that = this;
      var __uuid = uuid || '';
      var __hot = isHot || false;
      if (!iNet.isEmpty(__uuid)) {
        $.postJSON(this.url.hot, {uuid: __uuid, hotnews: __hot}, function (result) {
          var __result = result || {};
          if (__result.type != 'ERROR') {
            that.update(__result);
          }
        });
      }
    }
  });
});