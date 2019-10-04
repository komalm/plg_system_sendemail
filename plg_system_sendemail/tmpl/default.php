<?php
/**
* @package     Joomla.Plugin
* @subpackage  tjSendemail
*
* @copyright   Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
* @license     GNU General Public License version 2 or later; see LICENSE.txt
*/

defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;

$lang = Factory::getLanguage();
$lang->load('plg_system_sendemail', JPATH_ADMINISTRATOR);

JForm::addFormPath(JPATH_SITE . '/plugins/system/plg_system_sendemail/plg_system_sendemail/tmpl');
$form = JForm::getInstance('email', 'form', array(), false);

?>
<div id="bulkEmailModal" class="emailModal modal fade" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content is-progress" id="emailPopup">
			<div id="preload"></div>
			<div class="modal-header">
				<div class="row-fluid">
					<div class="span10">
						<h5 class="modal-title" id="exampleModalLabel"><?php echo JText::_('PLG_SYSTEM_SENDEMAIL_POPUP_HEADING');?></h5>
					</div>

					<div class="span2">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					</div>
				</div>

				<span id="errorMessage"></span>
			</div>

			<div class="modal-body">
				<div class="container-fluid">
					<form action="#" method="post" enctype="multipart/form-data" name="emailTemplateForm" id="emailTemplateForm" class="form-validate">
						<div class="form-horizontal">
							<div class="control-group">
								<div class="control-label"><?php echo $form->getLabel('subject'); ?></div>
								<div class="controls"><?php echo $form->getInput('subject'); ?></div>
							</div>
							<div class="control-group">
								<div class="control-label"><?php echo $form->getLabel('message'); ?></div>
								<div class="controls"><?php echo $form->getInput('message'); ?></div>
							</div>
							<div id="emailsDiv"></div>
						</div>
					</form>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-primary" id="tj-send-email" onclick="window.email.sendEmail();"><?php echo JText::_('PLG_SYSTEM_SENDEMAIL_POPUP_SEND_BTN');?></button>
				</div>
			</div>
		</div>
	</div>
</div>
