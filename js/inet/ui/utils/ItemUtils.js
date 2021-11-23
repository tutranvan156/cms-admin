/**
 * #PACKAGE: utils
 * #MODULE: cms-items
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 09:09 30/10/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file ItemUtils.js
 */

var ItemUtils = {
  isCreated: function (item) {
    return item.status === CMSConfig.MODE_CREATED;
  },
  isPending: function (item) {
    return item.status !== CMSConfig.MODE_CREATED
        && item.status !== CMSConfig.MODE_INTERNAL
        && item.status !== CMSConfig.MODE_PUBLISHED;
  },
  isInternal: function (item) {
    return item.status === CMSConfig.MODE_INTERNAL;
  },
  isPublished: function (item) {
    return item.status === CMSConfig.MODE_PUBLISHED;
  }
};