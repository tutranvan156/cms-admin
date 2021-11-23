/**
 * #PACKAGE: admin
 * #MODULE: plugins-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 09:39 26/07/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file PluginsList.js
 */
$(function () {
    /**
     * @class iNet.ui.admin.PluginsList
     * @extends iNet.ui.ListAbstract
     */
    iNet.ns('iNet.ui.admin.PluginsList');
    iNet.ui.admin.PluginsList = function (options) {
        var _this = this;
        iNet.apply(this, options || {});
        this.id = 'list-plugins-wg';
        this.gridID = 'list-plugins';
        this.idProperty = 'pluginDataKey';
        this.remote = false;
        this.module = 'area';
        this.pluginType = null;
        this.plugin = null;
        this.firstLoad = true;
        this.selected = null;
        this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

        this.url = {
            list: iNet.getPUrl('cms/plugindynamic/search'),
            change: iNet.getPUrl('cms/plugindynamic/change'),
            reset: iNet.getPUrl('cms/plugindynamic/reset'),
            list_area: iNet.getPUrl('cms/plugindynamic/theme')
        };

        this.$btn = {
            BACK: $('#list-btn-back'),
            UNDO: $('#list-btn-undo')
        };


        this.dataSource = new iNet.ui.grid.DataSource({
            columns: [{
                property: 'pluginDataKey',
                label: 'Tên nội dung',
                type: 'text',
                sortable: true
            }, {
                property: 'pluginDataValue',
                label: 'Nội dung hiển thị',
                type: 'text',
                original: true,
                renderer: function (v, record) {
                    return _this.getViewerByKey(v, record.pluginDataKey);
                }
            }, {
                property: 'theme',
                label: 'Giao diện đang sử dụng',
                type: 'label',
                sortable: true,
                width: 200
            }, {
                label: '',
                type: 'action',
                align: 'center',
                buttons: [{
                    text: iNet.resources.message.button.edit,
                    icon: 'icon-pencil',
                    labelCls: 'label label-info',
                    fn: function (record) {
                        _this.selected = record;
                        _this.getEditorByKey(record);
                    }
                }]
            }],
            delay: 250
        });

        this.basicSearch = function () {
            this.id = 'list-plugins-basic-search';
        };
        iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
            constructor: this.basicSearch,
            intComponent: function () {
                var search = this;
                this.$selectPlugin = $('#selected-area');
                this.inputSearch = this.getEl().find('.grid-search-input');
                this.$btnSearch = this.getEl().find('.grid-search-btn');
                this.$selectPlugin.on('change', function () {
                    search.setValSelect($(this).val());
                    search.$btnSearch.trigger('click');
                });
                $.postJSON(_this.url.list_area, {pageSize: 0, pageNumber: 0}, function (data) {
                    if (data.type !== 'ERROR') {
                        var items = data.items || [];
                        var html = '';
                        for (var i = 0; i < items.length; i++) {
                            html += '<option value="' + items[i].plugin + '">' + items[i].area + '</option>';
                        }
                        search.$selectPlugin.append(html);

                        if (!iNet.isEmpty(search.getValSelect())) {
                            search.$selectPlugin.val(search.getValSelect());
                        }
                    }
                });
            },
            setValSelect: function (cate) {
                _this.setPlugin(cate);
            },
            getValSelect: function () {
                return _this.getPlugin() || '';
            },
            getUrl: function () {
                return _this.url.list;
            },
            getData: function () {
                var __data = {
                    pageSize: CMSConfig.PAGE_SIZE,
                    pageNumber: 0,
                    keyword: this.inputSearch.val() || '',
                    pluginType: '',
                    plugin: this.getValSelect() || ""
                };

                return __data;
            }
        });

        iNet.ui.admin.PluginsList.superclass.constructor.call(this);
        this.$btn.UNDO.on('click', function () {
            _this.reset(function () {
                _this.getGrid().reload();
            });
        });
        this.$btn.BACK.on('click', function () {
            _this.hide();
            _this.fireEvent('back_plugin', _this);
        });
        this.getGrid().on('update', function (data) {
            _this.updateContent(data);
        });
    };
    iNet.extend(iNet.ui.admin.PluginsList, iNet.ui.ListAbstract, {
        setFirstLoad: function (firstLoad) {
            this.firstLoad = firstLoad;
        },
        setParent: function (parent) {
            this.parent = parent;
            this.$btn.BACK.show();
        },
        passRoles: function (parent) {
        },
        setPlugin: function (plugin) {
            window.grid = this.getGrid();

            this.plugin = plugin;
        },
        getPlugin: function () {
            return this.plugin;
        },
        setPage: function (page) {
            this.page = page;
        },
        getPage: function () {
            return this.page || '';
        },
        setArea: function (area) {
            this.area = area;
        },
        getArea: function () {
            return this.area || '';
        },
        setNamePage: function (name) {
            this.namePage = name;
        },
        getNamePage: function () {
            return this.namePage || '';
        },
        reset: function (callback) {
            $.postJSON(this.url.reset, {}, function (result) {
                if (result === 'SUCCESS') {
                    callback && callback();
                }
            });
        },
        updateContent: function (dataUpdate) {
            if (this.selected) {
                var _this = this;
                var params = {
                    area: this.selected.area,
                    plugin: this.selected.plugin,
                    pluginType: this.selected.pluginType
                };
                params['_' + this.selected.pluginDataKey] = dataUpdate.pluginDataValue;
                update(params, function () {
                    _this.selected = Object.assign(_this.selected, dataUpdate);
                    _this.update(_this.selected);
                });
            }
        },
        getViewerByKey: function (value, key) {
            if (key.startsWith(CMSConfig.EDITOR_TYPE.IMAGE)) {
                if (CMSUtils.isLink(value))
                    return '<img class="grid-thumb-img" src="' + value + '" />';
                return value;
            } else if (key.startsWith(CMSConfig.EDITOR_TYPE.TEXT_SM)
                || key.startsWith(CMSConfig.EDITOR_TYPE.TEXT_LG)) {
                return value;
            } else if (key.startsWith(CMSConfig.EDITOR_TYPE.LINK)) {
                return '<a target="_blank" href="' + value + '">' + value + '</a>';
            } else {
                return value;
            }
        },
        getEditorByKey: function (record) {
            var _this = this;
            var key = record.pluginDataKey;
            if (key.startsWith(CMSConfig.EDITOR_TYPE.IMAGE)) {
                CMSUtils.loadMedia(CMSConfig.ASSET_TYPE_IMAGE, false, function (result) {
                    var data = result || [];
                    var src = '';
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            src = CMSUtils.getMediaPath(data[i]);
                        }
                    }
                    _this.updateContent({pluginDataValue: src});
                });
            } else if (key.startsWith(CMSConfig.EDITOR_TYPE.DOCUMENT)) {
                CMSUtils.loadMedia(CMSConfig.ASSET_TYPE_DOCUMENT, false, function (result) {
                    var data = result || [];
                    var src = '';
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            src = CMSUtils.getMediaPath(data[i]);
                        }
                    }
                    _this.updateContent({pluginDataValue: src});
                });
            } else if (key.startsWith(CMSConfig.EDITOR_TYPE.FILE)) {
                CMSUtils.loadMedia(CMSConfig.ASSET_TYPE_OTHERS, false, function (result) {
                    var data = result || [];
                    var src = '';
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            src = CMSUtils.getMediaPath(data[i]);
                        }
                    }
                    _this.updateContent({pluginDataValue: src});
                });
            } else if (key.startsWith(CMSConfig.EDITOR_TYPE.TEXT_SM)
                || key.startsWith(CMSConfig.EDITOR_TYPE.LINK)) {
                this.edit(record);
            } else {
                this.edit(record);
            }
        }
    });

    function update(params, callback) {
        $.postJSON(iNet.getPUrl('cms/plugindynamic/change'), params, function (results) {
            callback && callback(results);
        });
    }
});
