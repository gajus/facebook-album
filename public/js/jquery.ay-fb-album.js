/**
 * jQuery Facebook album v0.0.2 (2012 NOV 27)
 * https://github.com/gajus/facebook-album
 *
 * Licensed under the BSD.
 * https://github.com/gajus/facebook-album/blob/master/LICENSE
 *
 * Author: Gajus Kuizinas <g.kuizinas@anuary.com>
 */
(function(){
	var console;

	var template = $('<div class="ay-album-widget-overlay">\
		<div class="ay-album-widget">\
			<div class="body">\
				<h1>Select a photo from your Facebook album(s)</h1>\
				<ul class="albums"></ul>\
				<ul class="photos"></ul>\
			</div>\
		</div>\
	</div>')

	var albums = [];
	
	var populate_album_data = function(callback)
	{
		FB.api({
			method: 'fql.multiquery',
			queries: {
				query1: "SELECT object_id, name FROM album WHERE owner=me() AND type = 'normal';",
				query2: "SELECT album_object_id, pid, src_small, src_big FROM photo WHERE album_object_id IN (SELECT object_id FROM #query1)"
			}
		}, function(response){
			albums	= response[0].fql_result_set;
		
			for(var i = 0, j = albums.length; i < j; i++)
			{
				albums[i].photos	= [];
			}
		
			for(var i = 0, j = response[1].fql_result_set.length; i < j; i++)
			{
				var photo	= response[1].fql_result_set[i];
				
				for(var l = 0, k = albums.length; l < k; l++)
				{
					if(albums[l].object_id == photo.album_object_id)
					{						
						albums[l].photos.push(photo);
					}
				}
			}
			
			callback();
		});
	};
	
	var scroll_top	= function(){
		if(window != window.top && FB)
		{
			FB.Canvas.scrollTo(0,0);
		}
		else
		{
			window.scrollTo(0,0);
		}
	};
	
	// true if user is connected and has authorised the 'user_photos' permission.
	// var authorised = false;
	
	$.ayFbAlbum		= function(options){
		var overlay;
		var widget;
		var close_event;
	
		var settings	= $.extend({
			callback: false,
			loader: false,
			debug: false
		}, options);
		
		if(!settings.callback)
		{
			throw 'Missing callback function.';
		}
		else if(settings.loader)
		{
			settings.loader.show();
		}
		
		if(!settings.debug)
		{
			console	= {log: function(){}, error: function(){}, warn: function(){}, info: function(){}};
		}
		
		console.log('Initiating Facebook album sequence.');
		
		var open_widget = function()
		{
			var has_photos	= false;			
		
			for(var i = 0, j = albums.length; i < j; i++)
			{
				if(albums[i].photos.length > 0)
				{
					has_photos	= true;
				
					break;
				}
			}
		
			if(!has_photos)
			{
				console.warn('User does not have photos.');
			
				return close_widget({error: {code: 1, message: 'User does not have any photos.'}});
			};
			
			overlay = $(template.clone()).appendTo('body');
			widget = overlay.find('.ay-album-widget');
			
			close_event	= $(document).on('click', function(e){
				if($.contains(e.target, widget[0]))
				{
					close_widget();
				}
			});
		
			scroll_top();
		
			console.log('Populating the album list.');
			
			for(var i = 0, j = albums.length; i < j; i++)
			{
				var li	= $('<li>').text(albums[i].name).data('object_id', albums[i].object_id);
				
				if(i === 0)
				{
					populate_gallery(albums[i].object_id);
				
					li.addClass('active');
				}
				
				li.appendTo(widget.find('.albums'));
			}
			
			widget.find('.albums').on('click', 'li', function(){
				if($(this).hasClass('active'))
				{
					return;
				}
				
				var object_id = $(this).data('object_id');
				
				populate_gallery(object_id);
				
				$(this).addClass('active').siblings().removeClass('active');
			});
			
			widget.find('.photos').on('click', 'li', function(){
				close_widget({url: $(this).data('src_url')});
			});
			
			if(settings.loader)
			{
				settings.loader.hide();
			}
		};
		
		var populate_gallery = function(object_id)
		{
			var album;
			
			widget.find('.photos').empty();
			
			for(var i = 0, j = albums.length; i < j; i++)
			{
				if(albums[i].object_id == object_id)
				{
					album	= albums[i];
					
					break;
				}
			}
			
			if(!album)
			{
				throw 'Album not found.';
			}
			
			for(var i = 0, j = album.photos.length; i < j; i++)
			{
				var li = $('<li>').css({backgroundImage: 'url(\'' +  album.photos[i].src_small + '\')'}).data('src_url', album.photos[i].src_big);
				
				li.appendTo(widget.find('.photos'));
			}
		};
		
		var close_widget = function(response){	
			if(overlay)
			{
				overlay.remove();
			}
			
			if(close_event)
			{
				$(document).off('click', close_event);
			}
			
			if(settings.loader)
			{
				settings.loader.hide();
			}
			
			settings.callback(response);
		};
		
		var authenticate_user	= function(authentication_fallback){
			console.log('Fetching user permissions.');
		
			FB.api('me/permissions', function(r){
				if(!r.data || r.data[0].user_photos !== 1)
				{
					console.error('User is not authorised or has not provided the required permissions.');
					
					if(authentication_fallback)
					{					
						authentication_fallback();
					}
					else
					{
						close_widget();
					}
					
					return;
				}
				else
				{
					console.log('User is authorised.');
				
					if(!albums.length)
					{
						console.log('Fetching information about the user albums and photos.');
					
						populate_album_data(open_widget);
					}
					else
					{
						open_widget();
					}
				}
			});
		};
		
		authenticate_user(function(){
			FB.login(function(r)
			{
				console.log('User is asked to authorise the application with the required permissions.');
			
				if(r.authResponse !== null)
				{
					authenticate_user();
				}
			}, {scope: 'user_photos' })
		});		
	};
})($);