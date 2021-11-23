// #PACKAGE: form
// #MODULE: cms-select-user-popover
$(function () {
  iNet.ns('iNet.ui.form.SelectUserPopover');
  iNet.ui.form.SelectUserPopover = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);// apply configuration
    iNet.ui.form.SelectUserPopover.superclass.constructor.call(this);
    this.id = this.id || 'user-select-members';
    this.resourceRoot = this.resourceRoot || iNet.resources.cmsadmin;
    this.title = this.title || this.getText('add_person', 'user');
    this.linkTitle = this.linkTitle || this.getText('add_person', 'user');
    this.placement = this.placement || 'top';
    this.url = this.url || iNet.getUrl('cmsfirm/member/list');
    if(this.placement==='auto') {
      this.placement = 'bottom';
    }
    this.singleSelect = !iNet.isEmpty(this.singleSelect) ? this.singleSelect : false;
    this.hideGroup = !iNet.isEmpty(this.hideGroup) ? this.hideGroup : false;
    this.initComponent();
    var me = this;
    var $el = this.getEl();
    this.$userInputContainer = $el.find('.user-box-input-container');
    this.$userInput = $el.find('input.user-box-input');
    this.$userItemContainer = $el.find('.user-box-item-container');
    this.$userWrap = $el.find('.user-box-wrap');
    this.$addLink = $el.find('a.user-box-link');
    this.companyLoaded = false;
    this.groupLoaded = false;
    this.departmentLoaded = false;

    this.$userInput.on('keydown', function (e) {
      var code = (e.keyCode ? e.keyCode : e.which);
      if (code === 13) { //Enter keycode
        me.getEl().find('a.user-box-group-item:visible:first').trigger('click');
        me.$userInput.val('').trigger('change');
        return false;
      } else if (code === 8 && iNet.isEmpty(me.$userInput.val())) { //Backspace keycode
        me.getEl().find('.user-box-item:last').find('a').trigger('click');
        me.$userInput.trigger('change');
        return false;
      }
    }.createDelegate(this));

    this.$userInput.on("blur", function (e) {
      e.stopPropagation();
      $(this).val('');
    });
    this.$userInput.on("focus", function (e) {
      e.stopPropagation();
      if (me.$userInputContainer.is(':hidden')) {
        me.$userInputContainer.show();
        me.getPopover().popover('show');
      }
    });

    this.$addLink.on('click', function (e) {
      e.stopPropagation();
      $(this).hide();
      me.$userInputContainer.show();
      me.getPopover().popover('show');
      me.focus();
    });

    this.$userItemContainer.on('click', 'a', function (e) {//remove user item
      e.stopPropagation();
      me.removeItem($(this).parent());
    });

    this.$popover = this.$userWrap.popover({
      html: true,
      title: String.format('<i class="icon-user"></i> <b>{0}</b> <a class="close" href="javascript:;">&times;</a>', this.getTitle()),
      placement: this.placement,
      content: function () {
        var __html = '<div>';
        __html += '<div class="user-box-tabs hide">';
        __html += String.format('<a href="javascript:;" data-type="company" class="user-box-tab user-box-tab-selected"><span class="user-box-tab-text">{0}</span></a>', me.getText('company', 'user'));
        __html += String.format('<a href="javascript:;" data-type="group" class="user-box-tab"><span class="user-box-tab-text">{0}</span></a>', me.getText('my_group', 'user'));
        __html +=  String.format('<a href="javascript:;" data-type="department" class="user-box-tab"><span class="user-box-tab-text">{0}</span></a>', me.getText('employees_department', 'user'));
        __html += '</div>';
        __html += '<div class="user-box-box-tabs-content">';
        __html += '<div class="user-box-group" style="border-top-color: #fff !important;">';
        __html += '<div data-role="company">';
        __html += '</div>';
        __html += '<div data-role="group" style="display: none;">';
        __html += '</div>';
        __html += '<div data-role="department" style="display: none;">';
        __html += '</div>';
        __html += '</div>';
        __html += '</div>';
        __html += '</div>';
        return __html;
      }
    });

    this.getPopover().on('shown.bs.popover', function () {
      me.$addLink.hide(); //if user not exists
      me.$userInputContainer.show();
      me.focus();
      me.loadCompanyMember();
    });

    this.getPopover().on('hidden.bs.popover', function () {
      me.companyLoaded = false;
      me.groupLoaded = false;
      me.departmentLoaded = false;
      me.$userInput.off('change input');
      me.$userInputContainer.hide();
      me.$addLink.show();
      me.fireEvent('change', me.getData());
    });

    this.getEl().on('click', 'a.user-box-tab', function (e) {
      e.stopPropagation();
      var $tab = $(this);
      var __type = $tab.attr('data-type');
      switch (__type) {
        case 'company':
          break;
        case 'group':
          me.loadSocialMember();
          break;
        case 'department':
          me.loadDepartementMember();
          break;
      }

      me.getEl().find(String.format('.user-box-group>div[data-role]:visible')).hide();
      me.getEl().find(String.format('.user-box-group>div[data-role="{0}"]', __type)).show();
      me.getEl().find('.user-box-tab-selected').removeClass('user-box-tab-selected');
      $tab.addClass('user-box-tab-selected');
      me.focus();
    });

    this.getEl().on('click', 'a.close', function (e) {
      e.stopPropagation();
      me.hidePopover();
    });

    this.getEl().on('click', 'a.user-box-tab', function (e) {
      e.stopPropagation();
    });

    this.getEl().on('click', 'a.user-box-group-item', function (e) { //select or unselect on popover
      e.stopPropagation();
      var $item = $(this);
      var __user = $item.data('data') || {};
      if ($item.hasClass('user-box-group-item-selected')) {
        if (__user.group==="ALL") {
          me.removeItemById('all');
        } else {
          me.removeItemById(__user.username);
        }
      } else {
        me.addItemToList(__user);
        me.focus();
      }
    });

    $(document).on('mouseup', function(e){
      if (me.getEl().has(e.target).length === 0){
        me.hidePopover();
      }
    });
  };
  iNet.extend(iNet.ui.form.SelectUserPopover, iNet.ui.WidgetExt, {
    initComponent: function () {
      var __html = '<div class="user-box-wrap">';
      __html += '<span class="user-box-item-container">';
      __html += '</span>';
      __html += '<span class="user-box-input-container" style="display: none;">';
      __html += '<input type="text" value="" class="user-box-input" style="box-shadow: none !important;">';
      __html += '</span>';
      if (!this.singleSelect) {
        __html += String.format('<a href="javascript:;" class="user-box-link" style="display: inline-block;">+ {0}</a>', this.linkTitle);
      }
      __html += '</div>';
      this.getEl().html(__html);
    },
    getTitle: function () {
      return this.title;
    },
    getEl: function () {
      return $.getCmp(this.id);
    },
    getPopover: function () {
      return this.$popover;
    },
    hidePopover: function(){
      this.getEl().find('.popover').hide();
      this.getPopover().popover('hide');
    },
    focus: function () {
      this.$userInput.val('').trigger('change');
      this.$userInput.focus();
    },
    addItemToList: function (item) {
      var __item = item || {};
      var __html = '';
      if (this.singleSelect) {
        this.resetData();
      }
      if (__item.group === 'ALL') {
        if (this.$userItemContainer.find('.user-box-item[data-uuid="all"]').length > 0) {
          return;
        }
        __html = String.format('<span data-uuid="{0}" class="user-box-item user-box-all-users">', 'all');
        __html += String.format('<span class="user-box-item-text">{0}</span>', this.getText('all_employees', 'user'));
        __html += '<a href="javascript:;"><i class="icon-remove"></i></a></span>';

      } else {
        if (this.$userItemContainer.find(String.format('.user-box-item[data-uuid="{0}"]', __item.username)).length > 0) {
          return;
        }
        __html = String.format('<span data-uuid="{0}" class="user-box-item user-box-item-users">', __item.username);
        __html += String.format('<span class="user-box-item-text">{0}</span>', __item.fullname);
        __html += '<a href="javascript:;"><i class="icon-remove"></i></a></span>';
      }
      if (!iNet.isEmpty(__html)) {
        var $el = $(__html);
        $el.data('data', __item);
        this.getElementItemById(__item.username).addClass('user-box-group-item-selected');

        this.$userItemContainer.append($el);
        this.fireEvent('add', __item);
      }
      this._checkExist();
    },
    /**
     * Remove a Item form id
     */
    removeItemById: function (uuid) {
      var $el = this.$userItemContainer.find(String.format('[data-uuid="{0}"]', uuid));
      this.removeItem($el);
    },
    /**
     * Remove a Item form SelectUserPopover
     */
    removeItem: function ($item) {
      var __data = $item.data('data') || {};
      this.getElementItemById(__data.username).removeClass('user-box-group-item-selected');
      this.fireEvent('remove', __data);
      $item.remove();
      this._checkExist();
    },
    /**
     * Returns the all items of Box
     */
    getItems: function () {
      return this.getEl().find('.user-box-item');
    },
    /**
     * Returns the Element Group of popover
     */
    getElementGroupByType: function (type) {
      var $wrap = this.getEl().find(String.format('.user-box-group>div[data-role="{0}"]', type));
      return $wrap;
    },
    /**
     * Returns the Elements Item of Popover
     */
    getElementItemById: function (id) {
      return this.getEl().find(String.format('a.user-box-group-item[data-id="{0}"]', id));
    },
    setCompanyMember: function (v) {
      this._companyMembers = v || [];
    },
    getCompanyMember: function () {
      return this._companyMembers || [];
    },
    _createUserItem: function (item) {
      var __item = item || {};
      var __url = iNet.getPUrl('system/userprofile/photo') + '?thumbnail=28&usercode=' + __item.username;
      var __cls = this.hasSelectById(__item.username) ? 'user-box-group-item-selected' : '';
      var __html = String.format('<a data-id="{0}" class="user-box-group-item {1}" href="javascript:;"><div class="user-item">', __item.username, __cls);
      __html += String.format('<div class="hide">{0}</div>', __item.username);
      __html += '<div class="user-box-group-item-avatar">';
      __html += String.format('<img class="user-box-group-item-img" style="background-image:url({0})">', __url);
      __html += '</div>';
      __html += String.format('<div class="user-box-group-item-info"><div class="user-box-group-item-name" title="{0}">{0}</div></div>', __item.fullname);
      __html += '</div></a>';

      var $el = $(__html).data('data', __item);
      return $el;
    },
    setParams: function (params) {
      this.params = params;
    },
    getParams: function () {
      return this.params || {prefix: (iNet.firmPrefix || '')};
    },
    convertData: function (data) {
      var __result = data || {};
      var __items = [];
      (__result.items || []).forEach(function (item) {
        if (!item.username && item.member)
          item.username = item.member;

        if (iNet.isEmail(item.username)) {
          __items.push(item);
        }
      });
      return __items;
    },
    loadCompanyMember: function () {
      var me = this;
      if (this.companyLoaded) {
        return;
      }
      $.getJSON(this.url, this.getParams(), function (result) {
        var __users = me.convertData(result);
        me.setCompanyMember(__users);
        var $wrap = me.getElementGroupByType('company');
        $wrap.empty();
        $wrap.append(String.format('<span class="user-box-group-name hide">{0}:</span>', me.getText('people', 'user')));
        var $group = $('<span class="user-box-group-content"></span>');

        if(!me.hideGroup) {
          var __allEl = String.format('<a class="user-box-group-item" href="javascript:;"><div class="user-item">');
          __allEl += '<div class="user-box-group-item-avatar">';
          __allEl += String.format('<img class="user-box-group-item-img">');
          __allEl += '</div>';
          __allEl += String.format('<div class="user-box-group-item-info"><div class="user-box-group-item-name user-box-group-item-all">{0}</div></div>', me.getText('all_employees', 'user'));
          __allEl += '</div></a>';
          var $all = $(__allEl);
          $all.data('data', {group: 'ALL' , items: __users});
          $group.append($all);
        }
        for (var i = 0; i < __users.length; i++) {
          var __item = __users[i] || {};
          var $el = me._createUserItem(__item);
          $group.append($el);
        }

        $wrap.append($group);

        $wrap.searchable({
          searchField: 'input.user-box-input',
          selector: '.user-box-group-item',
          childSelector: '.user-item',
          hide: function (elem) {
            elem.fadeOut(50);
          },
          show: function (elem) {
            elem.fadeIn(50);
          },
          onSearchEmpty: function( elem ) {

          },
          clearOnLoad: true
        });
        me.companyLoaded = true;
      });

    },
    loadSocialMember: function () {
      var me = this;
      if (this.groupLoaded) {
        return;
      }
      $.getJSON(iNet.getPUrl('social/member/list'), function (result) {
        var __result = result || {};
        var __users = __result.items || [];
        var $wrap = me.getElementGroupByType('group');
        $wrap.empty();
        var $group = null, $groupContainer = null;

        for (var i = 0; i < __users.length; i++) {
          var __item = __users[i] || {};
          __item.username = __item.usercode;
          var $el = me._createUserItem(__item);
          $groupContainer = $wrap.find(String.format('[data-category="{0}"]', __item.category));
          if ($groupContainer.length < 1) {
            $groupContainer = $(String.format('<div data-category="{0}"></div>', __item.category));
            $groupContainer.append(String.format('<span class="user-box-group-name">{0}:</span>', __item.category));
            $group = $('<span class="user-box-group-content"></span>');
            $group.append($el);
            $groupContainer.append($group);
            $wrap.append($groupContainer);
          } else {
            $group = $groupContainer.find('.user-box-group-content');
            $group.append($el);
          }
        }
        $wrap.searchable({
          searchField: 'input.user-box-input',
          selector: '.user-box-group-item',
          childSelector: '.user-item',
          hide: function (elem) {
            elem.fadeOut(50);
          },
          show: function (elem) {
            elem.fadeIn(50);
          },
          onSearchEmpty: function( elem ) {

          },
          clearOnLoad: true
        });
        me.groupLoaded = true;
      });
    },
    loadDepartementMember: function () {
      var me = this;
      if (this.departmentLoaded) {
        return;
      }
      $.getJSON(iNet.getUrl('system/department/list'), function (result) {
        var __result = result || {};
        var __depts = __result.items || [];
        var $wrap = me.getElementGroupByType('department');
        $wrap.empty();
        for (var i = 0; i < __depts.length; i++) {
          var __dept = __depts[i] || {};
          var __html = String.format('<div data-category="{0}">', __dept.uuid);
          __html += String.format('<span class="user-box-group-name">{0}:</span>', __dept.description || __dept.name);
          __html += '<span class="user-box-group-content"></span></div>';
          $wrap.append(__html);
        }
        var __users = me.getCompanyMember();
        for (var j = 0; j < __users.length; j++) {
          var __item = __users[j] || {};
          var __userDepts = __item.departments || [];
          var $el = me._createUserItem(__item);
          for (var k = 0; k < __userDepts.length; k++) {
            var $container = $wrap.find(String.format('[data-category="{0}"]', __userDepts[k]));
            //console.log(__userDepts[k] ,$container.find('.user-box-group-name').text());
            if ($container.length > 0) {
              var $group = $container.find('.user-box-group-content');
              $group.append($el.clone().data('data', __item));
            }
          }
          $el.remove();
        }
        $wrap.searchable({
          searchField: 'input.user-box-input',
          selector: '.user-box-group-item',
          childSelector: '.user-item',
          hide: function (elem) {
            elem.fadeOut(50);
          },
          show: function (elem) {
            elem.fadeIn(50);
          },
          onSearchEmpty: function( elem ) {

          },
          clearOnLoad: true
        });
        me.departmentLoaded = true;
      });
    },
    _checkExist: function () {
      if (this.getItems().length > 0) {
        this.$addLink.text('+ '+ this.getText('add_more', 'user'));
      } else {
        this.$addLink.text('+ ' + this.linkTitle);
      }
    },
    resetData: function () {
      this.hidePopover();
      this.$userItemContainer.empty();
      this._checkExist();
    },
    clear: function () {
      this.$userItemContainer.empty();
      this._checkExist();
    },
    getData: function () {
      var $items = this.$userItemContainer.find('.user-box-item');
      var datas = [];
      for (var i = 0; i < $items.length; i++) {
        var $item = $($items[i]);
        var __data = $item.data('data');
        datas.push($item.data('data'));
      }
      return datas;
    },
    hasSelectById: function (id) {
      return this.getMembers().indexOf(id) > -1;
    },
    getOwnerData: function () {
      return this.ownerData || [];
    },
    setData: function (data) {
      var __items = [];
      if (!iNet.isObject(data)) {
        return;
      }
      if (iNet.isArray(data)) {
        __items = data || []
      } else {
        __items = [data];
      }
      this.ownerData = __items;
      for (var i = 0; i < __items.length; i++) {
        var __item = __items[i] || {};
        this.addItemToList(__item);
      }
    },
    getMembers: function () {
      var __items = this.getData();
      var __members = [];
      for (var i = 0; i < __items.length; i++) {
        var __item = __items[i] || {};
        __members.push(__item.username);
      }
      return __members;
    }
  });
});
