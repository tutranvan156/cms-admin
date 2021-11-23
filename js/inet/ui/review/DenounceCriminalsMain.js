/**
 * Copyright (c) 2019 by Tien Ha (tienht@inetcloud.vn)
 *
 * Created by dev on 11:25 20/12/2019
 *
 */
// #PACKAGE: review
// #MODULE: denounce-criminals-main
$(function () {
    var list = new iNet.ui.review.DenounceCriminalsList();

    var content = null;

    var history = new iNet.ui.form.History({
        id: 'history-' + iNet.generateId(),
        root: list
    });
    history.on('back',function (widget) {
        widget.show();
    });

    var loadContentWg = function (parent) {
        if(!content){
            content = new iNet.ui.review.DenounceCriminalsDetail();
            content.on('back', function () {
                history.back();
            });
            content.on('deleted', function (data) {
                parent.removeByID(data.uuid);
                history.back();
            });
        }
        if(parent){
            content.setParent(parent);
            parent.hide();
        }
        history.push(content);
        content.passRoles(parent);
        content.show();
        return content;
    };
    list.on('open', function (record, parent) {
        content = loadContentWg(parent);
        content.setRecord(record);
        content.setForm(record);
    });
});