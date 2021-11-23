// #PACKAGE: review
// #MODULE: cms-item-review
/**
 * DUYET BAI VIET
 * Created by Huyen Doan <huyendv@inetcloud.vn> on 06/07/2015.
 */
$(function () {
  /**
   * @class iNet.ui.author.ItemReview
   * @extends iNet.ui.author.ItemListAbstract
   */
  iNet.ns('iNet.ui.author.ItemReview');
  iNet.ui.author.ItemReview = function (config) {
    var _this = this, __cog = config || {};
    iNet.apply(this, __cog);
    this.id = this.id || 'review-list-wg';
    this.gridID = 'review-list-grid';
    this.module = 'review';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    // this.dataCate = dataCate || [];
    this.url = {
      list: iNet.getPUrl('cms/item/reviewlist'),
      cate: iNet.getPUrl('cms/item/catereview')
    };
    var $cate = null;
    var $keyword = null;
    var params = {
      pageSize: 10,
      pageNumber: 0,
      keyword: '',
      category: '',
      language: ''
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        property: 'subject',
        label: _this.getText('subject', _this.getModule()),
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
            var text = '<ul class="list-default no-margin-bottom">';
            (v || []).forEach(function (value) {
              for (var i = 0; i < _this.dataCate.length; i++) {
                if (_this.dataCate[i].value === value) {
                  text += '<li>' + _this.dataCate[i].name + '</li>';
                  break;
                }
              }
            });
            text += '</ul>';
            return text;
          }
          return v ? v.join(',') : item.category;
        }
      }, {
        property: 'writername',
        label: this.getText('writername', _this.getModule()),
        type: 'label',
        width: 200,
        renderer: function (v) {
          return v;
        }
      }, {
        property: 'created',
        label: this.getText('created', _this.getModule()),
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
      this.id = 'review-list-basic-search';
    };
    iNet.extend(this.basicSearch, iNet.Component, {
      constructor: this.basicSearch,
      intComponent: function () {
        $lang = $('#select-language-review');
        $lang.on('change', function () {
          params.language = $lang.val();
          _this.grid.load();
        });
        $cate = $('#review-list-search-cate');
        $cate.on('change', function () {
          params.code = $cate.val();
          _this.grid.load();
        });
        $keyword = $('#review-list-keyword-txt');
        $keyword.on('change', function () {
          params.keyword = $keyword.val();
          _this.grid.load();
        });
      },
      getUrl: function () {
        return _this.url.list;
      },
      getId: function () {
        return this.id;
      },
      getData: function () {
        var __params = params;
        __params.code = $cate.val() || '';
        __params.keyword = $keyword.val() || '';
        __params.language = $lang.val() || '';
        return __params;
      }
    });
    iNet.ui.author.ItemReview.superclass.constructor.call(this);
    this.grid.on('click', function (record) {
      _this.fireEvent(_this.getEvent('open'), record || {}, _this);
    });

    _this.getGrid().$searchcontrol.off('searched cleared');
    _this.getGrid().$filtercontrol.off('changed');
  };

  iNet.extend(iNet.ui.author.ItemReview, iNet.ui.author.ItemListAbstract);

  /**
   * @type {iNet.ui.author.ItemReview}
   * @private
   */
  var reviewList = new iNet.ui.author.ItemReview();
  /**
   * @type {iNet.ui.author.ItemCompose}
   * @private
   */
  var post = null;
  /**
   * @type {iNet.ui.form.History}
   * @private
   */
  var history = new iNet.ui.form.History({
    id: 'history-' + iNet.generateId(),
    root: reviewList
  });
  /**
   * @param {iNet.ui.author.ItemReview} parent
   * @returns {iNet.ui.author.ItemCompose}
   */
  var loadPostWg = function (parent) {
    if (!post) {
      post = new iNet.ui.author.ItemCompose({type: 'REVIEWER'});
      post.on(post.getEvent('back'), function () {
        parent.show();
        parent.grid.load();
      });
      post.on(post.getEvent('send'), function () {
        post.hide();
        parent.show();
        parent.grid.load();
      });
      post.on(post.getEvent('removed'), function () {
        post.hide();
        parent.show();
        parent.grid.load();
      });
    }
    if (parent) {
      post.setParent(parent);
      parent.hide();
    }
    history.push(post);
    post.passRoles(parent);
    post.show();
    return post;
  };
  history.on('back', function (widget) {
    widget.show();
  });
  reviewList.show();
  reviewList.on(reviewList.getEvent('open'), function (record, parent) {
    post = loadPostWg(parent);
    post.setLoadUrl(iNet.getPUrl('workflow/cms/review'));
    post.loadReview(record.uuid, record.status);
  });
});
