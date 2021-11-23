/**
 * #PACKAGE: admin
 * #MODULE: cms-poll-content
 */
/**
 * Copyright (c) 2017 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:25 AM 28/10/2017.
 * -------------------------------------------
 * @project cms-admin
 * @author nbccong
 * @file PollContent.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.PollContent
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.PollContent');
  iNet.ui.admin.PollContent = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'poll-content-wg';
    this.module = 'poll';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.count = 0;
    this.countLoad = 0;
    this.toolbar = {
      BACK: $('#content-btn-back'),
      CREATE: $('#content-btn-create'),
      SAVE: $('#content-btn-save'),
      DEL: $('#content-btn-del')
    };

    this.form = {
      question: $('#txt-poll-question-0'),
      answerWrapper: $('#poll-answer-wrapper-0'),
      btnAddAnswer: $('#poll-add-answer-0'),
      multi: $('#chk-poll-multi-0'),
      share: $('#chk-poll-share'),
      addPoll: $('#poll-add'),
      formPoll: $('.list-poll'),
      subject: $('#subject-question')
    };

    this.itemTplId = 'item-answer-template';
    this.newsPollId = 'news-form-poll';

    iNet.ui.admin.PollContent.superclass.constructor.call(this);

    this.toolbar.BACK.on('click', function () {
      _this.hide();
      _this.clear();
      _this.fireEvent('back', _this);
      if (_this.countLoad !== 0) {
        _this.fireEvent('save-update', _this);
        _this.countLoad = 0;
      }
    });

    this.toolbar.CREATE.on('click', function () {
      _this.clear();
    });

    this.toolbar.SAVE.on('click', function () {
      if (_this.getRecord().uuid)
        PollAPI.update(_this.getData(), function (result) {
          if (result.type === 'ERROR')
            _this.error(
                iNet.resources.notify.update,
                _this.getText('update_error')
            );
          else {
            _this.success(
                iNet.resources.notify.update,
                _this.getText('update_success')
            );
            _this.fireEvent('updated', result, _this);
          }
        });
      else
        PollAPI.create(_this.getData(), function (result) {
          if (result.type === 'ERROR')
            _this.error(
                iNet.resources.notify.create,
                _this.getText('create_error')
            );
          else {
            _this.success(
                iNet.resources.notify.create,
                _this.getText('create_success')
            );
            _this.getRecord().uuid = result.uuid;
            _this.fireEvent('created', result, _this);
          }
        });
    });

    this.toolbar.DEL.on('click', function () {
      var dialog = _this.confirmDlg(
          _this.getText('del_title'),
          _this.getText('del_content'),
          function () {
            PollAPI.remove(this.getData(), function (result) {
              if (result && result.uuid) {
                _this.fireEvent('removed', result);
                _this.success(_this.getText('del_title'), _this.getText('del_success'));
              }
              else
                _this.error(_this.getText('del_title'), _this.getText('del_error'));
            });
            this.hide();
          });
      dialog.setData({uuid: _this.getRecord().uuid});
      dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
      dialog.show();
    });

    this.addAnswer = function (el) {
      el.on('click', function () {
        $(this).prev().append(iNet.Template.parse(_this.itemTplId, {}));
        $(this).prev().find('button').last().removeClass('btn-remove');
        $(this).prev().find('button').last().addClass('btn-remove-answer');
      });
    }

    this.removeAnswer = function (el) {
      el.on('click', '.btn-remove-answer', function () {
        $(this).closest('.answer-item').remove();
      });
    };
    this.addAnswer(this.form.btnAddAnswer);
    this.removeAnswer(this.form.answerWrapper);

    this.form.addPoll.on('click', function () {
      _this.count += 1;
      console.log('_this.count',_this.count);
      _this.form.formPoll.append(iNet.Template.parse(_this.newsPollId, {index: _this.count}));
      _this.addAnswer($('#poll-add-answer-' + _this.count + ''));
      _this.removeAnswer($('#poll-answer-wrapper-' + _this.count + ''));
    });

  };
  iNet.extend(iNet.ui.admin.PollContent, iNet.ui.WidgetExt, {
    setRecord: function (record) {
      this.current = record;
    },
    getRecord: function () {
      return this.current;
    },
    load: function (recordId) {
      var _this = this;
      this.clear();
      PollAPI.load({uuid: recordId}, function (result) {
        _this.setRecord(result);
        _this.fillForm();
        FormUtils.showButton(_this.toolbar.DEL, !!result.uuid);
      });
    },
    getData: function () {
      var data = {};

      data.shared = this.form.share[0].checked;
      data.subject = this.form.subject.val();
      data.questions = [];
      $('.form-poll-child').each(function (i, e) {
        console.log('i',i);
        var jsonChild = {};
        var answer = [];
        jsonChild.question = $('#txt-poll-question-' + i + '').val();
        jsonChild.multiChoice = $('#chk-poll-multi-' + i + '')[0].checked;
        if ($(this).attr('data-key'))
          jsonChild.key = $(this).attr('data-key');
        $(this).find('.answer').each(function () {
          if ($(this).val() || $(this).parent().attr('data-answer')) {
            answer.push({
              content: $(this).val(),
              key: $(this).parent().attr('data-answer')
            });
          }
        });
        jsonChild.answers = answer;
        data.questions.push(jsonChild);
      });

      data.questions = JSON.stringify(data.questions);
      console.log('data: ', data);
      return $.extend({}, this.getRecord(), data);
    },
    fillForm: function () {
      var _this = this;
      var data = this.getRecord();
      this.form.share[0].checked = data.shared || false;
      if (data.uuid) {
        if (data.questions.length !== 0) {
          _this.form.subject.val(data.subject);
          for (var i = 0; i < data.questions.length; i++) {
            var item = data.questions[i];
            if (i === 0) {
              this.form.question.val(item.question);
              var parentForm = this.form.question.parents('.form-poll-child');
              $(parentForm).attr('data-uuid', data.uuid);
              $(parentForm).attr('data-key', item.key);
              for (var j = 0; j < item.answers.length; j++) {
                if (j === 0) {
                  var inputFirst = _this.form.answerWrapper.find('input:eq(' + j + ')');
                  $(inputFirst).val(item.answers[j].answer);
                  $(inputFirst).parent().attr('data-uuid', data.uuid);
                  $(inputFirst).parent().attr('data-key', item.key);
                  $(inputFirst).parent().attr('data-answer', item.answers[j].key);
                }
                else {
                  _this.form.answerWrapper.append(iNet.Template.parse(_this.itemTplId, {
                    uuid: data.uuid,
                    questionKey: item.key,
                    answerKey: item.answers[j].key
                  }));
                  _this.form.answerWrapper.find('input:eq(' + j + ')').val(item.answers[j].answer);

                }
                _this.form.multi[0].checked = item.multiChoice || false;
              }
            }
            else {
              _this.isUpdateCounter = i;
              _this.form.formPoll.append(iNet.Template.parse(_this.newsPollId, {
                index: i,
                uuid: data.uuid,
                questionKey: item.key
              }));
              _this.addAnswer($('#poll-add-answer-' + i + ''));
              _this.removeAnswer($('#poll-answer-wrapper-' + i + ''));
              $('#txt-poll-question-' + i + '').val(item.question);
              var answerWrapperAppend = $('#poll-answer-wrapper-' + i + '');
              for (var j = 0; j < item.answers.length; j++) {
                if (j === 0) {
                  var __inputFirst = answerWrapperAppend.find('input:eq(' + j + ')');
                  $(__inputFirst).val(item.answers[j].answer);
                  $(__inputFirst).parent().attr('data-uuid', data.uuid);
                  $(__inputFirst).parent().attr('data-key', item.key);
                  $(__inputFirst).parent().attr('data-answer', item.answers[j].key);
                  // answerWrapperAppend.find('input:eq(' + j + ')').val(item.answers[j].answer);
                }
                else {
                  answerWrapperAppend.append(iNet.Template.parse(_this.itemTplId, {
                    uuid: data.uuid,
                    questionKey: item.key,
                    answerKey: item.answers[j].key
                  }));
                  answerWrapperAppend.find('input:eq(' + j + ')').val(item.answers[j].answer);
                }
                // console.log('aaaaaaa: ',$('#chk-poll-multi-' + j + '')[0]);
                // console.log('aaaaaaa: ',$('#chk-poll-multi-' + i + '')[0]);
                $('#chk-poll-multi-' + i + '')[0].checked = item.multiChoice || false;
              }
            }
          }
        }
      }
      else {
        this.form.question.val(data.question || '');
        this.form.answerWrapper.val('');
        this.form.multi[0].checked = data.multiChoice || false;
      }
      $('.btn-del-question').unbind().click(function () {
        var __this = this;
        var dialog = _this.confirmDlg(
            _this.getText('del_title'),
            _this.getText('del_content'),
            function () {
              $.postJSON(iNet.getPUrl('cms/poll/question/rm'), this.getData(), function (result) {
                if (result && result.uuid) {
                  _this.fireEvent('removed', result);
                  $(__this).parent().remove();
                  _this.success(_this.getText('del_title'), _this.getText('del_success'));
                  _this.countLoad += 1;
                }
                else {
                  _this.error(_this.getText('del_title'), _this.getText('del_error'));
                }
              });
              this.hide();
            });
        dialog.setData({
          uuid: $(this).parent().attr('data-uuid'),
          questionKey: $(this).parent().attr('data-key')
        });
        dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
        dialog.show();
      });

      $('.btn-remove').unbind().click(function () {
        var __this = this;
        var __parent = $(this).parents('.input-group:first');
        var dialog = _this.confirmDlg(
            _this.getText('del_title'),
            _this.getText('del_content'),
            function () {
              $.postJSON(iNet.getPUrl('cms/poll/answer/rm'), this.getData(), function (result) {
                if (result && result.uuid) {
                  _this.fireEvent('removed', result);
                  _this.success(_this.getText('del_title'), _this.getText('del_success'));
                  $(__this).parents('.answer-item:first').remove();
                  _this.countLoad += 1;
                }
                else {
                  _this.error(_this.getText('del_title'), _this.getText('del_error'));

                }
              });
              this.hide();
            });
        dialog.setData({
          uuid: $(__parent).attr('data-uuid'),
          questionKey: $(__parent).attr('data-key'),
          answerKey: $(__parent).attr('data-answer')
        });
        dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('del_title'));
        dialog.show();
      });
      $('.btn-del-question').each(function () {
        $(this).show();
      });
      $('.btn-remove').each(function () {
        $(this).show();
      });
    },
    setForm: function () {
      $('.btn-del-question').each(function () {
        $(this).css('display', 'none');
      });
      $('.btn-remove').each(function () {
        $(this).css('display', 'none');
      });
      this.form.formPoll.find('.form-poll-child').each(function (i, e) {
        if (i !== 0) {
          $(this).remove();
        }
      });
    },
    clear: function () {
      this.setForm();
      this.setRecord({});
      this.fillForm();
      this.form.answerWrapper.find('.answer-item').not('.default').remove();
      this.form.answerWrapper.find('input').val('');
      FormUtils.showButton(this.toolbar.SAVE, true);
      FormUtils.showButton(this.toolbar.DEL, false);
    }
  });
});

