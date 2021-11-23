/**
 * #PACKAGE: admin
 * #MODULE: image-content-list
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:41 13/05/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file ImageContentList.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.ImageContentList
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.ImageContentList');
  iNet.ui.admin.ImageContentList = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || 'wg-list-image-media';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.module = 'layout';
    this.gridID = 'list-business';
    this.firstLoad = false;
    this.remote = false;
    //start video embed
    var addbuttons = true;
    var players = plyr.setup(".js-player");
    this.target = ".js-player";
    this.limit = 30;
    this.$toolbar = {
      BACK: $('#list-image-btn-back')
    };
    this.$form = {
      content: $('#list-image-media-group'),
      player: $('#content-player')
    };
    this.url = {
      list: iNet.getPUrl('cms/asset/list'),
      view_image: iNet.getPUrl('cms/asset/photoview'),
      view: iNet.getPUrl('cms/asset/download'),
      view_video: iNet.getPUrl('cms/asset/videoview')
    };
    this.loadPlaylist = function (target, limit, myPlaylist) {
      $("li.pls-playing").removeClass("pls-playing");
      $(".plyr-playlist-wrapper").remove();

      limit = limit - 1;

      if (myPlaylist) {

        PlyrPlaylist(".plyr-playlist", myPlaylist, limit);
        //return
      }


      function PlyrPlaylist(target, myPlaylist, limit) {
        $('<div class="plyr-playlist-wrapper"><ul class="plyr-playlist"></ul></div>').insertAfter("#player");


        var playingclass = "";
        var items = [];
        $.each(myPlaylist, function (id, val) {
          if (0 === id) playingclass = "pls-playing";
          else playingclass = "";
          items.push(
              '<li class="' + playingclass + '"><a href="#" data-type="' + val.sources[0].type + '" data-video-id="' + val.sources[0].src + '"><img class="plyr-miniposter" src="' + val.poster + '"> ' +
              val.title + " - " + val.author + "</a></li> ");

          if (id == limit)
            return false;

        });
        $(target).html(items.join(""));
        setTimeout(function () {
        }, 500);


      }

      players[0].on("ready", function (event) {
        players[0].play();
        if (addbuttons) {
          $(".plyr-playlist .pls-playing").find("a").trigger("click");

          $('<button type="button" class="plyr-prev"><i class="fa fa-step-backward fa-lg"></i></button>').insertBefore('.plyr__controls [data-plyr="play"]');

          $('<button type="button" class="plyr-next"><i class="fa fa-step-forward fa-lg"></i></button>').insertAfter('.plyr__controls [data-plyr="pause"]');
          addbuttons = false;
        }

      })
      $(document).on("click", "ul.plyr-playlist li a", function (event) {
        event.preventDefault();

        $("li.pls-playing").removeClass("pls-playing");
        $(this)
            .parent()
            .addClass("pls-playing");

        var video_id = $(this).data("video-id");
        var video_type = $(this).data("type");
        players[0].source({
          type: "video",
          title: "video_title",
          sources: [{src: video_id, type: video_type}]
        });
        $(".plyr-playlist").scrollTo(".pls-playing", 300);
      })
    }

    $.fn.scrollTo = function (elem, speed, margin) {
      $(this).animate(
          {
            scrollTop:
                $(this).scrollTop() -
                $(this).offset().top +
                $(elem).offset().top
          },
          speed == undefined ? 1000 : speed
      );
      return this;
    };
    _this.$grid = $(String.format('#{0}', this.gridID));

    function checkPdfFile(name) {
      var file_type = name.substr(name.lastIndexOf('.')).toLowerCase();
      if (file_type === '.pdf') {
        return true;
      }
      return false;
    }

    this.initGrid = function () {
      _this.dataSource = new iNet.ui.grid.DataSource({
        columns: [
          {
            property: 'description',
            label: 'Mô tả',
            type: 'text',
            sortable: true
          }, {
            property: 'brief',
            label: 'Tên',
            type: 'text',
            sortable: true
          }, {
            property: 'size',
            label: 'Dung lượng',
            type: 'text',
            sortable: true,
            width: 120,
            renderer: function (v) {
              return v / 1024 + ' KB';
            }
          }, {
            property: 'position',
            label: 'Thứ tự',
            type: 'text',
            sortable: true,
            width: 80
          }, {
            property: 'created',
            label: 'Ngày tải lên',
            type: 'text',
            sortable: true,
            width: 120,
            renderer: function (v) {
              return new Date(v).format('d/m/Y');
            }
          }, {
            label: '',
            type: 'action',
            width: 60,
            align: 'center',
            buttons: [{
              text: iNet.resources.message.button.del,
              icon: 'fa fa-eye',
              labelCls: 'label label-primary',
              fn: function (record) {
                window.open(_this.url.view + '?code=' + record.code + '&view=pdf', '_blank');
              },
              visibled: function (record) {
                return checkPdfFile(record.brief);
              }
            }]
          }
        ],
        delay: 250
      });
      var convertData = function (data) {
        _this.grid.setTotal(data.total);
        return data.items;
      };
      _this.convertData = _this.convertData || convertData;


      iNet.ui.admin.BasicSearch = function () {
        this.url = _this.url.list;
        this.id = 'list-basic-business-search';
        iNet.ui.admin.BasicSearch.superclass.constructor.call(this);
      };
      iNet.extend(iNet.ui.admin.BasicSearch, iNet.ui.grid.AbstractSearchForm, {
        intComponent: function () {
          this.inputSearch = this.getEl().find('.grid-search-input');
          this.btnSearch = this.getEl().find('.grid-search-btn');
        },
        getId: function () {
          return this.id;
        },
        getUrl: function () {
          return _this.url.list;
        },
        getData: function () {
          return {
            type: _this.getType(),
            category: _this.getCategory(),
            order: '-created',
            pageSize: 0,
            pageNumber: 0
          }
        }
      });

      _this.grid = new iNet.ui.grid.Grid({
        id: _this.$grid.prop('id'),
        url: _this.url.list,
        dataSource: _this.dataSource,
        basicSearch: iNet.ui.admin.BasicSearch,
        convertData: _this.convertData,
        stretchHeight: false,
        params: _this.getParams(),
        remotePaging: _this.remote,
        firstLoad: _this.firstLoad,
        editable: false,
        idProperty: 'uuid'
      });
    };

    //embed end


    iNet.ui.admin.ImageContentList.superclass.constructor.call(this);
    this.$toolbar.BACK.click(function () {
      _this.hide();
      _this.fireEvent('back');
      if (_this.getType() === CMSConfig.ASSET_TYPE_VIDEO) {
        players[0].pause();
        _this.$form.player.hide();
      } else if (_this.getType() === CMSConfig.ASSET_TYPE_IMAGE) {
        _this.$form.content.html('');
      } else {
        _this.$grid.hide();
      }

    });
  };
  iNet.extend(iNet.ui.admin.ImageContentList, iNet.ui.ViewWidget, {
    loadGrid: function () {
      this.initGrid();
      this.$grid.show();
      this.grid.load();
    },
    setType: function (type) {
      this.type = type;
    },
    getType: function () {
      return this.type || '';
    },
    setCategory: function (category) {
      this.category = category;
    },
    getCategory: function () {
      return this.category || '';
    },
    renderHtmlImage: function () {
      var _this = this;
      this.listImageCategory(function (data) {
        if (data.type !== CMSConfig.TYPE_ERROR) {
          var items = data.items || [];
          var length = items.length;
          var html = '';
          for (var i = 0; i < length; i++) {
            html += iNet.Template.parse('list-image-tpl', {
              src: _this.url.view_image + '?code=' + items[i].code
            });
          }
          _this.$form.content.html(html);
        }
      });
    },
    runVideoEmbed: function () {
      var _this = this;
      this.listImageCategory(function (data) {
        if (data.type !== CMSConfig.TYPE_ERROR) {
          var items = data.items || [];
          var length = items.length;
          var myPlaylist = [];
          for (var i = 0; i < length; i++) {
            myPlaylist.push({
              type: 'video/mp4',
              title: items[i].description || items[i].brief,
              author: iNet.logged,
              sources: [{
                src: _this.url.view_video + '?code=' + items[i].code,
                type: 'video/mp4'
              }],
              src: _this.url.view_video + '?code=' + items[i].code,
              poster: 'https://img.youtube.com/vi/nfs8NYg7yQM/hqdefault.jpg'
            });
          }
          _this.loadPlaylist(_this.target, _this.limit, myPlaylist);
          _this.$form.player.show();
        }
      });
    },
    getParams: function () {
      return {
        type: this.getType(),
        category: this.getCategory(),
        order: '-created',
        pageSize: 0,
        pageNumber: 0
      };
    },
    listImageCategory: function (callback) {
      $.getJSON(this.url.list, this.getParams(), function (data) {
        callback && callback(data);
      }, {
        mask: this.getMask(),
        msg: iNet.resources.ajaxLoading.saving
      });
    }
  });
});
