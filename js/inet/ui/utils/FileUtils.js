// #PACKAGE: utils
// #MODULE: file
/**
 * @class FileFormat
 * @extends Object.
 *
 * support control document format.
 */
var FileUtils = {
  /**
   * distance of openoffice and msoffice.
   */
  NEXT_FORMAT: 6,
  /**
   * OpenOffice Word
   */
  OO_WORD: 0,
  /**
   * OpenOffice Excel.
   */
  OO_EXCEL: 1,
  /**
   * OpenOffice Power Point.
   */
  OO_POWERPOINT: 2,
  /**
   * OpenOffice Graph.
   */
  OO_GRAPH: 3,
  /**
   * OpenOffice Math.
   */
  OO_MATH: 4,
  /**
   * OpenOffice Database.
   */
  OO_DATABASE: 5,
  /**
   * Microsoft Word.
   */
  MS_WORD: 6,
  /**
   * Microsoft Excel.
   */
  MS_EXCEL: 7,
  /**
   * Microsoft Power Point.
   */
  MS_POWERPOINT: 8,
  /**
   * Microsoft Access.
   */
  MS_ACCESS: 9,
  /**
   * Microsoft Project.
   */
  MS_PROJECT: 10,
  /**
   * Microsoft Visio.
   */
  MS_VISIO: 11,
  /**
   * Text document.
   */
  DOC_TEXT: 12,
  /**
   * HTML document.
   */
  DOC_HTML: 13,
  /**
   * XML document.
   */
  DOC_XML: 14,
  /**
   * PDF document.
   */
  DOC_PDF: 15,
  /**
   * Image document.
   */
  DOC_IMG: 16,
  /**
   * iNet document.
   */
  DOC_INET: 17,
  /**
   * Other document
   */
  DOC_OTHER: 18,
  /**
   * Microsoft Word 2007
   */
  MS_WORD_2007: 19,
  /**
   * Microsoft Excel 2007.
   */
  MS_EXCEL_2007: 20,
  /**
   * Microsoft PowerPoint 2007.
   */
  MS_POWERPOINT_2007: 21,
  /**
   * Document format
   */
  FORMAT: ['oo-word', 'oo-excel', 'oo-powerpoint', 'oo-graph', 'oo-math', 'oo-database', 'ms-word', 'ms-excel',
    'ms-powerpoint', 'ms-access', 'ms-project', 'ms-visio', 'doc-text', 'doc-html', 'doc-xml', 'doc-pdf',
    'doc-img', 'doc-inet', 'doc-other', 'ms-word7', 'ms-excel7', 'ms-powerpoint7'],
  /**
   * Document extension format.
   */
  EXT_FORMAT: ['odt', 'ods', 'odp', 'odg', 'odf', 'odb', 'doc', 'xls', 'ppt', 'mdb', 'mpp',
    'vsd', 'txt', 'html', 'xml', 'pdf', 'jpg', 'dtt', 'oth', 'docx', 'xlsx', 'pptx'],
  /**
   * Document format name.
   */
  FORMAT_NAME: [
    'Open Office Word',
    'Open Office Excel',
    'Open Office Powerpoint',
    'Open Office Graph',
    'Open Office Math',
    'Open Office Database',
    'Microsoft Word',
    'Microsoft Excel',
    'Microsoft Powerpoint',
    'Microsoft Access',
    'Microsoft Project',
    'Microsoft Visio',
    'Text Document',
    'HTML Document',
    'XML Document',
    'PDF Document',
    'Image Document',
    'iNet Document',
    'Others',
    'Microsoft Word 2007',
    'Microsoft Excel 2007',
    'Microsoft PowerPoint 2007'
  ],
  /**
   * @return the file extension.
   */
  getExtension: function (file) {
    if (file == undefined || file == '')
      return '';
    var position = file.lastIndexOf('.');
    if (position == -1)
      return '';

    // get file extension.
    return file.substr(position + 1, file.length);
  },

  /**
   * @return the format value.
   */
  getFormat: function (extension) {
    for (var index = 0; index < this.EXT_FORMAT.length; index++) {
      if (extension == this.EXT_FORMAT[index])
        return index;
    }

    // return document other.
    return this.DOC_OTHER;
  },
  getIcon: function (extension) {
    var iconCls = 'file-icon xicon-' + extension || 'oth';
    //'icon-paper-clip'
    return iconCls;
  },
  getFileIcon: function (file) {
    var ext = FileUtils.getExtension(file);
    return FileUtils.getIcon(ext);
  },
  /**
   * change format to ms office
   * @param {int} format- the given document format
   * @return {int}
   */
  changeFormatToMSOffice: function (format) {
    return format + this.NEXT_FORMAT;
  },

  /**
   * change format to openoffice
   * @param {int} format - the given document format
   * @return {int}
   */
  changeFormatToOO: function (format) {
    return format - this.NEXT_FORMAT;
  },
  getSize: function (size) {
    var __size = size || 0;
    var __rageToFix = 2;
    if (__size < 1024) {
      return String.format('{0} B', __size.toFixed(__rageToFix))
    }
    __size = __size / 1024;
    if (__size < 1024) {
      return String.format('{0} KB', __size.toFixed(__rageToFix))
    }
    __size = __size / 1024;
    if (__size < 1024) {
      return String.format('{0} MB', __size.toFixed(__rageToFix))
    }
    __size = __size / 1024;
    if (__size < 1024) {
      return String.format('{0} GB', __size.toFixed(__rageToFix))
    }
  }
};
