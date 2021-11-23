/**
 * #PACKAGE: author
 * #MODULE: asset-documents
 */
$(() => {

    class BasicSearch extends iNet.ui.grid.Search {
        protected id = 'documents-basic-search';
        private folderId: string = 'asset-document-folder';
        private url = iNet.getPUrl('cms/asset/list');
        private folder = null;

        protected toolbar: any = {};
        protected formSearch: any = {};
        protected assetFolder: any = new iNet.ui.author.AssetFolder({
            id: this.folderId,
            assetType: CMSConfig.ASSET_TYPE_DOCUMENT,
            toolbar: {
                CREATE: $('#asset-document-folder-btn-create'),
                EDIT: $('#asset-document-folder-btn-edit'),
                REMOVE: $('#asset-document-folder-btn-remove'),
                PUBLISHED: $('#asset-document-folder-btn-published'),
                UNPUBLISHED: $('#asset-document-folder-btn-unpublished')
            }
        });

        // @ts-ignore
        constructor() {
            // @ts-ignore
            this.init();
            super();
        }

        init() {}

        intComponent() {
            this.toolbar = {
                BACK: this.getEl().find('#asset-documents-back'),
                UPLOAD: this.getEl().find('#asset-documents-upload'),
                SELECT: this.getEl().find('#asset-documents-select'),
            };
            this.formSearch = {
                INPUT: this.getEl().find('.grid-search-input'),
                BTN_SEARCH: this.getEl().find('.grid-search-btn')
            };

            this.toolbar.BACK.on('click', () => {
                this.fireEvent('back');
            });

            this.toolbar.UPLOAD.on('click', () => {
                this.fireEvent('upload');
            });

            this.toolbar.SELECT.on('click', () => {
                this.fireEvent('select');
            });

            this.assetFolder.on('change', (folder) => {
                this.setFolder(folder);
                this.formSearch.BTN_SEARCH.trigger('click');
            });

            this.assetFolder.on('loaded', (folder) => {
                this.setFolder(folder);
                this.formSearch.BTN_SEARCH.trigger('click');
            });
        }

        getUrl () {
            return this.url;
        }

        setFolder(folder: string) {
            this.folder = folder;
        }

        getFolder(): string {
            return this.folder;
        }

        getData () {
            return {
                type: CMSConfig.ASSET_TYPE_DOCUMENT,
                category: this.getFolder(),
                pageSize: CMSConfig.PAGE_SIZE,
                pageNumber: 0,
                keyword: this.formSearch.INPUT.val() || '',
                order: '-created'
            };
        }
    }

    class AssetDocuments extends iNet.ui.ListAbstract {
        protected id: string = 'asset-documents-wg';
        protected gridID = 'list-documents';
        protected remote = true;
        protected firstLoad = false;
        protected module = 'media';
        protected resourceRoot = iNet.resources.cmsadmin;

        private submitter: any = {};
        private filesUpload = new Hashtable();
        private selected: Array<any> = [];

        protected url = {
            list: iNet.getPUrl('cms/asset/list')
        };

        private form = {
            INPUT_UPLOAD: $('#asset-inp-upload')
        };

        protected dataSource = new iNet.ui.grid.DataSource({
            columns: [{
                type : 'selection',
                align: 'center',
                width : 30
            }, {
                property: 'brief',
                label: 'Tên',
                type: 'text',
                sortable: true,
                renderer: (value, record) => {
                    if (record.preview) {
                        return '<div class="progress">\n' +
                                '  <div id="upload-progress-' + record.index + '" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0">\n' +
                                '   ' + value + '(<i class="upload-' + record.index + '-percent">0%</i>)\n' +
                                '  </div>\n' +
                                '</div>'
                    }
                    return value;
                }
            }, {
                property: 'size',
                label: 'Dung lượng',
                type: 'text',
                sortable: true,
                width: 220,
                renderer: (v) => {
                    return FileUtils.getSize(v);
                }
            }, {
                property: 'created',
                label: 'Ngày tải lên',
                type: 'text',
                sortable: true,
                width: 120,
                renderer: (v) => {
                    // @ts-ignore
                    return new Date(v).format(iNet.dateFormat);
                }
            }, {
                label: '',
                type: 'action',
                align: 'center',
                buttons: [{
                    text: this.getText('delete', 'link'),
                    icon: 'icon-trash',
                    labelCls: 'label label-danger',
                    fn: (record) => {
                        let dialog = this.confirmDlg(this.getText('delete_file'), this.getText('confirm_del_file'), () => {
                            AssetAPI.remove(dialog.getData(), (result) => {
                                if (result.type !== CMSConfig.TYPE_ERROR) {
                                    this.success(this.getText('delete_file'), this.getText('del_file_success'));
                                    this.removeRecord(result);
                                }
                                else {
                                    this.error(this.getText('delete_file'), this.getText('del_file_unsuccess'));
                                }
                            });
                            dialog.hide();
                        });
                        dialog.setTitle('<i class="fa fa-times-circle-o red"></i> ' + this.getText('delete_file'));
                        dialog.show();
                        dialog.setData({uuid: record.uuid, folder: record.folder, file: 1});
                    }
                }]
            }],
            delay: 250
        });

        protected basicSearch = BasicSearch;

        // @ts-ignore
        constructor() {
            // @ts-ignore
            this.init();

            super();

            this.getGrid().on('selectionchange', (sm) => {
                this.selected = sm.getSelection();
            });

            this.getGrid().getQuickSearch().on('back', () => {
                this.hide();
                this.fireEvent('back', this);
            });

            this.getGrid().getQuickSearch().on('upload', () => {
                this.filesUpload.clear();
                this.form.INPUT_UPLOAD.trigger('click');
            });

            this.getGrid().getQuickSearch().on('select', () => {
                this.fireEvent('selected', this.selected, this);
            });

            this.form.INPUT_UPLOAD.on('change', (event: JQuery.Event) => {
                let files: FileList = (event.currentTarget as HTMLInputElement).files;
                if (files.length < 1) {
                    return;
                }
                for (let i = 0; i < files.length; i++) {
                    let file: File = files.item(i);
                    this.preUpload(file, i);
                }
                this.upload();
            });
        }

        init(): void {
            if (this.getEl().length <= 0) {
                throw new Error('#Asset Document > Element is not found with id {' + this.getId() +'}!');
            }
        }

        getId(): string {
            return this.id;
        }

        getEl(): JQuery<HTMLElement> {
            return $('#' + this.getId());
        }

        getFolder(): string {
            return this.getGrid().getQuickSearch().getFolder();
        }

        preUpload(item, index: number): void {
            let data = {
                uuid: iNet.generateId(),
                brief: item.name,
                size: item.size,
                created: new Date().getTime(),
                preview: true,
                index: index
            };
            item.id = data.uuid;
            this.filesUpload.put(data.uuid, data);
            this.insert(data);
        }

        upload(): void {
            if (this.filesUpload.size() > 0) {
                let idx = 0;
                // @ts-ignore
                this.filesUpload.each((key: string, file: any) => {
                    uploadSingle(idx, file, this.submitter, {
                        index: idx,
                        params: {
                            type: CMSConfig.ASSET_TYPE_DOCUMENT,
                            category: this.getFolder()
                        },
                        callback: (result, index) => {
                            if (result.type !== CMSConfig.TYPE_ERROR) {
                                let elements = result.elements || [];
                                if (elements.length > 0) {
                                    let item = elements[0];
                                    $('#' + file.id).prop('id', item.uuid);
                                    this.update(item);
                                    getProgressElByIndex(index).hide();
                                }
                            }
                        },
                        onProgress: (value, index) => {
                            console.log('progress index ', index, idx);
                            let progressBarEl = getProgressElByIndex(index);
                            progressBarEl.attr('aria-valuenow', value);
                            progressBarEl.css({width: value + '%'});
                            progressBarEl.find('.upload-' + index + '-percent').text(value);
                        },
                        onComplete: (e, index) => {
                            getProgressElByIndex(index).hide();
                        },
                        onError: (e, index) => {
                            console.log('error index ', index, idx, e);
                            getProgressElByIndex(index).hide();
                        }
                    });
                    idx++;
                });
            }
        }
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

    // export class
    iNet.ui.author.AssetDocuments = AssetDocuments;
});