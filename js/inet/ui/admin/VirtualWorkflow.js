// #PACKAGE: admin
// #MODULE: workflow
$(function () {
  iNet.ns('iNet.ui.admin.VirtualWorkflow');
  iNet.ui.admin.VirtualWorkflow = function (config) {
    var __defConfig = {
      element: "statemachine-design",
      selector: ".statemachine-design .w"
    };
    var __config = config || __defConfig;

    iNet.apply(this, __config);
    var self = this;
    this.$element = $("#" + this.element);
    this.label = '';
    this.data = {connections: []};
    this.template = {
      node: '<div class="w" id="{0}" data-type="{5}" style="left: {2}px; top: {3}px;"><i class="{4}"></i> {1} <div class="ep"></div></div>',
      end: '<div class="w" id="{0}" style="left: 482px; top: 229px;">{1}</div>',
      begin: '<div class="w w-n-start" id="{0}" data-type="{5}" style="left: {2}px; top: {3}px;"><i class="{4}"></i> {1} <div class="ep"></div></div>'
    };
    // setup some defaults for jsPlumb.
    this.instance = jsPlumb.getInstance({
      Endpoint: ["Dot", {radius: 2}],
      HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2},
      ConnectionOverlays: [
        ["Arrow",
          {
            location: 1,
            id: "arrow",
            length: 14,
            foldback: 0.8
          }],
        ["Label", {label: "Connections", id: "label", cssClass: "aLabel"}]
      ],
      Container: this.element
    });

    this.windows = jsPlumb.getSelector(this.selector);

    // initialise draggable elements.
    this.instance.draggable(this.windows);

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
    // happening.
    // Event -------------------------------------------------------------------------------------
    this.instance.bind("click", function (c) {
      //remove class selected on all connections
      self.removeCssSelected();

      var source = c.sourceId, target = c.targetId;
      var conns = self.data.connections;
      for (var i = 0; i < conns.length; i++) {
        if (source == conns[i].source && target == conns[i].target) {
          c.uuid = conns[i].uuid;
          break;
        }
      }
      var canvas = c.getOverlay("label").canvas;
      if (!!canvas) {
        $(canvas).addClass('selected');
      }
      self.fireEvent('connectionclick', c);
    });

    this.instance.bind("endpointClick", function (endpoint, originalEvent) {
      self.fireEvent('endpointclick', endpoint, originalEvent);
    });
    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    this.instance.bind("connection", function (info) {
      //info.connection.getOverlay("label").setLabel(self.label);
    });
    this.instance.bind("connectionDragStop", function (connection) {
      self.fireEvent('connectiondragstop', connection);
    });

    this.$element.on('click', 'div.w', function (event) {
      // remove class selected
      self.removeCssSelected();
      var node = $(this);
      node.addClass('selected');

      self.fireEvent('nodeclick', event, this);
    });
    this.draggable = function (selector) {
      self.instance.draggable(selector);
      selector.on('dragstop', function (event, ui) {
        self.fireEvent('dragstop', ui);
      });
    };

    this.makeSource = function (selector) {
      self.instance.makeSource(selector, {
        filter: ".ep",// only supported by jquery
        anchor: "Continuous",
        connector: ["Flowchart", {stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true}],
        /*maxConnections: 10,*/
        /*onMaxConnections: function (info, e) {
         alert("Maximum connections (" + info.maxConnections + ") reached");
         },*/
        connectorStyle: {
          strokeStyle: "#5c96bc",
          lineWidth: 3,
          outlineColor: "transparent",
          outlineWidth: 4
        }
      });
    };

    this.makeTarget = function (selector) {
      self.instance.makeTarget(selector, {
        dropOptions: {hoverClass: "dragHover"},
        anchor: "Continuous"
      });
    };

    this.removeCssSelected = function () {
      self.$element.find('div.selected').removeClass('selected');
      var allcons = self.instance.getAllConnections();
      for (var i = 0; i < allcons.length; i++) {
        var canvas = allcons[i].getOverlay("label").canvas;
        if (!!canvas) {
          $(canvas).removeClass('selected');
        }
      }
    };
  };

  iNet.extend(iNet.ui.admin.VirtualWorkflow, iNet.Component, {
    /**
     *  String id
     *  boolean start
     *  boolean endway
     *  String name
     */
    addNode: function (data) {
      var __template = this.template.node;
      if (data.start && !data.endway) {
        __template = this.template.begin;
      }

      this.$element.append(String.format(__template, data.id || "temp", data.name || "Node", data.x, data.y, data.icon, data.type || "OR"));
      var $selector = $.getCmp(data.id);
      this.draggable($selector);
      this.makeSource($selector);
      this.makeTarget($selector);

      /*if (data.start && !data.endway) { // start node
       this.makeSource($selector);
       } else {
       this.makeSource($selector);
       this.makeTarget($selector);
       }*/
    },
    removeNode: function (id) {
      var $selector = $.getCmp(id);
      this.instance.detachAllConnections($selector);
      this.instance.unmakeSource($selector);
      $selector.remove();
    },
    moveNode: function (id, x, y) {
      $.getCmp(id).css({left: x, top: y});
    },
    connect: function (idSource, idTarget, label, uuid) {
      //this.label = label;
      var connect = this.instance.connect({source: idSource, target: idTarget});
      connect.getOverlay("label").setLabel(label);
      this.data.connections.push({
        uuid: uuid,
        source: idSource,
        target: idTarget
      });
    },
    detach: function (connection) {
      this.instance.detach(connection);
    },
    reset: function () {
      var me = this;
      $.each(this.data.connections || [], function (i, conn) {
        me.detach(conn);
      });
      this.data.connections = [];
      jsPlumb.reset();
      this.$element.empty();
    }
  });

  iNet.ns('iNet.ui.admin.Workflow');
  iNet.ui.admin.Workflow = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);

    var resources =
    {
      wfConstant: {},// iNet.resources.wfTool.constant,
      wfGraph: {},//iNet.resources.wfTool.graph,
      wfNode: {},//iNet.resources.wfTool.node,
      wfConnection: {}//iNet.resources.wfTool.connection
    };

    var render = function () {
      var __html_wf_vdt_n_name = '';
      __html_wf_vdt_n_name += '<div class="row-fluid control">';
      __html_wf_vdt_n_name += '   <span class="span4"><label for="node-name-txt" class="control-label">{0} </label></span>';
      __html_wf_vdt_n_name += '   <span class="span8"><input id="node-name-txt" class="span12" type="text"></span>';
      __html_wf_vdt_n_name += '</div>';
      __html_wf_vdt_n_name = String.format(__html_wf_vdt_n_name, resources.wfNode['name']);

      var __html_wf_vdt_n_actor = '';
      __html_wf_vdt_n_actor += '<div class="row-fluid">';
      __html_wf_vdt_n_actor += '   <span class="span4"><label for="node-actor-cbo" class="control-label">{0} </label></span>';
      __html_wf_vdt_n_actor += '   <span class="span8"><input id="node-actor-cbo" class="span12"></span>';
      __html_wf_vdt_n_actor += '</div>';
      __html_wf_vdt_n_actor = String.format(__html_wf_vdt_n_actor, resources.wfNode['actor']);

      var __html_wf_vdt_n_multiDecision = '';
      __html_wf_vdt_n_multiDecision += '<div class="row-fluid">';
      __html_wf_vdt_n_multiDecision += '   <span class="span4"><label for="node-multiDecision-check" class="control-label">{0} </label></span>';
      __html_wf_vdt_n_multiDecision += '   <span class="span8">';
      __html_wf_vdt_n_multiDecision += '      <label>';
      __html_wf_vdt_n_multiDecision += '          <input id="node-multiDecision-check" type="checkbox" class="ace" ">';
      __html_wf_vdt_n_multiDecision += '          <span class="lbl"></span>';
      __html_wf_vdt_n_multiDecision += '      </label>';
      __html_wf_vdt_n_multiDecision += '   </span>';
      __html_wf_vdt_n_multiDecision += '</div>';
      __html_wf_vdt_n_multiDecision = String.format(__html_wf_vdt_n_multiDecision, resources.wfNode['multiDecision']);

      var __html_wf_vdt_n_type = '';
      __html_wf_vdt_n_type += '<div class="row-fluid control hide">';
      __html_wf_vdt_n_type += '   <span class="span4"><label for="node-type-cbo" class="control-label">{0} </label></span>';
      __html_wf_vdt_n_type += '   <span class="span8"><input id="node-type-cbo" disabled="disabled" class="span12"></span>';
      __html_wf_vdt_n_type += '</div>';
      __html_wf_vdt_n_type = String.format(__html_wf_vdt_n_type, resources.wfNode['type']);

      var __html_wf_vdt_n_join_type = '';
      __html_wf_vdt_n_join_type += '<div class="row-fluid control">';
      __html_wf_vdt_n_join_type += '   <span class="span4"><label for="node-join-type-cbo" class="control-label">{0} </label></span>';
      __html_wf_vdt_n_join_type += '   <span class="span8"><input id="node-join-type-cbo" class="span12"></span>';
      __html_wf_vdt_n_join_type += '</div>';
      __html_wf_vdt_n_join_type = String.format(__html_wf_vdt_n_join_type, resources.wfNode['joinType']);

      var __html_wf_vdt_n_svc_out = '';
      __html_wf_vdt_n_svc_out += '<div class="row-fluid control">';
      __html_wf_vdt_n_svc_out += '   <span class="span4"><label for="node-svc-out-cbo" class="control-label">{0} </label></span>';
      __html_wf_vdt_n_svc_out += '   <span class="span8"><input id="node-svc-out-cbo" class="span12"></span>';
      __html_wf_vdt_n_svc_out += '</div>';
      __html_wf_vdt_n_svc_out = String.format(__html_wf_vdt_n_svc_out, resources.wfNode['svcOut']);

      var __html_wf_vdt_n_svc_in = '';
      __html_wf_vdt_n_svc_in += '<div class="row-fluid control">';
      __html_wf_vdt_n_svc_in += '   <span class="span4"><label for="node-svc-in-cbo" class="control-label">{0} </label></span>';
      __html_wf_vdt_n_svc_in += '   <span class="span8"><input id="node-svc-in-cbo" class="span12"></span>';
      __html_wf_vdt_n_svc_in += '</div>';
      __html_wf_vdt_n_svc_in = String.format(__html_wf_vdt_n_svc_in, resources.wfNode['svcIn']);

      var __html_wf_vdt_n_business = '';
      __html_wf_vdt_n_business += '<div class="row-fluid control hide">';
      __html_wf_vdt_n_business += '   <span class="span4"><label for="node-business-cbo" class="control-label">{0} </label></span>';
      __html_wf_vdt_n_business += '   <span class="span8"><input id="node-business-cbo" disabled="disabled" class="span12"></span>';
      __html_wf_vdt_n_business += '</div>';
      __html_wf_vdt_n_business = String.format(__html_wf_vdt_n_business, resources.wfNode['business']);

      var __html_wf_vdt_n_screen = '';
      __html_wf_vdt_n_screen += '<div class="row-fluid control">';
      __html_wf_vdt_n_screen += '   <span class="span4"><label for="node-screen-cbo" class="control-label">{0} </label></span>';
      __html_wf_vdt_n_screen += '   <span class="span8"><input id="node-screen-cbo" class="span12"></span>';
      __html_wf_vdt_n_screen += '</div>';
      __html_wf_vdt_n_screen = String.format(__html_wf_vdt_n_screen, resources.wfNode['screen']);

      var __html_wf_vdt_n_attribute = '';
      __html_wf_vdt_n_attribute += '<div class="row-fluid control">';
      __html_wf_vdt_n_attribute += '   <span class="span4"><label for="node-attribute-cbo" class="control-label">{0} </label></span>';
      __html_wf_vdt_n_attribute += '   <span class="span8"><input id="node-attribute-cbo" class="span12"></span>';
      __html_wf_vdt_n_attribute += '</div>';
      __html_wf_vdt_n_attribute = String.format(__html_wf_vdt_n_attribute, resources.wfNode['attribute']);

      var __html_wf_vdt_n_radio = '';
      __html_wf_vdt_n_radio += '<div class="row-fluid control">';
      __html_wf_vdt_n_radio += '   <div class="span12" style="display: inline-flex">';
      __html_wf_vdt_n_radio += '      <div class="radio"><label><input id="node-value-rad" name="optionsValues" type="radio" class="ace" value=""><span class="lbl"> {0}</span></label></div>';
      __html_wf_vdt_n_radio += '      <div class="radio"><label><input id="node-variable-rad" name="optionsValues" type="radio" class="ace" value="$"><span class="lbl"> {1}</span></label></div>';
      __html_wf_vdt_n_radio += '      <div class="radio"><label><input id="node-expressions-rad" name="optionsValues" type="radio" class="ace" value="express"><span class="lbl"> {2}</span></label></div>';
      __html_wf_vdt_n_radio += '   </div>';
      __html_wf_vdt_n_radio += '</div>';
      __html_wf_vdt_n_radio = String.format(__html_wf_vdt_n_radio, resources.wfNode['value'], resources.wfNode['variable'], resources.wfNode['expressions']);

      var __html_wf_vdt_n_value = '';
      __html_wf_vdt_n_value += '<div class="row-fluid control">';
      __html_wf_vdt_n_value += '   <span class="span12"><textarea id="node-value-txt" class="span12" rows="7"></textarea></span>';
      __html_wf_vdt_n_value += '</div>';
      __html_wf_vdt_n_value = String.format(__html_wf_vdt_n_value, '');

      var __html_wf_vdt_n = '';
      __html_wf_vdt_n += '<div id="wf-node-detail" class="wf-border wf-detail span12">';
      __html_wf_vdt_n += '  <form id="frm-node-detail">';
      __html_wf_vdt_n += '      <div id="node-detail-div" class="wf-info">{0}{1}{2}{10}{3}{4}{5}{6}{11}{7}{8}{9}</div>';
      __html_wf_vdt_n += '  </form>';
      __html_wf_vdt_n += '</div>';
      __html_wf_vdt_n = String.format(__html_wf_vdt_n, __html_wf_vdt_n_name, __html_wf_vdt_n_actor, __html_wf_vdt_n_type, __html_wf_vdt_n_join_type, __html_wf_vdt_n_business, __html_wf_vdt_n_svc_in, __html_wf_vdt_n_svc_out, __html_wf_vdt_n_attribute, __html_wf_vdt_n_radio, __html_wf_vdt_n_value, __html_wf_vdt_n_multiDecision, __html_wf_vdt_n_screen);

      var __html_wf_vdt_c_name = '';
      __html_wf_vdt_c_name += '<div class="row-fluid control">';
      __html_wf_vdt_c_name += '   <span class="span4"><label for="connect-name-txt" class="control-label">{0} </label></span>';
      __html_wf_vdt_c_name += '   <span class="span8"><input id="connect-name-txt" class="span12" type="text"></span>';
      __html_wf_vdt_c_name += '</div>';
      __html_wf_vdt_c_name = String.format(__html_wf_vdt_c_name, resources.wfConnection['name']);

      var __html_wf_vdt_c_priority = '';
      __html_wf_vdt_c_priority += '<div class="row-fluid control">';
      __html_wf_vdt_c_priority += '   <span class="span4"><label for="connect-priority-txt" class="control-label">{0} </label></span>';
      __html_wf_vdt_c_priority += '   <span class="span8"><input id="connect-priority-txt" class="span12" type="text"></span>';
      __html_wf_vdt_c_priority += '</div>';
      __html_wf_vdt_c_priority = String.format(__html_wf_vdt_c_priority, resources.wfConnection['priority']);

      var __html_wf_vdt_c_script_cbo = '';
      __html_wf_vdt_c_script_cbo += '<div class="row-fluid control">';
      __html_wf_vdt_c_script_cbo += '   <span class="span4"><label for="connect-script-cbo" class="control-label">{0} </label></span>';
      __html_wf_vdt_c_script_cbo += '   <span class="span8"><input id="connect-script-cbo" class="span12"></span>';
      __html_wf_vdt_c_script_cbo += '</div>';
      __html_wf_vdt_c_script_cbo = String.format(__html_wf_vdt_c_script_cbo, resources.wfConnection['script']);

      var __html_wf_vdt_c_script_txt = '';
      __html_wf_vdt_c_script_txt += '<div class="row-fluid control">';
      __html_wf_vdt_c_script_txt += '   <span class="span12"><textarea id="connect-script-txt" class="span12" rows="7"></textarea></span>';
      __html_wf_vdt_c_script_txt += '</div>';
      __html_wf_vdt_c_script_txt = String.format(__html_wf_vdt_c_script_txt, '');

      var __html_wf_vdt_c = '';
      __html_wf_vdt_c += '<div id="wf-connect-detail" class="wf-border wf-detail span12" style="display: none">';
      __html_wf_vdt_c += '   <form id="frm-connection-detail">';
      __html_wf_vdt_c += '       <div id="connection-detail-div" class="wf-info">{0}{3}{1}{2}</div>';
      __html_wf_vdt_c += '   </form>';
      __html_wf_vdt_c += '</div>';
      __html_wf_vdt_c = String.format(__html_wf_vdt_c, __html_wf_vdt_c_name, __html_wf_vdt_c_script_cbo, __html_wf_vdt_c_script_txt, __html_wf_vdt_c_priority);

      var __html_wf_vdt = '';
      __html_wf_vdt += '<div id="wf-detail-div" class="wf-width4 hide">{0}{1}</div>';
      __html_wf_vdt = String.format(__html_wf_vdt, __html_wf_vdt_n, __html_wf_vdt_c);

      var __html_wf_vds = '';
      __html_wf_vds += '<div id="wf-design-div" class="wf-width12">';
      __html_wf_vds += '   <div id="wf-design" class="wf-border wf-design span12"></div>';
      __html_wf_vds += '</div>';
      __html_wf_vds = String.format(__html_wf_vds, '');

      var __html_wf_v = '';
      __html_wf_v += '<div id="workflow-design-view" class="wf-design-view">';
      __html_wf_v += '  <div class="row-fluid">';
      __html_wf_v += '      <div class="span12 wf-view">{0}{1}</div>';
      __html_wf_v += '  </div>';
      __html_wf_v += '</div>';
      __html_wf_v = String.format(__html_wf_v, __html_wf_vds, __html_wf_vdt);

      var __html_wf_b = '';
      __html_wf_b += '<div id="workflow-design-business" class="wf-design-business">';
      __html_wf_b += '    <div id="wf-business-div"></div>';
      __html_wf_b += '</div>';
      __html_wf_b = String.format(__html_wf_b, '');

      var __html_wf_t_t = ''
      __html_wf_t_t += '<h4><i class="icon-random"></i> {0}</h4>';
      __html_wf_t_t = String.format(__html_wf_t_t, resources.wfConstant['title']);

      var __html_wf_t_n = '';
      __html_wf_t_n += '<div id="wf-node-action" class="wf-toolbar">';
      __html_wf_t_n += '     <a id="workflow-design-node-add" data-action="node-add" style="display: none" href="#"><i class="icon-plus"> {0}</i></a>';
      __html_wf_t_n += '     <a id="workflow-design-node-save" data-action="node-save" href="#"><i class="icon-save"> {1}</i></a>';
      __html_wf_t_n += '     <a id="workflow-design-node-del" data-action="node-delete" href="#"><i class="icon-trash"> {2}</i></a>';
      __html_wf_t_n += ' </div>';
      __html_wf_t_n = String.format(__html_wf_t_n, resources.wfNode['add'], resources.wfNode['save'], resources.wfNode['delete']);

      var __html_wf_t_c = '';
      __html_wf_t_c += '<div id="wf-connect-action" class="wf-toolbar" style="display: none">';
      __html_wf_t_c += '     <a id="workflow-design-conn-save" data-action="conn-save" href="#"><i class="icon-save"> {0}</i></a>';
      __html_wf_t_c += '     <a id="workflow-design-conn-del" data-action="conn-delete" href="#"><i class="icon-trash"> {1}</i></a>';
      __html_wf_t_c += ' </div>';
      __html_wf_t_c = String.format(__html_wf_t_c, resources.wfConnection['save'], resources.wfConnection['delete']);

      var __html_wf_t_u = '';
      __html_wf_t_u += '<div id="wf-util-action" class="wf-toolbar">';
      __html_wf_t_u += '    <a id="workflow-design-util-resize" data-action="resize" href="#"><i class="icon-resize-full"></i></a>';
      __html_wf_t_u += '    <a id="workflow-design-util-collapse" data-action="collapse" href="#"><i class="icon-th-list"></i></a>';
      __html_wf_t_u += '    <a id="workflow-design-util-business" data-action="business" href="#"><i class="icon-gears"></i></a>';
      __html_wf_t_u += '</div>';
      __html_wf_t_u = String.format(__html_wf_t_u, '');

      var __html_wf_t = '<div id="workflow-design-toolbar" class="wf-design-toolbar">{0}{1}{2}{3}</div>';
      __html_wf_t = String.format(__html_wf_t, __html_wf_t_t, __html_wf_t_n, __html_wf_t_c, __html_wf_t_u);

      var __html_wf = '';
      __html_wf += '<div id="workflow-control" class="wf-content hide">{0}{1}{2}</div>';
      __html_wf = String.format(__html_wf, __html_wf_t, __html_wf_b, __html_wf_v);

      return __html_wf;
    }

    $('#' + __config.id).html(render());

    this.$id = $("#workflow-control");
    var self = this;
    var notify = null;
    var nodeDialog = null;
    var arcDialog = null;
    var __init = false;

    var __owner =
    {
      uuid: null,
      graph: {},
      zone: "",
      context: __config.context,
      nodeClick: false,
      nodes: [],
      node: {},
      nodeUuid: '',
      nodeUI: {},
      nodeAttr: [],
      nodeTemp: {uuid: 'temp', nodeName: resources.wfNode.temp, joinType: "OR", start: true, endway: false},
      connClick: false,
      conns: [],
      arcs: [],
      conn: {}
    };

    this.$element = this.$id;
    this.$mask = this.$id;
    this.owner = __owner;

    var url =
    {
      loadGraph: iNet.getPUrl('cloud/workflow/visualdesign'),

      loadNode: iNet.getPUrl('cloud/workflow/member/view'),
      updateNode: iNet.getPUrl('cloud/workflow/member/update'),
      createNode: iNet.getPUrl('cloud/workflow/member/create'),
      delNode: iNet.getPUrl('cloud/workflow/member/delete'),
      assignNode: iNet.getPUrl('cloud/workflow/actor/assign'),
      updatePosition: iNet.getPUrl('cloud/workflow/actor/update'),

      loadBusiness: iNet.getPUrl('cloud/workflow/business'),
      loadAlias: iNet.getPUrl('cloud/workflow/alias/list'),
      loadBizRegister: iNet.getPUrl('cloud/workflow/bizregister'),

      loadType: iNet.getPUrl('system/page/service'),
      loadScreen: iNet.getPUrl('system/page/service'), //service=result loadType

      arcCreate: iNet.getPUrl('cloud/workflow/arc/create'),
      arcScript: iNet.getPUrl('cloud/workflow/arccond/update'), //arc, condition, scriptTemplateID, priority
      arcDelete: iNet.getPUrl('cloud/workflow/arc/delete'),
      loadScript: iNet.getPUrl('cloud/workflow/script/list') //zone
    };
    var wfControl =
    {
      divToolbar: $("#workflow-design-toolbar"),
      divBusiness: $("#workflow-design-business"),
      divView: $("#workflow-design-view"),
      business: $("#wf-business-div"),
      design: $("#wf-design-div"),
      detail: $("#wf-detail-div")
    };
    var $action =
    {
      NODEADD: $('#workflow-design-node-add'),
      NODESAVE: $('#workflow-design-node-save'),
      NODEDEL: $('#workflow-design-node-del'),
      CONNSAVE: $('#workflow-design-conn-save'),
      CONNDEL: $('#workflow-design-conn-del')
    };
    var $input =
    {
      // form Node
      nodeName: $('#node-name-txt'),
      nodeMultiDecision: $('#node-multiDecision-check'),
      nodeActor: $('#node-actor-cbo'),
      nodeSvcOut: $('#node-svc-out-cbo'),
      nodeSvcIn: $('#node-svc-in-cbo'),
      nodeType: $('#node-type-cbo'),
      nodeJoinType: $('#node-join-type-cbo'),
      nodeBusiness: $('#node-business-cbo'),
      nodeAttribute: $('#node-attribute-cbo'),
      nodeScreen: $('#node-screen-cbo'),
      nodeRadValue: $('#node-value-rad'),
      nodeRadVariable: $('#node-variable-rad'),
      nodeRadExpressions: $('#node-expressions-rad'),
      nodeValue: $('#node-value-txt'),
      // form Connection
      conName: $('#connect-name-txt'),
      conPriority: $('#connect-priority-txt'),
      conScript: $('#connect-script-cbo'),
      conValue: $('#connect-script-txt')
    };
    var $toolbar =
    {
      Resize: $('#workflow-design-util-resize'),
      Collapse: $('#workflow-design-util-collapse'),
      Business: $('#workflow-design-util-business')
    };

    $toolbar.Business.on('click', function () {
      var __status = $toolbar.Business.attr('data-status') || "";
      if (iNet.isEmpty(__status) || __status == 'show') {
        wfControl.divBusiness.hide();
        $toolbar.Business.attr('data-status', 'hide');
        setHeight();
      } else {
        wfControl.divBusiness.show();
        $toolbar.Business.attr('data-status', 'show');
        setHeight();
      }
    });
    $toolbar.Resize.on('click', function () {

      self.fireEvent('resize');
      var $icon = $(this).find('i');
      console.log(">> icon >>", $icon);
      /*var __parentId = self.$element.parent().prop('id');
       console.log(">> $btnResize >>", self.$element.parent(), __parentId);
       if (!iNet.isEmpty(__parentId)) {
       var $icon = $(this).find('i');
       if ($('#' + __parentId).is(':nodeAttr')) {
       $icon.attr('class', 'icon-resize-full');
       $('#' + __parentId).show();
       } else {
       $('#' + __parentId).hide();
       $icon.attr('class', 'icon-resize-small');
       }
       }*/
    });
    $toolbar.Collapse.on('click', function () {
      detailView(true);
    });

    // UTILITY ==================================
    var createSelect = function (id, datasource, idValue, formatView, allowClear, multiple, ajax, query) {
      var __datasource = datasource || [];
      var __idValue = idValue || "id";
      var __formatView = formatView || 1; //View= 1: name; 2: code name
      var __allowClear = iNet.isEmpty(allowClear) ? true : allowClear;
      var __multiple = iNet.isEmpty(multiple) ? false : multiple;
      var __ajax = iNet.isEmpty(ajax) ? {} : ajax;
      var __query = iNet.isFunction(query) ? query : "";

      var __config = {};
      __config.id = id;
      __config.allowClear = __allowClear;
      __config.multiple = __multiple;
      __config.data = {
        results: __datasource,
        text: function (item) {
          return iNet.isEmpty(item.name) ? "" : item.name;
        }
      };
      __config.idValue = function (data) {
        return data[__idValue];//(__idValue == "code") ? data.code : data.id;
      };
      __config.initSelection = function (element, callback) {
        var __key = __idValue;
        var __value = element.val().split(',') || [];
        var __dataArray = [];
        var __dataValue = "";
        var __multiSelect = __multiple;

        if (!iNet.isEmpty(__value)) {
          for (var i = 0; i < __value.length; i++) {
            for (var j = 0; j < __datasource.length; j++) {
              if ((__key == "id") ? __datasource[j][__key].toString() == __value[i].toString() : __datasource[j][__key].toString() == __value[i].toString()) {
                __datasource[j].name = iNet.isEmpty(__datasource[j].name) ? "" : __datasource[j].name;
                __datasource[j].code = iNet.isEmpty(__datasource[j].code) ? "" : __datasource[j].code;

                if (__multiSelect) {
                  __dataArray.push(__datasource[j]);
                } else {
                  __dataValue = __datasource[j];
                }
                break;
              }
            }
          }
        }

        if (__multiSelect) {
          callback(__dataArray);
        } else {
          callback(__dataValue);
        }

      };
      __config.formatResult = function (data) {
        var __dataCode = iNet.isEmpty(data.code) ? "" : data.code;
        var __dataName = iNet.isEmpty(data.name) ? "" : data.name;

        var markup1 = __dataName;
        var markup2 = String.format('<span style="color: #c09853; text-align: right; padding-right: 5px"><strong>{0}<strong></strong></strong></span> {1}', __dataCode, __dataName);
        var markup = (__formatView == 1) ? markup1 : markup2;
        return markup;
      };
      __config.formatSelection = function (data) {
        var __dataCode = iNet.isEmpty(data.code) ? "" : data.code;
        var __dataName = iNet.isEmpty(data.name) ? "" : data.name;

        var markup1 = __dataName;
        var markup2 = String.format('<label class="label label-info marg-b-0">{0}</label> {1}', __dataCode, __dataName);
        var markup = (__formatView == 1) ? markup1 : markup2;
        return markup;
      };
      if (!iNet.isEmpty(ajax)) __config.ajax = __ajax;
      if (!iNet.isEmpty(__query)) __config.query = query;

      return new iNet.ui.form.select.Select(__config);
    };
    var notifySuccess = function (title, content) {
      if (!notify) {
        notify = new iNet.ui.form.Notify({delay: 3000});
      }
      notify.setType('success');
      notify.setTitle(title || '');
      notify.setContent(content || '');
      notify.show();
    };
    var notifyError = function (title, content) {
      if (!notify) {
        notify = new iNet.ui.form.Notify({delay: 3000});
      }
      notify.setType('error');
      notify.setTitle(title || '');
      notify.setContent(content || '');
      notify.show();
    };
    var setHeight = function (height) {
      wfControl.design.height($(window).height() - 5 - wfControl.design.offset().top);
      wfControl.detail.height(wfControl.design.height());
    };
    var detailView = function (detailClick) {
      var __nodeClick = self.owner.nodeClick;
      var __connClick = self.owner.connClick;
      var __view = wfControl.design.hasClass('wf-width8'); //wf-width8: detail show; wf-width12: detail hide

      var __formNode = $("#wf-node-detail");
      var __actionNode = $("#wf-node-action");
      var __formConn = $("#wf-connect-detail");
      var __actionConn = $("#wf-connect-action");

      if (__nodeClick || __connClick) {
        if (detailClick) {
          if (__view) {
            wfControl.detail.hide();
            wfControl.design.removeClass('wf-width8');
            wfControl.design.addClass('wf-width12');
          } else {
            wfControl.detail.show();
            wfControl.design.removeClass('wf-width12');
            wfControl.design.addClass('wf-width8');
          }
        } else {
          wfControl.detail.show();
          wfControl.design.removeClass('wf-width12');
          wfControl.design.addClass('wf-width8');
        }

        __view = wfControl.design.hasClass('wf-width8');
        if (__nodeClick && __view) {
          __formNode.show();
          __actionNode.show();
        } else {
          __formNode.hide();
          __actionNode.hide();
        }

        if (__connClick && __view) {
          __formConn.show();
          __actionConn.show();
        } else {
          __formConn.hide();
          __actionConn.hide();
        }

      }
      else {
        wfControl.design.removeClass('wf-width8');
        wfControl.design.addClass('wf-width12');
        wfControl.detail.hide();
        __formNode.hide();
        __actionNode.hide();
        __formConn.hide();
        __actionConn.hide();
      }

      if (self.owner.graph.version == "PRODUCTION") {
        __actionNode.hide();
        __actionConn.hide();
      }
    };

    // VIRTUAL =================================
    var virtual = new iNet.ui.admin.VirtualWorkflow({element: "wf-design", selector: ".w-design .w"});
    virtual.on('dragstop', function (ui) {
      console.log(">> node drapstop >>", ui.position.left, ui.position.top);
      var uuid = ui.helper.attr("id");
      var x = ui.position.left;
      var y = ui.position.top;
      var __data = {
        task: uuid,
        x: parseInt(x),
        y: parseInt(y)
      };
      self.owner.nodeUI = __data;
      if (uuid == 'temp') {
        return;
      }

      $.ajax({
        url: url.updatePosition,
        data: __data,
        type: "POST"
      });
    });
    virtual.on('connectionclick', function (connection) {
      self.owner.nodeClick = false;
      self.owner.connClick = true;
      detailView(false);

      self.owner.nodeUuid = '';
      self.owner.conn = connection;

      var __conUuid = connection.uuid;
      var __arc = {};
      $.each(self.owner.arcs || [], function (a, arc) {
        if (arc.uuid == __conUuid) {
          __arc = arc;
          return false; //break
        }
      });
      $input.conName.val(__arc.arcName);
      $input.conPriority.val(__arc.priority || 0);
      $input.conScript.setValue(__arc.scriptTemplateID || "");
      $input.conValue.val(__arc.condition || "");

      if (iNet.isEmpty(__arc.scriptTemplateID || "")) {
        $input.conValue.show();
      } else {
        $input.conValue.val("");
        $input.conValue.hide();
      }

      if (iNet.isEmpty(__conUuid)) {
        $input.conName.prop("readonly", false);
      } else {
        $input.conName.prop("readonly", true);
      }
    });
    virtual.on('nodeclick', function (event, node) {
      self.owner.nodeClick = true;
      self.owner.connClick = false;
      detailView(false);

      var __uuid = $(node).prop('id');
      if (self.owner.nodeUuid == __uuid) {
        return;
      }

      if (__uuid === 'temp') {
        var __nodeTemp = self.owner.nodeTemp || {};
        __nodeTemp.type = $(node).attr('data-type');
        setNode(__nodeTemp);
      } else {
        loadNode(self.owner.graph.uuid, self.owner.graph.zone, __uuid);
      }
    });
    virtual.on('connectiondragstop', function (connection) {
      if (!iNet.isEmpty((connection || {}).connector || "")) {
        var __sourceId = (connection || {}).sourceId || "";
        var __targetId = (connection || {}).targetId || "";
        if (!iNet.isEmpty(__sourceId) && !iNet.isEmpty(__targetId)) {
          var __isExists = false;
          if (__sourceId == __targetId) {
            __isExists = true;
          } else {
            $.each(self.owner.conns || [], function (c, con) {
              if (con.sourceId == __sourceId && con.targetId == __targetId) {
                __isExists = true;

              }
            });
            $.each(self.owner.arcs || [], function (a, arc) {
              $.each(self.owner.nodes || [], function (n, node) {
                if (arc.arcTo == node.nodeName) {
                  if (arc.taskActorUUID == __sourceId && node.uuid == __targetId) {
                    __isExists = true;
                  }
                }
              });
            });
          }

          if (!__isExists) {
            self.owner.conns.push(connection);
          } else {
            virtual.detach(connection);
          }
        }
      }
    });

    // INIT DATA =================================
    var changeBusiness = function (business) {
      var __business = business || "";
      console.log(">> changeBusiness >>", __business);
      $input.nodeBusiness.setValue(__business);
      $.postJSON(url.loadBusiness, {type: __business}, function (result) {
        var __itemsAttribute = [];
        var __result = result || {};

        $.each(__result.elements, function (i, item) {
          __itemsAttribute.push({id: item, code: item, name: item});
        });

        $input.nodeAttribute = createSelect('node-attribute-cbo', __itemsAttribute, 'id', 1, false, false);
        $input.nodeAttribute.on('change', function () {
          var __attr = "_" + $input.nodeAttribute.getValue();
          $input.nodeValue.val("");
          $.each(self.owner.nodeAttr || [], function (i, attr) {
            if (__attr == (attr || {}).id) {
              setAttribute(attr);
              return false; //break $.each
            }
          });
        });

        //Set default $input.nodeAttribute
        var __attrDefault = __itemsAttribute[0] || {};
        if (!iNet.isEmpty(__attrDefault.id)) {
          $input.nodeAttribute.setValue(__attrDefault.id);
          var __attr = "_" + $input.nodeAttribute.getValue();
          $input.nodeValue.val("");
          $.each(self.owner.nodeAttr || [], function (i, attr) {
            if (__attr == (attr || {}).id) {
              setAttribute(attr);
              return false; //break $.each
            }
          });
        } else {
          $input.nodeRadValue.prop("checked", true);
        }
      });
    };
    var getIconBusiness = function (business) {
      //var __icon = (wfControl.business.find('[data-id="'+business+'"]').find('i')[0] || []).className  || "icon-gears";

      var __icon = "icon-add";
      $.each(__itemsBusiness || [], function (i, buss) {
        if (buss.id == business) {
          __icon = buss.icon;
          return false; //break loop
        }
      });
      return __icon;
    };
    var getAttribute = function () {
      var __attr = "_" + $input.nodeAttribute.getValue();
      var __value = "";
      if ($input.nodeRadVariable.prop("checked")) {
        __value = "$";
      } else if ($input.nodeRadExpressions.prop("checked")) {
        __value = "express::";
      }
      __value += $input.nodeValue.val();

      var __isExists = false;
      $.each(self.owner.nodeAttr || [], function (i, attr) {
        if (__attr == (attr || {}).id) {
          attr.value = __value;
          __isExists = true;
          return false; //break $.each
        }
      });

      console.log("__isExists >>", __isExists);
      if (!__isExists) {
        self.owner.nodeAttr.push({id: __attr, value: __value});
      }
    };
    var setAttribute = function (attr) {
      var __value = (attr || {}).value || "";
      console.log(">> attr >>", attr);

      if (__value.indexOf("$") >= 0) {
        $input.nodeRadVariable.prop("checked", true);
      } else if (__value.indexOf("express::") >= 0) {
        $input.nodeRadExpressions.prop("checked", true)
      } else {
        $input.nodeRadValue.prop("checked", true);
      }
      __value = __value.replace("$", "");
      __value = __value.replace("express::", "");
      $input.nodeValue.val(__value);
    };

    var __itemsType = [
      {id: "start", code: "Start", name: "Start"},
      {id: "work", code: "Work", name: "Work"},
      {id: "end", code: "End", name: "End"}
    ];
    var __itemsJoinType = [
      {id: "OR", code: "OR", name: "OR"},
      {id: "AND", code: "AND", name: "AND"}
    ];
    var __itemsBusiness = [];
    var __itemsActor = [];
    var __itemsBizRegister = [];
    var __itemsScript = [];
    var __itemsScreen = [];

    $input.nodeType = createSelect('node-type-cbo', __itemsType, 'id', 1, false, false);
    $input.nodeJoinType = createSelect('node-join-type-cbo', __itemsJoinType, 'id', 1, false, false);
    $input.nodeActor = createSelect('node-actor-cbo', __itemsActor, 'id', 1, true, true);
    $input.nodeSvcOut = createSelect('node-svc-out-cbo', __itemsBizRegister, 'id', 1, true, true);
    $input.nodeSvcIn = createSelect('node-svc-in-cbo', __itemsBizRegister, 'id', 1, true, true);
    $input.nodeBusiness = createSelect('node-business-cbo', __itemsBusiness, 'id', 1, false, false);
    $input.nodeAttribute = createSelect('node-attribute-cbo', [], 'id', 1, false, false);
    $input.nodeScreen = createSelect('node-screen-cbo', __itemsScreen, 'id', 1, false, false);

    $input.nodeRadValue.on('change', getAttribute);
    $input.nodeRadVariable.on('change', getAttribute);
    $input.nodeRadExpressions.on('change', getAttribute);
    $input.nodeValue.on('change', getAttribute);

    $input.conScript = createSelect('connect-script-cbo', __itemsScript, 'id', 1, true, false);

    var init = function (callback) {
      var __fn = iNet.isFunction(callback) ? callback.createDelegate(this) : iNet.emptyFn;
      if (!__init) {
        __init = true;

        $.postJSON(url.loadType, {}, function (result) {
          var __resultType = result || {};
          $.each(__resultType.elements || [], function (i, type) {
            $.postJSON(url.loadScreen, {service: type}, function (result) {
              var __resultScreen = result || {};
              $.each(__resultScreen.elements || [], function (j, screen) {
                __itemsScreen.push({id: screen.uri, code: screen.uri, name: screen.uri});
              });
              $input.nodeScreen = createSelect('node-screen-cbo', __itemsScreen, 'id', 1, true, false);
            });
          });
        });

        $.postJSON(url.loadBusiness, {}, function (result) {
          var __htmlBusiness = '';
          __htmlBusiness += '<li><div id=wf-business-{0} data-id="{1}" class="circle-tile">';
          __htmlBusiness += '    <a data-code="{2}">';
          __htmlBusiness += '        <div class="social-item">';
          __htmlBusiness += '            <div class="social-info-wrap">';
          __htmlBusiness += '                <div data-code="{3}" class="social-info">';
          __htmlBusiness += '                    <div class="social-info-front social-dribbble">';
          __htmlBusiness += '                        <i data-code="{4}" class="{5}"></i>';
          __htmlBusiness += '                    </div>';
          __htmlBusiness += '                </div>'
          __htmlBusiness += '            </div>'
          __htmlBusiness += '        </div>';
          __htmlBusiness += '    </a>';
          __htmlBusiness += '    <div class="circle-tile-content blue">';
          __htmlBusiness += '        <a data-code="{6}" class="circle-tile-description" data-title="">{7}</a>';
          __htmlBusiness += '    </div>';
          __htmlBusiness += '</div></li>';

          var __html = '<ul>';
          var __result = result || {};
          $.each(__result.elements, function (i, item) {
            __itemsBusiness.push({id: item, code: item, name: item, icon: "icon-gears"});
            __html += String.format(__htmlBusiness, item, item, item, item, item, "icon-gears", item, item);
          });
          __html += '</ul>';
          $input.nodeBusiness = createSelect('node-business-cbo', __itemsBusiness, 'id', 1, false, false);

          wfControl.business.html(__html);
          wfControl.business.find('div[data-id]').draggable(
              /*{
               connectToSortable: ".wf-border"
               },
               {
               drap: function(e,t){
               t.helper.width(400);
               },
               stop: function (e, t) {
               console.log(">> business stop >>", e);
               }
               }*/
          );

          wfControl.business.find('div[data-id]').on('dragstop', function (ui) {
            console.log(">> business drapstop >>", ui.clientX, ui.clientY);
            //console.log(">> business drapstop >>", ui.position.left, ui.position.top);
            var __uiId = ui.currentTarget.id || "";
            $('#' + __uiId).css('left', 0);
            $('#' + __uiId).css('top', 0);
            var __businessId = $('#' + __uiId).attr("data-id") || "";
            self.owner.nodeTemp.type = __businessId;
            self.owner.nodeTemp.icon = getIconBusiness(__businessId);
            $action.NODEADD.trigger('click', {x: ui.clientX, y: ui.clientY});
            changeBusiness(__businessId);
          });
          /*wfControl.business.find('a').on('click', function (e) {
           var __businessId = $(e.target).attr("data-code") || "";
           self.owner.nodeTemp.type = __businessId;
           self.owner.nodeTemp.icon = getIconBusiness(__businessId);
           $action.NODEADD.trigger('click');
           changeBusiness(__businessId);
           });*/
        });

        $.postJSON(url.loadAlias, {zone: self.owner.zone, context: self.owner.context}, function (result) {
          var __result = result || {};
          $.each(__result.items || [], function (i, item) {
            __itemsActor.push({id: item.actor, code: item.actor, name: item.name});
          });
          $input.nodeActor = createSelect('node-actor-cbo', __itemsActor, 'id', 1, true, true);
        });

        $.postJSON(url.loadBizRegister, {}, function (result) {
          var __result = result || {};
          $.each(__result.elements || [], function (i, item) {
            __itemsBizRegister.push({id: item, code: item, name: item});
          });
          $input.nodeSvcOut = createSelect('node-svc-out-cbo', __itemsBizRegister, 'id', 1, true, true);
          $input.nodeSvcIn = createSelect('node-svc-in-cbo', __itemsBizRegister, 'id', 1, true, true);
        });

        $.postJSON(url.loadScript, {zone: self.owner.graph.zone}, function (result) {
          var __result = result || {};
          $.each(__result.items || [], function (i, item) {
            __itemsScript.push({id: item.uuid, code: item.uuid, name: item.name});
          });
          $input.conScript = createSelect('connect-script-cbo', __itemsScript, 'id', 1, true, false);
          $input.conScript.on('change', function () {
            var __value = $input.conScript.getValue() || "";
            if (iNet.isEmpty(__value)) {
              $input.conValue.show();
            } else {
              $input.conValue.val("");
              $input.conValue.hide();
            }
          });
        });

        __fn();
      }
      else {
        __fn();
      }
    }

    // GRAPH PROCESS =================================
    var reloadGraph = function (graph) {
      //graph select view
      var __data = graph || self.owner.graph;
      self.resetData();

      console.log(">> reloadGraph >>", __data);
      self.owner.graph = __data;
      self.owner.uuid = __data.uuid;

      $.postJSON(url.loadGraph, {graph: __data.uuid, zone: __data.zone}, function (result) {
        var __result = result || {};
        if (!iNet.isEmpty(__result.graph)) {
          self.setData(__result);
          setHeight();
        } else {
          setHeight();
          notifyError(resources.wfGraph.title, String.format(resources.wfConstant.load_error, ""));
        }
      }, {
        mask: self.$mask,
        msg: resources.wfConstant.process
      });
    }

    this.resetData = function () {
      self.owner = iNet.apply(self.owner, __owner);
      virtual.reset();
      detailView(false);
    };

    this.setData = function (data) {
      // build node
      var __nodes = data.nodes || [];
      self.owner.nodes = __nodes;
      for (var i = 0; i < __nodes.length; i++) {
        var node = __nodes[i];
        if ((node.nodeName || "").toLowerCase() != "__blank") {
          var __data = {};
          __data.id = node.uuid;
          __data.name = node.nodeName;
          __data.start = node.start;
          __data.endway = node.endway;
          __data.x = node.x;
          __data.y = node.y;
          __data.type = node.type;
          __data.icon = getIconBusiness(node.type);
          virtual.addNode(__data);
          virtual.moveNode(node.uuid, node.x, node.y);
        }
      }

      // build connection
      var __arcs = data.arcs || [];
      self.owner.conns = [];
      self.owner.arcs = [];
      $.each(data.arcs || [], function (i, arc) {
        var __nodeBegin = getNode(arc.taskActorUUID, "uuid") || {};
        var __nodeEnd = getNode(arc.arcTo, "nodeName") || {};
        var __uuidBegin = __nodeBegin.uuid || "";
        var __uuidEnd = __nodeEnd.uuid || "";

        if (__uuidEnd != __uuidBegin) { //find node begin of connection
          virtual.connect(__uuidBegin, __uuidEnd, arc.arcName, arc.uuid);
          self.owner.arcs.push(arc);
        }
      });
    };

    this.loadGraph = function (graph) {
      var __graph = graph || {};
      self.owner.graph = __graph;
      self.owner.uuid = __graph.uuid;
      self.owner.zone = __graph.zone;
      self.owner.context = __graph.context || __config.context;

      var __fnCallBack = function () {
        self.owner.nodeClick = false;
        self.owner.connClick = false;

        wfControl.detail.hide();
        wfControl.design.removeClass('wf-width8');
        wfControl.design.addClass('wf-width12');

        reloadGraph(graph);
      };

      init(__fnCallBack);
    };

    // NODE =================================
    var nodeConfirmDialog = function (title, content, okFn) {
      var __okFn = iNet.isFunction(okFn) ? okFn.createDelegate(this) : iNet.emptyFn;
      if (!nodeDialog) {
        nodeDialog = new iNet.ui.dialog.ModalDialog({
          id: iNet.generateId(),
          title: title || '',
          content: content || '',
          buttons: [
            {
              text: iNet.resources.message.button.ok,
              cls: 'btn-primary',
              icon: 'icon-ok icon-white',
              fn: __okFn
            },
            {
              text: iNet.resources.message.button.cancel,
              cls: 'btn-default',
              icon: 'icon-remove',
              fn: function () {
                this.hide();
              }
            }
          ]
        });
      }
      return nodeDialog;
    };

    var assignNode = function (data, callback) {
      var __fn = iNet.isFunction(callback) ? callback.createDelegate(this) : iNet.emptyFn;
      var __dataNode = data || {};
      var __graph = self.owner.graph.uuid || "";
      var __name = __dataNode.name || "";
      var __actor = __dataNode.actor || "";
      var __param = {graph: __graph, name: __name, actor: __actor};
      console.log(">> assignNode param >>", __param);
      if (!iNet.isEmpty(__graph) && !iNet.isEmpty(__name) && !iNet.isEmpty(__actor)) {
        $.postJSON(url.assignNode, __param, function (result) {
          var __result = result || {};
          console.log(">> assignNode result >>", __result);
          if (__name == __result.nodeName) {
            __fn({status: 1, result: __dataNode}); //callback
          } else {
            __fn({status: 0, result: __dataNode}); //callback
          }
        }, {
          mask: self.$mask,
          msg: resources.wfConstant.process
        });
      } else {
        __fn({status: 0, result: __dataNode}); //callback
      }
    };

    var saveNode = function (data, callback) {
      var __fn = iNet.isFunction(callback) ? callback.createDelegate(this) : iNet.emptyFn;
      var __dataNode = data || {};
      var __url = iNet.isEmpty(__dataNode.task) ? url.createNode : url.updateNode;

      console.log(">> saveNode param >>", __dataNode);
      $.postJSON(__url, __dataNode, function (result) {
        var __result = result || {};
        console.log(">> saveNode result >>", __result);
        if (!iNet.isEmpty(__result.uuid)) {
          $input.nodeName.prop("readonly", true);
          assignNode(__dataNode, callback);
        } else {
          __fn({status: 0, result: __result}); // save error
        }
      }, {
        mask: self.$mask,
        msg: resources.wfConstant.process
      });
    };

    var loadNode = function (graph, zone, task) {
      var __data = {graph: graph, zone: zone, task: task};

      $.postJSON(url.loadNode, __data, function (result) {
        var __result = result || {};
        if (!iNet.isEmpty(__result.uuid)) {
          setNode(__result);
        }
      }, {
        mask: self.$mask,
        msg: resources.wfConstant.process
      });
    };

    var getDataNodeForSave = function (dataNode) {
      var __dataNode = dataNode || {};
      __dataNode.graph = self.owner.graph.uuid;
      __dataNode.zone = self.owner.graph.zone;
      __dataNode.task = __dataNode.uuid;
      __dataNode.actor = (__dataNode.actors || []).toString();
      for (var key in __dataNode.attributes || {}) {
        __dataNode["_" + key] = __dataNode.attributes[key];
      }

      delete __dataNode.actors;
      delete __dataNode.attributes;

      return __dataNode;
    };

    var getNode = function (value, key) {
      var __key = key || "uuid";
      var __node = {};
      $.each(self.owner.nodes || [], function (n, node) {
        if ((node[key] || "") == value) {
          __node = node || {};
          return false; //break $
        }
      });
      return __node;
    };

    var setNode = function (data) {
      var __data = data || {};
      console.log(">> setNode >>", __data);
      self.owner.nodeAttr = []; //reset
      self.owner.node = __data || {}; //reset

      self.owner.nodeUuid = __data.uuid || 'temp';
      $input.nodeName.prop("readonly", __data.uuid != 'temp');
      $input.nodeName.val(__data.nodeName);
      $input.nodeMultiDecision.prop("checked", (__data.multiDecision || 0) ? true : false);
      var __nodeAttr = ((self.owner.nodes || [])[__data.uuid] || {}).attributes || {};
      console.log("(__data.actors || []).toString()", (__data.actors || []).toString());
      $input.nodeActor.setValue([(__data.actors || []).toString()]);
      $input.nodeSvcIn.setValue([(__data.svcIn || []).toString()]);
      $input.nodeSvcOut.setValue([(__data.svcOut || []).toString()]);
      $input.nodeJoinType.setValue(__data.joinType);

      if (__data.start) {
        $input.nodeType.setValue('start');
      } else {
        $input.nodeType.setValue('work');
      }
      changeBusiness(__data.type);

      var __attributes = {};
      __attributes = iNet.apply(__attributes, __data.attributes || {});
      __attributes = iNet.apply(__attributes, __nodeAttr);
      for (var key in __attributes) {
        if (key == 'screen') {
          $input.nodeScreen.setValue(__attributes[key]);
        } else {
          self.owner.nodeAttr.push({id: "_" + key, value: __attributes[key]});
        }
      }
    };

    var createNode = function () {
      var __dataNode = {
        joinParam: '',
        guard: '',
        zone: self.owner.graph.zone,
        graph: self.owner.graph.uuid,
        name: $input.nodeName.val(),
        multiDecision: $input.nodeMultiDecision.prop("checked"),
        type: $input.nodeBusiness.getValue(),
        actor: $input.nodeActor.getValue().toString(),
        svcIn: $input.nodeSvcIn.getValue().toString(),
        svcOut: $input.nodeSvcOut.getValue().toString()
      };

      var ui = self.owner.nodeUI;
      if (!!ui.task && ui.task == 'temp') {
        __dataNode.x = ui.x;
        __dataNode.y = ui.y;
      } else {
        __dataNode.x = self.owner.nodeTemp.x;
        __dataNode.y = self.owner.nodeTemp.y;
      }
      __dataNode.start = true;
      __dataNode.endway = false;

      var item = "";
      for (var i = 0; i < self.owner.nodeAttr.length; i++) {
        item = self.owner.nodeAttr[i] || {};
        __dataNode[item.id] = item.value;
      }

      var __fnCallBack = function (resultBack) {
        var __resultBack = resultBack || {};
        if (__resultBack.status == 0) { // fail
          notifyError(resources.wfNode.title, String.format(resources.wfConstant.save_error, ""));
        }
        else if (__resultBack.status == 1) { // success
          notifySuccess(resources.wfNode.title, resources.wfConstant.save_success);
        }
        reloadGraph();

      };
      saveNode(__dataNode, __fnCallBack);
    };

    var updateNode = function () {
      var __dataNode = {
        joinParam: '',
        guard: '',
        task: self.owner.nodeUuid,
        graph: self.owner.graph.uuid,
        zone: self.owner.graph.zone,
        name: $input.nodeName.val(),
        multiDecision: $input.nodeMultiDecision.prop("checked"),
        joinType: $input.nodeJoinType.getValue(),
        type: $input.nodeBusiness.getValue(),
        actor: $input.nodeActor.getValue().toString(),
        svcIn: $input.nodeSvcIn.getValue().toString(),
        svcOut: $input.nodeSvcOut.getValue().toString(),
        _screen: $input.nodeScreen.getValue()
      };

      var item = "";
      for (var i = 0; i < self.owner.nodeAttr.length; i++) {
        item = self.owner.nodeAttr[i] || {};
        __dataNode[item.id] = item.value;
      }

      var type = $input.nodeType.getValue();
      if (type == 'start') {
        __dataNode.start = true;
        __dataNode.endway = false;
      } else if (type == 'work') {
        __dataNode.start = false;
        __dataNode.endway = false;
      }


      var __fnCallBack = function (resultBack) {
        var __resultBack = resultBack || {};
        if (__resultBack.status == 0) { // fail
          notifyError(resources.wfNode.title, String.format(resources.wfConstant.save_error, ""));
        }
        else if (__resultBack.status == 1) { // success
          notifySuccess(resources.wfNode.title, resources.wfConstant.save_success);
        }
        reloadGraph();
      };
      saveNode(__dataNode, __fnCallBack);
    };

    $action.NODEADD.click(function (e, position) {
      var __data = {};
      __data.id = self.owner.nodeTemp.uuid;
      __data.name = self.owner.nodeTemp.nodeName;
      __data.start = self.owner.nodeTemp.start;
      __data.endway = self.owner.nodeTemp.endway;
      __data.x = !iNet.isEmpty(position.x) ? (position.x - 50) : self.owner.nodeTemp.x;
      __data.y = !iNet.isEmpty(position.y) ? (position.y - 220) : self.owner.nodeTemp.y;
      __data.type = self.owner.nodeTemp.type;
      __data.icon = self.owner.nodeTemp.icon;

      if (__data.x >= 0 && __data.y >= 0) {
        virtual.removeNode('temp');
        virtual.addNode(__data);
        self.owner.nodeTemp.x = __data.x;
        self.owner.nodeTemp.y = __data.y;
        setNode(self.owner.nodeTemp);

        self.owner.nodeClick = true;
        self.owner.connClick = false;
        detailView(false);
      }
    });
    $action.NODESAVE.click(function () {
      var __errors = [];
      if (iNet.isEmpty($input.nodeName.val())) {
        $input.nodeName.focus();
        __errors.push(String.format(resources.wfConstant.is_not_blank, resources.wfNode.name));
      }
      if (iNet.isEmpty($input.nodeActor.getValue().toString())) {
        __errors.push((__errors.length > 0 ? '<br/>' : '') + String.format(resources.wfConstant.is_not_blank, resources.wfNode.actor));
      }
      var __nodeName = $input.nodeName.val().trim().toLowerCase();
      $.each(self.owner.nodes || [], function (n, node) {
        if (node.nodeName.trim().toLowerCase() == __nodeName && self.owner.nodeUuid != node.uuid) {
          __errors.push((__errors.length > 0 ? '<br/>' : '') + String.format(resources.wfConstant.is_exists, resources.wfNode.name));
          return false; //break
        }
      });

      if (__errors.length > 0) {
        notifyError(resources.wfNode.title, String.format("{0}", __errors));
        return;
      }

      if (self.owner.nodeUuid == 'temp') {
        createNode();
      } else {
        updateNode();
      }
    });
    $action.NODEDEL.click(function () {
      if (self.owner.nodeUuid == 'temp') {
        virtual.removeNode(self.owner.nodeUuid);
        self.owner.nodeClick = false;
        detailView(false);
        return;
      }
      //TODO ask user before delete
      var __numNodeStart = 0;
      if (self.owner.nodes.length > 0) {
        $.each(self.owner.nodes || [], function (i, node) {
          var __node = node || {};
          if (__node.start) {
            __numNodeStart++;
          }
        });
      }

      if (__numNodeStart == 1 && self.owner.node.start) {
        notifyError(resources.wfNode.title, resources.wfConstant.can_not_del_all_nodes_start);
        return;
      }

      var __confirmDialog = nodeConfirmDialog(resources.wfNode.title, "Content", function () {
        var __data = {
          graph: self.owner.graph.uuid,
          zone: self.owner.graph.zone,
          task: self.owner.nodeUuid
        };

        $.postJSON(url.delNode, __data, function (result) {
          var __result = result || {};
          if (!iNet.isEmpty(__result.uuid)) {
            self.owner.nodeClick = false;
            detailView(false);
            reloadGraph();
            notifySuccess(resources.wfNode.title, resources.wfConstant.delete_success);
            __confirmDialog.hide();
          } else {
            // save error
            notifyError(resources.wfNode.title, String.format(resources.wfConstant.delete_error, ""));
          }
        }, {
          mask: self.$mask,
          msg: resources.wfConstant.process
        });
      });
      __confirmDialog.setContent(String.format(resources.wfConstant.delete_confirm, self.owner.node.nodeName));
      __confirmDialog.show();
    });

    // CONNECTION =================================
    var arcConfirmDialog = function (title, content, okFn) {
      var __okFn = iNet.isFunction(okFn) ? okFn.createDelegate(this) : iNet.emptyFn;
      if (!arcDialog) {
        arcDialog = new iNet.ui.dialog.ModalDialog({
          id: iNet.generateId(),
          title: title || '',
          content: content || '',
          buttons: [
            {
              text: iNet.resources.message.button.ok,
              cls: 'btn-primary',
              icon: 'icon-ok icon-white',
              fn: __okFn
            },
            {
              text: iNet.resources.message.button.cancel,
              cls: 'btn-default',
              icon: 'icon-remove',
              fn: function () {
                this.hide();
              }
            }
          ]
        });
      }
      return arcDialog;
    };

    var assignScript = function (data) {
      var __data = data || {};
      console.log(">> assignScript data >>", __data);

      var __fnAssignScript = function (param) {
        var __param = param || {};

        if (iNet.isEmpty(__param.condition) && iNet.isEmpty(__param.script)) {
          notifySuccess(resources.wfConnection.title, resources.wfConstant.save_success);
          reloadGraph();
        } else {
          $.postJSON(url.arcScript, {
            condition: __param.condition,
            scriptTemplateID: __param.scriptTemplateID,
            arc: __param.arc,
            priority: __param.priority
          }, function (result) {
            var __result = result || {};
            if (__result.type == "ERROR") {
              var __error = [];
              $.each(__result.errors || [], function (e, err) {
                __error.push(err.message);
              });
              notifyError(resources.wfConnection.title, String.format("{0}", __error));
            } else {
              notifySuccess(resources.wfConnection.title, resources.wfConstant.save_success);
            }
            reloadGraph();
          });
        }
      };

      if (iNet.isEmpty(__data.uuid)) {
        $.postJSON(url.loadGraph, {graph: __data.graph, zone: __data.zone}, function (result) {
          var __result = result || {};
          var __arcs = __result.arcs || [];
          console.log(">> assignScript result >>", __arcs);
          $.each(__arcs, function (a, arc) {
            if (arc.arcName == __data.label) {
              //arc, condition, scriptTemplateID, priority
              __fnAssignScript({
                condition: __data.condition,
                scriptTemplateID: __data.script,
                arc: arc.uuid,
                priority: __data.priority
              });
              return false;// break $
            }
          });
        }, {
          mask: self.$mask,
          msg: resources.wfConstant.process
        });
      } else {
        __fnAssignScript({
          condition: __data.condition,
          scriptTemplateID: __data.script,
          arc: __data.uuid,
          priority: __data.priority
        });
      }
    };

    var saveConn = function (data, callback) {
      var __fn = iNet.isFunction(callback) ? callback.createDelegate(this) : iNet.emptyFn;
      var __dataConn = data || {};
      var __url = url.arcCreate;

      console.log(">> saveConn param >>", __dataConn);
      if (iNet.isEmpty(__dataConn.uuid)) {
        $.postJSON(__url, __dataConn, function (result) {
          var __result = result || {};
          console.log(">> saveConn result >>", __result);
          if (!iNet.isEmpty(__result.uuid)) {
            $input.conName.prop("readonly", true);
            __fn({status: 1, result: __result}); //callback
          } else {
            __fn({status: 0, result: __result}); //save error
          }
        }, {
          mask: self.$mask,
          msg: resources.wfConstant.process
        });
      } else {
        $input.conName.prop("readonly", true);
        __fn({status: 1, result: {}}); //callback
      }

    };

    $action.CONNSAVE.click(function () {
      var conn = self.owner.conn;
      var __errors = [];

      var __connName = $input.conName.val();
      if (iNet.isEmpty(__connName)) {
        $input.conName.focus();
        __errors.push(String.format(resources.wfConstant.is_not_blank, resources.wfConnection.name));
      }

      $.each(self.owner.arcs || [], function (a, arc) {
        if (arc.arcName.trim().toLowerCase() == __connName.trim().toLowerCase() && conn.sourceId == arc.taskActorUUID && arc.uuid != conn.uuid) {
          __errors.push((__errors.length > 0 ? '<br/>' : '') + String.format(resources.wfConstant.is_exists, resources.wfConnection.name));
          return false; //break
        }
      });
      if (conn.sourceId == "temp" || conn.targetId == "temp") {
        __errors.push(resources.wfConstant.can_not_create_connection_node_temp);
      }

      if (__errors.length > 0) {
        notifyError(resources.wfConnection.title, String.format("{0}", __errors));
        return;
      }

      var __data = {
        uuid: self.owner.conn.uuid,
        graph: self.owner.graph.uuid,
        zone: self.owner.graph.zone,
        label: __connName,
        from: conn.sourceId,
        to: conn.targetId,
        priority: iNet.isNumber(Number($input.conPriority.val() || 0)) ? Number($input.conPriority.val() || 0) : 0,
        condition: $input.conValue.val(),
        script: $input.conScript.getValue()
      };
      var __fnConnCallBack = function (resultBack) {
        var __resultBack = resultBack || {};
        if (__resultBack.status == 0) { // fail
          reloadGraph();
          notifyError(resources.wfConnection.title, String.format(resources.wfConstant.save_error, ""));
        } else if (__resultBack.status == 1) { // success
          assignScript(__data);
        }
      };

      var __nodeSource = getNode(conn.sourceId, "uuid") || {};
      var __nodeTarget = getNode(conn.targetId, "uuid") || {};

      if (__nodeTarget.start) {
        var __dataNode = getDataNodeForSave(__nodeTarget || {});
        __dataNode.start = false;

        var __fnNodeCallBack = function (resultBack) {
          var __resultBack = resultBack || {};
          if (__resultBack.status == 0) { // fail
            saveConn(__data, __fnConnCallBack);
          }
          else if (__resultBack.status == 1) { // success
            if (!__nodeSource.start) {
              var __isExistsArcTo = false;
              $.each(self.owner.arcs || [], function (a, arc) {
                if (arc.arcTo.toString().toLowerCase() == __nodeSource.nodeName.toString().toLowerCase()) {
                  __isExistsArcTo = true;
                  return false;
                }
              });

              if (!__isExistsArcTo) {
                __dataNode = getDataNodeForSave(__nodeSource || {});
                __dataNode.start = true;

                saveNode(__dataNode, __fnNodeCallBack);
              } else {
                saveConn(__data, __fnConnCallBack);
              }
            } else {
              saveConn(__data, __fnConnCallBack);
            }
          }

        };
        saveNode(__dataNode, __fnNodeCallBack);
      }
      else if (!__nodeSource.start) {
        var __isExistsArcTo = false;
        $.each(self.owner.arcs || [], function (a, arc) {
          if (arc.arcTo.toString().toLowerCase() == __nodeSource.nodeName.toString().toLowerCase()) {
            __isExistsArcTo = true;
            return false;
          }
        });

        if (!__isExistsArcTo) {
          __dataNode = getDataNodeForSave(__nodeSource || {});
          __dataNode.start = true;

          var __fnNodeCallBack = function (resultBack) {
            var __resultBack = resultBack || {};
            if (__resultBack.status == 0) { // fail
              saveConn(__data, __fnConnCallBack);
            }
            else if (__resultBack.status == 1) { // success
              saveConn(__data, __fnConnCallBack);
            }

          };
          saveNode(__dataNode, __fnNodeCallBack);
        } else {
          saveConn(__data, __fnConnCallBack);
        }
      }
      else {
        saveConn(__data, __fnConnCallBack);
      }
    });
    $action.CONNDEL.click(function () {
      if (iNet.isEmpty(self.owner.conn.uuid)) {
        $.each(self.owner.conns || [], function (c, con) {
          if (con.sourceId == self.owner.conn.sourceId && con.targetId == self.owner.conn.targetId) {
            self.owner.conns.splice(self.owner.conns.indexOf(con), 1);
          }
        });
        virtual.detach(self.owner.conn);
        self.owner.connClick = false;
        detailView(false);
        return;
      }

      var __conUuid = self.owner.conn.uuid || "";
      var __arcDel = {};
      $.each(self.owner.arcs || [], function (a, arc) {
        if (arc.uuid == __conUuid) {
          __arcDel = arc;
          return false; //break
        }
      });
      var __confirmDialog = arcConfirmDialog(resources.wfConnection.title, "Content", function () {
        var __data = {
          from: self.owner.conn.sourceId,
          to: self.owner.conn.targetId,
          graph: self.owner.graph.uuid,
          zone: self.owner.graph.zone
        };
        $.postJSON(url.arcDelete, __data, function (result) {
          var __result = result || {};
          if (!iNet.isEmpty(__result.uuid)) {
            self.owner.connClick = false;
            detailView(false);
            reloadGraph();
            notifySuccess(resources.wfConnection.title, resources.wfConstant.delete_success);
            __confirmDialog.hide();
          } else {
            // save error
            notifyError(resources.wfConnection.title, String.format(resources.wfConstant.delete_error, ""));
          }
        }, {
          mask: self.$mask,
          msg: resources.wfConstant.process
        });
      });
      __confirmDialog.setContent(String.format(resources.wfConstant.delete_confirm, __arcDel.arcName));
      __confirmDialog.show();
    });

    // WINDOW =================================
    $(window).on('resize', function () {
      setHeight();
    });
    self.hide();
  };

  iNet.extend(iNet.ui.admin.Workflow, iNet.Component, {
    constructor: iNet.ui.admin.Workflow,
    version: '1.0',
    resetData: function () {
      this.resetData();
    },
    loadGraph: function (graph) {
      this.loadGraph(graph);
    },
    getOwner: function () {
      return this.owner;
    },
    show: function () {
      this.$id.show();
    },
    hide: function () {
      this.$id.hide();
    }
  });
});