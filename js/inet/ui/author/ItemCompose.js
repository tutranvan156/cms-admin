// #PACKAGE: author
// #MODULE: cms-item-compose
/**
 * Copyright (c) 2015 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 17/01/2015.
 * -------------------------------------------
 * @project cms-admin
 * @file ItemCompose
 * @author nbchicong
 */

$(function () {
    /**
     * @class iNet.ui.author.ItemCompose
     * @extends iNet.ui.WidgetExt
     */
    iNet.ns('iNet.ui.author.ItemCompose');
    iNet.ui.author.ItemCompose = function (config) {
        var that = this, __cog = config || {};
        iNet.apply(this, __cog);
        this.id = this.id || 'wg-compose-post';
        this.module = 'post';
        this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
        this.type = this.type || 'WRITER';
        this.dataCate = dataCate || [];
        // this.cache = {};
        this.cateBox = new iNet.ui.author.CategoryBoxExt();
        this.avatarBox = new iNet.ui.author.AvatarBoxExt();
        this.templates = [];
        this.wfFirstNode = {};
        this.wfNodes = null;
        this.isSaved = false;
        this.isSend = true;
        this.isPublish = false;
        this.$toolbar = {
            BACK: $('#toolbar-btn-back'),
            CREATE: $('#toolbar-btn-create'),
            REMOVED: $('#toolbar-btn-removed'),
            SAVE: $('#toolbar-btn-save'),
            SAVE_AND_SEND: $('#toolbar-btn-save-and-send'),
            SAVE_AND_PUBLISH: $('#toolbar-btn-save-and-publish'),
            REJECTED: $('#toolbar-btn-rejected'),
            SEND: $('#toolbar-btn-send'),
            SEND_LIST: $('#toolbar-btn-send-menu-list'),
            PUBLISH: $('#toolbar-btn-publish'),
            REMOVED_REJECT: $('#toolbar-btn-removed-reject'),
            SHARE: $('#toolbar-btn-share'),
            SHARE_LIST: $('#toolbar-btn-share-menu-list'),
        };
        this.$form = {
            subject: $('#post-txt-subject'),
            brief: $('#post-txt-brief'),
            group: $('#post-txt-group'),
            image: $('#post-txt-image'),
            content: $('#post-txt-content'),
            btnView: $('[data-action="view"]'),
            template: $('#list-template-select'),
            tags: $('#list-tags'),
            language: $('#language')
        };
        this.url = {
            load: iNet.getPUrl('workflow/cms/load'),
            reject: iNet.getPUrl('cms/item/reviewreject'),
            remove: iNet.getPUrl('cms/item/retrieve'),
            save: iNet.getPUrl('cms/item/modify'),
            template: iNet.getPUrl('cms/template/type'),
            reference_add: iNet.getPUrl('cms/item/addref'),
            path: iNet.getPUrl('cms/item/queuepath'),
            send: iNet.getPUrl('cms/item/queueadd'),

            loadShareConfig: iNet.getPUrl('social/configs/list'),
        };

        this.formValidate = new iNet.ui.form.Validate({
            id: that.id,
            rules: [{
                id: this.$form.subject.prop('id'),
                validate: function (v) {
                    if (iNet.isEmpty(v))
                        return iNet.resources.message.field_not_empty;
                }
            },
                //   {
                //   id: this.$form.brief.prop('id'),
                //   validate: function (v) {
                //     if (iNet.isEmpty(v))
                //       return iNet.resources.message.field_not_empty;
                //   }
                // },
                {
                    id: this.$form.content.prop('id'),
                    validate: function (v) {
                        if (iNet.isEmpty(v))
                            return iNet.resources.message.field_not_empty;
                    }
                }]
        });
        this.editor = new iNet.ui.common.ContentEditor({id: '#post-txt-content'});
        this.reference = new iNet.ui.author.ItemReferenceBoxExt();
        this.published = new iNet.ui.author.ItemPublishedQueueBox();

        iNet.ui.author.ItemCompose.superclass.constructor.call(this);

        this.checkUrl();
        this.editor.on('preview', function (uri) {
            var __uuid = that.getCache().uuid || '';
            if (__uuid) {
                window.open(iNet.getPUrl(uri) + '?preview=true&uuid=' + __uuid, '_blank');
            }
        });
        this.reference.on('added', function (result) {
            var __result = result || {};
            if (__result.type !== 'ERROR') {
                that.success(that.getText('reference', that.getModule()), that.getText('reference_add_success', that.getModule()));
            } else {
                that.error(that.getText('reference', that.getModule()), that.getText('reference_add_error', that.getModule()));
            }
        });
        this.reference.on('removed', function (result) {
            var __result = result || {};
            if (__result.type !== 'ERROR') {
                that.success(that.getText('reference', that.getModule()), that.getText('reference_remove_success', that.getModule()));
            } else {
                that.error(that.getText('reference', that.getModule()), that.getText('reference_remove_error', that.getModule()));
            }
        });

        this.$form.group.on('change', function () {
            var __data = {
                group: that.$form.group.val()
            };
            CMSUtils.loadCategory(__data, function (html) {
                that.$form.category.html(html);
            });
        }).trigger('change');
        this.$toolbar.BACK.on('click', function () {
            that.hide();
            that.fireEvent(that.getEvent('back'), that);
            FormUtils.showButton(that.$toolbar.SAVE, false);

        });
        this.$toolbar.CREATE.on('click', function () {
            that.resetData();
            FormUtils.showButton(that.$toolbar.SAVE, true);
            FormUtils.showButton(that.$toolbar.REMOVED, false);
            FormUtils.showButton(that.$toolbar.REMOVED_REJECT, false);
        });

        this.$toolbar.SAVE.on('click', function () {
            if (that.validate()) {
                that.save(function (data, isUpdate) {
                    if (data.type !== CMSConfig.TYPE_ERROR) {
                        if (isUpdate) {
                            that.success(that.getText('update_title'), that.getText('update_success'));
                            that.fireEvent(that.getEvent('updated'), data, that);
                        } else {
                            that.success(that.getText('create_title'), that.getText('create_success'));
                            that.fireEvent(that.getEvent('saved'), data, that);
                            if (data.status !== CMSConfig.MODE_PUBLISHED
                                && data.status !== CMSConfig.MODE_INTERNAL) {
                                FormUtils.showButton(that.$toolbar.SEND, that.isSend);
                                FormUtils.showButton(that.$toolbar.PUBLISH, that.isPublish);
                            }
                        }
                    } else {
                        if (isUpdate) {
                            that.error(that.getText('update_title'), that.getText('update_unsuccess'));
                        } else {
                            that.error(that.getText('create_title'), that.getText('save_unsuccess'));
                        }
                    }
                });
            }
        });

        this.$toolbar.SAVE_AND_SEND.on('click', function () {
            if (that.validate()) {
                that.save(function (data) {
                    if (data.type !== CMSConfig.TYPE_ERROR) {
                        if (!iNet.isEmptyObject(that.wfFirstNode)) {
                            console.debug('send post after save: ', that.wfFirstNode);
                            Object.keys(that.wfFirstNode).forEach(function (key) {
                                console.debug('execute send post to node: ', that.wfFirstNode);
                                that.send(data.status, that.wfFirstNode[key], key);
                            });
                        }
                    }
                });
            }
        });

        this.$toolbar.SAVE_AND_PUBLISH.on('click', function () {
            if (that.validate() && that.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER)) {
                that.save(function (data) {
                    if (data.type !== CMSConfig.TYPE_ERROR) {
                        if (!iNet.isEmptyObject(that.wfFirstNode)) {
                            console.debug('publish post after save: ', that.wfFirstNode);
                            Object.keys(that.wfFirstNode).forEach(function (key) {
                                console.debug('execute publish post to node: ', that.wfFirstNode);
                                that.send(CMSConfig.MODE_PUBLISHED, that.wfFirstNode[key], key, function (results) {
                                    if (results.type !== CMSConfig.TYPE_ERROR) {
                                        that.success(that.getText('publish'), that.getText('publish_success'));
                                    } else {
                                        that.warning(that.getText('save_and_publish'), that.getText('save_and_publish_error'));
                                    }
                                });
                            });
                        }
                    }
                });
            }
        });

        this.$toolbar.REMOVED_REJECT.on('click', function () {
            that.dialog = that.confirmDlg(
                that.getText('remove_title', that.getModule()),
                that.getText('remove_content', that.getModule()), function () {
                    $.postJSON(that.url.remove, {uuid: that.getCache().uuid}, function (result) {
                        var __result = result || {};
                        if (iNet.isDefined(__result.uuid)) {
                            that.dialog.hide();
                            that.success(that.getText('remove_title', that.getModule()), that.getText('remove_success', that.getModule()));
                            that.hide();
                            $.postJSON(that.url.save, {uuid: that.getCache().uuid, withdraw: true}, function (result) {
                                that.fireEvent(that.getEvent('removed'), that.getPost());
                                that.fireEvent(that.getEvent('back'), that);
                            });
                        } else {
                            that.error(that.getText('remove_title', that.getModule()), that.getText('remove_unsuccess', that.getModule()));
                        }
                    }, {
                        mask: that.getMask(),
                        msg: iNet.resources.ajaxLoading.deleting
                    });
                }).show();
        });

        this.$toolbar.REMOVED.on('click', function () {
            that.dialog = that.confirmDlg(
                that.getText('remove_title', that.getModule()),
                that.getText('remove_content', that.getModule()), function () {
                    $.postJSON(that.url.remove, {uuid: that.getCache().uuid}, function (result) {
                        var __result = result || {};
                        if (iNet.isDefined(__result.uuid)) {
                            that.dialog.hide();
                            that.success(that.getText('remove_title', that.getModule()), that.getText('remove_success', that.getModule()));
                            that.hide();
                            that.fireEvent(that.getEvent('back'), that);
                            that.fireEvent(that.getEvent('removed'), that.getPost());
                        } else {
                            that.error(that.getText('remove_title', that.getModule()), that.getText('remove_unsuccess', that.getModule()));
                        }
                    }, {
                        mask: that.getMask(),
                        msg: iNet.resources.ajaxLoading.deleting
                    });
                }).show();
        });
        this.$toolbar.REJECTED.on('click', function () {
            that.dialog = that.confirmDlg(
                that.getText('reject_title', that.getModule()),
                that.getText('reject_content', that.getModule()), function () {
                    $.postJSON(that.url.reject, {
                        uuid: that.getCache().uuid,
                        code: that.getPost().status
                    }, function (result) {
                        var __result = result || {};
                        if (iNet.isDefined(__result.uuid)) {
                            that.dialog.hide();
                            that.success(that.getText('reject_title', that.getModule()), that.getText('reject_success', that.getModule()));
                            that.hide();
                            that.fireEvent(that.getEvent('removed'), that.getPost());
                        } else {
                            that.error(that.getText('reject_title', that.getModule()), that.getText('reject_unsuccess', that.getModule()));
                        }
                    });
                }).show();
        });
        this.$toolbar.PUBLISH.on('click', function () {
            that.send();
        });
        this.$toolbar.SEND.on('click', 'a[data-action="btn-group-action"]', function () {
            var code = $(this).attr('data-code');
            // var code=$(this).text();
            var name = $(this).html();
            var status = that.getPost().status === CMSConfig.MODE_CREATED ? '' : that.getPost().status;
            that.send(status, name, code);
        });

        var itemShareDialog;
        this.$toolbar.SHARE.on('click', 'a[data-action="btn-group-action"]', function () {
            var attr = $(this).attr('data-code');
            console.log("attr", attr);

            if (!itemShareDialog) {
                console.log("itemShareDialog");

                itemShareDialog = new iNet.ui.author.ItemShareDialog();

                itemShareDialog.on('back', function () {
                    itemShareDialog.hide();
                    itemShareDialog.clear();
                });
            }

            var itemData = that.getData();

            switch (attr) {
                case 'zalo':
                    var coverImageUrl = String.format('https://{0}{1}', window.location.hostname, itemData.image);
                    $.postJSON(iNet.getPUrl("cms/social/htmlclean"), {message: itemData.subject} , function (result) {
                        console.log("result = ", result);
                        itemShareDialog.setZaloContent(itemData.brief, result, coverImageUrl);
                    });
                    itemShareDialog.setSocialType("zalo");
                    itemShareDialog.show();
                    break;
                case 'facebook':
                    var articleLinkAccess = $(this).attr('facebook-article-link-access');
                    var articleLink = String.format('{0}?item={1}', articleLinkAccess, itemData.uuid);

                    itemShareDialog.setFacebookContent(itemData.brief, articleLink);
                    itemShareDialog.setSocialType("facebook");
                    itemShareDialog.show();
                    break;
            }
            // new iNet.ui.author.ItemShareDialog().show();
        });

        this.$form.btnView.on('click', function () {
            var __data = that.$form.image.val();
            var __id = iNet.alphaGenerateId();
            var __tmpHTML = '<a id="' + __id + '" href="' + __data + '" class="hide"></a>';
            var __meId = that.id;
            $('#' + __meId).append(__tmpHTML);
            $('#' + __id).colorbox({
                rel: __id,
                transition: 'fade',
                opacity: 0.3,
                speed: 150,
                close: '<i class="icon-remove-sign red"> </i>',
                scalePhotos: true,
                maxWidth: 640
            }).trigger('click').remove();
        });

        this.$form.template.on('change', function () {
            var __uuid = that.$form.template.val() || '';
            if (!iNet.isEmpty(__uuid)) {
                for (var i = 0; i < that.templates.length; i++) {
                    if (that.templates[i].uuid === __uuid) {
                        that.editor.setValue(that.templates[i].message);
                        return;
                    }
                }
            } else {
                that.editor.setValue('');
            }
        });

        this.init();
    };
    iNet.extend(iNet.ui.author.ItemCompose, iNet.ui.WidgetExt, {
        constructor: iNet.ui.author.ItemCompose,
        checkUrl: function () {
            if (this.type === 'REVIEWER' && this.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER)) {
                this.url.path = iNet.getPUrl('cms/item/reviewpath');
                this.url.send = iNet.getPUrl('cms/item/reviewstatus');
                this.url.save = iNet.getPUrl('cms/item/reviewupdate');
                this.$toolbar.SEND.find('button').html(this.getText('review', this.getModule()) + ' <span class="icon-caret-down icon-on-right"> </span>')
            }
        },
        init: function () {
            this.loadTemplate();
            if (!this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN))
                this.cateBox.readOnly();
        },
        setPost: function (post) {
            this.cache.post = post;
            this.setUUID(post.uuid);
        },
        getPost: function () {
            return this.cache.post;
        },
        setUUID: function (uuid) {
            this.cache.uuid = uuid;
        },
        validate: function () {
            return this.formValidate.check();
        },
        isCanSavePublish: function () {
            return this.isSend && !this.isSaved
                // && (this.wfNodes.length() === 1)
                && this.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER);
        },
        setData: function (post) {
            var __post = post || {};
            var tags = (__post.tags || '').split(';');
            this.$form.subject.val(__post.subject || '');
            this.$form.language.val(__post.language || '');
            this.$form.brief.val(__post.brief || '');
            this.$form.image.val(__post.image || '');
            this.editor.setValue(__post.message || '');
            this.cateBox.setValue(__post.categories || []);
            this.avatarBox.setValue(__post.image);
            this.published.setValue('');
            if (__post.internal && __post.internal > 0) {
                this.published.setValue(__post.internal);
            }
            if (__post.published && __post.published > 0) {
                this.published.setValue(__post.published);
            }

            this.$form.tags.tagsinput('removeAll');
            for (var i = 0; i < tags.length; i++) {
                this.$form.tags.tagsinput('add', tags[i]);
            }

            this.loadReference(__post.uuid, __post.references);
            this.setPost(__post);
            this.loadPaths(__post.status || '');
            this.resize();
        },
        getData: function () {
            var publishDate = this.published.getValue();
            var data = {
                firm: this.getPost().firm,
                subject: this.$form.subject.val(),
                brief: this.$form.brief.val(),
                image: this.avatarBox.getValue(),
                categories: this.cateBox.getValue(),
                message: this.editor.getValue(),
                tags: this.$form.tags.tagsinput('items').join(';'),
                language: this.$form.language.val(),
                uuid: this.getCache().uuid
            };
            if (this.type === 'REVIEWER') {
                data.code = this.getPost().status
            }
            return iNet.apply(data, publishDate);
        },
        resetData: function () {
            this.enable();
            this.$form.tags.tagsinput('removeAll');
            this.setData({
                subject: '',
                brief: '',
                image: '',
                category: '',
                message: '',
                uuid: null,
                references: []
            });
            this.$form.language.val('vi');
            this.isSaved = false;
            this.published.clear();
            this.avatarBox.clear();
            this.cateBox.clear();
            FormUtils.showButton(this.$toolbar.SEND, false);
            FormUtils.showButton(this.$toolbar.PUBLISH, false);
            FormUtils.showButton(this.$toolbar.SAVE, true);
            FormUtils.showButton(this.$toolbar.REMOVED, false);
            FormUtils.showButton(this.$toolbar.REMOVED_REJECT, false);
        },
        enable: function () {
            this.$form.subject.removeClass('disabled').removeAttr('disabled');
            this.$form.brief.removeClass('disabled').removeAttr('disabled');
            this.$form.template.removeClass('disabled').removeAttr('disabled');
            this.cateBox.enable();
            this.avatarBox.enable();
            this.reference.enable();
            this.published.enable();
            this.editor.enable();
        },
        disable: function () {
            this.$form.subject.addClass('disabled').attr('disabled', 'disabled');
            this.$form.brief.addClass('disabled').attr('disabled', 'disabled');
            this.$form.template.addClass('disabled').attr('disabled', 'disabled');
            this.cateBox.disable();
            this.avatarBox.disable();
            this.reference.disable();
            this.published.disable();
            this.editor.disable();
        },
        checkReviewRole: function () {
            var _this = this,
                code = null;
            Object.keys(this.wfFirstNode).forEach(function (key) {
                console.debug('execute send post to node: ', _this.wfFirstNode);
                code = key;
            });
            var nodeCanPublish = function (node) {
                var member = (node.attribute || []).find(function (value) {
                    return value.usercode === iNet.logged;
                });
                return node.type === 'END' && iNet.isDefined(member);
            };
            FormUtils.showButton(_this.$toolbar.SAVE_AND_SEND, _this.isSend && !_this.isSaved);
            $.getJSON(iNet.getPUrl('cms/item/review/wfnode'), {code: code}, function (responseData) {
                if (responseData.type !== CMSConfig.TYPE_ERROR) {
                    var node = responseData || {};
                    FormUtils.showButton(_this.$toolbar.SAVE_AND_PUBLISH, _this.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER)
                        && nodeCanPublish(node));
                }
            });
        },
        setLoadUrl: function (url) {
            this.url.load = url;
        },
        getLoadUrl: function () {
            return this.url.load;
        },
        load: function (post) {
            var that = this;
            FormUtils.showButton(that.$toolbar.SAVE_AND_SEND, false);
            FormUtils.showButton(that.$toolbar.SAVE_AND_PUBLISH, false);
            $.postJSON(this.getLoadUrl(), {uuid: post.uuid}, function (result) {
                var __result = result || {};
                if (iNet.isDefined(__result.uuid)) {
                    that.isSaved = true;
                    that.setData(__result);
                    if (__result.status !== CMSConfig.MODE_PUBLISHED
                        && __result.status !== CMSConfig.MODE_INTERNAL) {
                        FormUtils.showButton(that.$toolbar.SAVE, true);
                        FormUtils.showButton(that.$toolbar.SEND, that.isSend);
                        FormUtils.showButton(that.$toolbar.PUBLISH, that.isPublish);
                        FormUtils.showButton(that.$toolbar.REMOVED, false);
                        FormUtils.showButton(that.$toolbar.REMOVED_REJECT, false);
                        FormUtils.showButton(that.$toolbar.SHARE, false);
                        that.enable();
                    } else if ((__result.status === CMSConfig.MODE_PUBLISHED
                        || __result.status === CMSConfig.MODE_INTERNAL) && that.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN)) {
                        FormUtils.showButton(that.$toolbar.SAVE, false);
                        FormUtils.showButton(that.$toolbar.SEND, false);
                        FormUtils.showButton(that.$toolbar.PUBLISH, false);
                        FormUtils.showButton(that.$toolbar.REMOVED, true);
                        FormUtils.showButton(that.$toolbar.REMOVED_REJECT, __result.writercode === iNet.logged);
                        FormUtils.showButton(that.$toolbar.SHARE, true);
                        that.disable();
                    } else if ((__result.status === CMSConfig.MODE_PUBLISHED
                            || __result.status === CMSConfig.MODE_INTERNAL)
                        && (that.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || that.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER))) {
                        FormUtils.showButton(that.$toolbar.REMOVED, true);
                        FormUtils.showButton(that.$toolbar.REMOVED_REJECT, __result.writercode === iNet.logged);
                    } else if ((__result.status === CMSConfig.MODE_PUBLISHED
                        || __result.status === CMSConfig.MODE_INTERNAL) && (!(that.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN)) && !(that.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER)))) {
                        FormUtils.showButton(that.$toolbar.REMOVED, false);
                        FormUtils.showButton(that.$toolbar.REMOVED_REJECT, false);
                        that.disable();
                    } else if (__result.status === CMSConfig.MODE_CREATED) {
                        FormUtils.showButton(that.$toolbar.REMOVED, false);
                        FormUtils.showButton(that.$toolbar.REMOVED_REJECT, false);
                    }
                    // if(that.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN))
                    //     FormUtils.showButton(that.$toolbar.REMOVED, true);
                    // else
                    //     FormUtils.showButton(that.$toolbar.REMOVED, false);
                }
            });
        },
        loadReview: function (uuid, code) {
            var that = this;
            var __uuid = uuid || '';
            if (!iNet.isEmpty(__uuid)) {
                FormUtils.showButton(that.$toolbar.CREATE, false);
                FormUtils.showButton(that.$toolbar.SEND, that.isSend);
                FormUtils.showButton(that.$toolbar.PUBLISH, that.isPublish);
                FormUtils.showButton(that.$toolbar.SAVE_AND_SEND, false);
                FormUtils.showButton(that.$toolbar.SAVE_AND_PUBLISH, false);
                FormUtils.showButton(that.$toolbar.REMOVED, false);
                FormUtils.showButton(that.$toolbar.REMOVED_REJECT, false);
                FormUtils.showButton(that.$toolbar.SAVE, true);
                $.postJSON(this.getLoadUrl(), {uuid: uuid, code: code}, function (result) {
                    var __result = result || {};
                    that.cateBox.setValue(result.categories);
                    if (__result.type !== 'ERROR') {
                        that.isSaved = true;
                        FormUtils.showButton(that.$toolbar.REJECTED, __result.firm === iNet.firmPrefix
                            && __result.status !== CMSConfig.MODE_PUBLISHED
                            && that.getSecurity().hasRoles([CMSConfig.ROLE_ADMIN, CMSConfig.ROLE_REVIEWER]));
                        that.setData(__result);
                    }
                });
            } else {
                that.resetData();
            }
        },
        loadTemplate: function () {
            var that = this;
            $.postJSON(that.url.template, {type: 'PAGE'}, function (result) {
                var __result = result || {};
                var __opt = '', __list = __result.items || [];
                that.templates = __list;
                for (var i = 0; i < __list.length; i++) {
                    __opt = String.format('<option value="{0}">{1}</option>', __list[i].uuid, __list[i].name);
                    that.$form.template.append(__opt);
                }
            });
        },
        loadReference: function (uuid, data) {
            var that = this;
            var __data = data || [];
            var __uuid = uuid || '';
            that.reference.setUuid(__uuid);
            that.reference.setValue(__data);
        },
        loadPaths: function (code) {
            var that = this;
            var __code = code || '';
            if (__code === CMSConfig.MODE_CREATED) {
                __code = '';
            }
            $.postJSON(that.url.path, {code: __code}, function (result) {
                var __result = result || {};
                if (__result.type !== 'ERROR') {
                    var paths = __result || {};
                    that.$toolbar.SEND_LIST.html('');
                    delete paths[CMSConfig.MODE_INTERNAL];
                    if (!iNet.isEmptyObject(paths)) {
                        that.wfNodes = paths;
                        if (!$.isEmptyObject(paths['goto'])) {
                            that.$toolbar.SEND_LIST.append('<div style="font-weight:bold;padding: 5px;background: #ececec;"><i class="fa fa-share-square" aria-hidden="true"></i> Gửi duyệt nhanh</div>');
                            for (var subKey in paths['goto']) {
                                that.$toolbar.SEND_LIST.append(String.format('<li><a href="javascript:;" data-send="true" data-action="btn-group-action" data-code="{0}">{1}</a></li>', subKey, paths['goto'][subKey]));
                            }
                            delete paths['goto'];
                        }
                        if (__code) {
                            that.$toolbar.SEND_LIST.append('<div style="font-weight:bold;padding: 5px;background: #ececec;"><i class="fa fa-hand-o-right" aria-hidden="true"></i> Theo qui trình</div>');
                            Object.keys(paths).forEach(function (key, index) {
                                var value = paths[key];
                                if (index === 0) {
                                    that.wfFirstNode[key] = value;
                                }
                                if (key === value && key === CMSConfig.MODE_PUBLISHED) {
                                    value = that.getText('publish', that.getModule());
                                }

                                that.$toolbar.SEND_LIST.append(String.format('<li><a href="javascript:;" data-action="btn-group-action" data-code="{0}">{1}</a></li>', key, value));
                            });
                        } else {
                            if (paths.hasOwnProperty(CMSConfig.MODE_PUBLISHED)
                                && paths[CMSConfig.MODE_PUBLISHED] === CMSConfig.MODE_PUBLISHED) {
                                that.$toolbar.SEND_LIST.append('<div style="font-weight:bold;padding: 5px;background: #ececec;"><i class="fa fa-hand-o-right" aria-hidden="true"></i> Theo qui trình</div>');
                                Object.keys(paths).forEach(function (key, index) {
                                    var value = paths[key];
                                    if (index === 0) {
                                        that.wfFirstNode[key] = value;
                                    }
                                    if (value !== CMSConfig.MODE_PUBLISHED) {
                                        that.$toolbar.SEND_LIST.append(String.format('<li><a href="javascript:;" data-action="btn-group-action" data-code="{0}">{1}</a></li>', key, value));
                                    }
                                });
                                that.$toolbar.SEND_LIST.append(String.format('<li><a href="javascript:;" data-action="btn-group-action" data-code="{0}">{1}</a></li>', CMSConfig.MODE_PUBLISHED, that.getText('publish', that.getModule())));
                            } else {
                                // for (var key in paths) {
                                //   if (paths.hasOwnProperty(key)) {
                                //     that.$toolbar.SEND_LIST.append(String.format('<li><a href="javascript:;" data-action="btn-group-action" data-code="{0}">{1}</a></li>', key, paths[key]));
                                //   }
                                // }
                                that.$toolbar.SEND_LIST.append('<div style="font-weight:bold;padding: 5px;background: #ececec;"><i class="fa fa-hand-o-right" aria-hidden="true"></i> Theo qui trình</div>');
                                Object.keys(paths).forEach(function (key, index) {
                                    var value = paths[key];
                                    if (index === 0) {
                                        that.wfFirstNode[key] = value;
                                    }
                                    that.$toolbar.SEND_LIST.append(String.format('<li><a href="javascript:;" data-action="btn-group-action" data-code="{0}">{1}</a></li>', key, value));
                                });
                            }
                        }
                        that.isSend = true;
                        that.isPublish = false;
                    } else {
                        that.isSend = false;
                        that.isPublish = true;
                    }
                }
                that.checkReviewRole();
                // FormUtils.showButton(that.$toolbar.SAVE_AND_SEND, that.isSend && !that.isSaved);
                // FormUtils.showButton(that.$toolbar.SAVE_AND_PUBLISH, that.isSend && !that.isSaved && that.getSecurity().hasRoles(CMSConfig.ROLE_REVIEWER));
            });


            //
            $.postJSON(that.url.loadShareConfig, {}, function (result) {
                var _result = result || {};
                if (_result.total > 0) {
                    console.log('loadShareConfig _result.total', _result);
                    that.$toolbar.SHARE_LIST.empty();
                    var _items = _result.items || [];
                    _items.forEach(e => {
                        that.$toolbar.SHARE_LIST.append(String.format('<li><a href="javascript:;" data-action="btn-group-action" data-code="{0}" facebook-article-link-access="{1}">{2}</a></li>', e.socialType, e.attribute.article_link_access, e.socialType.toUpperCase()));
                    });
                }
            }, {
                mask: that.getMask(),
                msg: 'Đang xử lý...'
            });

        },
        resize: function () {
            $(window).trigger('resize');
        },
        save: function (callback) {
            var _this = this;
            var params = _this.getData();
            if (iNet.isEmpty(params.uuid) || iNet.isDefined(params.uuid)) {
                // delete params.uuid;
            }
            $.postJSON(_this.url.save, params, function (results) {
                if (results.type !== CMSConfig.TYPE_ERROR) {
                    _this.isSaved = true;
                    _this.setPost(results);
                    _this.saveReferences(results.uuid);
                    FormUtils.showButton(_this.$toolbar.SAVE_AND_SEND, false);
                    FormUtils.showButton(_this.$toolbar.SAVE_AND_PUBLISH, false);
                }
                callback && callback(results, !iNet.isEmpty(params.uuid));
            }, {
                mask: _this.getMask(),
                msg: iNet.resources.ajaxLoading.saving
            });
        },
        saveReferences: function (uuid) {
            var that = this;
            var __data = that.reference.getValue();
            var __uuid = uuid || '';
            for (var i = 0; i < __data.length; i++) {
                var __params = {
                    uuid: __uuid,
                    ref: __data[i].uuid || '',
                    subject: __data[i].subject || ''
                };
                $.postJSON(that.url.reference_add, __params, function (result) {
                    var __result = result || {};
                    if (__result.type === 'ERROR') {
                        that.error(that.getText('reference', that.getModule()), that.getText('reference_add_error', that.getModule()));
                    }
                });
            }
        },
        send: function (status, nodeName, nodeCode, callback) {
            var that = this;
            var __post = this.getPost();
            if (__post.category || __post.categories) {
                var __params = iNet.apply(__post, this.getData());
                var __name = nodeName || '';

                if (status) {
                    __params.code = status;
                }

                if (nodeCode) {
                    __params.path = nodeCode;
                }

                $.postJSON(that.url.send, __params, function (result) {
                    var __result = result || {};
                    if (callback) {
                        callback(result);
                    } else {
                        if (__result.type !== 'ERROR') {
                            if (__params.code === CMSConfig.MODE_PUBLISHED) {
                                that.success(that.getText('send', that.getModule()), that.getText('publish_success', that.getModule()));
                            } else {
                                that.success(that.getText('send', that.getModule()), String.format(that.getText('send_success', that.getModule()), __name));
                            }
                            that.fireEvent(that.getEvent('send'), __result, __params.code, __post.status, that);
                        } else {
                            if (__params.code === CMSConfig.MODE_PUBLISHED) {
                                that.error(that.getText('send', that.getModule()), that.getText('publish_error', that.getModule()));
                            } else {
                                that.error(that.getText('send', that.getModule()), String.format(that.getText('send_error', that.getModule()), __name));
                            }
                        }
                    }
                }, {
                    mask: that.getMask(),
                    msg: __params.code === CMSConfig.MODE_PUBLISHED ? that.getText('publishing', that.getModule()) : that.getText('sending', that.getModule())
                });
            } else {
                that.error(that.getText('send', that.getModule()), that.getText('category_required', that.getModule()));
            }
        }
    });
});
