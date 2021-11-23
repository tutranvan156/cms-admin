/**
 * #PACKAGE: admin
 * #MODULE: layout-web-plugin
 */

$(function () {
    console.log(">>> layout-web-plugin >>> ");

    var __htmlConfig = '';
    __htmlConfig += '<span class="cms-config cms-toolbox">';
    __htmlConfig += '   <span class="cms-config cms-area">{0}</span>';
    __htmlConfig += '	<span class="cms-config cms-action">';
    __htmlConfig += '		<span class="cms-config cms-action config-plugin">';
    __htmlConfig += '			<i class="fa fa-gears"></i>';
    __htmlConfig += '		</span>';
    __htmlConfig += '		<span class="cms-config cms-action choose-plugin">';
    __htmlConfig += '			<i class="fa fa-skyatlas"></i>';
    __htmlConfig += '		</span>';
    __htmlConfig += '    	<span class="cms-config cms-action show-hide-area">';
    __htmlConfig += '    		<label>';
    __htmlConfig += '                <input checked="checked" class="ace ace-switch ace-switch-6" type="checkbox">';
    __htmlConfig += '                <span class="lbl"></span>';
    __htmlConfig += '    		</label>';
    __htmlConfig += '		</span>';
    __htmlConfig += '	</span>';
    __htmlConfig += '</span>';

    $('[data-area]').each(function(i, area){
        $(area).prepend(__htmlConfig.replace("{0}", $(area).attr("data-area")));
    });
});