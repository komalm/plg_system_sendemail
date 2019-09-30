var tjsendEmail = function (tjTableId, tjTdClass){

	//~ this.tjTableId = 'report-table';
	//~ this.tjTdClass = '.td-sendemail';
	this.tjTableId = tjTableId;
	this.tjTdClass = '.' + tjTdClass;
	this.checkBoxName = 'cid';
	this.emailSubjectFieldId = 'email-subject';
	this.emailMessageFieldId = 'email-message';

	this.isSendEmail = jQuery('body').find(this.tjTableId).length;
	this.isCheckboxes = jQuery('body').find('input[name="' + this.checkBoxName + '[]"]').length;

	if (this.isSendEmail)
	{
		self.init();
	}

}

tjsendEmail.prototype.init:function (){
	// If on list view already checkbox are present then avoid the add column function
	if (!this.isCheckboxes)
	{
		self._addColumn();
	}

	self._btnSendEmail();
}

tjsendEmail.prototype._addColumn: function() {
	var tr = document.getElementById(this.tjTableId).tHead.children[0];
	tr.insertCell(0).outerHTML = '<th><input type="checkbox" name="checkall-toggle" value="" class="hasTooltip" title="Check All Items" onclick="Joomla.checkAll(this)"></th>'

	var tblBodyObj = document.getElementById(this.tjTableId).tBodies[0];
	for (var i=0; i<tblBodyObj.rows.length; i++) {
		var newCell = tblBodyObj.rows[i].insertCell(0);
		newCell.innerHTML = '<input type="checkbox" id="cb0" name="cid[]" value="' + i + '" onclick="Joomla.isChecked(this.checked);">'
	}
}

tjsendEmail.prototype.btnSendEmail: function () {
	try {
		let btnHtml = '<div class="btn-wrapper" id="tj-sendemail">';
				btnHtml += '<button type="button" class="btn btn-primary" id="email-queue-column" data-toggle="modal" data-target="#bulkEmailModal" onclick="self.preparePopup();">';
					btnHtml += Joomla.JText._('PLG_SYSTEM_SENDEMAIL_BTN') ;
				btnHtml += '</button>';
			btnHtml += '</div>';

		jQuery('#toolbar').append(btnHtml);
	}
	catch (err) {
		/*console.log(err.message);*/
	}
}

tjsendEmail.prototype.preparePopup: function () {
	try {
		if (document.adminForm.boxchecked.value==0)
		{
			alert(Joomla.JText._('PLG_SYSTEM_SENDEMAIL_SELECT_CHECKBOX'));
			return false;
		}

		// Remove below line removeclass it is temp added
		jQuery("div").find('.tjlms-wrapper').removeClass("tjBs3");

		var modelEmail = '<div id="bulkEmailModal" class="emailModal modal fade" role="dialog">';
				modelEmail += '<div class="modal-dialog">';
					modelEmail += '<div class="modal-content is-progress" id="emailPopup">';
					modelEmail += '<div id="preload"></div>';
							modelEmail += '<div class="modal-header">';
								modelEmail += '<div class="row-fluid">';
									modelEmail += '<div class="span10">';
										modelEmail += '<h5 class="modal-title" id="exampleModalLabel">' + Joomla.JText._('PLG_SYSTEM_SENDEMAIL_POPUP_HEADING') + '</h5>';
									modelEmail += '</div>';
									modelEmail += '<div class="span2">';
										modelEmail += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
									modelEmail += '</div>';
								modelEmail += '</div>';
								modelEmail += '<span id="errorMessage"></span>';
							modelEmail += '</div>';

							modelEmail += '<div class="modal-body">';
								modelEmail += '<div class="container-fluid">';
									modelEmail += '<form action="#" method="post" enctype="multipart/form-data" name="emailTemplateForm" id="emailTemplateForm" class="form-validate">';
										modelEmail += '<div class="row-fluid">';
											modelEmail += '<div class="span12">';
												modelEmail += '<div class="control-group">';
													modelEmail += '<div class="control-label">';
														modelEmail += '<label id="email-subject-label" for="email-subject" class="hasPopover required" title="" >';
															modelEmail += Joomla.JText._('PLG_SYSTEM_SENDEMAIL_POPUP_EMAIL_SUBJECT') + ' <span class="star">&nbsp;*</span>';
														modelEmail += '</label>';
													modelEmail += '</div>';

													modelEmail += '<div class="controls">';
														modelEmail += '<input type="text" name="template[subject]" id="' + this.emailSubjectFieldId + '" value="" class="required" required="required" aria-required="true">';
													modelEmail += '</div>';
												modelEmail += '</div>';
												modelEmail += '<div class="control-group">';
													modelEmail += '<div class="control-label">';
														modelEmail += '<label id="email-message-label" for="email-message" class="hasPopover required" title="" >';
															modelEmail += Joomla.JText._('PLG_SYSTEM_SENDEMAIL_POPUP_EMAIL_BODY_MESSAGE') + ' <span class="star">&nbsp;*</span>';
														modelEmail += '</label>';
													modelEmail += '</div>';
													modelEmail += '<div class="controls">';
														modelEmail += '<textarea name="template[message]" rows="7" style="width: 30%;" id="'+ this.emailMessageFieldId + '" value="" class="required" required="required" aria-required="true"></textarea>';
													modelEmail += '</div>';
												modelEmail += '</div>';
											modelEmail += '</div>';
											modelEmail += '<div id="emailsDiv"></div>';
										modelEmail += '</div>';
									modelEmail += '</div>';
								modelEmail += '</form>';
							modelEmail += '</div>';
							modelEmail += '<div class="modal-footer">';
								modelEmail += '<button type="button" class="btn btn-primary validate" id="tj-send-email" onclick="self.sendEmail();">' + Joomla.JText._('PLG_SYSTEM_SENDEMAIL_POPUP_SEND_BTN') + '</button>';
							modelEmail += '</div>';
					modelEmail += '</div>';
				modelEmail += '</div>';
			modelEmail += '</div>';

		// Confirm this class to append popup
		jQuery('#j-main-container').append(modelEmail);

		jQuery('div').find("#preload").hide();
		jQuery('div').find(".is-progress").removeClass('is-progress');
		jQuery('div').find("#tj-send-email").attr("disabled", false);
		jQuery("#" + this.emailSubjectFieldId).val('');
		jQuery("#" + this.emailMessageFieldId).val('');

		jQuery("#emailsDiv").empty();

		jQuery.each(jQuery("input[name='cid[]']:checked").closest("td").siblings("td" + this.tjTdClass), function () {
			var hiddenEle = "<input readonly type='hidden' name='emails[]' value='" + jQuery(this).text() + "'/>";
			jQuery("#bulkEmailModal").find("#emailsDiv").append(hiddenEle);
		});

		// Create editor field
		 tinyMCE.execCommand( 'mceAddEditor', false, "email-message");

		// alert(values.join (", "));
	}
	catch (err) {
		/*console.log(err.message);*/
	}
}

