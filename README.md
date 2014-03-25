# Facebook Photo Upload plugin

[Demonstration](https://dev.anuary.com/172f847c-726e-5965-b785-ecff3d69b3f9/). Note that demonstration does not actually upload any files. However, the PHP files have all of the logic written down. It is up to you to issue an XHR request to the PHP script to initiate the uploading to the server.

![Screenshot](https://raw.github.com/gajus/falbum/master/docs/screenshot.png)

## Usage

The script will automatically make sure that user is authorised with the required permissions (namely, `user_photos`).

	$.gajus.falbum({callback: function(r) {
		if (!r) {
			// User did not select any photo.
		} else if(r.url) {
			// Url of the selected photo.
		} else if (r.error) {
			// Error object containing the error.code and error.message.
		}
	},
		loader: $('#your-loader'), // Optional. jQuery reference to the element that will be displayed when the script is loading (XHR requestss, etc.).
		debug: false // Optional. Allows to track (console.) script activity.
	});