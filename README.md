# Facebook Photo Upload plugin

[Demonstration](https://dev.anuary.com/172f847c-726e-5965-b785-ecff3d69b3f9/). Note that demonstration does not actually upload any files. However, the PHP files have all of the logic written down. It is up to you to issue an XHR request to the PHP script to initiate the uploading to the server.

## Usage

Make sure that user has authorised the `user_photos` permission.

	$.ayFbAlbum(function(src_url){
		// Do whatever you need with the URL of the full-size photo.
	});

## License & Notes

The BSD License - Copyright (c) 2012 Gajus Kuizinas.