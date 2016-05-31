$(document).ready(function(){	
	
	var RestApi={};
	(function(RestApi, $){
		var _$ul=$('#articles'),
		    _$title=$('#articleField').find('#title'),
		    _$text=$('#articleField').find('#text'),
		    _$userId=$('#userId'),
		    userCount;

	   var root = 'http://jsonplaceholder.typicode.com';

       RestApi.init=function(){
            $('main').on('click', '#articleField button', this.saveArticle)
                     .on('click', '#allUserId button', this.loadArticles)
                     .on('click', '[data-action="remove"]',  event.data , $.proxy(this.remove, this) )
                     .on('click', '[data-action="change"]',  event.data , $.proxy(this.change, this) )
                     .on('click', '[data-action="save"]',  event.data , $.proxy(this.save, this) )
                     .on('click', '[data-action="cancel"]',  function(){ $(event.target).closest('section').hide(200);  $(event.target).closest('li').find('button').show(200);} )
                    
            RestApi.loadArticles();
        };

       RestApi.loadArticles=function(){
       	
       	    var searchUrl='',
       	        message='All articles',
       	        user=_$userId.val();
       	    if (user){ searchUrl="?userId="+user; 
       	               message+=' user with id '+user; };

       	    _$ul.hide().empty();      
      
	       	$.ajax({
	        	type: 'GET',
	        	url: root+'/posts'+searchUrl,
	        	success: function(items){
	                $.each(items, function(i, item){
	                	_$ul.append('<li data-id="'+item.id+'" data-user-id="'+item.userId+'"><h3><span>#'+item.id+"</span>    "+item.title+'</h3><blockquote>'+item.body+'</blockquote>'+
	                		        '<button class="btn btn-danger" data-action="remove">X</button><button class="btn btn-default" data-action="change">Change</button></li>');
	                });
	                _$ul.prepend('<h2>'+message+'</h2>').show(400);
	        	},
	        	error: function(){
	        		console.log('error in loading');
	        	}
	            });
       };
         
       RestApi.saveArticle=function(){
        	var item={
        		userId: _$userId.val() || 1,
        		title: _$title.val(),
        		body: _$text.val()
        	};

        	$.ajax({
        		type: 'POST',
        		url: root+'/posts',
        		data: item,
        		success: function(data){
        			console.log('article added');
        			_$ul.find('h2').after('<li data-id=""><h3><span>new</span>    '+item.title+'</h3><blockquote>'+item.body+'</blockquote>'+
        				         '<button class="btn btn-danger" >X</button><button class="btn btn-default">Change</button></li>').hide().show(400);
        		},
        		error: function(){
        			console.log('error with edding')
        		}
        	});
        };

       RestApi.remove=function(event){
        	var
        	    _$target = $( event.target ),
        	    _$item= _$target.closest('li'),
        	    id=_$item.data('id');
          
        	$.ajax({
	        	type: 'DELETE',
	        	url: root+'/posts/'+id,
	        	success: function(items){

	               console.log('deleted');
	               _$item.hide(400);
	        	},
	        	error: function(){
	        		console.log('error in deleting');
	        	}
	            });

        };

       RestApi.change=function(event){
        	var
        	    _$target = $( event.target ),
        	    _$item= _$target.closest('li'),
        	    id=_$item.data('id');
 
            _$item.find('button').hide(200);
        	_$item.prepend('<section>'+
		    '<input  class="form-control" id="title" type="text" placeholder="title"/>'+
		    '<textarea class="form-control" id="text" type="text" placeholder="text"></textarea>'+
		    '<button class="btn btn-default" data-action="save">Save</button>'+
		    '<button class="btn btn-default" data-action="cancel">Cancel</button></section>').hide().show(400); 
        };
        
       RestApi.save=function(event){
        	var
        	    _$target = $( event.target ),
        	    _$item= _$target.closest('li'),
        	    id=_$item.data('id');  
       
        	var item={
        		userId:  _$item.data('user-id'),
        		title: _$item.find('#title').val(),
        		body: _$item.find('#text').val()
        	};

        	$.ajax({
        		type: 'PUT',
        		url: root+'/posts/'+id,
        		data: item,
        		success: function(data){
        			console.log('article changed');
        			
        		},
        		error: function(){
        			console.log('error with changing')
        		}
        	});
            
            _$item.after('<li data-id="'+id+' data-userId='+item.userId+'"><h3><span>#'+id+"</span>    "+
            	          item.title+'</h3><blockquote>'+item.body+'</blockquote>'+
	                      '<button class="btn btn-danger" data-action="remove">X</button>'+
	                      '<button class="btn btn-default" data-action="change">Change</button></li>');
            _$item.remove();
        }
    RestApi.init();
   
	})(RestApi,jQuery);

});