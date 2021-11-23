/**
 * #PACKAGE: admin
 * #MODULE: cms-other-category
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 16:09 07/03/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file OtherCategory.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.OtherCategory
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.OtherCategory');
  iNet.ui.admin.OtherCategory = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'wg-other';
    this.$el = {
      category: $('#list-box-category')
    };
    iNet.ui.admin.OtherCategory.superclass.constructor.call(this);
    this.rendererListCategory();
  };
  iNet.extend(iNet.ui.admin.OtherCategory, iNet.ui.ListAbstract, {
    getPathImage: function (urlImg) {
      if (iNet.staticUrl.charAt(iNet.staticUrl.length - 1) !== '/') {
        return iNet.staticUrl + '/' + urlImg;
      } else {
        return iNet.staticUrl + urlImg;
      }
    },
    rendererListCategory: function () {
      var categories = [
        {
          title: 'Mẫu biểu - Tài liệu hướng dẫn',
          image: this.getPathImage("images/cmsadmin/other/kt-xh.jpg"),
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_SOCIOECONOMIC),
          categories: [
            {
              name: 'Chuyên mục',
              data_page: 'cmsadmin/page/admin/economy/data/category'
            }, {
              name: 'Số liệu thống kê',
              data_page: 'cmsadmin/page/admin/economy/data/content'
            }
          ]
        }, {
          title: 'Số liệu báo cáo',
          image: this.getPathImage("images/cmsadmin/other/report.jpg"),
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_SOCIOECONOMIC),
          categories: [
            {
              name: 'Chuyên mục',
              data_page: 'cmsadmin/page/admin/economy/report/category'
            }, {
              name: 'Báo cáo',
              data_page: 'cmsadmin/page/admin/economy/report/content'
            }
          ]
        },
        {
          title: 'Khiếu nại - Tố cáo',
          image: this.getPathImage("images/cmsadmin/other/complain.png"),
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_COMPLAIN),
          categories: [
            {
              name: 'Loại khiếu nại',
              data_page: 'cmsadmin/page/admin/complain-type'
            }, {
              name: 'Danh sách khiếu nại',
              data_page: 'cmsadmin/page/admin/complain'
            }
          ]
        },
        {
          title: 'Đường dây nóng',
          image: this.getPathImage("images/cmsadmin/other/hotline.jpg"),
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_FQA_REVIEWER),
          categories: [
            {
              name: 'Chuyên mục',
              data_page: 'cmsadmin/page/review/hotline-type'
            }, {
              name: 'Danh sách câu hỏi',
              data_page: 'cmsadmin/page/review/hotline'
            }
          ]
        },
        {
          title: 'Người dân góp ý',
          image: this.getPathImage("images/cmsadmin/other/mail.jpg"),
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_FQA_REVIEWER),
          categories: [
            {
              name: 'Loại góp ý',
              data_page: 'cmsadmin/page/review/feedback-type'
            }, {
              name: 'Danh sách góp ý',
              data_page: 'cmsadmin/page/review/feedback'
            }
          ]
        },
        {
          title: 'Hỏi đáp',
          image: this.getPathImage("images/cmsadmin/other/answer.jpg"),
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_FQA_REVIEWER),
          categories: [
            {
              name: 'Loại hỏi đáp',
              data_page: 'cmsadmin/page/author/fqa-category'
            }, {
              name: 'Danh sách hỏi đáp',
              data_page: 'cmsadmin/page/author/fqa'
            }
          ]
        },
        {
          title: 'Liên hệ',
          image: this.getPathImage("images/cmsadmin/other/contact.jpg"),
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_FQA_REVIEWER),
          categories: [
            {
              name: 'Danh sách',
              data_page: 'cmsadmin/page/review/contact'
            }
          ]
        },
        {
          title: 'Thu hồi, giao đất, cho thuê đất',
          image: this.getPathImage("images/cmsadmin/other/recall.png"),
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_LAND),
          categories: [
            {
              name: 'Hình thức',
              data_page: 'cmsadmin/page/admin/land/formality'
            }, {
              name: 'Danh sách',
              data_page: 'cmsadmin/page/admin/land/revocation'
            }
          ]
        },
        {
          title: 'Giá đất',
          image: this.getPathImage("images/cmsadmin/other/price.jpg"),
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_LAND),
          categories: [
            {
              name: 'Địa điểm, tuyến đường',
              data_page: 'cmsadmin/page/admin/land/route'
            }, {
              name: 'Giá đất theo tuyến đường',
              data_page: 'cmsadmin/page/admin/land/land-route'
            }, {
              name: 'Giá đất theo dự án',
              data_page: 'cmsadmin/page/admin/land/land-project'
            }
          ]
        },
        {
          title: 'Thu chi ngân sách',
          image: this.getPathImage("images/cmsadmin/other/collect.jpg"),
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_BUDGET),
          categories: [
            {
              name: 'Dự toán',
              data_page: 'cmsadmin/page/admin/estimated'
            }, {
              name: 'Tình hình thực hiện',
              data_page: 'cmsadmin/page/admin/execution'
            }
          ]
        },
        {
          title: 'Hộ nghèo',
          role: this.getSecurity().hasRoles(CMSConfig.ROLE_ADMIN) || this.getSecurity().hasRoles(CMSConfig.ROLE_POORHOUSE),
          image: this.getPathImage("images/cmsadmin/other/poor.jpg"),
          categories: [
            {
              name: 'Danh sách',
              data_page: 'cmsadmin/page/admin/poor-household'
            }
          ]
        },
        {
          title: 'Tố giác tội phạm',
          role:  this.getSecurity().hasRoles(CMSConfig.ROLE_DENOUNCECRIMINALS),
          image: this.getPathImage("images/cmsadmin/other/hotline.jpg"),
          categories: [
            {
              name: 'Danh sách',
              data_page: 'cmsadmin/page/review/denouncecriminals'
            }
          ]
        }
      ];
      var html = '';
      for (var i = 0; i < categories.length; i++) {
        if (categories[i].role) {
          var itemCateHtml = '<div class="col-md-4 col-sm-6">' +
              '<div class="card box-shadow">' +
              '<img class="card-img-top img-fluid border-bottom" src="' + categories[i].image + '" alt="' + categories[i].title + '">' +
              '<div class="card-body p-3">' +
              '<h4 class="card-title font-weight-bold">' + categories[i].title + '</h4>' +
              '<div class="text-sub text-muted">'
          for (var j = 0; j < categories[i].categories.length; j++) {
            var cateSub = categories[i].categories[j];
            itemCateHtml += '<p class="card-text pointer" data-page="' + cateSub.data_page + '">' + cateSub.name + '</p>'
          }
          itemCateHtml += '</div>' +
              '</div>' +
              '</div>' +
              '</div>'
          html += itemCateHtml;
        }
      }
      this.$el.category.append(html);
      this.$el.category.on('click', '.pointer', function () {
        var page = $(this).attr('data-page');
        window.location.href = iNet.getPUrl(page) + '?back=true';
      });
    }
  });
});
