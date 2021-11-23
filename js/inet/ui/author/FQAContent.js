// #PACKAGE: author
// #MODULE: cms-fqa-content
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 27/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file FQAContent
 * @author nbchicong
 */
$(function () {
    /**
     * @class iNet.ui.author.FQAContent
     * @extends iNet.ui.WidgetExt
     */
    iNet.ns('iNet.ui.author.FQAContent');
    iNet.ui.author.FQAContent = function (config) {
        var that = this, __cog = config || {};
        var __status = ['CREATED', 'PUBLISHED'];
        iNet.apply(this, __cog);
        this.id = 'fqa-content-wg';
        this.module = 'fqa';
        this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
        this.dataCate = dataCate || [];
        this.url = {
            save: iNet.getPUrl('cmsfaq/review/create'),
            answer: iNet.getPUrl('faq/statusupdate'),
            load: iNet.getPUrl('cmsfaq/review/load'),
            update: iNet.getPUrl('faq/update'),
            del: iNet.getPUrl('faq/delete'),
            exportDetail: iNet.getPUrl('cms/denunciation/excel/generator'),
            check_status: iNet.getPUrl('report/file/chkstatus'),
            download: iNet.getPUrl('report/file/download')
        };
        this.$toolbar = {
            BACK: $('#content-btn-back'),
            CREATE: $('#content-btn-create'),
            ANSWER: $('#content-btn-answer'),
            DEL: $('#content-btn-del'),
            EXPORT: $('#content-btn-export')
        };
        this.form = this.form || {
            owner: $('#fqa-content-owner'),
            subject: $('#fqa-content-subject'),
            category: $('#fqa-content-category'),
            question: $('#fqa-content-question'),
            answer: $('#fqa-content-answer')
        };
        this.$toolbar.BACK.on('click', function () {
            that.hide();
            that.fireEvent('back', that);
        });
        this.$toolbar.CREATE.on('click', function () {
            that.resetForm();
        });
        this.$toolbar.DEL.on('click', function () {
            var dialog = that.confirmDlg(
                that.getText('del_title'),
                that.getText('del_content'), function () {
                    $.postJSON(that.url.del, this.getOptions(), function (result) {
                        if (iNet.isDefined(result.uuid)) {
                            that.success(that.getText('del_title'), that.getText('del_success'));
                            that.fireEvent('deleted', result, that);
                        } else {
                            that.error(that.getText('del_title'), that.getText('del_unsuccess'));
                        }
                        // _this.hide();
                    }, {
                        mask: that.getMask(),
                        msg: iNet.resources.ajaxLoading.deleting
                    });
                    this.hide();
                }
            );
            dialog.setOptions({fqa: that.getRecordId()});
            dialog.show();
        });
        this.$toolbar.ANSWER.on('click', function () {
            if (that.formValidate.check()) {
                var data = that.getForm();
                if (that.getMode() === MODE.VIEW) {
                    data.status = __status[1];
                    update(data, function () {
                        changeStatus(data);
                    });
                }
                if (that.getMode() === MODE.CREATE) {
                    save(data);
                }
            }
        });
        this.$toolbar.EXPORT.on('click', function () {
            var detail = that.getRecord();
            console.log("detail : ", detail);
            if(detail != null) {
                detail.type = "DenounceDetail";
                $.postJSON(that.url.exportDetail, detail, function (result) {
                    if (iNet.isDefined(result.uuid)) {
                        that.checkStatus(result.uuid);
                    }
                });
            }
        });
        var changeStatus = function (data) {
            $.postJSON(that.url.answer, data, function (result) {
                if (iNet.isDefined(result.uuid)) {
                    that.success(that.getText('answer_title'), that.getText('answer_success'));
                    that.fireEvent('answered', result, that);
                } else {
                    that.error(that.getText('answer_title'), that.getText('answer_unsuccess'));
                }
            });
        };
        var save = function (data) {
            $.postJSON(that.url.save, data, function (result) {
                if (iNet.isDefined(result.uuid)) {
                    that.success(that.getText('save_title'), that.getText('save_success'));
                    that.fireEvent('created', result, that);
                } else {
                    that.error(that.getText('save_title'), that.getText('save_unsuccess'));
                }
            });
        };
        var update = function (data, callback) {
            $.postJSON(that.url.update, data, function (result) {
                if (iNet.isDefined(result.uuid)) {
                    callback && callback(result);
                    that.fireEvent('updated', result, that);
                }
            });
        };
        this.formValidate = new iNet.ui.form.Validate({
            id: that.id,
            rules: [{
                id: this.form.question.prop('id'),
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return iNet.resources.message.field_not_empty;
                }
            }, {
                id: this.form.category.prop('id'),
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return iNet.resources.message.field_not_empty;
                }
            }]
        });
        iNet.ui.author.FQAContent.superclass.constructor.call(this);
        this.editor = new iNet.ui.common.LittleEditor({id: '#' + this.form.answer.prop('id')});
        FormUtils.showButton(this.$toolbar.DEL, this.getMode() !== MODE.CREATE);
    };
    iNet.extend(iNet.ui.author.FQAContent, iNet.ui.WidgetExt, {
        getMode: function () {
            return this.mode || MODE.VIEW;
        },
        setMode: function (mode) {
            this.mode = mode || MODE.VIEW;
        },
        setRecord: function (fqa) {
            this.cache = fqa;
        },
        getRecord: function () {
            return this.cache;
        },
        getRecordId: function () {
            return this.cache ? (this.cache.uuid || '') : '';
        },
        setGroup: function (group) {
            this.group = group;
        },
        getGroup: function () {
            return this.group || CMSConfig.GROUP_FQA;
        },
        getCategoryName: function (uuid) {
            for (var i = 0; i < this.dataCate.length; i++) {
                if (this.dataCate[i].value === uuid) {
                    return this.dataCate[i].name;
                }
            }
        },
        load: function () {
            var _this = this;
            $.getJSON(this.url.load, {uuid: this.getRecordId()}, function (result) {
                if (result.type !== 'ERROR') {
                    _this.setForm(result);
                }
            });
        },
        setForm: function (data) {
            this.form.owner.text(String.format('{0} {1} {2}', data.owner || '', this.getText('fqa_on', this.getModule()), new Date(data.created).format(iNet.fullDateFormat)));
            this.form.category.val(data.category);
            this.form.subject.val(data.subject);
            this.form.question.val(data.question);
            this.editor.setValue(data.answer || '');
        },
        getForm: function () {
            return {
                uuid: this.getRecordId(),
                subject: this.form.subject.val(),
                question: this.form.question.val(),
                category: this.form.category.val(),
                answer: this.editor.getValue(),
                group: this.getGroup()
            };
        },
        resetForm: function () {
            this.form.owner.val('');
            this.form.category.val('');
            this.form.subject.val('');
            this.form.question.val('');
            this.editor.setValue('');
            this.setRecord({});
        },
        checkStatus: function (reportId) {
            $.postJSON(this.url.check_status, {reportID: reportId}, function (v) {
                if (this.checkedCount > 30) {
                    this.showMessage('error', 'Kết xuất dữ liệu', 'Có lỗi xảy ra khi kết xuất dữ liệu');
                    return;
                }
                switch (v) {
                    case 0:
                    case 1:
                        this.showMessage('info', 'Kết xuất dữ liệu', 'Đang xử lý tải dữ liệu');
                        this.checkedCount += 1;
                        this.checkStatus.defer(2000, this, [reportId]);
                        break;
                    case 2:
                        window.location.href = this.url.download + '?reportID=' + reportId;
                        this.showMessage('success', 'Kết xuất dữ liệu', 'Kết xuất dữ liệu thành công ');
                        break;
                }
            }.createDelegate(this));
        }
    });
});