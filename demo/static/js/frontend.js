$(function(){
	var photo	= $('#photo');

	$('.button-upload-photo').on('click', function(){
		$.gajus.falbum({callback: function(r){
			if (!r) {
				// user did not select anything
			} else if(r.url) {
				var image	= new Image();
						
				image.onload	= function(){
					photo.show().css({width: this.width, height: this.height, backgroundImage: 'url(\'' + this.src + '\')'});
					
					// To actually upload the file, you'd need to issue an XHR request with the URL to the source image.
					// The PHP file contains all the logic needed to upload the file.
				};
				
				image.src	= r.url;
			} else if(r.error) {
				console.log(r.error);
			}
		}});
	});
});

window.fbAsyncInit	= function () {
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