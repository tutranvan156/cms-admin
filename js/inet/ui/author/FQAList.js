// #PACKAGE: author
// #MODULE: cms-fqa-list
// 
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 27/06/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file FQAList
 * @author nbchicong
 */

var MODE = {
    VIEW: 'VIEW',
    CREATE: 'CREATE'
};
$(function () {
        /**
         * @class iNet.ui.author.FQAList
         * @extends iNet.ui.ListAbstract
         */
        iNet.ns('iNet.ui.author.FQAList');
        iNet.ui.author.FQAList = function (config) {
            var that = this, __cog = config || {};
            var __status = this.__status || ['', 'CREATED', 'PUBLISHED'];
            iNet.apply(this, __cog);
            this.id = 'fqa-list-wg';
            this.gridID = 'grid-fqa';
            this.module = 'fqa';
            this.dataCate = dataCate || [];
            this.remote = this.remote || true;
            this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
            this.group = this.group || CMSConfig.GROUP_FQA;
            this.url = this.url || {
                list: iNet.getPUrl('faq/reviewlist'),
                del: iNet.getPUrl('faq/delete'),
                generator: iNet.getPUrl('cms/denunciation/excel/generator'),
                check_service_status: iNet.getPUrl('report/file/chkstatus'),
                download: iNet.getPUrl('report/file/download')
            };
            this.toolbar = {
                CREATE: $('#list-btn-add')
            };
            this.dataSource = this.dataSource || new iNet.ui.grid.DataSource({
                columns: [{
                    type: 'selection',
                    align: 'center',
                    width: 30
                }, {
                    property: 'question',
                    label: this.getText('question', this.getModule()),
                    type: 'label'
                }, {
                    property: 'category',
                    label: this.getText('category', this.getModule() + 123),
                    width: 150,
                    sortable: true,
                    type: 'select',
                    editData: this.dataCate,
                    valueField: 'value',
                    displayField: 'name',
                    cls: 'hidden-320'
                }, {
                    property: 'owner',
                    label: this.getText('owner', this.getModule()),
                    type: 'label',
                    align: 'center',
                    cls: 'text-center',
                    width: 150
                }, {
                    property: 'status',
                    label: this.getText('status', this.getModule()),
                    sortable: true,
                    type: 'text',
                    align: 'center',
                    cls: 'text-center',
                    width: 100,
                    renderer: function (v) {
                        return String.format('<b class="{1}">{0}</b>', that.getText(v.toLowerCase(), that.getModule()), CMSUtils.getColorByStatus(v));
                    }
                }, {
                    property: 'created',
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
                        text: iNet.resources.message.button.del,
                        icon: 'icon-trash',
                        labelCls: 'label label-important',
                        fn: function (record) {
                            var dialog = that.confirmDlg(
                                that.getText('del_title', that.getModule()),
                                that.getText('del_content', that.getModule()), function () {
                                    var _this = this;
                                    $.postJSON(that.url.del, this.getOptions(), function (result) {
                                        if (iNet.isDefined(result.uuid)) {
                                            that.removeByID(result.uuid);
                                            that.success(that.getText('del_title', that.getModule()), that.getText('del_success', that.getModule()));
                                            _this.hide();
                                        } else {
                                            that.error(that.getText('del_title', that.getModule()), that.getText('del_unsuccess', that.getModule()));
                                        }
                                    }, {
                                        mask: that.getMask(),
                                        msg: iNet.resources.ajaxLoading.deleting
                                    });
                                }
                            );
                            dialog.setOptions({fqa: record.uuid});
                            dialog.setTitle('<i class="fa fa-trash red"></i> ' + that.getText('del_title'));
                            dialog.show();
                        }
                    }]
                }]
            });
            this.basicSearch = function () {
                this.id = 'list-basic-search';
            };


            iNet.extend(this.basicSearch, iNet.ui.grid.Search, {
                constructor: this.basicSearch,
                intComponent: function () {
                    var qSearch = this;
                    this.$qSearch = $.getCmp(this.id);
                    this.$inputSearch = this.$qSearch.find('.grid-search-input');
                    this.$groupSearch = this.$qSearch.find('#cbb-fqa-category');
                    this.$btnViewAll = this.$qSearch.find('#btn-view-all-post');
                    this.$btnViewCreated = this.$qSearch.find('#btn-view-created');
                    this.$btnViewPosted = this.$qSearch.find('#btn-view-posted');
                    this.$btnSearch = this.$qSearch.find('[data-action-search="search"]:first');
                    this.$groupSearch.on('change', function () {
                        qSearch.setCate($(this).val());
                        qSearch.$btnSearch.trigger('click');
                    });
                    qSearch.setStatus(__status[0]);
                    this.$btnViewAll.on('click', function () {
                        qSearch.setActive(this);
                        qSearch.setStatus(__status[0]);
                        qSearch.$btnSearch.trigger('click');
                    });
                    this.$btnViewCreated.on('click', function () {
                        qSearch.setActive(this);
                        qSearch.setStatus(__status[1]);
                        qSearch.$btnSearch.trigger('click');
                    });
                    this.$btnViewPosted.on('click', function () {
                        qSearch.setActive(this);
                        qSearch.setStatus(__status[2]);
                        qSearch.$btnSearch.trigger('click');
                    });
                },
                setActive: function (el) {
                    var $el = $(el);
                    var $parent = $el.parent();
                    $parent.children().removeClass('active');
                    $el.addClass('active');
                },
                getUrl: function () {
                    return that.url.list;
                },
                getId: function () {
                    return this.id;
                },
                setStatus: function (type) {
                    this.type = type;
                },
                getStatus: function () {
                    return this.type;
                },
                setCate: function (cate) {
                    this.cate = cate;
                },
                getCate: function () {
                    return this.cate;
                },
                getData: function () {
                    return {
                        pageSize: CMSConfig.PAGE_SIZE,
                        pageNumber: 0,
                        keyword: this.$inputSearch.val(),
                        category: this.getCate(),
                        status: this.getStatus(),
                        group: that.group
                    };
                }
            });

            this.grid = new iNet.ui.grid.Grid({
                id: that.gridID,
                dataSource: that.dataSource,
                url: that.url.search,
                firstLoad: true,
                allowDownload: true,
                idProperty: 'uuid',
                basicSearch: this.basicSearch,
                pageSize: 10,
                remotePaging: true,
                convertData: function (data) {
                    data = data || {};
                    this.setTotal(data.total);
                    return data.items;
                }
            });

            this.getGrid().on('download', function (params, control) {

                console.log("dasdj sabd");

                var __params = that.getGrid().getParams() || {};
                __params.type = "DenounceSummary";

                $.postJSON(iNet.getPUrl('cms/denunciation/search'), __params, function (result) {
                    __params.result = JSON.stringify(result.items);
                    $.postJSON(iNet.getPUrl('cms/denunciation/excel/generator'), __params, function (result) {
                        console.log("__params : ", __params);
                        if (iNet.isDefined(result.uuid)) {
                            console.log("checkStatus");

                            that.checkStatus(result.uuid);
                        }
                    });

                });


            });

            iNet.ui.author.FQAList.superclass.constructor.call(this);
            this.toolbar.CREATE.on('click', function () {
                that.fireEvent('create', MODE.CREATE, that);
            });
            this.grid.on('click', function (record) {
                console.log("record", record);
                that.fireEvent('open', record, that);
            });
        };
        iNet.extend(iNet.ui.author.FQAList, iNet.ui.WidgetExt, {
            getGrid: function () {
                return this.grid;
            },
            checkStatus: function (reportId) {
                console.log("check_status");
                $.postJSON(iNet.getPUrl('report/file/chkstatus'), {reportID: reportId}, function (v) {
                    if (this.checkedCount > 30) {
                        this.showMessage('error', 'Kết xuất dữ liệu', 'Có lỗi xảy ra khi kết xuất dữ liệu');
                        return;
                    }
                    switch (v) {
                        case 0:
                        case 1:
                            this.showMessage('info', 'Kết xuất dữ liệu', 'Đang xử lý tải dữ liệu');
                            this.checkedCount += 1;
                            this.checkStatus.defer(2000, this, [reportId]);
                            break;
                        case 2:
                            window.location.href = iNet.getPUrl('report/file/download') + '?reportID=' + reportId;
                            this.showMessage('success', 'Kết xuất dữ liệu', 'Kết xuất dữ liệu thành công ');
                            break;
                    }
                }.createDelegate(this));
            }
        });
    }
);