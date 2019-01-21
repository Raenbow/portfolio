$(document).ready(function() {
	$('#contact-form').submit(function() {
		
		var buttonCopy = $('#contact-form button').html(),
			errorMessage = $('#contact-form button').data('error-message'),
			sendingMessage = $('#contact-form button').data('sending-message'),
			okMessage = $('#contact-form button').data('ok-message'),
			timeoutMessage = $('#contact-form button').data('timeout-message'),
			serverErrorMessage = $('#contact-form button').data('server-error-message'),
			hasError = false;
		
		$('#contact-form .error-message').remove();
		
		$('.requiredField').each(function() {
			if($.trim($(this).val()) == '') {
				var errorText = $(this).data('error-empty');
				$(this).parent().append('<span class="error-message" style="display:none;">'+errorText+'</span>').find('.error-message').fadeIn('fast');
				$(this).addClass('inputError');
				hasError = true;
			} else if($(this).is("input[type='email']") || $(this).attr('name')==='email') {
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				if(!emailReg.test($.trim($(this).val()))) {
					var invalidEmail = $(this).data('error-invalid');
					$(this).parent().append('<span class="error-message" style="display:none;">'+invalidEmail+'.</span>').find('.error-message').fadeIn('fast');
					$(this).addClass('inputError');
					hasError = true;
				}
			}
		});
		
		if(hasError) {
			$('#contact-form button').html('<i class="fa fa-times"></i>'+errorMessage);
			setTimeout(function(){
				$('#contact-form button').html(buttonCopy);
			},2000);
		}
		else {
			$('#contact-form button').html('<i class="fa fa-spinner fa-spin"></i>'+sendingMessage);
			
			var formInput = $(this).serialize();

			$.ajax({
				type: "POST",
				url: $(this).attr('action'),
				data: formInput,
				success: function(data){
					if(data.success === true){
						$('#contact-form button').html('<i class="fa fa-check"></i>'+okMessage);
				
						$('#contact-form')[0].reset();
						
						setTimeout(function(){
							$('#contact-form button').html(buttonCopy);
						},2000);
					} else if (data.success === false){
						console.log('Sorry, there was an error sending your message.');
					}
				},
				error: function(response, $error, serverError){
					if ($error === "error" && serverError === "Internal Server Error"){
						$('#contact-form button').html('<i class="fas fa-exclamation"></i> '+serverErrorMessage).addClass("error-color");
						$('#contact-form .form-control').css("border-bottom", "3px solid #ff0000");
						$('.feelFree').addClass("hide");
						$('.pleaseEmailDirect').addClass("show");
					} else if ($error === "timeout"){
						$('#contact-form button').html('<i class="fas fa-exclamation-triangle"></i> '+timeoutMessage).addClass("too-slow-color");
						$('#contact-form .form-control').css("border-bottom", "3px solid lightgoldenrodyellow");
						$('#contact-form p').append('<span class="slow-message" style="display:none;">'+'Please try again shortly.'+'</span>').find('.slow-message').fadeIn('fast');
					}
					console.log($error);
				},
				timeout: 10000,
				dataType: 'JSON'
			});
		}
		
		return false;	
	});
});