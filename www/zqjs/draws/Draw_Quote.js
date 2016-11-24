/**
 * 
 * [draw_page_quote description]
 * @return {[type]} [description]
 */
var DIVISIONS = {
	tbody_main: undefined,
	c_tbody_main: undefined,
	tbody_custom: undefined,
	c_tbody_custom: undefined
}

function draw_page_quote() {
	if (DM.get_data("state.page") == "quotes" ) {
		if(!DM.get_data('state.ins_type')){ return;}

		var ins_type = DM.get_data('state.ins_type');
		var ins_str = DM.get_data( ins_type + "_ins_list");

		if( ! DIVISIONS["tbody_" + ins_type] ){
			DIVISIONS["tbody_" + ins_type] = document.querySelector('.inslist_type_' + ins_type + ' table.qt tbody');
			DIVISIONS["c_tbody_" + ins_type] = document.querySelector('.inslist_type_' + ins_type + ' .qt_cwrapper tbody');
		}

		if (DIVISIONS["tbody_" + ins_type]) {
			DIVISIONS["tbody_" + ins_type].innerHTML = '';
			DIVISIONS["c_tbody_" + ins_type].innerHTML = '';
		}

		if (ins_str) {
			var ins_list = ins_str.split(',');
			if (DIVISIONS["tbody_" + ins_type]) {
				for (var i = 0; i < ins_list.length; i++) {
					if (DIVISIONS["tbody_" + ins_type].querySelectorAll('.' + ins_list[i]).length == 0){
						DM.run(function (insid) {
							return function () {
								draw_page_quote_line(insid)
							};
						}(ins_list[i]));
					}

					DM.run(function (insid) {
						return function () {
							draw_page_quote_detail(insid)
						};
					}(ins_list[i]));
				}
			}
		}

	}
}

function click_handler_posdetail(insid){
	if(DM.get_data('account_id') == ''){
		DM.update_data({state:{
			detail_ins_id : insid,
			detail_pos_id: "new"
		}});
		location.href = "#/app/posdetail";
	}else {
		var pos_list = DM.get_data('quotes.'+insid+'.pos_list');
		if(pos_list){
			var pos_id = pos_list.split(',')[0];
			DM.update_data({state:{
				detail_ins_id : insid,
				detail_pos_id: pos_id
			}});
			location.href = "#/app/posdetail";
		}else{
			DM.update_data({state:{
				detail_ins_id : insid,
				detail_pos_id: "new"
			}});
			location.href = "#/app/posdetail";
		}
	}
}

function draw_page_quote_line(insid) {
	var ins_type = DM.get_data('state.ins_type');

	var insid_name = DM.get_data("quotes." + insid + '.instrument_name');

	if (DIVISIONS["tbody_" + ins_type].querySelectorAll('tr.' + insid).length === 0) {
		// need paint the tr - .insid = quotes_keys[i]
		var tr_odd = document.createElement('tr'), tr_even = document.createElement('tr');
		tr_odd.className = 'odd ' + insid;
		tr_even.className = 'even ' + insid;

		var click_handler = function (insid) {
						return function () { click_handler_posdetail(insid) };
					}(insid);

		tr_odd.addEventListener('click', click_handler);
		tr_even.addEventListener('click', click_handler);

		var temp = "<td>" + insid + "</td>";
		for (var i = 0; i < CONST.inslist_cols_odd.length; i++) {
			temp += "<td data-content='' class='" + insid + "_" + CONST.inslist_cols_odd[i] + "'></td>"
		}
		tr_odd.innerHTML = temp;
		temp = "<td>" + insid_name + "</td>";
		for (var i = 0; i < CONST.inslist_cols_even.length; i++) {
			temp += "<td data-content='' class='" + insid + "_" + CONST.inslist_cols_even[i] + "'></td>"
		}
		tr_even.innerHTML = temp;
		DIVISIONS["tbody_" + ins_type].appendChild(tr_odd);
		DIVISIONS["tbody_" + ins_type].appendChild(tr_even);

		var qt_c_tr_odd = document.createElement('tr'), qt_c_tr_even = document.createElement('tr');
		qt_c_tr_odd.className = 'odd ' + insid;
		qt_c_tr_even.className = 'even ' + insid;

		qt_c_tr_odd.addEventListener('click', click_handler);
		qt_c_tr_even.addEventListener('click', click_handler);

		qt_c_tr_odd.innerHTML = "<td>" + insid + "</td>";
		qt_c_tr_even.innerHTML = "<td>" + insid_name + "</td>";
		DIVISIONS["c_tbody_" + ins_type].appendChild(qt_c_tr_odd);
		DIVISIONS["c_tbody_" + ins_type].appendChild(qt_c_tr_even);
	}// 画合约行
}

function draw_page_quote_detail(insid) {
	var ins_type = DM.get_data('state.ins_type');

	var quote = DM.get_data("quotes." + insid);

	var keys = CONST.inslist_cols_odd.concat(CONST.inslist_cols_even);

	for (var i = 0; i < keys.length; i++) {
		var div = DIVISIONS["tbody_" + ins_type].querySelector('.' + insid + '_' + keys[i]);

		if (div) {
			var val = quote[keys[i]] == undefined ? '' : quote[keys[i]];
			var arr = val.split('|');
			if(arr[1]){
				div.className = addClassName(div.className, arr[1]);
			}
			div.setAttribute('data-content', arr[0]) ;
		}
	}
}