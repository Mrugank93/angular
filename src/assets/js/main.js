$(document).ready(function(){
	$(".right_video").fitVids();
	$('#nav').slicknav();
	 $("#responsive_video").fitVids();
	 $('.bxslider').bxSlider({
		auto : true,
		mode : 'fade',
		controls: true,
		nextText :'<i class="fa fa-angle-right"></i>',
		prevText :'<i class="fa fa-angle-left"></i>',
		height: '100%'
	});
	
<!-- fade_effect -->
	$("ul#nav li").on('mouseenter', function() {
		$(this).find('.subNav').fadeIn(500);
	}).on('mouseleave', function() {
		$(this).find('.subNav').fadeOut(500);
	});
	  
	  $("ul#nav li").click(function() {
	$( "ul#nav li ul" ).fadeIn( "slow" );
});
  
<!-- fade_effect -->
$('#nav').slicknav({
		label: '',
		duration: 1000,
		easingOpen: "easeOutBounce"
	});



	 
});
