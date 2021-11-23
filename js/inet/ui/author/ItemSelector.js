// #PACKAGE: author
// #MODULE: cms-item-selector

$(function () {
  /**
   * @class iNet.ui.author.ItemSelector
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.author.ItemSelector');
  iNet.ui.author.ItemSelector = function (config) {
    var that = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.id = this.id || 'list-post-selector-wg';
    this.$element = $('#' + this.id);
    this.gridID = 'list-post-selector-grid';
    this.module = 'post';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.statusQuery = this.statusQuery || CMSConfig.MODE_PUBLISHED;
    this.url = {
      list: iNet.getPUrl('cms/item/textsearch')
    };
    this.$toolbar = {
      SELECT: $('#list-post-selector-btn-ok')
    };
    this.$modal = $('#list-post-selector-modal');
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'subject',
        label: this.getText('name'),
        type: 'label'
      }, {
        property: 'category',
        label: this.getText('name', 'category'),
        width: 150,
        sortable: true,
        type: 'select',
        editData: this.dataCate,
        valueField: 'value',
        displayField: 'name',
        cls: 'hidden-320'
      }, {
        property: 'status',
        label: this.getText('status'),
        sortable: true,
        type: 'text',
        align: 'center',
        cls: 'text-center',
        width: 100,
        renderer: function (v) {
          return String.format('<b class="{1}">{0}</b>', that.getText(v.toLowerCase()), CMSUtils.getColorByStatus(v));
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
      }],
      delay: 250
    });
    this.basicSearch = function () {
      this.id = 'list-post-selector-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.Component, {
      constructor: this.basicSearch,
      intComponent: function () {
        var qSearch = this;
        this.$qSearch = $.getCmp(this.id);
        this.$inputSearch = this.$qSearch.find('.grid-search-input');
        this.$groupSearch = this.$qSearch.find('.grid-search-cate');
        this.$btnSearch = this.$qSearch.find('[data-action-search="search"]:first');
        this.$groupSearch.on('change',function(){
          qSearch.setCate($(this).val());
          qSearch.$btnSearch.trigger('click');
        });
        this.setCate(this.$groupSearch.val());
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
      setCate: function (cate) {
        this.cate = cate;
      },
      getCate: function () {
        return this.cate;
      },
      getData: function () {
        return {
          pageSize : 10,
          pageNumber : 0,
          keyword: this.$inputSearch.val(),
          category: this.getCate(),
          status: that.getStatusQuery()
        };
      }
    });
    iNet.ui.author.ItemSelector.superclass.constructor.call(this);

    this.$toolbar.SELECT.on('click', function () {
      var __list = that.getSelection();
      var __selected = [];
      for (var i = 0; i < __list.length; i++) {
        __selected.push({uuid: __list[i].uuid, subject: __list[i].subject});
      }
      that.fireEvent('selected', __selected);
    });

    this.init();
  };
  iNet.extend(iNet.ui.author.ItemSelector, iNet.ui.ListAbstract, {
    init: function () {

    },
    setStatusQuery: function (status) {
      this.statusQuery = status;
    },
    getStatusQuery: function () {
      return this.statusQuery;
    },
    show: function () {
      this.$element.show();
      this.$modal.modal('show');
    },
    hide: function () {
      this.$element.hide();
      this.$modal.modal('hide');
    }
  });
});
