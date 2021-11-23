// #PACKAGE: author
// #MODULE: cms-comment-content
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 27/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file CommentContent
 * @author nbchicong
 */
$(function () {
  /**
   * @class iNet.ui.author.CommentContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.author.CommentContent');
  iNet.ui.author.CommentContent = function (config) {
    var that = this, __cog = config || {};
    var __status = ['CREATED', 'PUBLISHED'];
    iNet.apply(this, __cog);
    this.id = 'comment-content-wg';
    this.module = 'comment';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.url = {
      review: iNet.getPUrl('cms/comment/update'),
      del: iNet.getPUrl('cms/comment/delete')
    };
    this.$toolbar = {
      BACK: $('#content-btn-back'),
      APPROVED: $('#content-btn-approved'),
      REJECT: $('#content-btn-reject'),
      DEL: $('#content-btn-del')
    };
    this.$form = {
      author: $('#comment-author'),
      subject: $('#comment-subject'),
      message: $('#comment-message'),
      post: $('#comment-post')
    };
    this.$toolbar.BACK.on('click', function () {
      that.hide();
      that.fireEvent(that.getEvent('back'), that);
    });
    this.$toolbar.APPROVED.on('click', function () {
      var __comment = that.getComment();
      __comment.setStatus(__status[1]);
      changeStatus(__comment);
    });
    this.$toolbar.REJECT.on('click', function () {
      var __comment = that.getComment();
      __comment.setStatus(__status[0]);
      changeStatus(__comment);
    });
    this.$toolbar.DEL.on('click', function () {
      that.confirmDlg(
          that.getText('del_title', that.getModule()),
          that.getText('del_content', that.getModule()), function () {
            $.postJSON(that.url.del, that.dialog.getOptions(), function (result) {
              that.dialog.hide();
              if (iNet.isDefined(result.uuid)) {
                that.hide();
                that.fireEvent(that.getEvent('deleted'), that.getComment());
                that.success(that.getText('del_title', that.getModule()), that.getText('del_success', that.getModule()));
              } else {
                that.error(that.getText('del_title', that.getModule()), that.getText('del_unsuccess', that.getModule()));
              }
            }, {
              mask: that.getMask(),
              msg: iNet.resources.ajaxLoading.deleting
            });
          }
      ).setOptions({id: that.getComment().uuid});
      that.dialog.show();
    });
    var changeStatus = function (data) {
      $.postJSON(that.url.review, data, function (result) {
        if (data.getStatus() == __status[1]) {
          if (iNet.isDefined(result.uuid)) {
            that.success(that.getText('approved_title', that.getModule()), that.getText('approved_success', that.getModule()));
            that.fireEvent(that.getEvent('approved'), data, that);
            that.$toolbar.APPROVED.hide();
          } else {
            that.error(that.getText('approved_title', that.getModule()), that.getText('approved_unsuccess', that.getModule()));
          }
        } else {
          if (iNet.isDefined(result.uuid)) {
            that.success(that.getText('reject_title', that.getModule()), that.getText('reject_success', that.getModule()));
            that.fireEvent(that.getEvent('rejected'), data, that);
          } else {
            that.error(that.getText('reject_title', that.getModule()), that.getText('reject_unsuccess', that.getModule()));
          }
        }
      });
    };
    iNet.ui.author.CommentContent.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.author.CommentContent, iNet.ui.WidgetExt, {
    setComment: function (comment) {
      this.cache.cmt = comment;
    },
    getComment: function () {
      return this.cache.cmt;
    },
    load: function (data) {
      this.setComment(data || new iNet.ui.model.Comment());
      var __comment = this.getComment();
      this.$form.post.html(this.getText('post', this.getModule()) + ': ' + (__comment.getItemSubject() || ''))
      this.$form.author.html(String.format(
          '{0} {1} {2}',
          __comment.getAuthor() || '',
          this.getText('cmt_on', this.getModule()),
          new Date(__comment.getCreated()).format(iNet.fullDateFormat)));
      this.$form.subject.html(__comment.getSubject());
      this.$form.message.html(__comment.getContent());
      if (__comment.getStatus() == 'CREATED') {
        this.$toolbar.APPROVED.show();
      } else {
        this.$toolbar.APPROVED.hide();
      }
    }
  });
});