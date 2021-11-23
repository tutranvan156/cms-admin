// #PACKAGE: financial
// #MODULE: financial-organ-list-widget
$(function () {
    iNet.ns("iNet.ui", "iNet.ui.cmsadmin");
    iNet.ui.cmsadmin.FinancialOrganListWidget = function (config) {
        var me = this;
        iNet.apply(this, config || {});
        this.id = 'financial-organ-list-widget';
        this.gridID = 'financial-organ-grid';
        this.url = {
            list: iNet.getPUrl('cms/financial/admin/organ/search')
        };
        this.toolbar = {
            CREATE: $('#financial-organ-list-btn-add')
        };
        iNet.ui.cmsadmin.FinancialOrganListWidget.superclass.constructor.call(this);

        var dataSource = new iNet.ui.grid.DataSource({
            columns: [{
                property: 'order',
                label: 'STT',
                type: 'rownumber',
                align: 'center',
                width: 50
            }, {
                property: 'organName',
                label: 'Tên đơn vị',
                type: 'text',
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return 'Không được để trống';
                }
            },
                {
                    property: 'organId',
                    label: 'Mã đơn vị',
                    type: 'text',
                    width: 150,
                    validate: function (v) {
                        if (iNet.isEmpty(v))
                            return 'Không được để trống';
                    }

                }, {
                    property: 'orderView',
                    label: 'Thử tự hiển thị',
                    type: 'text',
                    width: 120,
                    validate: function (v) {
                        if (iNet.isEmpty(v))
                            return 'Không được để trống';
                    }
                }, {
                    type: 'action',
                    align: 'center',
                    buttons: [{
                        text: iNet.resources.message.button.edit,
                        icon: 'fa fa-pencil',
                        fn: function (record) {
                            me.edit(record);
                        }
                    }, {
                        text: iNet.resources.message.button.del,
                        icon: 'fa fa-times',
                        labelCls: 'label label-important',
                        fn: function (record) {
                            var dialog = me.confirmDlg(
                                'Xóa đơn vị',
                                'Bạn chắc chắn không ?', function () {
                                    this.hide();
                                    var loading = new iNet.ui.form.LoadingItem({
                                        maskBody: $('body'),
                                        msg: 'Đang xử lý...'
                                    });
                                    FinancialReportAPI.rmOrgan(this.getData(), function (result) {
                                        if (result.type !== CMSConfig.TYPE_ERROR) {
                                            me.success('Xóa đơn vị', 'Xóa đơn vị thành công');
                                            me.getGrid().load();
                                        } else {
                                            me.error('Xóa đơn vị', 'Có lỗi xảy ra trong quá trình xóa');
                                        }
                                        loading.destroy();
                                    });
                                }
                            );
                            dialog.setTitle('<i class="fa fa-times red"></i> ' + 'Xóa đơn vị');
                            dialog.setData({
                                uuid: record.uuid
                            });
                            dialog.show();
                        }
                    }]
                }]
        });

        iNet.ui.cmsadmin.XGateRecordBasicSearch = function () {
            this.id = 'financial-organ-list-basic-search';
            this.url = iNet.getPUrl('cms/financial/admin/organ/search');
            iNet.ui.cmsadmin.XGateRecordBasicSearch.superclass.constructor.call(this);
        };
        iNet.extend(iNet.ui.cmsadmin.XGateRecordBasicSearch, iNet.ui.grid.AbstractSearchForm, {
            constructor: iNet.ui.cmsadmin.XGateRecordBasicSearch,
            intComponent: function () {
                this.$txtKeyword = $('#financial-organ-list-quick-search-txt-keyword');
            },
            getData: function () {
                return {
                    pageSize: 10,
                    pageNumber: 0,
                    keywords: this.$txtKeyword.val()
                };
            }
        });
        this.grid = new iNet.ui.grid.Grid({
            id: this.gridID,
            dataSource: dataSource,
            url: this.url.list,
            firstLoad: true,
            idProperty: 'uuid',
            basicSearch: iNet.ui.cmsadmin.XGateRecordBasicSearch,
            pageSize: 10,
            remotePaging: true,
            convertData: function (data) {
                data = data || {};
                this.setTotal(data.total);
                return data.items;
            }
        });

        me.toolbar.CREATE.on('click', function () {
            me.newRecord();
        });
        me.getGrid().on('save', function (data) {
            var loading = new iNet.ui.form.LoadingItem({
                maskBody: $('body'),
                msg: 'Đang xử lý...'
            });
            FinancialReportAPI.saveOrUpdateOrgan(data, function (result) {
                if (result.type !== CMSConfig.TYPE_ERROR) {
                    me.success('Thêm đơn vị', 'Thêm đơn vị thành công');
                    me.reload();
                } else {
                    me.error('Thêm đơn vị', 'Có lỗi xảy ra trong quá trình thêm');
                }
                loading.destroy();
            });
        });
        me.getGrid().on('update', function (newData, oldData) {
            console.log("update");
            var data = $.extend({}, oldData, newData);
            var loading = new iNet.ui.form.LoadingItem({
                maskBody: $('body'),
                msg: 'Đang xử lý...'
            });
            FinancialReportAPI.saveOrUpdateOrgan(data, function (result) {
                if (result.type !== CMSConfig.TYPE_ERROR) {
                    me.success('Cập nhật đơn vị', 'Cập nhật đơn vị thành công');
                    me.reload();
                } else {
                    me.error('Cập nhật đơn vị', 'Cập nhật đơn vị xảy ra lỗi');
                }
                loading.destroy();
            });
        });
    };

    iNet.extend(iNet.ui.cmsadmin.FinancialOrganListWidget, iNet.ui.ListAbstract);

});