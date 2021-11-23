// #PACKAGE: financial
// #MODULE: financial-report-wg
$(function () {
    iNet.ns("iNet.ui", "iNet.ui.cmsadmin");
    iNet.ui.cmsadmin.FinancialReportWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'financial-report-widget';
        iNet.ui.cmsadmin.FinancialReportWidget.superclass.constructor.call(this);

        var me = this;
        console.log('[FinancialReportWidget]', this);
        this.formId = this.formId || 'financial-report-form';
        this.attachmentsApproved = [];
        this.resourceParent = 'link';
        this.filenames = [];
        this.attachTplId = 'financial-list-file-script';
        this.form = {
            uuid: $('#financial-report-txt-id'),
            reportOfOrganId: $('#financial-report-txt-reportOfOrganId'),
            reportOfOrganName: $('#financial-report-txt-reportOfOrganName'),
            reportType: $('#financial-report-txt-reportType'),
            name: $('#financial-report-txt-name'),
            year: $('#financial-report-txt-year'),
            form: $('#financial-report-txt-form'),
            signNumber: $('#financial-report-txt-signNumber'),
            publicationDate: $('#financial-report-txt-publicationDate'),
            active: $('#financial-report-txt-active'),
            attachments: $('#financial-report-txt-attachments'),
            listUpload: $('#file-report-attachments'),
            qdDate: $('#financial-report-txt-qdDate')
        };
        this.TOOLBAR = {
            BACK: $('#financial-report-btn-back'),
            CREATE: $('#financial-report-btn-create'),
            SAVE: $('#financial-report-btn-save')
        };

        this.TOOLBAR.BACK.on('click', function () {
            this.hide();
            this.clearForm();
            this.fireEvent('back', this);
        }.createDelegate(this));

        this.TOOLBAR.CREATE.on('click', function () {
            this.clearForm();
            this.clearArrayFile();
        }.createDelegate(this));

        this.form.reportOfOrganName.select2();

        this.publicationDatepicker = this.form.publicationDate.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate', function (ev) {
            me.publicationDatepicker.hide();
        }).data('datepicker');

        this.qdDatepicker = this.form.qdDate.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate', function (ev) {
            me.qdDatepicker.hide();
        }).data('datepicker');

        this.fvalidate = new iNet.ui.form.Validate({
            id: $('#financial-report-widget').prop('id'),
            rules: [{
                id: this.form.reportType.prop('id'),
                placement: 'bottom',
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return me.getText("Không được để trống");
                }
            }, {
                id: this.form.reportOfOrganName.prop('id'),
                placement: 'bottom',
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return me.getText("Không được để trống");
                }
            }, {
                id: this.form.name.prop('id'),
                placement: 'bottom',
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return me.getText("Không được để trống");
                }
            }, {
                id: this.form.year.prop('id'),
                placement: 'bottom',
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return me.getText("Không được để trống");
                }
            }, {
                id: this.form.form.prop('id'),
                placement: 'bottom',
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return me.getText("Không được để trống");
                }
            }, {
                id: this.form.signNumber.prop('id'),
                placement: 'bottom',
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return me.getText("Không được để trống");
                }
            }, {
                id: this.form.qdDate.prop('id'),
                placement: 'bottom',
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return me.getText("Không được để trống");
                }
            }, {
                id: 'file-container',
                placement: 'bottom',
                validate: function (v) {
                    if (iNet.isEmpty(me.getUuid()) && iNet.isEmpty(me.form.attachments.val())) {
                        return me.getText("Không được để trống");
                    }
                }
            }]
        });
        this.TOOLBAR.SAVE.on('click', function () {
            this.save();
        }.createDelegate(this));

        this.form.attachments.on('change', function () {
            me.checkingFile(this.files);
            me.appendFile(me.attachmentsApproved);
        });
        this.form.listUpload.on('click', '.btn-download', function () {
            $.download(iNet.getPUrl('cms/financial/download'), {
                uuid: me.getUuid(),
                attachId: $(this).attr('data-grid')
            });
        });
        this.form.listUpload.on('click', '.btn-update', function () {
            var fileId = $(this).attr('data-fileId');

            //var index = me.attachmentsApproved.findIndex((v) => v.fileId === fileId);
            index = me.attachmentsApproved.findIndex(function (element) {
                return element['fileId'] === fileId
            });

            if (index > -1) {
                var file = me.attachmentsApproved[index];

                var fd = me.getFile(file);
                fd.append("uuid", me.getUuid());
                var loading = new iNet.ui.form.LoadingItem({
                    maskBody: $('body'),
                    msg: 'Đang xử lý...'
                });
                FinancialReportAPI.uploadFile(fd, function (result) {
                    if (result.type === 'ERROR') {
                        me.error('Đính kèm file', "Có lỗi trong khi đính kèm file");
                        loading.destroy();
                    } else {
                        me.success('Đính kèm file', 'Đính kèm thành công');
                        me.setFile(result);
                        loading.destroy();
                    }
                });
            } else me.error('Đính kèm file', "Có lỗi trong khi đính kèm file");
        });
        this.form.listUpload.on('click', '.btn-remove', function () {
            var thisEl = $(this);
            var name = thisEl.attr('data-name');
            var uuid = me.getUuid();
            var attachId = thisEl.attr('data-grid');
            var dialog = me.confirmDlg(
                me.getText('title_delete', me.resourceParent),
                me.getText('quesion_delete', me.resourceParent),
                function () {
                    dialog.hide();
                    if (dialog.getData().attachId) {
                        var loading = new iNet.ui.form.LoadingItem({
                            maskBody: $('body'),
                            msg: 'Đang xử lý...'
                        });
                        FinancialReportAPI.rmFile({uuid: uuid, attachId: attachId}, function (result) {
                            if (result.type === 'ERROR') {
                                me.error(me.getText('delete', me.resourceParent), me.getText('delete_error', me.resourceParent));
                                loading.destroy();
                            } else {
                                dialog.getOptions().fileEl.parents('.attachment').remove();
                                me.success(me.getText('delete', me.resourceParent), me.getText('delete_success', me.resourceParent));
                                me.removeFileInList(dialog.getOptions().name);
                                loading.destroy();
                            }
                        });
                    } else {
                        dialog.getOptions().fileEl.parents('.attachment').remove();
                        me.success(me.getText('delete', me.resourceParent), me.getText('delete_success', me.resourceParent));
                        me.removeFileInList(dialog.getOptions().name);
                    }
                });
            dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + me.getText('title_delete', me.resourceParent));
            dialog.setData({
                uuid: me.getUuid(),
                attachId: uuid,
            });
            dialog.setOptions({
                name: name,
                fileEl: thisEl
            });
            dialog.show();
        });
    };

    iNet.extend(iNet.ui.cmsadmin.FinancialReportWidget, iNet.ui.WidgetExt, {
        setUuid: function (x) {
            this.uuid = x;
        },
        setCode: function (x) {
            this.code = x;
        },
        getCode: function () {
            return this.code || '';
        },
        getUuid: function () {
            return this.uuid || '';
        },
        getData: function () {
            var __form = this.form;
            var fd = new FormData(document.getElementById(this.formId));
            for (var i = 0; i < this.attachmentsApproved.length; i++) {
                fd.append(iNet.generateId(), this.attachmentsApproved[i]);
            }
            var organID = this.form.reportOfOrganName.find(':selected').attr('data-code');
            var uuid = this.getUuid();

            fd.append('reportOfOrganId', organID);
            fd.append('reportOfOrganName', __form.reportOfOrganName.val());
            fd.append('reportType', __form.reportType.val());
            fd.append('name', __form.name.val());
            fd.append('year', __form.year.val());
            fd.append('form', __form.form.val());
            fd.append('signNumber', __form.signNumber.val());
            fd.set('publicationDate', __form.publicationDate.val().toDate().getTime());
            fd.append('uuid', uuid);
            fd.set('qdDate', __form.qdDate.val().toDate().getTime());


            return fd;
        },
        getFile: function (file) {
            var form = new FormData();
            form.append(this.getUuid(), file);
            return form;
        },
        clearForm: function () {
            this.form.reportOfOrganId.val('');
            this.form.reportOfOrganName.val(null).trigger('change');
            this.form.reportType.val('');
            this.form.name.val('');
            this.form.year.val('');
            this.form.form.val('');
            this.form.signNumber.val('');
            this.form.publicationDate.val('');
            this.form.qdDate.val('');
            this.form.active.val('');
            this.form.attachments.val('');
            this.uuid = null;
        },
        setReportData: function (data) {
            this.setUuid(data.uuid);
            this.form.reportType.val(data.reportType);
            this.form.reportOfOrganName.val(data.reportOfOrganName).trigger('change');
            // $('#financial-report-txt-reportOfOrganName').val("Sở Tài chính").trigger('change')

            console.log(data.reportOfOrganName);
            console.log("Sở Tài chính"==data.reportOfOrganName);

            this.form.name.val(data.name);
            this.form.year.val(data.year);
            this.form.form.val(data.form);
            this.form.signNumber.val(data.signNumber);

            if (data.qdDate == 0) {
                this.form.qdDate.val('');
            } else
                this.form.qdDate.val(new Date(data.qdDate).format(iNet.dateFormat));

            if (data.publicationDate == 0) {
                this.form.publicationDate.val('');
            } else
                this.form.publicationDate.val(new Date(data.publicationDate).format(iNet.dateFormat));

        },
        distinctArrayFile: function (files) {
            return (files || []).reduce(function (memory, e1) {
                var matches = memory.filter(function (e2) {
                    return e1.name === e2.name
                });
                if (matches.length === 0)
                    memory.push(e1);
                return memory;
            }, []);
        }
        ,
        setFile: function (data) {
            this.clearArrayFile();
            this.attachmentsApproved = data.attachments || [];
            if (!this.isTransfer()) {
                var html = '';
                for (var i = 0; i < this.attachmentsApproved.length; i++) {
                    var item = this.attachmentsApproved[i];
                    item.name = item.name || item.file;
                    item.local = !item.uuid;
                    item.isShow = "hide";
                    html += iNet.Template.parse(this.attachTplId, item);
                }
                this.form.listUpload.append(html);
            }
        }
        ,
        setTransfer: function (transfer) {
            this.transfer = transfer;
        }
        ,
        isTransfer: function () {
            return this.transfer;
        }
        ,
        save: function () {
            var me = this;
            if (!this.fvalidate.check()) {
                return;
            }
            var __data = this.getData();
            var __uuid = this.getUuid();

            if (iNet.isEmpty(__uuid)) {
                var loading = new iNet.ui.form.LoadingItem({
                    maskBody: $('body'),
                    msg: 'Đang xử lý...'
                });
                FinancialReportAPI.aSave(__data, function (result) {
                    var __result = result || {};
                    if (__result.type === CMSConfig.TYPE_ERROR) {
                        me.showMessage('error', 'Lưu', 'Đã có lỗi khi lưu');
                        loading.destroy();
                    } else {
                        me.showMessage('success', 'Lưu', 'Đã lưu thành công');
                        loading.destroy();
                    }
                    me.setReportData(result);
                    me.setFile(result);
                });

            } else {
                loading = new iNet.ui.form.LoadingItem({
                    maskBody: $('body'),
                    msg: 'Đang xử lý...'
                });
                FinancialReportAPI.aUpdateInfo(__data, function (result) {
                    var __result = result || {};
                    if (__result.type === CMSConfig.TYPE_ERROR) {
                        me.showMessage('error', 'Cập nhật', 'Đã có lỗi khi cập nhật');
                        loading.destroy();
                    } else {
                        me.showMessage('success', 'Cập nhật', 'Đã cập nhật thành công');
                        loading.destroy();
                    }
                });
            }
        }
        ,
        checkingFile: function (files) {
            for (var i = 0; i < (files || []).length; i++) {
                var file = files[i];
                if (this.filenames.indexOf(file.name) === -1) {
                    this.filenames.push(file.name);
                    this.attachmentsApproved.push(file);
                }
            }
        }
        ,
        appendFile: function (listFile) {
            this.form.listUpload.empty();
            var html = '';

            for (var i = 0; i < listFile.length; i++) {
                var file = listFile[i];
                file.name = file.name || file.file;
                file.local = !file.uuid;
                file.fileId = iNet.generateId();
                file.isShow = !iNet.isEmpty(this.getUuid()) && file.local ? '' : 'hide';
                html += iNet.Template.parse(this.attachTplId, file);
            }

            this.form.listUpload.append(html);
        }
        ,
        clearArrayFile: function () {
            this.attachmentsApproved = [];
            this.filenames = [];
            this.form.listUpload.empty();
        }
        ,
        removeFileInList: function (name) {
            this.attachmentsApproved = $.grep(this.attachmentsApproved, function (item) {
                return item.name !== name;
            });
            this.filenames = $.grep(this.filenames, function (item) {
                return item !== name;
            });
        }
        ,
        setPublisherCode: function (code) {
            this.pulisherCode = code;
        }
        ,
        getPublisherCode: function () {
            return this.pulisherCode || '';
        }
    })
    ;
});
