/**
 * #PACKAGE: author
 * #MODULE: asset-mains
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 13:47 26/09/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file AssetMains.ts
 */
$(() => {
    class AssetMains {
        private types = new iNet.ui.author.AssetTypes();
        private images = null;
        private documents = null;

        private history = new iNet.ui.form.History({
            id: 'history-' + iNet.generateId(),
            root: this.types
        });

        constructor() {

            this.history.on('back', (widget) => {
                widget.show();
            });

            this.types.on('change', (type, clazz) => {
                switch (type) {
                    case CMSConfig.ASSET_TYPE_IMAGE:
                        this.loadImages(clazz);
                        break;
                    case CMSConfig.ASSET_TYPE_DOCUMENT:
                        this.loadDocuments(clazz);
                        break;
                }
            });
        }

        loadImages(parent) {
            if (!this.images) {
                this.images = new iNet.ui.author.AssetImages();
                this.images.on('back', () => {
                    this.history.back();
                });
            }
            if (parent) {
                this.images.setParent(parent);
                parent.hide();
            }
            this.history.push(this.images);
            this.images.passRoles(parent);
            this.images.show();
            return this.images;
        }

        loadDocuments(parent) {
            if (!this.documents) {
                this.documents = new iNet.ui.author.AssetDocuments();
                this.documents.on('back', () => {
                    this.history.back();
                });
            }
            if (parent) {
                this.documents.setParent(parent);
                parent.hide();
            }
            this.history.push(this.documents);
            this.documents.passRoles(parent);
            this.documents.show();
            return this.documents;
        }
    }

    // export class
    new AssetMains();
});