// #PACKAGE: warehouse
// #MODULE: import-history-list-widget
$(function () {
    iNet.ns("iNet.ui", "iNet.ui.cmsadmin");
    iNet.ui.cmsadmin.ImportHistoryListWidget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);// apply configuration
        this.id = this.id || 'xgate-record-widget';

        iNet.ui.cmsadmin.ImportHistoryListWidget.superclass.constructor.call(this);
        var me = this;
        var dataSource = new iNet.ui.grid.DataSource({
            columns: [{
                property: 'order',
                label: 'STT',
                type: 'rownumber',
                align: 'center',
                width: 50
            }, {
                property: 'importDate',
                label: 'Thời gian kết nhập',
                sortable: true,
                type: 'text',
                renderer: function (v) {
                    return new Date(v).format(iNet.fullDateFormat);
                }
            }, {
                property: 'totalRecord',
                label: 'Tổng số hồ sơ',
                sortable: true,
                type: 'text',
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return 'Can not null';
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
                        dialog.setData({session: record.session, grid: me.getGrid()});
                        dialog.show();
                    }

                }]
            }]
        });

        this.grid = new iNet.ui.grid.Grid({
            id: 'import-history-grid',
            dataSource: dataSource,
            url: iNet.getPUrl('cms/warehouse/importhistory/getimporthistoryservice'),
            firstLoad: true,
            idProperty: 'uuid',
            pageSize: 10,
            convertData: function (data) {
                return data.items;
            }
        });
        $('#xgate-record-btn-get-detail').on('click',function () {
            me.fireEvent('get-detail', me);
        }.createDelegate(this));

        var $fileUpload = $('#norm-tree-file-upload');
        var $formUpload = $('#norm-tree-form');

        $('#xgate-record-btn-import').on('click', function () {
            $fileUpload.trigger('click');
        }.createDelegate(this));

        $fileUpload.on('change', function() {
            var loading;
            $formUpload.ajaxSubmit({
                url: iNet.getPUrl('cms/warehouse/xgate/import'),
                beforeSubmit: function (arr, $form, options) {
                    loading = new iNet.ui.form.LoadingItem({
                        maskBody: $('body'),
                        msg: 'Đang xử lý...'
                    });
                },
                success: function (result) {
                    if(loading){
                        loading.destroy();
                    }
                    if (result.type == 'ERROR') {

                        me.showMessage('error', 'Kết nhập', 'Có lỗi xảy ra khi kết nhập dữ liệu');
                    } else {
                        me.showMessage('success', 'Kết nhập', 'Dữ liệu đã được kết nhập');
                        me.getGrid().load();
                    }
                    $fileUpload.val('');
                }
            });
        }.createDelegate(this));
    };
    iNet.extend(iNet.ui.cmsadmin.ImportHistoryListWidget, iNet.ui.WidgetExt, {
        getGrid: function () {
            return this.grid;
        },
        loadGrid: function() {
            this.getGrid().load();
        },

        createConfirmDeleteDialog: function () {
            if (!this._confirmDeleteDialog) {
                this._confirmDeleteDialog = new iNet.ui.dialog.ModalDialog({
                    id: 'list-modal-confirm-delete',
                    title: 'Xóa hồ sơ',
                    content: 'Bạn có chắc chắn không ?',
                    buttons: [{
                        text: 'OK',
                        cls: 'btn-primary',
                        icon: 'icon-ok icon-white',
                        fn: function () {
                            var __data = this.getData();
                            var __session = __data.session;
                            var __grid = __data.grid;
                            if (!iNet.isEmpty(__session)) {
                                this.hide();
                                $.postJSON(iNet.getPUrl('cms/warehouse/xgate/removeimportsessionservice'), {
                                    session: __session
                                }, function () {
                                    if (__grid) {
                                        __grid.remove(__session);
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