(function(){
	var template	= $('<div class="ay-album-widget-overlay">\
		<div class="ay-album-widget">\
			<div class="body">\
				<div class="loader">\
					<div class="animation-loader"></div>\
				</div>\
				<h1>Select a photo from your Facebook album(s)</h1>\
				<ul class="albums"></ul>\
				<ul class="photos"></ul>\
			</div>\
		</div>\
	</div>')

	var albums	= [];
	
	var populate_album_data	= function(callback)
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
	
	$.ayFbAlbum		= function(callback){
		var overlay		= $(template.clone()).appendTo('body'),
			widget		= overlay.find('.ay-album-widget'),
			loader		= widget.find('.loader');
		
		
		var close_event	= $(document).on('click', function(e){
			if($.contains(e.target, widget[0]))
			{
				close_widget();
			}
		});
		
		var close_widget = function(src_url){
			overlay.remove();
			
			$(document).off('click', close_event);
			
			callback(src_url);
		};
		
		var open_widget = function()
		{
			// populate album names
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
				close_widget($(this).data('src_url'));
			});
			
			loader.hide();
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
		
		if(!albums.length)
		{
			populate_album_data(open_widget);
		}
		else
		{
			open_widget();
		}		
	};
})($);