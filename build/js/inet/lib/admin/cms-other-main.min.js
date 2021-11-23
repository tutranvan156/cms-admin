/**
 * #PACKAGE: admin
 * #MODULE: cms-other-main
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 20:07 12/03/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file OtherMain.js
 */
$(function () {
  $.fn.modalmanager.defaults.resize = true;
  /**
   @type {iNet.ui.admin.OtherCategory}
  * */
  var listBox=new iNet.ui.admin.OtherCategory();
  listBox.show();
});
