/**
 * #PACKAGE: admin
 * #MODULE: cms-social-config
 */
$(function () {
    /**
     * @class iNet.ui.admin.SocialConfig
     * @extends iNet.ui.WidgetExt
     */
    iNet.ns('iNet.ui.admin.SocialConfig');
    iNet.ui.admin.SocialConfig = function (options) {
        var me = this;
        iNet.apply(this, options || {});
        this.id = 'social-setting';
        this.module = 'setting';
        this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
        this.form = {
            zalo: {
                active: $('#cms-social-zalo-active-checkbox'),
                accessToken: $('#social-config-zalo-access-token'),
            },
            facebook: {
                active: $('#cms-social-facebook-active-checkbox'),
                accessToken: $('#social-config-facebook-access-token'),
                articleLinkAccess: $('#social-config-facebook-article-link-access'),
                appID: $('#social-config-facebook-app-id'),
                appSecret: $('#social-config-facebook-app-secret'),
                pageId: $('#social-config-facebook-page-id'),
                accountID: $('#social-config-facebook-account-id'),
                longLiveAccessToken: $('#social-config-facebook-long-lived-token'),
                expirationTime: $('#social-config-facebook-expiration-time'),
            }
        }
        this.btn = {
            save: $('#social-config-btn-save'),
            facebookGenerateConfig: $('#social-config-facebook-generate')

        }
        this.url = {
            list: iNet.getPUrl('social/configs/list'),
            save: iNet.getPUrl('social/configs/save'),
            facebookGenerateConfig: iNet.getPUrl('social/configs/facebook/generate'),

        };


        this.btn.save.on('click', function () {
            var params = [];
            if (me.form.zalo.active.is(":checked")) {
                params.push(me.getZaloConfigData());
            }
            if (me.form.facebook.active.is(":checked")) {
                params.push(me.getFacebookConfigData());
            }

            console.log("params", params);
            var myJsonString = {};
            try {
                myJsonString = JSON.stringify(params);
            } catch (e) {
            }


            $.postJSON(me.url.save, {"params": myJsonString}, function (result) {
                console.log("result", result);
                var _result = result || {};

                if (_result.status) {
                    me.success("Lưu cấu hình", "Lưu cấu hình thành công");
                } else {
                    me.error("Lưu cấu hình", "Có lỗi trong quá trình xử lý");
                }
            }, {
                mask: $('#' + me.id),
                msg: "Đang xử lý"
            });
        });

        this.btn.facebookGenerateConfig.on('click', function () {
            $.postJSON(me.url.facebookGenerateConfig, me.getFacebookParams(), function (result) {
                var _result = result || {};
                console.log("_result", _result);
                if (_result.status) {
                    me.success("Lấy cấu hình", "Lấy cấu hình thành công");
                    me.setFacebookRet(_result.data);
                } else {
                    me.error("Lấy cấu hình", "Có lỗi trong quá trình xử lý");
                }
            }, {
                mask: $('#' + me.id),
                msg: "Đang xử lý"
            });
        });
    };
    iNet.extend(iNet.ui.admin.SocialConfig, iNet.ui.WidgetExt, {
        loadData: function () {
            var that = this;
            $.postJSON(that.url.list, {}, function (result) {
                console.log("result : ", result);
                var _result = result || result;
                for (var i = 0; i < _result.total; i++) {
                    var item = _result.items[i];
                    switch (item.socialType) {
                        case 'zalo':
                            that.setZaloConfigData(item);
                            break;
                        case 'facebook':
                            that.setFacebookConfigData(item);
                            break;
                    }
                }
            }, {
                mask: $('#' + this.id),
                msg: "Đang xử lý ..."
            });
        },
        setZaloConfigData: function (config) {
            var _config = config || {};
            this.form.zalo.active.prop('checked', _config.active);
            this.form.zalo.accessToken.val(_config.attribute.access_token)
        },
        setFacebookConfigData: function (config) {
            var _config = config || {};
            this.form.facebook.active.prop('checked', _config.active);
            this.form.facebook.accessToken.val(_config.attribute.access_token)
            this.form.facebook.appID.val(_config.attribute.app_id)
            this.form.facebook.appSecret.val(_config.attribute.app_secret)
            this.form.facebook.pageId.val(_config.attribute.page_id)
            this.form.facebook.accountID.val(_config.attribute.account_id)
            this.form.facebook.longLiveAccessToken.val(_config.attribute.long_live_access_token)
            this.form.facebook.expirationTime.val(new Date(_config.attribute.expiration_time))
            this.form.facebook.articleLinkAccess.val(_config.attribute.article_link_access)
        },
        getZaloConfigData: function () {
            var params = {};
            var attribute = {};
            params.active = this.form.zalo.active.is(":checked");
            attribute.access_token = this.form.zalo.accessToken.val();

            params.attribute = attribute;
            params.socialType = "zalo";
            return params;
        },
        getFacebookConfigData: function () {
            var params = {};
            var attribute = {};
            params.active = this.form.facebook.active.is(":checked");
            attribute.access_token = this.form.facebook.accessToken.val();
            attribute.app_id = this.form.facebook.appID.val();
            attribute.app_secret = this.form.facebook.appSecret.val();
            attribute.page_id = this.form.facebook.pageId.val();
            attribute.account_id = this.form.facebook.accountID.val();
            attribute.long_live_access_token = this.form.facebook.longLiveAccessToken.val();
            attribute.expiration_time = new Date(this.form.facebook.expirationTime.val()).getTime();
            attribute.article_link_access = this.form.facebook.articleLinkAccess.val();

            params.attribute = attribute;
            params.socialType = "facebook";

            return params;
        },
        getFacebookParams: function () {
            var params = {};
            params.access_token = this.form.facebook.accessToken.val();
            params.app_id = this.form.facebook.appID.val();
            params.app_secret = this.form.facebook.appSecret.val();
            return params;
        },
        setFacebookRet: function (config) {
            var _config = config || {};
            this.form.facebook.longLiveAccessToken.val(_config.long_live_access_token);
            this.form.facebook.expirationTime.val(new Date(_config.expiration_time));
            this.form.facebook.pageId.val(_config.page_id);
            this.form.facebook.accountID.val(_config.account_id);
        },

    });

    new iNet.ui.admin.SocialConfig().loadData();
});
