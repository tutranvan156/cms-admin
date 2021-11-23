/**
 * #PACKAGE: document
 * #MODULE: agency-list
 */
/**
 * Copyright (c) 2018 CT1905
 * Created by Nguyen Ba Chi Cong <nbchicong@gmail.com>
 * Date: 02/09/2018
 * Time: 10:09 PM
 * ---------------------------------------------------
 * Project: cms-admin
 * @name: AgencyList
 * @author: nbchicong
 */

$(function () {
    /**
     * @class iNet.ui.document.AgencyList
     * @extends iNet.ui.ListAbstract
     */
    iNet.ns('iNet.ui.document.AgencyList');
    iNet.ui.document.AgencyList = function (config) {
        var _this = this;
        iNet.apply(this, config || {});
        this.id = 'agency-wg';
        this.gridID = 'agency-list';
        this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
        this.module = 'agency';
        this.remote = true;
        this.url = {
            list: iNet.getPUrl('cms/egov/agency/search')
        };
        this.toolbar = {
            CREATE: $('#list-btn-create')
        };

        this.dataSource = new iNet.ui.grid.DataSource({
            columns: [{
                property: 'name',
                label: _this.getText('name'),
                type: 'text'
            }, {
                property: 'code',
                label: _this.getText('code'),
                type: 'text',
                width: 150
            }, {
                property: 'createdDate',
                label: _this.getText('created'),
                type: 'text',
                width: 100,
                renderer: function (v) {
                    return new Date(v).format(iNet.dateFormat);
                }
            }, {
                property: 'modifiedDate',
                label: _this.getText('modified'),
                type: 'text',
                width: 120,
                renderer: function (v) {
                    return new Date(v).format(iNet.dateFormat);
                }
            }, {
                type: 'action',
                align: 'center',
                buttons: [{
                    text: iNet.resources.message.button.edit,
                    icon: 'fa fa-pencil',
                    fn: function (record) {
                        _this.edit(record);
                    }
                }, {
                    text: iNet.resources.message.button.del,
                    icon: 'fa fa-times',
                    labelCls: 'label label-important',
                    fn: function (record) {
                        var dialog = _this.confirmDlg(
                            _this.getText('del_title'),
                            _this.getText('del_confirm'), function () {
                                this.hide();
                                $.postJSON(iNet.getPUrl('cms/egov/agency/remove'), {
                                    uuid: record.uuid
                                }, function (result) {
                                    if (result.type !== CMSConfig.TYPE_ERROR) {
                                        _this.success(_this.getText('del_title'), _this.getText('del_success'));
                                        _this.getGrid().load();
                                    } else {
                                        _this.error(_this.getText('del_title'), _this.getText('del_error'));
                                    }
                                });
                            }
                        );
                        dialog.setTitle('<i class="fa fa-times red"></i> ' + _this.getText('del_title'));
                        dialog.setData({
                            enable: false,
                            uuid: record.uuid
                        });
                        dialog.show();
                    },
                    visibled: function () {
                        return _this.getSecurity().hasRoles(CMSConfig.ROLE_LEGAL_DOC);
                    }
                }]
            }]
        });

        this.basicSearch = function () {
            this.id = 'list-basic-search';
            this.url = _this.url.list;
            this.params = {
                pageSize: CMSConfig.PAGE_SIZE,
                pageNumber: 0,
                keyword: ''
            };
        };
        iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
            constructor: this.basicSearch,
            intComponent: function () {
                var search = this;
                var txtKeywordEl = this.getEl().find('.grid-search-input');
                var btnSearchEl = this.getEl().find('[data-action-search="search"]');
                txtKeywordEl.on('change', function () {
                    search.params.keyword = this.value;
                    btnSearchEl.trigger('click');
                });
            },
            getData: function () {
                return this.params;
            }
        });

        iNet.ui.document.AgencyList.superclass.constructor.call(this);
        _this.toolbar.CREATE.on('click', function () {
            _this.newRecord();
        });
        _this.getGrid().on('save', function (data) {
            var loading = new iNet.ui.form.LoadingItem({
                maskBody: $('body'),
                msg: 'Đang xử lý...'
            });
            $.postJSON(iNet.getPUrl('cms/egov/agency/save'), data, function (result) {
                if (result.type !== CMSConfig.TYPE_ERROR) {
                    _this.success('Thêm mới', 'Thêm mới thành công');
                    _this.reload();
                    loading.destroy();
                } else {
                    _this.error('Thêm mới', 'Có lỗi xảy ra trong quá trình thêm');
                    loading.destroy();
                }
                // callback && callback(result);
            });
        });
        _this.getGrid().on('update', function (newData, oldData) {
            var data = $.extend({}, oldData, newData);
            var loading = new iNet.ui.form.LoadingItem({
                maskBody: $('body'),
                msg: 'Đang xử lý...'
            });
            $.postJSON(iNet.getPUrl('cms/egov/agency/update'), data, function (result) {
                if (result.type !== CMSConfig.TYPE_ERROR) {
                    _this.success('Cập nhật', 'Cập nhật thành công');
                    _this.reload();
                    loading.destroy();
                } else {
                    _this.error('Cập nhật', 'Có lỗi xảy ra trong quá trình cập nhật');
                    loading.destroy();
                }
            });
        });
    };
    iNet.extend(iNet.ui.document.AgencyList, iNet.ui.ListAbstract);

    new iNet.ui.document.AgencyList();
});