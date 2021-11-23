/**
 * Copyright (c) 2019 by Tien Ha (tienht@inetcloud.vn)
 *
 * Created by dev on 14:03 20/12/2019
 *
 */
// #PACKAGE: review
// #MODULE: denounce-criminals-detail
$(function () {
    iNet.ns('iNet.ui.review.DenounceCriminalsDetail');
    iNet.ui.review.DenounceCriminalsDetail = function (options) {
        var _this = this;
        iNet.apply(this, options || {});
        this.module = 'fqa';
        this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;

        this.form = {
            owner: $('#txt-content-owner'),
            time: $('#txt-content-time'),
            subject: $('#txt-content-subject'),
            question: $('#txt-content-question'),
            answer: $('#txt-content-answer'),
            category: $('#txt-content-category')
        };

        iNet.ui.review.DenounceCriminalsDetail.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.review.DenounceCriminalsDetail, iNet.ui.author.FQAContent, {
        setForm: function (data) {
            this.form.owner.text(data.fullName || '');
            this.form.time.text(new Date(data.createdDate).format(iNet.fullDateFormat));
            this.form.subject.val(data.accusedPerson || '');
            this.form.question.val(data.content || '');
        }
    });
});