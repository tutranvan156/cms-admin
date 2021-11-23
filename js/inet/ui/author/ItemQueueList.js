// #PACKAGE: author
// #MODULE: cms-item-queue-list
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 23/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ListQueueItem
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.author.ItemQueueList
   * @extends iNet.ui.author.ItemListAbstract
   */
  iNet.ns('iNet.ui.author.ItemQueueList');
  iNet.ui.author.ItemQueueList = function (config) {
    var _this = this, __cog = config || {};
    var layout = iNet.getLayout();
    iNet.apply(this, __cog);
    this.isUpdateCounter = true;
    this.module = 'post';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.cache = {
      entries: {
        total: 0,
        created: 0,
        review: 0,
        published: 0
      }
    };
    this.url = {
      list: iNet.getPUrl('cms/item/search'),
      del: iNet.getPUrl('cms/item/delete'),
      remove: iNet.getPUrl('cms/item/retrieve'),
      statistic: iNet.getPUrl('cmsadmin/page/statistic')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'subject',
        label: this.getText('name'),
        type: 'label'
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
            return _this.renderCategories(v);
          }
          return v ? v.join(',') : item.category;
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
        property: 'writername',
        label: '<span class="icon-thumbs-up"></span>',
        type: 'label',
        align: 'center',
        cls: 'text-center',
        width: 40,
        renderer: function (v) {
          return '0';
        }
      }*/, {
        property: 'status',
        label: this.getText('status'),
        sortable: true,
        type: 'text',
        align: 'center',
        cls: 'text-center',
        width: 100,
        renderer: function (v, record) {
          return String.format('<b class="{1}">{0}</b>', _this.getStatusText(record), CMSUtils.getColorByStatus(v));
        }
      }, {
        property: 'created',
        label: this.getText('date'),
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
          text: this.getText('Thu hồi'),
          icon: 'fa fa-reply',
          labelCls: 'label label-warning',
          visibled: function (record) {
            return _this.getSecurity().hasRoles(CMSConfig.ROLE_WRITER)
                && record.writercode === iNet.logged
                && ItemUtils.isPending(record);
          },
          fn: function (record) {
            var dialog = _this.confirmDlg(
                _this.getText('Thu hồi bài viết'),
                _this.getText('Bạn chắc chắn muốn thu hồi bài viết đã gửi duyệt?'),
                function () {
                  this.hide();
                  var params = dialog.getOptions();
                  params['categories'] = record.categories.join(',');
                  ItemAPI.withdraw(params, function (result) {
                    if (result.type !== CMSConfig.TYPE_ERROR) {
                      var __cache = _this.getCache();
                      __cache.entries.review -= 1;
                      __cache.entries.created -= 1;
                      _this.updateCount(__cache);
                      _this.success('Thu hồi bài viết', 'Thu hồi bài viết thành công!');
                      _this.reload();
                    } else {
                      _this.error('Thu hồi bài viết', 'Quá trình thu hồi bài viết xảy ra lỗi');
                    }
                  });
                }
            );
            dialog.setOptions({uuid: record.uuid});
            dialog.setTitle('<i class="fa fa-reply orange"></i> Thu hồi bài viết');
            dialog.show();
          }
        }, {
          text: this.getText('unpublish', this.getModule()),
          icon: 'icon-remove',
          labelCls: 'label label-important',
          visibled: function (record) {
            return (_this.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER) || _this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN))
                && record.status === CMSConfig.MODE_PUBLISHED;
          },
          fn: function (record) {
            var dialog = _this.confirmDlg(
                _this.getText('remove_title', _this.getModule()), _this.getText('remove_content', _this.getModule()),
                function () {
                  this.hide();
                  $.postJSON(_this.url.remove, dialog.getOptions(), function (result) {
                    var __result = result || {};
                    if (iNet.isDefined(__result.uuid)) {
                      var __cache = _this.getCache();
                      __cache.entries.published -= 1;
                      __cache.entries.review += 1;
                      _this.updateCount(__cache);
                      _this.success(_this.getText('remove_title', _this.getModule()), _this.getText('remove_success', _this.getModule()));
                      _this.fireEvent(_this.getEvent('back'), _this);
                      _this.fireEvent(_this.getEvent('removed'), _this.getCache());
                      _this.reload();
                    } else {
                      _this.error(_this.getText('remove_title', _this.getModule()), _this.getText('remove_unsuccess', _this.getModule()));
                    }
                  }, {
                    mask: _this.getMask(),
                    msg: iNet.resources.ajaxLoading.deleting
                  });
                }
            );
            dialog.setOptions({uuid: record.uuid});
            dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('remove_title'));
            dialog.show();
          }
        }, {
          text: this.getText('del', 'button', '', iNet.resources.message),
          icon: 'icon-trash',
          labelCls: 'label label-important',
          visibled: function (record) {
            return _this.getSecurity().hasRoles([CMSConfig.ROLE_WRITER, CMSConfig.ROLE_ADMIN]) && record.status == CMSConfig.MODE_CREATED;
          },
          fn: function (record) {
            _this.setId(record.uuid);
            _this.dialog = _this.confirmDlg(
                _this.getText('del_title', _this.getModule()),
                _this.getText('del_content', _this.getModule()), function () {
                  $.postJSON(_this.url.del, _this.getCache(), function (result) {
                    _this.dialog.hide();
                    if (iNet.isDefined(result.uuid)) {
                      var __cache = _this.getCache();
                      __cache.entries.total -= 1;
                      if (result.status === CMSConfig.MODE_CREATED) {
                        __cache.entries.created -= 1;
                      } else {
                        __cache.entries.published -= 1;
                      }
                      _this.removeByID(result.uuid);
                      _this.updateCount(__cache);
                      _this.success(_this.getText('del_title', _this.getModule()), _this.getText('del_success', _this.getModule()));
                    } else {
                      _this.error(_this.getText('del_title', _this.getModule()), _this.getText('del_unsuccess', _this.getModule()));
                    }
                  }, {
                    mask: _this.getMask(),
                    msg: iNet.resources.ajaxLoading.deleting
                  });
                });
            _this.dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
            _this.dialog.show();
          }
        }]
      }],
      delay: 250
    });

    this.convertData = function (data) {
      var items = data.items || [];
      _this.cache.entries.total = data.total;
      _this.cache.entries.published = items.filter(function (item) {
        return ItemUtils.isPublished(item);
      }).length;
      _this.cache.entries.created = items.filter(function (item) {
        return ItemUtils.isCreated(item);
      }).length;
      _this.cache.entries.review = items.filter(function (item) {
        return ItemUtils.isPending(item);
      }).length;
      _this.grid.setTotal(data.total);
      return items;
    };
    this.basicSearch = function () {
      this.id = 'list-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.Component, {
      constructor: this.basicSearch,
      intComponent: function () {
        var qSearch = this;
        this.$qSearch = $.getCmp(this.id);
        this.$inputSearch = this.$qSearch.find('.grid-search-input');
        this.$groupSearch = this.$qSearch.find('.grid-search-cate');
        this.$btnViewAll = this.$qSearch.find('#btn-view-all-post');
        this.$btnViewCreated = this.$qSearch.find('#btn-view-created');
        this.$btnViewPending = this.$qSearch.find('#btn-view-pending');
        this.$btnViewPosted = this.$qSearch.find('#btn-view-posted');
        this.$selectViewLanguage = $('#select-language-view');
        this.$btnSearch = this.$qSearch.find('[data-action-search="search"]:first');
        this.$groupSearch.on('change', function () {
          _this.isUpdateCounter = true;
          for (var i = 0; i < _this.dataCate.length; i++) {
            var cate = _this.dataCate[i];
            if (cate.value === this.value) {
              qSearch.setCate(cate.value);
              qSearch.setGroup(cate.group);
              break;
            }
          }
          qSearch.$btnSearch.trigger('click');
        });
        this.$selectViewLanguage.on('change', function () {
          _this.isUpdateCounter = true;
          qSearch.$btnSearch.trigger('click');
        });

        this.$btnViewAll.on('click', function () {
          _this.isUpdateCounter = false;
          qSearch.setActive(this);
          qSearch.setStatus('');
          qSearch.$btnSearch.trigger('click');
        });
        this.$btnViewCreated.on('click', function () {
          _this.isUpdateCounter = false;
          qSearch.setActive(this);
          qSearch.setStatus(CMSConfig.MODE_CREATED);
          qSearch.$btnSearch.trigger('click');
        });
        this.$btnViewPending.on('click', function () {
          _this.isUpdateCounter = false;
          qSearch.setActive(this);
          qSearch.setStatus(CMSConfig.MODE_WORKFLOW);
          qSearch.$btnSearch.trigger('click');
        });
        this.$btnViewPosted.on('click', function () {
          _this.isUpdateCounter = false;
          qSearch.setActive(this);
          qSearch.setStatus(CMSConfig.MODE_PUBLISHED);
          qSearch.$btnSearch.trigger('click');
        });
      },
      updateCount: function (data) {
        this.$btnViewAll.find('span').text(String.format('({0})', data.total));
        this.$btnViewCreated.find('span').text(String.format('({0})', data.created));
        this.$btnViewPending.find('span').text(String.format('({0})', data.review));
        this.$btnViewPosted.find('span').text(String.format('({0})', data.published));
      },
      setActive: function (el) {
        var $el = $(el);
        var $parent = $el.parent();
        $parent.children().removeClass('active');
        $el.addClass('active');
      },
      getUrl: function () {
        return _this.url.list;
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
      setGroup: function (group) {
        this.group = group;
      },
      getGroup: function () {
        return this.group;
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
          category: this.getCate(),
          group: this.getGroup(),
          status: this.getStatus(),
          language: this.$selectViewLanguage.val()
        };
      }
    });
    iNet.ui.author.ItemQueueList.superclass.constructor.call(this);
    if (layout.paramMenu) {
      if (layout.paramMenu.status === CMSConfig.MODE_CREATED)
        this.getBasicSearch().$btnViewCreated.trigger('click');
      else if (layout.paramMenu.status === CMSConfig.MODE_PUBLISHED)
        this.getBasicSearch().$btnViewPosted.trigger('click');
      else if (layout.paramMenu.status === 'all')
        this.getBasicSearch().$btnViewAll.trigger('click');
      else {
        this.getBasicSearch().setCate(layout.paramMenu.statusCate);
        if (layout.paramMenu.pulished === '') {
          this.getBasicSearch().$groupSearch.val(layout.paramMenu.statusCate);
          this.getBasicSearch().$btnSearch.trigger('click');
        } else {
          this.getBasicSearch().setStatus(layout.paramMenu.published);
          this.getBasicSearch().$groupSearch.val(layout.paramMenu.statusCate);
          if (layout.paramMenu.pulished === CMSConfig.MODE_CREATED)
            this.getBasicSearch().$btnViewCreated.trigger('click');
          else if (layout.paramMenu.pulished === CMSConfig.MODE_PUBLISHED)
            this.getBasicSearch().$btnViewPosted.trigger('click');
        }
        this.isUpdateCounter = true;
      }
    }
    this.getGrid().on('loaded', function () {
      if (_this.isUpdateCounter) {
        _this.updateCount();
      }
      _this.isUpdateCounter = true;
    });
  };
  iNet.extend(iNet.ui.author.ItemQueueList, iNet.ui.author.ItemListAbstract, {
    openStatistic: function (record) {
      var __params = String.format('data={0}&type={1}&author={2}', iNet.Base64.encodeObject(record), this.getModule(), iNet.siteId);
      window.location.href = iNet.urlAppend(this.url.statistic, __params);
    },
    setCate: function (cate) {
      this.cate = cate;
    },
    setId: function (id) {
      this.cache.uuid = id;
    },
    updateCount: function (data) {
      var __data = data || this.getCache();
      this.grid.quickSearch.updateCount(__data.entries);
    }
  });
});