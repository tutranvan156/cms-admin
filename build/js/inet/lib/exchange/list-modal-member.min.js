/**
 * #PACKAGE: exchange
 * #MODULE: list-modal-member
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:11 30/08/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListModalMember.js
 */
$(function () {
  /**
   * @class iNet.ui.exchange.ListModalMember
   * @extends iNet.ui.ListAbstract
   */
  iNet.ns('iNet.ui.exchange.ListModalMember');
  iNet.ui.exchange.ListModalMember = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'wg-list-topic-member';
    this.gridID = 'grid-topic-member';
    this.module = 'topic';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.remote = true;
    this.username='';
    this.param={};
    this.firstLoad=false;
    this.url = {
      list: iNet.getPUrl('onl/exch/topic/member/list'),
      assign: iNet.getPUrl('onl/exch/question/assign')
    };
    this.$modal={
      modal:$('#myModal')
    };
    this.$btn={
      SEND:$('#btn-member-send')
    };
    this.dataSource = new iNet.ui.grid.DataSource({
      columns: [
        {
          property: 'username',
          label: _this.getText('name_admin'),
          type: 'text',
          sortable: true,
          width: 170,
          validate: function (v) {
            if (iNet.isEmpty(v)) {
              return _this.getText('validate_name');
            }
          }
        }, {
          property: 'fullname',
          label: _this.getText('fullname_admin'),
          type: 'text',
          sortable: true,
          width: 130,
          validate: function (v) {
            if (iNet.isEmpty(v)) {
              return _this.getText('validate_fullname');
            }
          }
        }, {
          property: 'alias',
          label: _this.getText('alias'),
          type: 'text',
          sortable: true,
          width: 170,
          validate: function (v) {
            if (iNet.isEmpty(v)) {
              return _this.getText('validate_alias');
            }
          }
        }],
      delay: 250
    });
    this.basicSearch = function () {
      this.id = 'list-basic-search-member-all';
    };
    iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
      constructor: this.basicSearch,
      intComponent: function () {
        var search = this;
        this.inputSearch = this.getEl().find('.grid-search-input');
        this.selectType = $('#selected-type-question');
        this.btnSearch = this.getEl().find('.grid-search-btn');

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
          topic:_this.getTopic()
        };
      }
    });
    iNet.ui.exchange.ListModalMember.superclass.constructor.call(this);
    this.getGrid().on('click',function(record){
      _this.username=record.username;
      _this.param.topic=record.topic;
      //console.log('record: ',record);
    });
    _this.$btn.SEND.on('click',function(){
      _this.param.guest=_this.username;
      _this.param.uuid=_this.getUuid();
      $.postJSON(_this.url.assign,_this.param,function(result){
        if (result.type === 'ERROR')
          _this.error(_this.getText('send_answer'), _this.getText('send_answer_error'));
        else {
          _this.$modal.modal.hide();
          $('.modal-backdrop').hide();
          $('.modal-scrollable').hide();
          _this.fireEvent(_this.getEvent('sended'),_this);
          _this.success(_this.getText('send_answer'), _this.getText('send_answer_success'));
        }
      });
    });
  };
  iNet.extend(iNet.ui.exchange.ListModalMember, iNet.ui.ListAbstract, {
    setTopic:function(id){
      this.topic=id;
    },
    getTopic:function(){
      return this.topic;
    },
    setUuid:function(uuid){
      this.uuid=uuid;
    },
    getUuid:function(){
      return this.uuid;
    },

    loadList: function () {
      this.setParams({
        pageSize: CMSConfig.PAGE_SIZE,
        pageNumber: 0,
        keywords: '',
        topic: this.getTopic()
      });
      this.load();
    }
  });
});
