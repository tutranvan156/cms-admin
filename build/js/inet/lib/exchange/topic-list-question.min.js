/**
 * #PACKAGE: exchange
 * #MODULE: topic-list-question
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 18:47 28/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file TopicListQuestion.js
 */
$(function () {
  /**
   * @class iNet.ui.exchange.TopicListQuestion
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.exchange.TopicListQuestion');
  iNet.ui.exchange.TopicListQuestion = function (options) {
    var _this = this, config = options || {};
    iNet.apply(this, config);
    this.id = 'wg-list-question';
    this.gridID = 'grid-list-question';
    this.module = 'topic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.remote = true;
    this.firstLoad = false;
    this.url = {
      list: iNet.getPUrl('onl/exch/question/list'),
      _delete: iNet.getPUrl('onl/exch/question/delete')
    };
    this.$btn = {
      BACK: $('#content-btn-back-question'),
      CREATED: $('#list-question-btn-create')
    };

    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'fullname',
          label: _this.getText('name_create_question'),
          type: 'text',
          sortable: true,
          width: 250
        }, {
          property: 'address',
          label: _this.getText('address','fqa'),
          type: 'text',
          sortable: true
        }, {
          property: 'status',
          label: _this.getText('status', 'fqa'),
          type: 'text',
          sortable: true,
          cls: 'text-center',
          width: 100,
          renderer:function(value){
            if(value==='CREATED')
              return 'Vừa tạo';
            else if(value==='PROCESS')
              return 'Đang xử lý';
            else if(value==='REVIEW')
              return 'Đang chờ duyệt';
            else if(value==='REJECT')
              return 'Từ chối';
            else if(value==='PUBLISHED')
              return 'Đã xuất bản';
            else if(value==='DELETE')
              return 'Đã xóa';
          }
        }, {
          property: 'created',
          label: _this.getText('date', 'link'),
          type: 'text',
          sortable: true,
          cls: 'text-center',
          width: 90,
          renderer: function (v) {
            return new Date(v).format('d/m/Y');
          }
        }, {
          label: '',
          type: 'action',
          align: 'center',
          buttons: [{
            text: _this.getText('delete', 'link'),
            icon: 'icon-trash',
            labelCls: 'label label-danger',
            fn: function (record) {
              var dialog = _this.confirmDlg(_this.getText('title_delete', 'link'), _this.getText('quesion_delete', 'link'), function () {
                rowRemove(this.getOptions(), record, this);
              });
              dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('title_delete', 'link'));
              dialog.setOptions({
                uuid: record.uuid,
                topic: _this.getTopicId()
              });
              dialog.show();
            }
          }]
        }],
      delay: 250
    });

    function rowRemove(_uuid, record, _dialog) {
      _dialog.hide();
      $.postJSON(_this.url._delete, _uuid, function (result) {
        if (result.success === false)
          _this.error(_this.getText('delete', 'link'), _this.getText('delete_error', 'link'));
        else {
          _this.removeRecord(record);
          _this.success(_this.getText('delete', 'link'), _this.getText('delete_success', 'link'));
        }
      });
    }

    this.basicSearch = function () {
      this.id = 'list-basic-search-question';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.selectType = $('#selected-type-question');
        this.btnSearch = this.getEl().find('.grid-search-btn');
        this.selectType.on('change', function () {
          search.btnSearch.trigger('click');
        });
      },
      getId: function () {
        return this.id;
      },
      getUrl: function () {
        return _this.url.list;
      },
      getData: function () {
        return {
          pageSize: CMSConfig.PAGE_SIZE,
          pageNumber: 0,
          keywords: this.inputSearch.val(),
          status: this.selectType.val(),
          topic: _this.getTopicId() || ''
        };
      }
    });
    iNet.ui.exchange.TopicListQuestion.superclass.constructor.call(this);
    this.$btn.CREATED.on('click', function () {
      _this.fireEvent(_this.getEvent('question_content'), _this.getTopicId(), _this);
    });
    this.$btn.BACK.on('click', function () {
      _this.setTopicId(null);
      _this.hide();
      _this.fireEvent(_this.getEvent('back_list'), _this);
    });
    this.getGrid().on('click',function(record){
      _this.fireEvent(_this.getEvent('open'),record,_this.getTopicId(),_this);
    });
  };
  iNet.extend(iNet.ui.exchange.TopicListQuestion, iNet.ui.ListAbstract, {
    setTopicId: function (topicId) {
      this.topicId = topicId;
    },
    getTopicId: function () {
      return this.topicId;
    },
    loadList: function () {
      this.setParams({
        pageSize: 10,
        pageNumber: 0,
        keywords: '',
        status: '',
        topic: this.getTopicId()
      });
      this.load();
    }
  });
});
