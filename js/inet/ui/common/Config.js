// #PACKAGE: common
// #MODULE: config

//DEFAULT CONFIG
var checking = '';
iNet.dateFormat = 'd/m/Y';
iNet.fullDateFormat = 'H:i:s d/m/Y';
iNet.today = new Date();

var AppConfig = {
  TYPE_APP: 'APPLICATION',
  TYPE_THEME: 'THEME',
  TYPE_PLUGIN: 'PLUGIN',
  MODE_REVIEW: 'REVIEW',
  MODE_PUBLISHED: 'PUBLISHED',
  FIRM_MENU: '_SELF'
};

var PluginKey = {
  cateCMS: 'cateCMS',
  imgCMS: 'imgCMS',
  menuCMS: 'menuCMS',
  videoCMS: 'videoCMS',
  fileCMS: 'fileCMS'
};

var CMSConfig = {
  MODULE_NAME: iNet.resources.cmsadmin.title,
  VERSION: '4.1.0',
  BUILD_TIME: typeof buildTime === 'undefined' ? '181101.1200' : buildTime,
  PAGE_SIZE: 10,
  APPLICATION: 'marketplace',
  ARRAY_SEPARATOR: ';',
  TYPE_ERROR: 'ERROR',
  MODE_CREATED: 'CREATED',
  MODE_INTERNAL: 'INTERNAL',
  MODE_PUBLISHED: 'PUBLISHED',
  MODE_WORKFLOW: 'WORKFLOW',
  AD_PAGE_SERVICE: 'CMSAdminPage',
  ENTRY_PAGE_SERVICE: 'CMSEntryPage',
  NEWS_PAGE_SERVICE: 'CMSNewsPage',
  HOME_PAGE_SERVICE: 'CMSHomePage',
  CONTENT_PAGE_SERVICE: 'CMSContentPage',
  ROLE_SUB: 'sub',
  ROLE_ADMIN: 'admin',
  ROLE_SUP_ADMIN: 'sup_admin',
  ROLE_ANALYSIS: 'analysis',
  ROLE_WRITER: 'writer',
  ROLE_REVIEWER: 'item_review',
  ROLE_CMT_REVIEWER: 'cmt_review',
  ROLE_DIS_REVIEWER: 'discus_review',
  ROLE_FQA_REVIEWER: 'fqa_review',
  ROLE_LEGAL_DOC: 'legal_doc',
  ROLE_LAND: 'land',
  ROLE_COMPLAIN: 'complain',
  ROLE_POORHOUSE: 'poorhouse',
  ROLE_DENOUNCECRIMINALS: 'cms_denunciation',
  ROLE_BUDGET: 'budget',
  ROLE_ECONOMY: 'socioeconomic',
  ROLE_ORG_STRUCTURE: 'org_structure',
  VAL_INTERNAL: 'INTERNAL',
  VAL_EXTERNAL: 'EXTERNAL',
  ASSET_TYPE_IMAGE: 'IMAGE',
  ASSET_TYPE_DOCUMENT: 'DOCUMENT',
  ASSET_TYPE_OTHERS: 'OTHERS',
  ASSET_TYPE_VIDEO: 'VIDEO',
  GROUP_FQA: 'GROUP_FQA',
  GROUP_DENOUONCECRIMINALS: 'GROUP_DENOUONCECRIMINALS',
  GROUP_HOTLINE: 'GROUP_HOTLINE',
  GROUP_FEEDBACK: 'GROUP_FEEDBACK',
  GROUP_COMPLAIN: 'GROUP_KHIEUNAITOCAO',
  GROUP_CONTACT: 'GROUP_CONTACT',
  GROUP_LAND: 'GROUP_LAND',
  GROUP_LAND_TYPE: 'GROUP_LAND_TYPE',
  GROUP_POOR_HOUSEHOLD: 'GROUP_POOR_HOUSEHOLD',
  GROUP_ESTIMATED: 'ESTIMATED',
  GROUP_EXECUTION: 'EXECUTION',
  GROUP_ECONOMY_REPORT: 'ECONOMY_REPORT',
  GROUP_ECONOMY_DATA: 'ECONOMY_DATA',
  GROUP_LAND_ROUTE: 'LAND_ROUTE',
  GROUP_LAND_PROJECT: 'LAND_PROJECT',

  ACE_MODE: {
    JS: 'javascript',
    CSS: 'css',
    HTML: 'html'
  },

  EDITOR_TYPE: {
    TEXT_SM: 'str_',
    TEXT_LG: 'txt_',
    IMAGE: 'img_',
    VIDEO: 'video_',
    DOCUMENT: 'doc_',
    FILE: 'file_',
    LINK: 'lnk_'
  },

  TYPE_PAGE: {
    PAGE_CONTENT: 'CMSContentPage',
    PAGE_CATEGORY: 'CMSNewsPage',
    PAGE_HOME: 'CMSHomePage',
    PAGE_VIEW_ITEM: 'CMSEntryPage'
  }
};