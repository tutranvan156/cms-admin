/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         at 08:05 08/12/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file Constants
 */

export enum Pagnination {
    PAGE_SIZE = 10
}

export enum Roles {
    ROLE_ADMIN = 'admin',
    ROLE_SUP_ADMIN = 'sup_admin',
    ROLE_ANALYSIS = 'analysis',
    ROLE_WRITER = 'writer',
    ROLE_REVIEWER  = 'item_review',
    ROLE_CMT_REVIEWER = 'cmt_review',
    ROLE_DIS_REVIEWER = 'discus_review',
    ROLE_FQA_REVIEWER = 'fqa_review',
    ROLE_LEGAL_DOC = 'legal_doc',
    ROLE_LAND = 'land',
    ROLE_COMPLAIN = 'complain',
    ROLE_POORHOUSE = 'poorhouse',
    ROLE_DENOUNCECRIMINALS = 'cms_denunciation',
    ROLE_BUDGET = 'budget',
    ROLE_ECONOMY = 'socioeconomic',
    ROLE_ORG_STRUCTURE = 'org_structure'
}

export enum ItemStatus {
    CREATED,
    INTERNAL,
    WORKFLOW,
    PUBLISHED
}

export enum PageService {
    CMSAdminPage,
    CMSHomePage,
    CMSEntryPage,
    CMSNewsPage,
    CMSContentPage
}

export enum AssetType {
    IMAGE,
    DOCUMENT,
    VIDEO,
    OTHERS
}

export enum LinkType {
    INTERNAL,
    EXTERNAL
}

export enum FQAGroup {
    GROUP_FQA,
    GROUP_HOTLINE,
    GROUP_FEEDBACK,
    GROUP_KHIEUNAITOCAO,
    GROUP_CONTACT
}