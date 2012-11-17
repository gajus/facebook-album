$(function(){
	var photo	= $('#photo');

	$('.button-upload-photo').on('click', function(){
		FB.login(function(r)
		{
			if(r.authResponse !== null)
			{
				$.ayFbAlbum(function(src_url){
					if(src_url)
					{
						var image	= new Image();
						
						image.onload	= function(){
							photo.show().css({width: this.width, height: this.height, backgroundImage: 'url(\'' + src_url + '\')'});
							
							// To actually upload the file, you'd need to issue an XHR request with the URL to the source image.
							// The PHP file contains all the logic needed to upload the file.
						};
						
						image.src	= src_url;
					}
				});
			}
		}, {scope: 'user_photos' });
	});
});

window.fbAsyncInit	= function()
{
	FB.init({appId: 128740590570428, status: true, cookie: true});
};

// Load the SDK Asynchronously
(function(d){
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));