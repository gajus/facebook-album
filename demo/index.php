<?php
require __DIR__ . '/../vendor/autoload.php';
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	
	<style>
	body, html { padding: 0; margin: 0; font:normal 12px/20px monospace, 'Lucida Grande', arial, Sans-Serif; }

	.authorship { margin: 20px; }

	.button-upload-photo { color: #f00; margin: 20px; cursor: pointer; }
	.button-upload-photo:hover { text-decoration: underline; }

	#photo { display: none; margin: 20px; background: #f2f2f2; border: 1px solid #e2e2e2; }
	</style>

	<link rel="stylesheet" type="text/css" href="static/css/frontend.css">
	
	<script src="static/js/jquery-1.8.2.min.js"></script>
	<script src="static/js/jquery.falbum.js"></script>
	<script src="static/js/frontend.js"></script>
	
	<title>2012 11 16 facebook album</title>
</head>
<body>
	<div id="photo"></div>

	<div class="button-upload-photo">Upload photo</div>

	<div class="authorship">
		<p>This is a demo of the <a href="https://github.com/anuary/falbum" target="_blank">Facebook photo album upload</a> plugin.</p>
	</div>
</body>
</html>