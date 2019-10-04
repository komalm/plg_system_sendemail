window.tjSendEmail.UI = function (tjTableId, tjTdClass, checkBoxName) {

	this.tjTableId = tjTableId;
	this.tjTdClass = '.' + tjTdClass;
	this.checkBoxName = checkBoxName;

	if (!this.isSendEmail())
	{
		console.log(Joomla.JText._('PLG_SYSTEM_SENDEMAIL_NOTALLOW'));
	}

	this.init();
}

// Return true if send email field is avaliable on view
window.tjSendEmail.UI.prototype.isSendEmail = function () {
	if (jQuery('body').find(this.tjTdClass).length)
	{
		return true;
	}
	else
	{
		return false;
	}
}

// Init function
window.tjSendEmail.UI.prototype.init = function () {
	var isCheckboxes = jQuery('body').find('input[name="' + this.checkBoxName + '[]"]').length;

	// If on list view already checkbox are present then avoid the add column function
	if (!isCheckboxes)
	{
		this._addColumn();
	}

	this.btnSendEmail();
}

// Add checkbox column if not present on list view
window.tjSendEmail.UI.prototype._addColumn = function() {
	var tr = document.getElementById(this.tjTableId).tHead.children[0];
	tr.insertCell(0).outerHTML = '<th><input type="checkbox" name="checkall-toggle" value="" class="hasTooltip" title="Check All Items" onclick="Joomla.checkAll(this)"></th>'

	var tblBodyObj = document.getElementById(this.tjTableId).tBodies[0];
	for (var i=0; i<tblBodyObj.rows.length; i++) {
		var newCell = tblBodyObj.rows[i].insertCell(0);
		newCell.innerHTML = '<input type="checkbox" id="cb0" name="' + this.checkBoxName + '[]" value="' + i + '" onclick="Joomla.isChecked(this.checked);">'
	}
}

// Add send email button on list view
window.tjSendEmail.UI.prototype.btnSendEmail = function () {
	try {
		var self = this;

		var $sendBtn = jQuery('<div class="btn-wrapper" id="tj-sendemail"><button type="button" class="btn btn-primary" id="email-queue-column" data-toggle="modal" data-target="#bulkEmailModal">' + Joomla.JText._('PLG_SYSTEM_SENDEMAIL_BTN') + '</button></div>');

		$sendBtn.click(function () {
				self.preparePopup();
			});

			jQuery('#toolbar').append($sendBtn);
	}
	catch (err) {
		console.log(err.message);
	}
}

// After click on send email button prepare popup
window.tjSendEmail.UI.prototype.preparePopup =  function () {

	if (document.adminForm.boxchecked.value==0)
	{
		alert(Joomla.JText._('PLG_SYSTEM_SENDEMAIL_SELECT_CHECKBOX'));
		return false;
	}

	jQuery("#emailsDiv").empty();

	var self = this;

	jQuery.ajax(
	{
		type: "POST",
		url: "index.php?option=com_ajax&plugin=tj_GetHTML&format=raw",
		success: function(data)
		{
			if (jQuery('#j-main-container').append(data))
			{
				jQuery('#bulkEmailModal').modal('show');

				// Remove below line removeclass it is temp added
				jQuery("div").find('.tjlms-wrapper').removeClass("tjBs3");

				jQuery('div').find("#preload").hide();
				jQuery('div').find(".is-progress").removeClass('is-progress');
				jQuery('div').find("#tj-send-email").attr("disabled", false);
				jQuery("#message").val('');
				jQuery("#subject").val('');
				// tinymce.init({selector: '#message'});
				// jQuery("#message").val('');

				jQuery.each(jQuery("input[name='" + self.checkBoxName + "[]']:checked").closest("td").siblings("td" + self.tjTdClass), function () {
					var hiddenEle = "<input readonly type='hidden' name='emails[]' value='" + jQuery(this).text() + "'/>";
					jQuery("#bulkEmailModal").find("#emailsDiv").append(hiddenEle);
				});
			}
		}
	});
}

// After click on send button on popup call this 'sendEmail' function
window.tjSendEmail.UI.prototype.sendEmail = function () {
	var validation = this.validate();

	if (!validation) {
		return false;
	}

	window.sendEmailCount = 0;
	window.failEmailCount = 0;

	var batchData = this.prepareBatch();

	jQuery.each(batchData, function (index, value) {
		value.index ++;
		 var callback = function (err, res) {
			if (err)
			{
				console.log('Something went wrong.');
			}
			else
			{
				if (res.success == true)
				{
					window.sendEmailCount = res.data.send + window.sendEmailCount;
					window.failEmailCount = res.data.fail + window.failEmailCount;

					// res.data.send = window.sendEmailCount;
					// res.data.fail = window.failEmailCount;

					if (value.index == value.batchCount)
					{
						jQuery('#preload').hide();
						jQuery('div').find(".is-progress").removeClass('is-progress');
						jQuery('#bulkEmailModal').modal('hide');

						 // Remove below line removeclass it is temp added
						 jQuery("div").find('.tjlms-wrapper').addClass("tjBs3");

						 res.message = res.message + " successfully " + window.sendEmailCount + ", and fail " +  window.failEmailCount + ".";

						 Joomla.renderMessages({"success":[res.message]});
					}
				}
				else
				{
					jQuery("#errorMessage").empty();
					var errormsg = '<div class="alert alert-error alert-danger"><button type="button" data-dismiss="alert" class="close">×</button><h4 class="alert-heading"></h4><div>' + res.message + '</div></div>';
					jQuery("#bulkEmailModal").find("#errorMessage").append(errormsg);
					jQuery('#preload').hide();
					jQuery('div').find(".is-progress").removeClass('is-progress');
					jQuery('#tj-send-email').removeAttr("disabled", true);
				}
			}
		}

		window.tjSendEmail.Services.sendEmail.send(value.emailData, callback);
	});
}

// Before send Email check validation subject and message are not empty
window.tjSendEmail.UI.prototype.validate =  function () {

	var thisForm = document.getElementById("emailTemplateForm");
	var isValid = document.formvalidator.isValid(thisForm);
	var invalidCount = 0;

	// Increase count if form validation false
	if (!isValid) { invalidCount = 1; }

	var emailMessageValue = jQuery("#message").val();

	// Increase count if editor value empty
	if (!emailMessageValue) { invalidCount = 1; }

	if (invalidCount)
	{
		var jformErrorMessage = jQuery('#system-message-container').html();
		Joomla.removeMessages();

		jQuery('#errorMessage').html(jformErrorMessage);

		if (!emailMessageValue)
		{
			jQuery('#message-lbl').addClass("invalid");
			var errormsg = '<div class="alert alert-error alert-danger"><button type="button" data-dismiss="alert" class="close">×</button><h4 class="alert-heading"></h4><div>Invalid field: Message</div></div>';
			jQuery("#bulkEmailModal").find("#errorMessage").append(errormsg);
		}

		return false;
	}

	return true;
}

// Before sending email prepare batch if sending email id's more than 10
window.tjSendEmail.UI.prototype.prepareBatch  =  function () {
	jQuery('#preload').show();
	jQuery('div').find("#emailPopup").addClass('is-progress');
	jQuery('#tj-send-email').attr("disabled", true);
	var chunk_size = 5;

	tinyMCE.triggerSave();

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
	});

	return batchArray;
}
