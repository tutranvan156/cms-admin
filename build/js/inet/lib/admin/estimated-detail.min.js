/**
 * #PACKAGE: admin
 * #MODULE: estimated-detail
 */
/**
 * Copyright (c) 2018 iNet Solutions Corp.,
 * Created by Nguyen Ba Chi Cong<nbccong@inetcloud.vn>
 *         on 10:38 28/08/2018.
 * -------------------------------------------
 * @project cms-admin
 * @author nbchicong
 * @file EstimatedDetail.js
 */
$(function () {
  /**
   * @class iNet.ui.admin.EstimatedDetail
   * @extends iNet.ui.WidgetExt
   */
  iNet.ns('iNet.ui.admin.EstimatedDetail');
  iNet.ui.admin.EstimatedDetail = function (options) {
    var _this = this;
    iNet.apply(this, options || {});
    this.id = 'estimated-detail-wg';
    this.formId = 'form-content';
    this.resourceRoot = this.resourceRoot || iNet.resources.message;
    this.module = 'estimated';
    this.revenue = {};
    this.expenditure = {};

    this.toolbar = {
      BACK: $('#detail-btn-back'),
      CREATE: $('#detail-btn-create'),
      SAVE: $('#detail-btn-save')
    };

    this.form = {
      year: $('#cbb-year'),
      district: $('#cbb-district'),
      ward: $('#cbb-ward'),

      balanceRevenue: $('#txt-balance-revenue'),
      localRevenue: $('#txt-local-revenue'),
      aidRevenue: $('#txt-aid-revenue'),
      previousYearRevenue: $('#txt-previous-year-revenue'),
      superiorRevenue: $('#txt-superior-revenue'),
      totalRevenue: $('#txt-total-revenue'),

      balanceCost: $('#txt-balance-cost'),
      investCost: $('#txt-invest-cost'),
      dailyCost: $('#txt-daily-cost'),
      redundancyCost: $('#txt-redundancy-cost'),
      superiorCost: $('#txt-superior-cost'),
      totalCost: $('#txt-total-cost')
    };

    this.formValidator = new iNet.ui.form.Validate({
      id: this.formId,
      rules: [{
        id: this.form.year.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('year'));
        }
      }, {
        id: this.form.district.prop('id'),
        validate: function (v) {
          if (iNet.isEmpty(v))
            return String.format(iNet.resources.message.field_not_empty, _this.getText('unit'));
        }
      }]
    });

    this.groupSelect = this.initSelect2(this.form.district, AddressAPI.URL.DISTRICT_LIST, {city: iNet.cityCode}, 'Chọn Huyện/TP');
    // this.wardSelect = this.initSelect2(this.form.ward, AddressAPI.URL.WARD_LIST, {district: this.getDistrict()}, 'Chọn Phường/Xã/TT');

    iNet.ui.admin.EstimatedDetail.superclass.constructor.call(this);

    this.toolbar.BACK.on('click', function () {
      _this.hide();
      _this.fireEvent('back', _this);
    });

    this.toolbar.CREATE.on('click', function () {
      _this.setRecordId(null);
      _this.resetForm();
    });

    this.toolbar.SAVE.on('click', function () {
      console.log('button save has been click with validator: ', _this.getFormValidator());
      console.log('validation result: ', _this.getFormValidator().check());
      if (_this.getFormValidator().check()) {
        _this.save();
      }
    });

    this.form.district.on('change.select2', function () {
      _this.setDistrict(_this.form.district.val());
    });

    this.form.localRevenue.on('change', function () {
      _this.revenue.local = this.value;
      _this.changeRevenue();
    });

    this.form.aidRevenue.on('change', function () {
      _this.revenue.aid = this.value;
      _this.changeRevenue();
    });

    this.form.previousYearRevenue.on('change', function () {
      _this.revenue.previousYear = this.value;
      _this.changeRevenue();
    });

    this.form.superiorRevenue.on('change', function () {
      _this.revenue.superior = this.value;
      _this.changeRevenue();
    });

    this.form.investCost.on('change', function () {
      _this.expenditure.invest = this.value;
      _this.changeCost();
    });

    this.form.dailyCost.on('change', function () {
      _this.expenditure.daily = this.value;
      _this.changeCost();
    });

    this.form.redundancyCost.on('change', function () {
      _this.expenditure.redundancy = this.value;
      _this.changeCost();
    });

    this.form.superiorCost.on('change', function () {
      _this.expenditure.superior = this.value;
      _this.changeCost();
    });
  };

  iNet.extend(iNet.ui.admin.EstimatedDetail, iNet.ui.WidgetExt, {
    setDistrict: function (value) {
      this.district = value;
    },
    getDistrict: function () {
      return this.district || '';
    },
    changeRevenue: function () {
      var balance = parseInt(this.form.localRevenue.val())
          + parseInt(this.form.aidRevenue.val());
      var total = balance
          + parseInt(this.form.previousYearRevenue.val())
          + parseInt(this.form.superiorRevenue.val());

      this.revenue.balance = balance;
      this.revenue.total = total;
      this.form.balanceRevenue.val(balance);
      this.form.totalRevenue.val(total);
    },
    changeCost: function () {
      var balance = parseInt(this.form.investCost.val())
          + parseInt(this.form.dailyCost.val())
          + parseInt(this.form.redundancyCost.val());
      var total = balance
          + parseInt(this.form.superiorCost.val());

      this.expenditure.balance = balance;
      this.expenditure.total = total;
      this.form.balanceCost.val(balance);
      this.form.totalCost.val(total);
    },
    changeDistrict: function (code) {
      var _this = this;
      AddressAPI.listDistrict({city: iNet.cityCode}, function (results) {
        var items = results.items || [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].code === code) {
            _this.triggerSelect2(_this.form.district, items[i]);
            break;
          }
        }
      });
    },
    changeWard: function (wardCode, districtCode) {
      var _this = this;
      AddressAPI.listWard({district: districtCode}, function (results) {
        var items = results.items || [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].code === wardCode) {
            _this.triggerSelect2(_this.form.ward, items[i]);
            break;
          }
        }
      });
    },
    initSelect2: function (element, url, params, placeholderMsg) {
      var _this = this;
      return element.select2({
        placeholder: placeholderMsg,
        allowClear: true,
        ajax: {
          url: url,
          dataType: 'json',
          multiple: true,
          delay: 250,
          data: function (data) {
            data.page = data.page || 0;
            return {
              keyword: data.term,
              pageNumber: data.page,
              pageSize: CMSConfig.PAGE_SIZE,
              city: iNet.cityCode,
              district: _this.getDistrict()
            };
          },
          processResults: function (data, params) {
            var __results = [];
            var __data = data.items || [];
            __data.forEach(function (item) {
              __results.push({
                id: item.code || item.uuid,
                text: item.name
              });
            });
            return {
              results: __results,
              pagination: {
                more: (CMSConfig.PAGE_SIZE * 30) < data.total
              }
            };
          },
          cache: true
        }
      });
    },
    triggerSelect2: function (select, data) {
      var option = new Option(data.name, data.code, true, true);
      select.append(option).trigger('change');
      select.trigger({
        type: 'select2:select',
        params: {
          data: data
        }
      });
    },
    resetSelect2: function (el) {
      el.val(null).trigger('change');
    },
    getFormEl: function () {
      return $('#' + this.formId);
    },
    /**
     * @returns {iNet.ui.form.Validate}
     */
    getFormValidator: function () {
      return this.formValidator;
    },
    setRecordId: function (uuid) {
      this.recordId = uuid;
    },
    getRecordId: function () {
      return this.recordId;
    },
    setRecord: function (record) {
      this.record = record;
      this.setRecordId(record.uuid);
    },
    getRecord: function () {
      return this.record || {};
    },
    getFormData: function () {
      var fd = this.getFormEl().serializeArray();
      fd.push({name: 'revenue', value: JSON.stringify(this.revenue)});
      fd.push({name: 'expenditure', value: JSON.stringify(this.expenditure)});
      fd.push({name: 'period', value: 12});
      return fd;
    },
    setFormData: function (data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var value = data[key];
          if (key === 'districtCode') {
            this.changeDistrict(value);
          }
          else if (key === 'wardCode') {
            this.changeWard(value, data.group || this.getDistrict());
          }
          else if (key === 'revenue') {
            for (var revenueKey in value) {
              if (value.hasOwnProperty(revenueKey)) {
                this.getFormEl().find('[data-name="_' + revenueKey + 'Revenue"]').val(value[revenueKey]);
              }
            }
          }
          else if (key === 'expenditure') {
            for (var expenditureKey in value) {
              if (value.hasOwnProperty(expenditureKey)) {
                this.getFormEl().find('[data-name="_' + expenditureKey + 'Cost"]').val(value[expenditureKey]);
              }
            }
          }
          $('[name="' + key + '"]').val(value);
        }
      }
    },
    resetForm: function () {
      this.setRecordId(null);
      this.getFormEl()[0].reset();
      this.revenue = {};
      this.expenditure = {};
      this.resetSelect2(this.form.district);
    },
    save: function () {
      var _this = this;
      var formData = this.getFormData();
      console.log('save function has been call with doc id: ', this.getRecordId());
      if (this.getRecordId()) {
        formData.push({name: 'uuid', value: this.getRecordId()});
      }
      StateBudgetAPI.save(formData, function (result) {
        if (result.type === CMSConfig.TYPE_ERROR) {
          _this.error(_this.getText('save'), _this.getText('save_error'));
        }
        else {
          _this.success(_this.getText('save'), _this.getText('save_success'));
          _this.setRecordId(result.uuid);
          _this.fireEvent('saved', result, _this);
        }
      });
    },
    load: function () {
      var _this = this;
      if (this.getRecordId()) {
        StateBudgetAPI.item({
          uuid: this.getRecordId()
        }, function (result) {
          _this.resetForm();
          _this.setRecord(result);
          _this.setFormData(result);
        });
      }
    }
  })
});