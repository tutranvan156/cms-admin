/**
 * #PACKAGE: author
 * #MODULE: asset-types
 */

/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 15:16 25/09/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file AssetTypes.ts
 */

$(() => {
    class AssetTypes extends iNet.ui.WidgetExt {
        private id: string = 'type-wg';

        // @ts-ignore
        constructor() {
            // @ts-ignore
            this.getEl().on('click', (event: JQuery.Event) => {
                let thisEl = $(event.target);
                let parentEl = thisEl.closest('.media-type');
                let type: string = parentEl.attr('data-type');
                this.fireEvent('change', type, this);
            });
            super();
        }

        getEl() {
            return $('#' + this.id);
        }
    }

    // export class
    iNet.ui.author.AssetTypes = AssetTypes;
});
