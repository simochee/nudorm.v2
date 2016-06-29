<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<title>Editor</title>
	<link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
	<link rel="stylesheet" href="/css/editor.css">
</head>
<body>

	<div class="select">
		<div class="form-outline">
			<div class="form-item">
				<span class="label">新規に作成</span>
				<div class="form">
					<input type="text" pattern="^[0-9]+$" placeholder="Year" maxlength="4" id="newYear" class="new-input year">
					<input type="text" pattern="^[0-9]+$" placeholder="Month" maxlength="2" id="newMonth" class="new-input month">
				</div>
				<button type="button" id="new" class="start-btn">開始</button>
			</div>
			<div class="form-label-and">または</div>
			<div class="form-item">
				<span class="label">既存ファイルの編集</span>
				<div class="form">
					<input type="file" id="editFile" class="edit-input-dummy">
					<label for="editFile" class="edit-input">
						<span class="icon"><span class="ion-document-text"></span></span>
					</label>
				</div>
				<button type="button" id="new" class="start-btn">開始</button>
			</div>
		</div>
	</div>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
	<script src="/editor/scriptb.js"></script>
</body>
</html>