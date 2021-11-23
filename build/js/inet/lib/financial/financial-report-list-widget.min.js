// #PACKAGE: financial
// #MODULE: financial-report-list-widget
$(function () {
    iNet.ns("iNet.ui", "iNet.ui.cmsadmin");
    iNet.ui.cmsadmin.FinancialReportListWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'financial-report-list-widget';

        iNet.ui.cmsadmin.FinancialReportListWidget.superclass.constructor.call(this);
        var me = this;
        var dataSource = new iNet.ui.grid.DataSource({
            columns: [{
                property: 'order',
                label: 'STT',
                type: 'rownumber',
                align: 'center',
                width: 50
            },
                {
                    property: 'name',
                    label: 'Tên báo cáo',
                    sortable: true,
                    type: 'text',
                    validate: function (v) {
                        if (iNet.isEmpty(v))
                            return 'Không được để trống';
                    }
                },
                {
                    property: 'reportOfOrganName',
                    label: 'Tên đơn vị',
                    sortable: true,
                    type: 'text',
                    width: 190,
                    validate: function (v) {
                        if (iNet.isEmpty(v))
                            return 'Không được để trống';
                    }
                },
                {
                    property: 'reportType',
                    label: 'Loại báo cáo',
                    sortable: true,
                    type: 'text',
                    width: 110,
                    validate: function (v) {
                        if (iNet.isEmpty(v))
                            return 'Không được để trống';
                    },
                    renderer: function (v) {
                        switch (v) {
                            case "estimate":
                                return "Dự toán";
                            case "perform":
                                return "Thực hiện";
                            case "settlement":
                                return "Quyết toán";
                            case "instructions":
                                return "Hướng dẫn dự toán ngân sách";
                            case "report":
                                return "BC NSNN cho công dân";
                            case "summary":
                                return "Tổng hợp tình hình công khai ngân sách";
                            case "publicDebt":
                                return "Công bố nợ chính quyền địa phương";
                            case "inspectionResults":
                                return "Kết quả thanh tra, kiểm toán";
                            case "performResults":
                                return "Kết quả thực hiện kiến nghị của thanh tra, kiểm toán";
                        }
                    }
                },
                {
                    property: 'active',
                    label: "Công khai",
                    sortable: false,
                    type: 'switches',
                    typeCls: 'switch-6',
                    cls: 'text-center',
                    width: 80,
                    onChange: function (record, active) {
                        me.setActive(record, active);
                    }
                }
                , {
                    label: '',
                    type: 'action',
                    separate: ' ',
                    align: 'center',
                    cls: 'hidden-767',
                    buttons: [{
                        text: 'Edit',
                        icon: 'fa fa-pencil',
                        labelCls: 'label label-primary',
                        visibled: function (record) {
                            return record.active;
                        },
                        fn: function (record) {
                            me.fireEvent('open', record, me);
                        }
                    }, {
                        text: 'Delete',
                        icon: 'icon-trash',
                        labelCls: 'label label-important',
                        visibled: function (record) {
                            return !record.active;
                        },
                        fn: function (record) {
                            var dialog = me.confirmDlg(
                                'Xóa báo cáo',
                                'Bạn chắc chắn không ?', function () {
                                    this.hide();
                                    var loading = new iNet.ui.form.LoadingItem({
                                        maskBody: $('body'),
                                        msg: 'Đang xử lý...'
                                    });

                                    FinancialReportAPI.aRemove(this.getData(), function (result) {
                                        if (result.type !== CMSConfig.TYPE_ERROR) {
                                            me.success('Xóa báo cáo', 'Xóa báo cáo thành công');
                                            me.getGrid().load();
                                            loading.destroy();
                                        } else {
                                            me.error('Xóa báo cáo', 'Có lỗi xảy ra trong quá trình xóa');
                                            loading.destroy();
                                        }
                                    });
                                }
                            );
                            dialog.setTitle('<i class="fa fa-times red"></i> ' + 'Xóa báo cáo');
                            dialog.setData({
                                uuid: record.uuid
                            });
                            dialog.show();
                        }
                    }]
                }
            ]
        });

        iNet.ui.cmsadmin.XGateRecordBasicSearch = function () {
            this.id = 'financial-report-list-basic-search';
            this.url = iNet.getPUrl('cms/financial/admin/search');
            iNet.ui.cmsadmin.XGateRecordBasicSearch.superclass.constructor.call(this);
        };
        iNet.extend(iNet.ui.cmsadmin.XGateRecordBasicSearch, iNet.ui.grid.AbstractSearchForm, {
            constructor: iNet.ui.cmsadmin.XGateRecordBasicSearch,
            intComponent: function () {
                this.$txtKeyword = $('#financial-report-list-quick-search-txt-keyword');
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
            id: 'financial-report-grid',
            dataSource: dataSource,
            url: iNet.getPUrl('cms/financial/admin/search'),
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


        $('#financial-report-list-btn-create').on('click', function () {
            this.fireEvent('create', this);
        }.createDelegate(this));

        this.getGrid().on('click', function (record) {
            me.fireEvent('open', record, me);
        });


    };
    iNet.extend(iNet.ui.cmsadmin.FinancialReportListWidget, iNet.ui.WidgetExt, {
        getGrid: function () {
            return this.grid;
        },
        setActive: function (record, active) {
            var id = record.uuid;
            $.postJSON(iNet.getPUrl("cms/financial/active"), {uuid: id, active: active}, function (result) {
                var __result = result || {};
                var grid = this.grid;
                if (grid) {
                    var item = grid.getById(id);
                    item.active = active;
                    grid.update(item);
                    grid.commit();
                }
            }.createDelegate(this));
        }
    });
});