$(function() {
	$('[href="#"]').click(function() { return false; });

	entryDate();

	setup();
});

var entryDate = function() {
	var d = new Date();
	var y = d.getFullYear();
	var m = d.getMonth() + 1;
	$('.period .year').val(y);
	$('.period .month').val(m);
}

var setup = function() {
	$('#start').click(function() {
		var $ele = $('.header .period');
		var f = $('#openFile').val();
		if(f) {
			var json = openFile($('#openFile'));
			convertJSON(json);
		} else {
			var y = $ele.find('.year').val();
			var m = $ele.find('.month').val();
			var s = $ele.find('.start').val();
			var e = $ele.find('.end').val();
			if(!y || !m || !s || !s) {
				alert('期間の指定が不十分です...');
			} else {
				createCalendar(y, m, s, e);
				shiftEdit();
			}
		}
		shortcuts();
	});
}

var createCalendar = function(y, m, s, e) {
	var weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var plane = $('.menu-card-plane').html();
	var html = '';
	for(var i=0; i<=e-s; i++) {
		var date = i + Number(s);
		var d = new Date(y + '-' + m + '-' + date);
		var id = y + '' + zero(m, 2) + '' + zero(date, 2);
		$('#menus').append('<div id="' + id + '" class="menu-card" data-date="' + date + '">');
		$('#' + id).hide()
				   .delay(100*i).fadeIn('fast')
				   .html(plane)
				   .find('.day').text(date)
				   .parent().find('.week').text(weeks[d.getDay()]);
		switch(d.getDay()) {
			case 0:
				$('#' + id).addClass('sun');
				break;
			case 6:
				$('#' + id).addClass('sat');
				break;
		}
	}
}

var openFile = function($this) {
	var file = $this.prop('files')[0];
	var reader = new FileReader();
	reader.onload = function(e) {
		var json = $.parseJSON(e.target.result);
		convertJSON(json);
	}
	reader.readAsText(file, 'utf-8');
}

var convertJSON = function(json) {
	var plane = $('.menu-card-plane').html();
	var weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var len = json.length;
	var y = json[0].year;
	var m = json[0].month;
	$('.period .year').val(y);
	$('.period .month').val(m);
	$('.period .start').val(json[1].date);
	$('.period .end').val(Number(json[1].date) + len - 2);
	console.log(json[0], json[0].created)
	$('[name="created"]').val(json[0].created);
	for(var i=1; i<len; i++) {
		var datum = json[i];
		var d = new Date(y + '-' + zero(m, 2) + '-' + zero(datum.date, 2));
		var id = y + zero(m, 2) + zero(datum.date, 2);
		$('#menus').append('<div id="' + id + '" class="menu-card" data-date="' + datum.date +'">' + plane + '</div>');
		var $this = $('#' + id);
		switch(d.getDay()) {
			case 0:
				$this.addClass('sun');
				break;
			case 6:
				$this.addClass('sat');
				break;
		}
		$this.find('.date .day').text(datum.date).next().text(weeks[d.getDay()]);
		var $bf = $this.find('.breakfast');
		$bf.find('.bf_jp').val(datum.breakfast.jap);
		$bf.find('.bf_ws').val(datum.breakfast.wes);
		$bf.find('.bf_sides').val(datum.breakfast.sides.join("\n"));
		var $lc = $this.find('.lunch');
		$lc.find('.lc_main').val(datum.lunch.main);
		$lc.find('.lc_sides').val(datum.lunch.sides.join("\n"));
		var $dn = $this.find('.dinner');
		$dn.find('.dn_a').val(datum.dinner.a);
		$dn.find('.dn_b').val(datum.dinner.b);
		$dn.find('.dn_sides').val(datum.dinner.sides.join("\n"));
		var $bf_jp_v = $this.find('.values.bf_jp .values-item');
		var $bf_ws_v = $this.find('.values.bf_ws .values-item');
		var $lc_v = $this.find('.values.lc .values-item');
		var $dn_a = $this.find('.values.dn_a .values-item');
		var $dn_b = $this.find('.values.dn_b .values-item');
		for(var j=0; j<4; j++) {
			$bf_jp_v.eq(j).find('input').val(datum.breakfast.values.jap[j]);
			$bf_ws_v.eq(j).find('input').val(datum.breakfast.values.wes[j]);
			$lc_v.eq(j).find('input').val(datum.lunch.values[j]);
			$dn_a.eq(j).find('input').val(datum.dinner.values.a[j]);
			$dn_b.eq(j).find('input').val(datum.dinner.values.b[j]);
		}
	}
	shiftEdit();
}

var shiftEdit = function() {
	$('#start').hide();
	$('#refresh').show();
	$('.open-file').hide();
	$('.period .start, .period .end').prop('readonly', true);
	$('#refresh').click(function() {
		refreshCalendar();
	})
	$('.header .save').show().click(function() {
		generateJSON();
	})
	window.onbeforeunload = function(e) {
		e = e || window.event;
		e.returnValue = 'このページから移動しようとしています！';
	}
}

var refreshCalendar = function() {
	var $ele = $('.header .period');
	var y = $ele.find('.year').val();
	var m = $ele.find('.month').val();
	var len = $('#menus').find('.menu-card').length;
	var s = $('#menus .menu-card').eq(0).find('.day').text();
	var weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	$('.menu-card.sun').removeClass('sun');
	$('.menu-card.sat').removeClass('sat');
	for(var i=0; i<len; i++) {
		var date = i + Number(s);
		var d = new Date(y + '-' + m + '-' + date);
		var $this = $('#menus .menu-card').eq(i);
		$this.find('.week').text(weeks[d.getDay()]);
		switch(weeks[d.getDay()]) {
			case "Sun":
				$this.addClass('sun');
				break;
			case "Sat":
				$this.addClass('sat');
				break;
		}
	}
}

