/**
 * Copyright (c) 2019 by Tien Ha (tienht@inetcloud.vn)
 *
 * Created by dev on 10:51 20/12/2019
 *
 */
// #PACKAGE: review
// #MODULE:denounce-criminals-list
$(function () {
    iNet.ns('iNet.ui.review.DenounceCriminalsList');
    iNet.ui.review.DenounceCriminalsList = function (options) {
        var _this = this;
        iNet.apply(this, options || {});
        this.__status = ['waiting', 'received', 'rejected'];
        this.module = 'fqa';
        this.group = CMSConfig.GROUP_DENOUONCECRIMINALS;
        this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
        this.remote = true;
        this.url = {
            list: iNet.getPUrl('cms/denunciation/search'),
            del: iNet.getPUrl('cms/denunciation/remove'),
            updatestatus: iNet.getPUrl('cms/denunciation/updatestatus')
        };

        this.dataSource = new iNet.ui.grid.DataSource({
            columns: [{
                type: 'selection',
                align: 'center',
                width: 30
            }, {
                property: 'accusedPerson',
                label: this.getText('Đối tượng bị tố giác'),
                type: 'label',
                width: 150
            }, {
                property: 'fullName',
                label: this.getText('Người tố giác'),
                type: 'label',
                align: 'center',
                cls: 'text-center',
                width: 150
            },  {
                property: 'createdDate',
                label: this.getText('date', this.getModule()),
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
                    text: 'Tiếp nhận',
                    cls: 'btn-primary',
                    icon: 'icon-ok icon-white',
                    fn: function (record) {
                        var dialog = _this.confirmDlg(
                            _this.getText('Cập nhật trạng thái', _this.getModule()),
                            _this.getText('Bạn có muốn thay đổi trạng thái không?', _this.getModule()), function () {
                                var that = this;
                                $.postJSON(_this.url.updatestatus,this.getOptions(), function (result) {
                                    if (result) {
                                        _this.success(_this.getText('Cập nhật trạng thái', _this.getModule()), _this.getText('Cập nhật thành công', _this.getModule()));
                                        that.hide();
                                        _this.reload();
                                    } else {
                                        _this.error(_this.getText('Cập nhật trạng thái', _this.getModule()), _this.getText('Quá trình cập nhật xảy ra lỗi', _this.getModule()));
                                    }
                                }, {
                                    mask : _this.getMask(),
                                    msg : iNet.resources.ajaxLoading.processing
                                });
                            }
                        );
                        dialog.setOptions({uuid : record.uuid , status : _this.__status[1], note : record.note});
                        dialog.setTitle('<i class="fa fa-plus red"></i> ' + _this.getText('Cập nhật trạng thái'));
                        dialog.show();
                    }
                },{
                    text: 'Từ chối',
                    cls: 'btn-primary',
                    icon: 'icon-remove',
                    fn: function (record) {
                        var dialog = _this.confirmDlg(
                            _this.getText('Cập nhật trạng thái', _this.getModule()),
                            _this.getText('Bạn có muốn thay đổi trạng thái không?', _this.getModule()), function () {
                                var that = this;
                                $.postJSON(_this.url.updatestatus,this.getOptions(), function (result) {
                                    if (result) {
                                        _this.success(_this.getText('Cập nhật trạng thái', _this.getModule()), _this.getText('Cập nhật thành công', _this.getModule()));
                                        that.hide();
                                        _this.reload();
                                    } else {
                                        _this.error(_this.getText('Cập nhật trạng thái', _this.getModule()), _this.getText('Quá trình cập nhật xảy ra lỗi', _this.getModule()));
                                    }
                                }, {
                                    mask : _this.getMask(),
                                    msg : iNet.resources.ajaxLoading.processing
                                });
                            }
                        );
                        dialog.setOptions({uuid: record.uuid,status : _this.__status[2], note : record.note});
                        dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + _this.getText('Từ chối tiếp nhận'));
                        dialog.show();
                    }
                },{
                    text: iNet.resources.message.button.del,
                    icon: 'icon-trash',
                    labelCls: 'label label-important',
                    // visibled: function (record) {
                    //     return record.status === _this.__status[1] && _this.getSecurity().hasRoles([CMSConfig.ROLE_ADMIN, CMSConfig.ROLE_FQA_REVIEWER]);
                    // },
                    fn: function(record) {
                        var dialog = _this.confirmDlg(
                            _this.getText('Xóa đơn tố giác', _this.getModule()),
                            _this.getText('Bạn có đồng ý xóa đơn tố giác này không', _this.getModule()), function () {
                                var that=this;
                                $.postJSON(_this.url.del, this.getOptions(), function (result) {
                                    if (iNet.isDefined(result)) {
                                        //_this.removeByID(result);
                                        _this.success(_this.getText('Xóa đơn tố giác', _this.getModule()), _this.getText('Xóa đơn thành công', _this.getModule()));
                                        that.hide();
                                        _this.reload();
                                    } else {
                                        _this.error(_this.getText('Xóa đơn tố giác', _this.getModule()), _this.getText('Xóa đơn không thành công', _this.getModule()));
                                    }
                                }, {
                                    mask : _this.getMask(),
                                    msg : iNet.resources.ajaxLoading.deleting
                                });
                            }
                        );
                        dialog.setOptions({uuid: record.uuid});
                        dialog.setTitle('<i class="fa fa-trash red"></i> ' + _this.getText('Xóa đơn tố giác'));
                        dialog.show();
                    }
                }]
            }]
        });

        iNet.ui.review.DenounceCriminalsList.superclass.constructor.call(this);
    };

    iNet.extend(iNet.ui.review.DenounceCriminalsList, iNet.ui.author.FQAList);
});