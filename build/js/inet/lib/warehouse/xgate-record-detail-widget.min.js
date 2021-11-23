// #PACKAGE: warehouse
// #MODULE: xgate-record-detail-widget
$(function () {
    iNet.ns("iNet.ui", "iNet.ui.cmsadmin");
    iNet.ui.cmsadmin.XGateRecordDetailWidget = function (config) {
        var __config = config || {};
        var me = this;
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'xgate-record-detail-wg';

        iNet.ui.cmsadmin.XGateRecordDetailWidget.superclass.constructor.call(this);
        this.url = {
            search: iNet.getPUrl('cms/warehouse/xgate/search'),
        };
        this.$toolbar = {
            BACK: $('#xgate-record-detail-btn-back')
        };

        this.$toolbar.BACK.on('click', function () {
            me.fireEvent('back', me);
        });
        var dataSource = new iNet.ui.grid.DataSource({
            columns: [{
                property: 'order',
                label: 'STT',
                type: 'rownumber',
                align: 'center',
                width: 50
            }, {
                property: 'industry',
                label: 'Mã lĩnh vực',
                sortable: true,
                type: 'text',
                width: 100,
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return 'Can not null';
                }
            }, {
                property: 'receiptNo',
                label: 'Mã hồ sơ',
                sortable: true,
                type: 'text',
                width: 200,
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return 'Can not null';
                }
            }, {
                property: 'applicant',
                label: 'Tổ chức, cá nhân và địa chỉ',
                sortable: true,
                type: 'text',
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return 'Can not null';
                }
            },{
                property: 'procedure',
                label: 'Loại thủ tục',
                sortable: true,
                type: 'text',
                width: 150,
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return 'Can not null';
                }
            },{
                property: 'importDate',
                label: 'Ngày kết nhập',
                sortable: true,
                type: 'text',
                align: 'center',
                width: 130,
                renderer: function (value) {
                    if (value > 0) {
                        return new Date(value).format('d/m/Y')
                    }
                }
            }, {
                label: '',
                type: 'action',
                separate: '&nbsp;',
                align: 'center',
                cls: 'hidden-767',
                buttons: [{
                    text: 'Delete',
                    icon: 'icon-trash',
                    labelCls: 'label label-important',
                    fn: function (record) {
                        var dialog = me.createConfirmDeleteDialog();
                        dialog.setData({rowId: record.uuid, grid: me.getGrid()});
                        dialog.show();
                    }

                }]
            }]
        });

        iNet.ui.cmsadmin.XGateRecordBasicSearch = function () {
            this.id = 'list-basic-search-wg';
            this.url = iNet.getPUrl('cms/warehouse/xgate/search');
            iNet.ui.cmsadmin.XGateRecordBasicSearch.superclass.constructor.call(this);
        };
        iNet.extend(iNet.ui.cmsadmin.XGateRecordBasicSearch, iNet.ui.grid.AbstractSearchForm, {
            constructor: iNet.ui.cmsadmin.XGateRecordBasicSearch,
            intComponent: function () {
                this.$txtKeyword = $('#list-quick-search-txt-keyword');
            },
            getData: function () {
                return {
                    pageSize: 10,
                    pageNumber: 0,
                    keywords:  this.$txtKeyword.val()
                };
            }
        });

        this.grid = new iNet.ui.grid.Grid({
            id: 'xgate-record-detail-grid',
            dataSource: dataSource,
            url: iNet.getPUrl('cms/warehouse/xgate/search'),
            firstLoad: true,
            idProperty: 'uuid',
            basicSearch: iNet.ui.cmsadmin.XGateRecordBasicSearch,
            remotePaging: true,
            pageSize: 10,
            convertData: function (data) {
                data = data || {};
                this.setTotal(data.total);
                return data.items;
            }
        });
    };
    iNet.extend(iNet.ui.cmsadmin.XGateRecordDetailWidget, iNet.ui.WidgetExt, {
        getGrid: function () {
            return this.grid;
        },
        loadGrid: function() {
            this.getGrid().load();
        },
        createConfirmDeleteDialog: function () {
            if (!this._confirmDeleteDialog) {
                this._confirmDeleteDialog = new iNet.ui.dialog.ModalDialog({

                    id: 'detail-modal-confirm-delete',
                    title: 'Xóa hồ sơ ?',
                    content: 'Bạn có chắc chắn không ?',
                    buttons: [{
                        text: 'OK',
                        cls: 'btn-primary',
                        icon: 'icon-ok icon-white',
                        fn: function () {
                            var __data = this.getData();
                            var __uuid = __data.rowId;
                            var __grid = __data.grid;
                            if (!iNet.isEmpty(__uuid)) {
                                this.hide();
                                $.postJSON(iNet.getPUrl('cms/warehouse/xgate/removerecord'), {
                                    uuid: __uuid
                                }, function () {
                                    if (__grid) {
                                        __grid.remove(__uuid);
                                        __grid.load();
                                    }
                                }, {mask: this.getMask(), msg: 'Đang xóa ...'});
                            }
                        }
                    }, {
                        text: iNet.resources.message.button.cancel,
                        icon: 'icon-remove',
                        fn: function () {
                            this.hide();
                        }
                    }]
                });
            }
            return this._confirmDeleteDialog;
        }

    });

});