$(function() {
	$('[type="file"]').on('change', function(e) {
		if( !this.files.length ) {
			return;
		}
		var file = $(this).prop('files')[0];
		var fr = new FileReader();
		fr.onload = function() {
			$.ajax({
				url: fr.result,
				type: 'get',
				success: function(data) {
					$('#outp').text(data);
				}
			})
		}
		var result = fr.readAsDataURL(file);
		console.log(file, result);
	})

	if(typeof Blob === undefined) {
		alert('このブラウザには対応していません！');
		return false;
	}

	$('#export').click(function() {
		setBlobUrl("download", $('#outp').text());
	});

})

var setBlobUrl = function(id, content) {
	var blob = new Blob([ content ], {"type": "application/json"});

	window.URL = window.URL || window.webkitURL;
	$('#' + id).attr('href', window.URL.createObjectURL(blob));
	$('#' + id).attr('download', 'tmp.json');
}