var generateJSON = function() {
	refreshCalendar();
	var len = $('.menu-card').length;
	var y = $('.period .year').val();
	var m = $('.period .month').val();
	var d = new Date();
	var now = getNow(d);
	var created = $('[name="created"]').val() ? $('[name="created"]').val() : now;
	var json = '[{"year":"' + Number(y) + '","month":"' + Number(m) + '","created":"' + created + '","modified":"' + now + '"},';
	for(var i=0; i<len; i++) {
		var $this = $('#menus .menu-card').eq(i);
		var date = $this.data('date');
		// Add date
		json += '{"date":"' + date + '",'
			// Add breakfast main menus
			+ '"breakfast":{"jap":"' + $this.find('input.bf_jp').val() + '","wes":"' + $this.find('input.bf_ws').val() + '",'
			// Add breakfast side menus
			+ '"sides":[' + getSides($this.find('.bf_sides')) + '],'
			// Add breakfast values
			+ '"values":{"jap":[' + getValues($this.find('.values.bf_jp')) + '],"wes":[' + getValues($this.find('.values.bf_ws')) + ']}'
			// Close breakfast
			+ '},'
			// Add lunch main menu
			+ '"lunch":{"main":"' + $this.find('.lc_main').val() + '",'
			// Add lunch side menus
			+ '"sides":[' + getSides($this.find('.lc_sides')) + '],'
			// Add lunch values
			+ '"values":[' + getValues($this.find('.values.lc')) + ']'
			// Close lunch
			+ '},'
			// Add dinner main menus
			+ '"dinner":{"a":"' + $this.find('input.dn_a').val() + '","b":"' + $this.find('input.dn_b').val() + '",'
			// Add dinner side menus
			+ '"sides":[' + getSides($this.find('.dn_sides')) + '],'
			// Add dinner values
			+ '"values":{"a":[' + getValues($this.find('.values.dn_a')) + '],"b":[' + getValues($this.find('.values.dn_b')) + ']}'
			// Close dinner
			+ '}'
			// Close this session
			+ '},';
	}
	json = json.slice(0, -1);
	json += ']';
	$('#result').val(json);
	$('.output').fadeIn();
	$('body').addClass('open');
	$('#close').click(function() {
		$('.output').fadeOut();
		$('body').removeClass('open');
	});
}

var getNow = function(d) {
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	var hour = d.getHours();
	var min = d.getMinutes();
	var sec = d.getSeconds();
	return year + '-' + zero(month, 2) + '-' + zero(date, 2) + ' ' + zero(hour, 2) + ':' + zero(min, 2) + ':' + zero(sec, 2);
}

var getSides = function($ele) {
	var text = $ele.val().replace(/\r\n|\r/g, "\n");
	var lines = text.split('\n');
	var array = [];
	for(var i=0; i<lines.length; i++) {
		if(lines[i] == '') {
			continue;
		}
		array.push('"' + lines[i] + '"');
	}
	return array.join(',');
}

var getValues = function($root) {
	$ele = $root.find('.values-item input');
	var array = [];
	for(var i=0; i<4; i++) {
		var val = $ele.eq(i).val();
		console.log(val);
		array.push('"' + val + '"');
	}
	return array.join(",");
}

var shortcuts = function() {
	$('#menus .bf_jp, #menus .bf_ws').focus(function() {
		var $this = $(this);
		$(window).keydown(function(e) {
			if(e.ctrlKey) {
			}
		})
	})
	$(window).keydown(function(e) {
		if(e.shiftKey) {
			var $this = $('*:focus');
			if(e.keyCode === 13) {
				if($this.is('.bf_jp, .bf_ws')) {
					var $parent = $this.parent().parent();
					console.log($parent);
					$parent.find('.bf_jp').val('ライス');
					$parent.find('.bf_ws').val('トースト');
					$parent.find('.bf_sides').val("").focus();
					return false;
				}
			}
		}
		if(e.ctrlKey) {
			if(e.keyCode === 13) {
				var $this = $('*:focus');
				if($this.is('.bf_jp, .bf_ws')) {
					var $parent = $this.parent().parent();
					console.log($parent);
					$parent.find('.bf_ws').val('ロールパン');
					$parent.find('.bf_sides').val("キャベツサラダ\nスープ\n牛乳");
					$parent.find('.values.bf_ws input').eq(0).focus();
				}
				if($this.is('.dn_a, .dn_b')) {
					var $parent = $this.parent().parent();
					console.log($parent);
					$parent.find('.dn_a').val('ポークカレー');
					$parent.find('.dn_b').val('ハヤシライス');
					$parent.find('.dn_sides').val("ミックスサラダ");
					$parent.find('.values.dn_a input').eq(0).focus();
				}
				if($this.is('textarea')) {
					var val = $this.val();
					$this.val(val + "\n");
				}
				return false;
			}
			if(e.keyCode === 97 || e.keyCode === 49) {
				appendItem('ライス');
				return false;
			}
			else if(e.keyCode === 98 || e.keyCode === 50) {
				appendItem('味噌汁');
				return false;
			}
			else if(e.keyCode === 99 || e.keyCode === 51) {
				appendItem('牛乳');
				return false;
			}
			else if(e.keyCode === 100 || e.keyCode === 52) {
				appendItem('スープ');
				return false;
			}
		}
	})
}

var appendItem = function(word) {
	var $this = $('*:focus');
	var val = $this.val();
	$this.val(val + word + "\n");
}

var zero = function(str, n) {
	return ('0000000' + str).slice(-n);
}