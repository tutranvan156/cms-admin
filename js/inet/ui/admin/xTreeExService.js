/**
 * Copyright (c) 2014 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 25/12/2014.
 * -------------------------------------------
 * @project cms-admin
 * @file xTreeExService
 * @author nbchicong
 */

$(function () {
  var $listFolder = $('#media-explorer--list-folder');
  var iconDefaultCls = 'xtree-icon';
  var data = {}, folder = {};
  var tree_data_2 = {
    pictures: {
      id: iNet.generateId(),
      name: 'Pictures',
      type: 'folder',
      iconCls: 'red',
      additionalParameters: {
        children: {
          wallpapers: {
            id: iNet.generateId(),
            name: 'Wallpapers',
            type: 'folder',
            iconCls: 'pink',
            additionalParameters: {
              children : [
                {id: iNet.generateId(), name: 'wallpaper1.jpg', type: 'item', iconCls: iconDefaultCls+' fa fa-file green'},
                {id: iNet.generateId(), name: 'wallpaper2.jpg', type: 'item', iconCls: iconDefaultCls+' fa fa-file green'},
                {id: iNet.generateId(), name: 'wallpaper3.jpg', type: 'item', iconCls: iconDefaultCls+' fa fa-file green'},
                {id: iNet.generateId(), name: 'wallpaper4.jpg', type: 'item', iconCls: iconDefaultCls+' fa fa-file green'}
              ]
            }
          },
          camera: {
            id: 'photoslist',
            name: 'Camera',
            type: 'folder',
            iconCls: 'pink',
            additionalParameters: {
              children : [
                {id: iNet.generateId(), name: 'photo1.jpg', type: 'item', iconCls: iconDefaultCls+' fa fa-picture-o green'},
                {id: iNet.generateId(), name: 'photo2.jpg', type: 'item', iconCls: iconDefaultCls+' fa fa-picture-o green'},
                {id: iNet.generateId(), name: 'photo3.jpg', type: 'item', iconCls: iconDefaultCls+' fa fa-picture-o green'},
                {id: iNet.generateId(), name: 'photo4.jpg', type: 'item', iconCls: iconDefaultCls+' fa fa-picture-o green'},
                {id: iNet.generateId(), name: 'photo5.jpg', type: 'item', iconCls: iconDefaultCls+' fa fa-picture-o green'},
                {id: iNet.generateId(), name: 'photo6.jpg', type: 'item', iconCls: iconDefaultCls+' fa fa-picture-o green'}
              ]
            }
          }
        }
      }
    },
    music: {
      id: iNet.generateId(),
      name: 'Music',
      type: 'folder',
      iconCls: 'orange',
      additionalParameters: {
        children : [
          {
            wallpapers: {
              id: iNet.generateId(),
              name: 'Wallpapers',
              type: 'folder',
              iconCls: 'pink',
              additionalParameters: {
                children: [
                  {
                    id: iNet.generateId(),
                    name: 'wallpaper1.jpg',
                    type: 'item',
                    iconCls: iconDefaultCls + ' fa fa-file green'
                  },
                  {
                    id: iNet.generateId(),
                    name: 'wallpaper2.jpg',
                    type: 'item',
                    iconCls: iconDefaultCls + ' fa fa-file green'
                  },
                  {
                    id: iNet.generateId(),
                    name: 'wallpaper3.jpg',
                    type: 'item',
                    iconCls: iconDefaultCls + ' fa fa-file green'
                  },
                  {
                    id: iNet.generateId(),
                    name: 'wallpaper4.jpg',
                    type: 'item',
                    iconCls: iconDefaultCls + ' fa fa-file green'
                  }
                ]
              }
            }
          },
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-music blue"></i> song1.ogg', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-music blue"></i> song2.ogg', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-music blue"></i> song3.ogg', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-music blue"></i> song4.ogg', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-music blue"></i> song5.ogg', type: 'item'}
        ]
      }
    },
    video: {
      id: iNet.generateId(),
      name: 'Video',
      type: 'folder',
      iconCls: 'blue',
      additionalParameters: {
        children : [
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-film blue"></i> movie1.avi', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-film blue"></i> movie2.avi', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-film blue"></i> movie3.avi', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-film blue"></i> movie4.avi', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-film blue"></i> movie5.avi', type: 'item'}
        ]
      }
    },
    documents: {
      id: iNet.generateId(),
      name: 'Documents',
      type: 'folder',
      iconCls: 'green',
      additionalParameters: {
        children : [
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-file-text red"></i> document1.pdf', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-file-text grey"></i> document2.doc', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-file-text grey"></i> document3.doc', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-file-text red"></i> document4.pdf', type: 'item'},
          {id: iNet.generateId(), name: '<i class="'+iconDefaultCls+' fa fa-file-text grey"></i> document5.doc', type: 'item'}
        ]
      }
    },
    readme: {id: iNet.generateId(), name: '<i class="' + iconDefaultCls + ' fa fa-file-text grey"></i> ReadMe.txt', type: 'item'},
    manual: {id: iNet.generateId(), name: '<i class="' + iconDefaultCls + ' fa fa-book blue"></i> Manual.html', type: 'item'}
  };
  var treeDataSource2 = new DataSourceTree({data: tree_data_2});
  var convertPathToFolder = function (path, parent) {
    var pathAr = path.split('/');
    var __tmp = {
      parent: parent.name,
      path: (iNet.isDefined(parent.path)?parent.path+'/':'/')+pathAr[1],
      id: pathAr[1]+iNet.generateId(),
      name: pathAr[1],
      type: 'folder',
      iconCls: 'blue',
      additionalParameters: {
        children: {}
      }
    };
    var __folder = iNet.isDefined(parent)?parent:folder;
    if(__folder.hasOwnProperty('additionalParameters')){
      __folder = __folder.additionalParameters.children;
    }
    if(!iNet.isDefined(__folder[pathAr[1]])){
      __folder[pathAr[1]] = {};
      __folder[pathAr[1]] = __tmp;
    }
    if(pathAr.length>2){
      var childPath = '/';
      for (var i=2; i<pathAr.length; i++){
        childPath += (i==pathAr.length-1)?pathAr[i]:pathAr[i]+'/';
      }
      convertPathToFolder(childPath, __folder[pathAr[1]]);
    }
  };
  var convertListFile = function (listFile, parent) {
    console.log(listFile, parent);
    var list = [];
    for (var i=0; i<listFile.length; i++){
      list.push({
            id: listFile[i].uuid,
            name: listFile[i].name,
            type: 'item',
            iconCls: iconDefaultCls+' fa fa-file green'}
      );
    }
    if(parent.hasOwnProperty('additionalParameters')){
      parent.additionalParameters.children = list;
    }
  };
  var excTree = function () {
    $('#col-list-folder').height($(window).height());
    $listFolder.on('loaded', function () {
      //$('#col-list-folder').perfectScrollbar();
    }).on('updated', function (e, result) {
      console.log(result);
    }).on('selected', function (e, result) {
      console.log(result);
    }).on('unselected', function (e, result) {
      console.log(result);
    }).on('opened', function (e, result, el, callback) {
      if(iNet.isFunction(callback)){
        if(!iNet.isDefined(result.parent)){
          var w = $listFolder.width();
          //$listFolder.css({width: w+5+'px'});
          $.postJSON(iNet.getPUrl('system/resimages/folder'), {module: result.name}, function (folderData) {
            var data = result;
            for (var i=0; i<folderData.items.length; i++){
              convertPathToFolder(folderData.items[i].path, data);
            }
            el.data(data);
            callback(el);
            //$('#col-list-folder').perfectScrollbar('update');
          });
        }else{
          //$.postJSON(iNet.getPUrl('system/images/list'), {module: result.parent, path: result.path}, function (listFile) {
          //  var data = result;
          //  convertListFile(listFile.items, data);
          //  el.data(data);
          //
          //});
          callback(el);
          //$('#col-list-folder').perfectScrollbar('update');
        }
      }
    }).on('closed', function (e, result) {
      var w = $listFolder.width();
      //$listFolder.css({width: w-5+'px'});
      console.log(result);
    });
  };
  $.postJSON(iNet.getPUrl('system/module/list'), {}, function (moduleData) {
    var modules = moduleData.elements;
    for (var i=0; i<modules.length; i++){
      data[modules[i].name] = {
        id: String.format('{0}-{1}-{2}', modules[i].name, modules[i].version, modules[i].sites),
        name: modules[i].name,
        type: 'folder',
        iconCls: 'blue',
        additionalParameters: {
          children: {}
        }
      };
    }
    var dataSrc = new DataSourceTree({data: data});
    $listFolder.xtree({
      dataSource: dataSrc,
      loadingHTML: '<div class="tree-loading"><i id="exloader-mini"></i></div>',
      iconSelected: null,
      iconUnSelected: null,
      cacheItems: false,
      isRemoteItem: true
    });
    excTree();
  });
});