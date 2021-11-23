/**
 * #PACKAGE: author
 * #MODULE: item-share-dialog
 */
$(function () {
    /**
     * @class iNet.ui.author.ItemShareDialog
     * @extends iNet.ui.WidgetExt
     */
    iNet.ns('iNet.ui.author.ItemShareDialog');
    iNet.ui.author.ItemShareDialog = function (options) {
        var me = this;
        iNet.apply(this, options || {});
        this.id = 'cms-item-share-dialog';
        this.module = 'comment';
        this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

        this.socialType = '';

        this.btn = {
            share: $('#cms-social-share-btn'),
        }

        this.url = {
            share: iNet.getPUrl('cms/social/share'),

        }

        this.form = {
            title: $('#cms-social-share-title'),
            message: $('#cms-social-share-message'),
            coverImageUrl: $('#cms-social-cover-image-url'),
            articleLink: $('#cms-social-share-article-link'),
        }

        this.div = {
            title: $('#cms-social-share-title-div'),
            message: $('#cms-social-share-message-div'),
            coverImageUrl: $('#cms-social-share-cover-image-url-div'),
            articleLink: $('#cms-social-share-article-link-div'),
        }

        this.btn.share.on('click', function () {
            var params = {}
            params.message = me.form.message.val();
            params.articleUrl = me.form.articleLink.val();
            params.coverImageUrl = me.form.coverImageUrl.attr('src');
            params.title = me.form.title.val();
            params.socialType = me.getSocialType();
            console.log('me.getSocialType()', me.getSocialType());

            $.postJSON(me.url.share, params, function (result) {
                var __result = result || {};
                console.log('result', __result);
                if (__result.status) {
                    me.success('Chia sẻ', 'Chia sẻ thành công !');
                    me.clear();
                    me.hide();
                } else {
                    me.error( 'Chia sẻ', 'Quá trình chia sẻ bài viết xảy ra lỗi, xin kiểm tra lại cấu hình !');
                }
            }, {
                mask: $('#wg-compose-post'),
                msg: "Đang xử lý"
            });
        });

        $('#cms-item-share-dialog-title').val(String.format('Chia sẻ lên {0}', me.getSocialType().toUpperCase()));

    };
    iNet.extend(iNet.ui.author.ItemShareDialog, iNet.ui.WidgetExt, {
        show: function () {
            $('#' + this.id).modal('show');
        },
        hide: function () {
            $('#' + this.id).modal('hide');
        },
        setZaloContent: function (title, message, coverImageUrl) {
            this.form.title.val(title);
            this.form.message.val(message);
            this.form.coverImageUrl.attr("src", coverImageUrl);

            this.div.title.show();
            this.div.message.show();
            this.div.coverImageUrl.show();
            this.div.articleLink.hide();
        },
        setFacebookContent: function (message, articleLink) {
            this.form.message.val(message);
            this.form.articleLink.val(articleLink);

            this.div.message.show();
            this.div.articleLink.show();
            this.div.title.hide();
            this.div.coverImageUrl.hide();
        },
        clear: function () {
            this.form.title.val("");
            this.form.message.val("");
            this.form.coverImageUrl.attr("src", "");
            this.form.articleLink.val("");
            this.socialType = '';
        },
        setSocialType: function (value) {
            this.socialType = value;
        },
        getSocialType: function () {
            return this.socialType;
        }
    });

});
