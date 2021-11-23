/**
 * #PACKAGE: document
 * #MODULE: shared-list
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:29 31/10/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file SharedList.ts
 */
$(() => {
  class BasicSearch extends iNet.ui.grid.Search {
    protected id = 'edoc-basic-search';
    private url = iNet.getPUrl('admin/edoc/search');

    protected formSearch: any = {};

    constructor() {
      super();
    }

    intComponent() {
      this.inputSearch = this.getEl().find('.grid-search-input');
      this.formSearch = {

      };
    }

    getUrl () {
      return this.url;
    }

    setFolder(folder) {
      this.folder = folder;
    }

    getFolder(): string {
      if (this.folder) {
        return this.folder;
      }
      return this.assetFolder.getFirst();
    }

    getData () {
      return {
        pageSize: CMSConfig.PAGE_SIZE,
        pageNumber: 0,
        keyword: this.inputSearch.val() || '',
        type: 'PROMULGATE',
        public: true,
        draft: false
      };
    }
  }

  class SharedList extends iNet.ui.ListAbstract {
    protected id: string = 'edoc-shared-wg';
    protected module = 'document';
    protected resourceRoot = iNet.resources.cmsadmin;
    protected gridID = 'edoc-shared-list';
    protected remote = true;

    protected url = {
      list: iNet.getPUrl('admin/edoc/search')
    };

    private selected: Array<any> = [];
    private toolbar = {
      UN_PUBLISHED: $('#list-btn-unpublished')
    };

    protected dataSource = new iNet.ui.grid.DataSource({
      columns: [{
        type: 'selection',
        align: 'center',
        width: 30
      }, {
        property: 'signNumber',
        label: this.getText('sign_number'),
        type: 'label',
        width: 200
      }, {
        property: 'content',
        label: this.getText('content'),
        type: 'label'
      }, {
        property: 'promulgationDate',
        label: this.getText('promulgation_date'),
        sortable: true,
        type: 'text',
        width: 150,
        renderer: (v) => {
          // @ts-ignore
          return new Date(v).format(iNet.dateFormat);
        }
      }, {
        type: 'action',
        align: 'center',
        buttons: [{
          text: this.getText('unpublished'),
          icon: 'fa fa-times',
          labelCls: 'label label-warning',
          visibled: (record) => {
            return this.getSecurity().hasRoles([CMSConfig.ROLE_ADMIN, CMSConfig.ROLE_LEGAL_DOC]);
          },
          fn: (record) => {
            this.showUnPublishConfirm({
              uuid: record.uuid,
              authorUnitCode: record.authorUnitCode
            });
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

      this.toolbar.UN_PUBLISHED.on('click', () => {
        this.showUnPublishConfirm({
          ids: this.selected.map(item => item.uuid).join(CMSConfig.ARRAY_SEPARATOR)
        });
      });

      this.getGrid().on('selectionchange', (sm) => {
        this.selected = sm.getSelection();
        FormUtils.disableButton(this.toolbar.UN_PUBLISHED, !(this.selected.length > 0));
      });

      this.getGrid().on('click', (record) => {
        this.fireEvent('open', record, this);
      });
    }

    init() {}

    unPublish(params) {
      LegalDocumentAPI.shareEdoc(params, (result) => {
        if (result.type === CMSConfig.TYPE_ERROR)
          this.error(this.getText('unpublished'), this.getText('unpublished_error'));
        else {
          this.reload();
          this.success(this.getText('unpublished'), this.getText('unpublished_success'));
        }
      });
    }

    showUnPublishConfirm(unPublishData) {
      let _this = this;
      let dialog = this.confirmDlg(
          _this.getText('unpublished'),
          _this.getText('unpublished_confirm'), () => {
            let params = dialog.getData();
            params['shr_stt'] = false;
            _this.unPublish(params);
            dialog.hide();
          }
      );
      dialog.setTitle('<i class="fa fa-times-circle-o text-warning"></i> ' + _this.getText('unpublished'));
      dialog.setData(unPublishData);
      dialog.show();
    }
  }

  // export class
  iNet.ns('iNet.ui.document.SharedList');
  iNet.ui.document.SharedList = SharedList;
});