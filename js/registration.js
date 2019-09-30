;(function() {

	$('#registr-btn').on('click', sendReg);
	
	$('.form-row').on('keydown', (e) => {
		if(e.keyCode == 13) {
			sendReg();
		}
	});

})();