tjsendEmail.prototype.sendEmail : function () {
	var validation = self.validate();

	if (!validation) {
		return false;
	}

	var batchData = self.prepareBatch();

	jQuery.each(batchData, function (index, value) {

		// alert( value.title + ' : ' + value.link );

		value.index ++;

		var url = "index.php?option=com_ajax&plugin=plg_System_Sendemail&format=json";

		var promise = jQuery.ajax({url: url, type: 'POST', async:true, data:value.emailData,dataType: 'json'});

		promise.fail(
			function(response) {
				console.log('Something went wrong.');

				var errormsg = '<div class="alert alert-error alert-danger"><button type="button" data-dismiss="alert" class="close">×</button><h4 class="alert-heading"></h4><div>' + response.message + '</div></div>';
				jQuery("#bulkEmailModal").find("#errorMessage").append(errormsg);
				jQuery('#preload').hide();
			}
		).done(
			function(response) {
				if (value.index == value.batchCount)
				{
					jQuery('#preload').hide();
					jQuery('div').find(".is-progress").removeClass('is-progress');
					jQuery('#bulkEmailModal').modal('hide');

					 // Remove below line removeclass it is temp added
					 jQuery("div").find('.tjlms-wrapper').addClass("tjBs3");

					 Joomla.renderMessages({"success":[response.message]});
				}
			}
		).always(
			function(response) {
				// console.log('response always.' , response);
			}
		);
	});

	// Call service
	//~ tjEmailService.postData();
}

tjsendEmail.prototype.validate: function () {
	jQuery('textarea').each(function (index, ta) {
		var $ta = jQuery(ta);
		var emailMessageValue = $ta.val();
	});

	var emailSubjectValue = jQuery("#" + this.emailSubjectFieldId).val();
	var emailMessageValue = jQuery("#" + this.emailMessageFieldId).val();
	var invalidCount = 0;

	if (!emailSubjectValue)
	{
		invalidCount = 1;

		jQuery("#" + this.emailSubjectFieldId).addClass("invalid");
		jQuery('#email-subject-label').addClass("invalid");
	}

	if (!emailMessageValue)
	{
		invalidCount = 1;

		jQuery("#" + this.emailMessageFieldId).addClass("invalid");
		jQuery('#email-message-label').addClass("invalid");
	}

	if (invalidCount)
	{
		return false;
	}

	return true;
}

tjsendEmail.prototype.prepareBatch : function () {
	jQuery('#preload').show();
	jQuery('div').find("#emailPopup").addClass('is-progress');
	jQuery('#tj-send-email').attr("disabled", true);
	var chunk_size = 5;

	var postData = jQuery("#emailTemplateForm").serializeArray();

	var emailContent = postData.splice(0,2);

	// Remove duplicate values from email array
	postData = postData.map(JSON.stringify).reverse() // convert to JSON string the array content, then reverse it (to check from end to begining)
	.filter(function(item, index, postData){ return postData.indexOf(item, index + 1) === -1; }) // check if there is any occurence of the item in whole array
	.reverse().map(JSON.parse) // revert it to original state

	// Chuck of 10 emails
	var emails = postData.map( function(e,i){
		return i%chunk_size===0 ? postData.slice(i,i+chunk_size) : null;
	}).filter(function(e){ return e; });

	var batchCount = emails.length;

	var batchArray = new Array();

	jQuery.each(emails, function (i, batch) {
		var emailData = batch.concat(emailContent);

		batchArray.push({
			'emailData': emailData,
			'index':  i,
			'batchCount':batchCount
		});

		// Call the send email function
		// tjutilitysendemail.send(emailData, i, batchCount);
	});

	return batchArray;
}
