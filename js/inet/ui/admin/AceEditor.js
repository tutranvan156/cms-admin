/**
 * #PACKAGE: admin
 * #MODULE: ace-editor
 */
/**
 * Copyright (c) 2019 iNet Solutions Corp.,
 * Created by Nguyen Ba Tran Van<vannbt@inetcloud.vn>
 *         on 10:15 17/06/2019.
 * -------------------------------------------
 * @project cms-admin
 * @author vannbt
 * @file AceEditor.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.AceEditor
   * @extends iNet.Component
   */
  iNet.ns('iNet.ui.admin.AceEditor');
  iNet.ui.admin.AceEditor = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = this.id || '#ace-editor';
    this.editor = ace.edit(this.id);
    this.editor.getSession().setUseWorker(true);
    this.editor.setTheme("ace/theme/chrome");
    this.editor.getSession().setMode("ace/mode/" + this.mode);
    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: false
    });
    this.editor.commands.on("afterExec", function (e) {
      if (e.command.name == "insertstring" && /^[\<.]$/.test(e.args)) {
        _this.editor.execCommand("startAutocomplete")
      }
    });
    this.editor.setShowPrintMargin(false);
    this.editor.setHighlightActiveLine(false);
    this.editor.commands.addCommand({
      name: 'format',
      bindKey: {win: "Ctrl-Shift-o"},
      exec: function (editor) {
        var val;
        if (_this.mode === CMSConfig.ACE_MODE.CSS) {
          val = css_beautify(editor.getValue());
        } else if (_this.mode === CMSConfig.ACE_MODE.JS) {
          val = js_beautify(editor.getValue());
        } else {
          val = html_beautify(editor.getValue());
        }
        editor.setValue(val, 1);
      }
    });
    iNet.ui.admin.AceEditor.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.admin.AceEditor, iNet.ui.ViewWidget, {
    insertContent: function (content) {
      this.editor.insert(content);
      this.editor.focus();
      this.editor.navigateFileEnd();
    },
    addContainer: function () {
      this.insertContent("<div class=\"container\"></div>");
    },
    addRow: function () {
      this.insertContent("<div class=\"row\"></div>");
    },
    formatCode: function (type) {
      var val;
      if (type === CMSConfig.ACE_MODE.CSS) {
        val = css_beautify(this.editor.getValue());
      } else if (type === CMSConfig.ACE_MODE.JS) {
        val = js_beautify(this.editor.getValue());
      } else {
        val = html_beautify(this.editor.getValue());
      }
      this.editor.setValue(val, 1);
      this.editor.focus();
      this.editor.navigateFileEnd();
    },
    setValue: function (value, type) {
      var val;
      if (type === CMSConfig.ACE_MODE.CSS) {
        val = css_beautify(value);
      } else if (type === CMSConfig.ACE_MODE.JS) {
        val = js_beautify(value);
      } else {
        val = html_beautify(value);
      }
      this.editor.setValue(val, 1);
    },
    getValue: function () {
      return this.editor.getValue() || '';
    }
  });
});
