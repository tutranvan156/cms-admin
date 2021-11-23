/**
 * #PACKAGE: admin
 * #MODULE: list-area-wg
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:13 21/04/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ListAreaWg.js
 */
window.options = {
    selectMenu: true
};
$(function () {
    /**
     * @class iNet.ui.admin.ListAreaWg
     * @extends iNet.Component
     */
    iNet.ns('iNet.ui.admin.ListAreaWg');
    iNet.ui.admin.ListAreaWg = function (options) {
        var _this = this;
        iNet.apply(this, options || {});
        this.id = this.id || 'wg-list-area';
        this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
        this.module = 'layout';
        this.dataAreas = [];
        this.url = {
            areas_all: iNet.getPUrl('cmsfirm/theme/areas'),
            page: iNet.getPUrl('cms/theme/page/list'),
            area_by_page: iNet.getPUrl('cms/theme/page/load'),
            area_custom: iNet.getPUrl('cmsfirm/custom/areas'),
            area_dynamic: iNet.getPUrl('cms/areadynamic/search'),
            active_area: iNet.getPUrl('cms/areadynamic/change'),
            area_refresh: iNet.getPUrl('cms/areadynamic/refresh')
        };

        this.$layout = {
            list_layout: $('#list-card-area'),
            list_page: $('#list-page'),
            name_page: $('.name-page'),
            search_area: $('#search-area'),
            designWeb: $('#design-webview'),
            designArea: $('#design-areaview'),
            iframe_design: $('#iframe-design')
        };

        this.listPage(function (data) {
            if (data.type !== "ERROR") {
                var html = '';
                var items = data.items || [];
                for (var i = 0; i < items.length; i++) {
                    html += '<a data-uuid="' + items[i].uuid + '" data-page="' + items[i].page + '" href="javascript:;" class="item-page list-group-item">' +
                        '<i class="fa fa-trello"></i> ' + items[i].page + '' +
                        '</a>';
                }
                _this.$layout.list_page.append(html);
                _this.listAreaCustom(function (data) {
                    if (data.type !== "ERROR") {
                        _this.setAreaCustom(data || {});
                        var optionFirst = _this.$layout.list_page.find('a:first');
                        optionFirst.addClass('active');
                        _this.setPageSelect(optionFirst.attr('data-uuid'));
                        _this.convertDataCustom(optionFirst.attr('data-page'), optionFirst.attr('data-uuid'));
                        _this.setNamePage(optionFirst.attr('data-page'));
                        _this.$layout.list_page.on('click', '.item-page', function () {
                            _this.$layout.list_page.find('.item-page.active').removeClass('active');
                            $(this).addClass('active');
                            var __page = $(this).attr('data-page');
                            _this.fireEvent('change_area_page', __page, $(this).attr('data-uuid'));
                        });
                    }
                });
            }
        });

        this.on('change_area_page', function (pageName, pageId) {
            _this.setPageSelect(pageId);
            _this.setNamePage(pageName);
            // _this.$layout.name_page.text(_this.getNamePage());
            _this.convertDataCustom(pageName, pageId);

        });

        iNet.ui.admin.ListAreaWg.superclass.constructor.call(this);
        this.$layout.list_layout.on('click', '.btn-load-plugin', function () {
            _this.fireEvent('list_plugin', _this, $(this).attr('data-area'),$(this).attr('data-plugin'), _this.getPageSelect(), _this.getNamePage(), _this.areas);
        });

        this.$layout.search_area.on('keyup', function () {
            //var $input = this;
            var value = $(this).val().toLowerCase();
            _this.$layout.list_layout.find('tr .item-name-area').filter(function () {
                $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        });

        // this.$btn.LOAD.click(function () {
        //     $.postJSON(_this.url.area_refresh, {}, function (data) {
        //         _this.convertDataCustom(_this.getNamePage(), _this.getPageSelect());
        //     }, {
        //         mask: _this.getMask(),
        //         msg: iNet.resources.ajaxLoading.loading
        //     });
        // });
        // _this.$btn.WEBMODE.on('change', function () {
        //     viewDesign($(this).attr("page") || "");
        // });
        this.loadAllAreasContent();

        this.$layout.list_layout.on('click', '[name="action-area"]', function () {
            var params = {
                uuid: $(this).attr('uuid'),
                area: $(this).val(),
                page: _this.getNamePage()
            };
            var $el = $(this);
            if ($(this).is(':checked')) {
                //todo input checked true
                params['active'] = true;
                _this.activeArea(params, function (data) {
                    if (data.type !== CMSConfig.TYPE_ERROR) {
                        $el.parents('tr:first').find('button').removeClass('none-event');
                    }
                });
            } else {
                params['active'] = false;
                //todo input checked false
                _this.activeArea(params, function (data) {
                    if (data.type !== CMSConfig.TYPE_ERROR) {
                        $el.parents('tr:first').find('button').addClass('none-event');
                    }
                });
            }
        });
    };
    iNet.extend(iNet.ui.admin.ListAreaWg, iNet.ui.ViewWidget, {
         getPluginName:function(areaName, pageId){
            var _this = this;
            var __area;
            var _pluginName = "";
            for (var j = 0; j < _this.dataAreas.length; j++) {
                __area = this.dataAreas[j];
                if(__area.pageID === pageId && __area['areaName'] === areaName) {
                    return __area.pluginName;
                }
                if(!_pluginName && __area.pageID === "" && __area['areaName'] === areaName) {
                    _pluginName = __area.pluginName;
                }
            }
            return _pluginName;
        },
        convertDataCustom: function (pageName, pageId) {
            var _this = this;
            _this.loadAreaByPAge({
                page: pageName
            }, function (data) {
                if (data.type !== "ERROR") {
                    var areas = data.areas || [];
                    _this.listDynamicArea({
                        page: _this.getNamePage()
                    }, function (dataDynamic) {
                        if (dataDynamic.type !== CMSConfig.TYPE_ERROR) {
                            var items = dataDynamic.items || [];
                            var customItems = [];
                            if (areas.length !== 0) {
                                for (var i = 0; i < areas.length; i++) {
                                    var index = items.findIndex(function (ele) {
                                        return ele.area === areas[i];
                                    });
                                    var obj = {
                                        name: areas[i],
                                        pluginName: _this.getPluginName(areas[i], pageId)
                                    };
                                    if (index !== -1) {

                                        obj['active'] = items[index].active ? 'checked="checked"' : '';
                                        obj['uuid'] = items[index].uuid;
                                        obj['none'] = items[index].active ? '' : 'none-event'
                                    } else {
                                        obj['active'] = 'checked="checked"';
                                        obj['uuid'] = '';
                                        obj['none'] = '';
                                    }
                                    customItems.push(obj);
                                }
                            } else {
                                for (var i = 0; i < items.length; i++) {
                                    var obj = {
                                        name: items[i].area,
                                        active: items[i].active ? 'checked="checked"' : '',
                                        uuid: items[i].uuid,
                                        none: items[i].active ? '' : 'none-event',
                                        pluginName: _this.getPluginName(items[i].area, pageId)
                                    };
                                    customItems.push(obj);
                                }
                            }
                            _this.renderArea(customItems);
                        }
                    });

                }
            });
        },

        loadAllAreasContent:function(){
            var _this = this;
            $.getJSON(this.url.areas_all, {}, function (data) {
                var areas = data.elements || [];
                for(var i = 0 ;i < areas.length; i++) {
                    var _area = areas[i];
                    _this.dataAreas.push(_area);
                }
            });
        },

        updateItem: function(params){
            var __params = params || {};
            if(iNet.isEmpty(__params.area) || iNet.isEmpty(__params.pluginName)) {
                return;
            }
            var $row = this.$layout.list_layout.find(String.format('tr[data-area="{0}"]', __params.area));
            if($row.length>0) {
                $row.find('td:eq(1)').text(__params.pluginName);
                $row.find('button[data-plugin]').attr('data-plugin', __params.pluginName);
            }
        },

        setAreaCustom: function (areas) {
            var map = {};
            if(areas){
                for(var i = 0 ;i < areas.elements.length; i++) {
                    var _area = areas.elements[i];
                    map[_area['areaName']] = _area['pluginName']
                }
            }
            this.areaCustom = map || {};
        },
        getAreaCustom: function () {
            return this.areaCustom || {};
        },
        setPageSelect: function (page) {
            this.page = page;
        },
        getPageSelect: function () {
            return this.page;
        },
        setNamePage: function (name) {
            this.namePage = name;
        },
        getNamePage: function () {
            return this.namePage || '';
        },
        renderArea: function (areas) {
            var html = '';
            this.areas = [];
            for (var key in this.getAreaCustom()) {
                for (var i = 0; i < areas.length; i++) {
                    this.areas.push(areas[i].name);
                    if (key === areas[i].name) {
                        areas[i]['index'] = i + 1;
                        html += iNet.Template.parse('tpl-area', areas[i]);
                        break;
                        areas.splice(i, 1);
                    }
                }
            }
            this.$layout.list_layout.html(html);
        },
        listAreaCustom: function (callback) {
            $.getJSON(this.url.area_custom, {}, function (data) {
                callback && callback(data);
            }, {
                mask: this.getMask(),
                msg: iNet.resources.ajaxLoading.saving
            });
        },
        listPage: function (callback) {
            $.getJSON(this.url.page, {}, function (data) {
                callback && callback(data);
            }, {
                mask: this.getMask(),
                msg: iNet.resources.ajaxLoading.saving
            });
        },
        loadAreaByPAge: function (params, callback) {
            $.getJSON(this.url.area_by_page, params, function (data) {
                callback && callback(data);
            }, {
                mask: this.getMask(),
                msg: iNet.resources.ajaxLoading.saving
            });
        },
        listDynamicArea: function (params, callback) {
            $.getJSON(this.url.area_dynamic, params, function (data) {
                callback && callback(data);
            });
        },
        activeArea: function (params, callback) {
            $.postJSON(this.url.active_area, params, function (data) {
                callback && callback(data);
            }, {
                mask: this.getMask(),
                msg: iNet.resources.ajaxLoading.saving
            });
        }
    });
});
