<?php
namespace ay;

// This is only a helper function to name files.
// This is not required for your implementation.
function uuid()
{
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        // 32 bits for "time_low"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),

        // 16 bits for "time_mid"
        mt_rand( 0, 0xffff ),

        // 16 bits for "time_hi_and_version",
        // four most significant bits holds version number 4
        mt_rand( 0, 0x0fff ) | 0x4000,

        // 16 bits, 8 bits for "clk_seq_hi_res",
        // 8 bits for "clk_seq_low",
        // two most significant bits holds zero and one for variant DCE1.1
        mt_rand( 0, 0x3fff ) | 0x8000,

        // 48 bits for "node"
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}

if(!empty($_POST['ay']['src_url']))
{
	$response	= array();
	$uuid		= uuid();

	require __DIR__ . '/downloadremote.php';
	
	$uploader	= new DownloadRemote($_POST['ay']['src_url']);
	
	if(substr_compare(parse_url($_POST['ay']['src_url'], PHP_URL_HOST), 'akamaihd.net', -12, 12) !== 0)
	{
		$response['error']	= 'Invalid host.';
	}
	else if(!$uploader->download(1000*1000))
	{
		$response['error']	= 'The picture cannot exceed 1MB.';
	}
	else if($uploader->getMimeType() != 'image/jpeg; charset=binary')
	{
		$response['error']	= 'Invalid file format.';
	}
	else if(!$uploader->save(__DIR__ . '/uploads/' . $uuid . '.jpg'))
	{
		$response['error']	= 'File permission issue.';
	}
	else
	{
		$response['uuid']	= $uuid;
	}
	
	header('Content-Type: application/json');
	
	echo json_encode($response);
	
	exit;
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	
	<link rel="stylesheet" type="text/css" href="public/css/frontend.css">
	
	<script type="text/javascript" src="public/js/jquery-1.8.2.min.js"></script>
	<script type="text/javascript" src="public/js/jquery.ay-fb-album.js"></script>
	<script type="text/javascript" src="public/js/frontend.js"></script>
	
	<title>2012 11 16 facebook album</title>
</head>
<body>
	<div id="photo"></div>

	<div class="button-upload-photo">Upload photo</div>

	<div class="authorship">
		This is a demo of the <a href="https://github.com/anuary/ay-histogram" target="_blank">Facebook photo upload</a> plugin.
	</div>
</body>
</html>