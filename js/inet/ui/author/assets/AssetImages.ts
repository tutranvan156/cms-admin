/**
 * #PACKAGE: author
 * #MODULE: asset-images
 */

/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 11:56 25/09/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file AssetImages.ts
 */

$(() => {
    class AssetImages extends iNet.ui.WidgetExt {
        protected id: string = 'asset-images-wg';
        protected module = 'media';
        protected resourceRoot = iNet.resources.cmsadmin;

        private folderId: string = 'asset-images-folder';
        private listId: string = 'file-list';
        private pagingId: string = 'paging-toolbar';
        private itemTpl: string = 'image-item-tpl';
        private params: any = {};
        private submitter: any = {};
        private select: boolean = false;
        private folder: string = null;
        private store = new Hashtable();
        private filesUpload: FileList;

        private toolbar = {
            UPLOAD: $('#asset-images-upload'),
            BACK: $('#asset-images-back'),
            SELECT: $('#asset-images-select')
        };

        private form = {
            INPUT_UPLOAD: $('#asset-inp-upload-image')
        };

        private assetFolder = new iNet.ui.author.AssetFolder({id: this.folderId});

        private paging = new iNet.ui.common.PagingToolbar({
            id: this.pagingId,
            url: AssetAPI.URL.LIST,
            params: {
                type: CMSConfig.ASSET_TYPE_IMAGE,
                order: '-created'
            },
            idProperty: 'uuid'
        });

        // @ts-ignore
        constructor() {
            // @ts-ignore
            this.init();
            super();

            this.assetFolder.on('change', (folder) => {
                this.load(folder);
            });

            this.assetFolder.on('loaded', (folder) => {
                this.load(folder);
            });

            this.getPaging().on('load', (results) => {
                this.getStore().clear();
                if (results.type !== CMSConfig.TYPE_ERROR) {
                    this.render(results.items || []);
                }
                FormUtils.showButton(this.toolbar.SELECT, this.isSelect());
            });

            this.toolbar.BACK.on('click', () => {
                this.hide();
                this.fireEvent('back', this);
            });

            this.toolbar.UPLOAD.on('click', () => {
                this.form.INPUT_UPLOAD.trigger('click');
            });

            this.toolbar.SELECT.on('click', () => {

            });

            this.form.INPUT_UPLOAD.on('change', (event: JQuery.Event) => {
                this.filesUpload = (event.currentTarget as HTMLInputElement).files;
                this.upload();
            });

            this.getListEl().on('click', '[data-action="remove"]', (event: JQuery.Event) => {
                let thisEl = $(event.currentTarget);
                let fileEl = thisEl.closest('.file');
                if (fileEl.length > 0) {
                    if (fileEl.prop('id')) {
                        let file = get(fileEl.prop('id'), this.getStore());
                        let dialog = this.confirmDlg(
                                this.getText('delete_file', 'media'),
                                this.getText('confirm_del_file', 'media'), () => {
                                    dialog.hide();
                                    AssetAPI.remove(dialog.getData(), (result) => {
                                        if (result.type !== CMSConfig.TYPE_ERROR) {
                                            fileEl.remove();
                                            pop(result, this.getStore());
                                        }
                                    });
                                });
                        dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + this.getText('delete_file'));
                        dialog.setData({folder: file.folder, file: 1, uuid: fileEl.prop('id')});
                        dialog.show();
                    }
                }
            });
        }

        init(): void {
            if (this.getEl().length <= 0) {
                throw new Error('#Asset Image > Element is not found with id {' + this.getId() +'}!');
            }
        }

        getId(): string {
            return this.id;
        }

        getEl(): JQuery<HTMLElement> {
            return $('#' + this.getId());
        }

        getListEl(): JQuery<HTMLElement> {
            return $('#' + this.listId);
        }

        getPaging() {
            return this.paging;
        }

        setStore (data) {
            this.store = data;
        }

        getStore() {
            return this.store;
        }

        setSelect(select: boolean) {
            this.select = select;
            this.toggleSelect();
        }

        isSelect(): boolean {
            return this.select;
        }

        toggleSelect(): void {
            if (this.isSelect()) {
                this.getEl().addClass('selector');
            }
            else {
                this.getEl().removeClass('selector');
            }
        }

        setFolder(folder) {
            this.folder = folder;
        }

        getFolder() {
            return this.folder || this.assetFolder.getFirst();
        }

        setParams (data) {
            this.params = data;
            this.params.order = '-created';
        }

        getParams () {
            return this.params || {
                type: CMSConfig.ASSET_TYPE_IMAGE,
                category: this.getFolder(),
                order: '-created'
            };
        }

        load (folder?: string) {
            if (folder) {
                this.setFolder(folder);
            }
            this.getPaging().setParams({
                type: CMSConfig.ASSET_TYPE_IMAGE,
                category: this.getFolder(),
                order: '-created'
            });
            this.getPaging().load();
        }

        render (items) {
            this.getListEl().empty();
            (items || []).forEach((item) => {
                push(item, this.getStore());
                this.getListEl().append(this.renderItem(item));
            });
            this.toggleSelect();
        }

        renderItem (item): string {
            return iNet.Template.parse(this.itemTpl, item);
        }

        preUpload (files) {
            readFiles(0, files, (data) => {
                push(data, this.getStore());
                this.getListEl().append(this.renderItem(data));
            });
        }

        upload () {
            if (this.filesUpload.length > 0) {
                this.preUpload(this.filesUpload);
                for (let idx = 0; idx < this.filesUpload.length; idx++) {
                    let file: any = this.filesUpload.item(idx);
                    uploadSingle(idx, file, this.submitter, {
                        index: idx,
                        params: {
                            type: CMSConfig.ASSET_TYPE_IMAGE,
                            category: this.getFolder()
                        },
                        callback: (result, index) => {
                            console.log('callback index ', idx);
                            if (result.type !== CMSConfig.TYPE_ERROR) {
                                let elements = result.elements || [];
                                if (elements.length > 0) {
                                    let item = elements[0];
                                    let curEl = $('#' + file.id);
                                    pop(file, this.getStore());
                                    push(item, this.getStore());
                                    curEl.prop('id', item.id);
                                    curEl.find('img').attr('src', item.src);
                                    // this.renderItem(elements[0]);
                                }
                            }
                            this.filesUpload = null;
                        },
                        onProgress: (value, index) => {
                            getProgressElByIndex(idx).css({width: value + '%'});
                        },
                        onComplete: (e, index) => {
                            getProgressElByIndex(index).hide();
                        },
                        onError: (e, index) => {
                            getProgressElByIndex(index).hide();
                        }
                    });
                }
            }
        }
    }

    /**
     * @param {Number} index
     * @param {FileList} files
     * @param {Function} callback
     */
    function readFiles(index, files, callback) {
        let reader = new FileReader();
        reader.onload = () => {
            callback && callback(renderPreviewData(index, reader.result));
            if (index < files.length - 1) {
                readFiles(index++, files, callback);
            }
        };
        reader.readAsDataURL(files.item(index));
    }

    /**
     * @param {Number} index
     * @param {File} file
     * @param {Object} requests
     * @param {Object} options
     */
    function uploadSingle(index, file, requests, options) {
        if (file) {
            let fd = new FormData();
            fd.append(file.name, file);
            for (let key in options.params) {
                if (options.params.hasOwnProperty(key)) {
                    fd.append(key, options.params[key]);
                }
            }
            requests[getRequestByIndex(index)] = AssetAPI.upload(fd, options);
        }
    }

    function renderPreviewData(index, data) {
        return {
            id: iNet.generateId(),
            src: data,
            index: index
        }
    }

    /**
     * @param {Number} index
     * @returns {string}
     */
    function getRequestByIndex(index) {
        return 'upload-request-' + index;
    }

    /**
     * @param {Number} index
     * @returns {jQuery|HTMLElement}
     */
    function getProgressElByIndex(index): JQuery<HTMLElement> {
        return $('#upload-progress-' + index);
    }

    /**
     * @param {Array} items
     * @param {Hashtable} store
     */
    function pushAll(items, store) {
        items.forEach((item) => {
            if (!item.id) {
                item.id = item.uuid;
            }
            push(item, store);
        });
    }

    /**
     * @param {Object} item
     * @param {Hashtable} store
     */
    function push(item, store) {
        if (!item.id) {
            item.id = item.uuid;
        }
        pop(item, store);
        item.src = CMSUtils.getMediaPath(item, false);
        store.put(item.id, item);
    }

    /**
     * @param {Object} item
     * @param {Hashtable} store
     */
    function pop(item, store) {
        if (!item.id) {
            item.id = item.uuid;
        }
        if (contains(item, store)) {
            store.remove(item.id);
        }
    }

    /**
     * @param {String} key
     * @param {Hashtable} store
     */
    function get(key, store) {
        return store.get(key);
    }

    /**
     * @param {Object} item
     * @param {Hashtable} store
     */
    function contains(item, store) {
        if (!item.id) {
            item.id = item.uuid;
        }
        return store.containsKey(item.id);
    }

    // export class
    iNet.ui.author.AssetImages = AssetImages;
});