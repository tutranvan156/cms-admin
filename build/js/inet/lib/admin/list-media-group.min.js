/**
 * #PACKAGE: admin
 * #MODULE: list-media-group
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 16:37 12/05/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListMediaGroup.js
 */
$(function () {
    /**
     * @class iNet.ui.admin.ListMediaGroup
     * @extends iNet.Component
     */
    iNet.ns('iNet.ui.admin.ListMediaGroup');
    iNet.ui.admin.ListMediaGroup = function (options) {
        var _this = this;
        iNet.apply(this, options || {});
        this.id = this.id || 'wg-list-group-media';
        this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
        this.module = 'layout';
        this.gridID = 'list-group-media';
        this.firstLoad = false;
        this.remote = false;
        console.log(this);
        this.url = {
            list_group_public: iNet.getPUrl('cms/asset/pubcategory')
        };
        this.$toolbar = {
            BACK: $('#list-media-group-btn-back'),
            SAVE: $('#list-media-group-btn-save')
        };
        this.$form = {
            content: $('#list-card-media-group'),
            tbody: $('#tbody-category')
        };
        this.$type = {
            IMAGE: PluginKey.imgCMS,
            VIDEO: PluginKey.videoCMS,
            DOCUMENT: PluginKey.fileCMS
        };

        this.initGrid = function () {
            _this.dataSource = new iNet.ui.grid.DataSource({
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        width: 30
                    }, {
                        property: 'name',
                        label: 'Tên thư mục',
                        type: 'text',
                        sortable: true
                    }, {
                        label: '',
                        type: 'action',
                        width: 60,
                        align: 'center',
                        buttons: [{
                            text: 'Xem',
                            icon: 'fa fa-eye',
                            labelCls: 'label label-primary',
                            fn: function (record) {
                                _this.fireEvent('view_content', _this, _this.getType(), record.name);
                            }
                        }]
                    }
                ],
                delay: 250
            });
            _this.$grid = $(String.format('#{0}', this.gridID));
            var convertData = function (data) {
                return data.items || [];
            };
            _this.convertData = _this.convertData || convertData;


            iNet.ui.admin.BasicSearch = function () {
                this.url = _this.url.list_group_public;
                this.id = 'list-basic-group-search';
                iNet.ui.admin.BasicSearch.superclass.constructor.call(this);
            };
            iNet.extend(iNet.ui.admin.BasicSearch, iNet.ui.grid.AbstractSearchForm, {
                intComponent: function () {
                    this.inputSearch = this.getEl().find('.grid-search-input');
                    this.btnSearch = this.getEl().find('.grid-search-btn');
                },
                getId: function () {
                    return this.id;
                },
                getUrl: function () {
                    return _this.url.list;
                },
                getData: function () {
                    return _this.getParams();
                }
            });

            _this.grid = new iNet.ui.grid.Grid({
                id: _this.$grid.prop('id'),
                url: _this.url.list_group_public,
                dataSource: _this.dataSource,
                basicSearch: iNet.ui.admin.BasicSearch,
                convertData: _this.convertData,
                stretchHeight: false,
                params: _this.getParams(),
                pageSize: 9999,
                remotePaging: false,
                firstLoad: false,
                editable: false,
                idProperty: 'uuid'
            });
            _this.grid.on('selectionchange', function (sm, data) {
                var __records = sm.getSelection();
                var __count = __records.length;
                if (__count >= 1) {
                    _this.$toolbar.SAVE.prop('disabled', false);
                } else {
                    _this.$toolbar.SAVE.prop('disabled', true);
                }

                _this.setDataGrid(__records);

            });
            _this.grid.on('loaded', function () {
                var id = _this.getDataSelect().join(';');
                console.log('[id]', id);
                this.selectById(id);
            });
        };
        iNet.ui.admin.ListMediaGroup.superclass.constructor.call(this);

        this.$toolbar.BACK.click(function () {
            _this.hide();
            _this.fireEvent('back');
        });

        this.$toolbar.SAVE.click(function () {
            _this.setDataSelect(_this.getDataGrid());
            _this.fireEvent('update', _this.getDataSelect(), _this.$type[_this.getType()]);
        });

    };
    iNet.extend(iNet.ui.admin.ListMediaGroup, iNet.ui.ViewWidget, {
        setDataGrid: function (select) {
            this.gridSelect = select;
        },
        getDataGrid: function () {
            return this.gridSelect || [];
        },
        setCategory: function (category) {
            this.category = category;
        },
        getCategory: function () {
            return this.category || '';
        },
        setType: function (type) {
            this.type = type;
        },
        getType: function () {
            return this.type || '';
        },
        setDataSelect: function (data) {
            this.selectData = data;
        },
        getDataSelect: function () {
            return this.selectData || [];
        },
        getParams: function () {
            return {
                type: this.getType(),
                pageSize: 9999,
                pageNumber: 0,
                moreInfo: true
            }
        },
        renderGroupMedia: function () {
            this.initGrid();
            console.log('[grid]', this.grid);
            this.grid.load();
        }
    });
});
