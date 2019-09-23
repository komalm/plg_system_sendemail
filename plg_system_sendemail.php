<?php
/**
 * @package     Plg_System_Tjlms
 * @subpackage  Plg_System_Tjlms
 *
 * @author      Techjoomla <extensions@techjoomla.com>
 * @copyright   Copyright (C) 2009 - 2018 Techjoomla. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access.
defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\CMS\Session\Session;

JHtml::_('jquery.token');

$lang = JFactory::getLanguage();
$lang->load('plg_system_sendemail', JPATH_ADMINISTRATOR);

/**
 * Plugin to send email in a bulk.
 *
 * @since  __DEPLOY_VERSION__
 */
class PlgSystemplg_System_Sendemail extends JPlugin
{
	/**
	 * Constructor - Function used as a contructor
	 *
	 * @param   object  $subject  The object to observe
	 * @param   array   $config   An array that holds the plugin configuration
	 *
	 * @retunr  class object
	 *
	 * @since  __DEPLOY_VERSION__
	 */
	public function __construct($subject, $config)
	{
		Text::script('PLG_SYSTEM_SENDEMAIL_BTN');
		Text::script('PLG_SYSTEM_SENDEMAIL_SELECT_CHECKBOX');
		Text::script('PLG_SYSTEM_SENDEMAIL_POPUP_HEADING');
		Text::script('PLG_SYSTEM_SENDEMAIL_POPUP_EMAIL_SUBJECT');
		Text::script('PLG_SYSTEM_SENDEMAIL_POPUP_EMAIL_BODY_MESSAGE');
		Text::script('PLG_SYSTEM_SENDEMAIL_POPUP_SEND_BTN');

		parent::__construct($subject, $config);
	}

	/**
	 * Ajax call funcation to send email
	 *
	 * @return  none
	 *
	 * @since  __DEPLOY_VERSION__
	 */
	public function onAjaxplg_System_Sendemail()
	{
		Session::checkToken('post') or new JResponseJson(null, Text::_('JINVALID_TOKEN_NOTICE'), true);

		if (!Factory::getUser()->id)
		{
			echo new JResponseJson(null, Text::_('JERROR_ALERTNOAUTHOR'), true);
			jexit();
		}

		$app = Factory::getApplication();
		$config = Factory::getConfig();
		$ccMail = $config->get('mailfrom');

		if (!$ccMail)
		{
			echo new JResponseJson(null, Text::_('PLG_SYSTEM_SENDEMAIL_ERROR_NO_FROMEMAIL'), true);

			jexit();
		}

		$templateData = $app->input->post->get('template', '', 'array');
		$emails = $app->input->post->get('emails', '', 'array');

		if (empty($emails))
		{
			echo new JResponseJson(null, Text::_('PLG_SYSTEM_SENDEMAIL_ADD_RECIPIENTS_OR_CHECK_PREFERENCES'), true);

			jexit();
		}

		try
		{
			// Remove duplicate emails
			$emails = array_unique($emails);

			// The mail subject.
			$emailSubject = $templateData['subject'];

			// The mail body.
			$emailBody = $templateData['message'];

			foreach ($emails as $singleEmail)
			{
				// Send Email
				Factory::getMailer()->sendMail(
					$config->get('mailfrom'),
					$config->get('fromname'),
					trim($singleEmail),
					$emailSubject,
					$emailBody,
					true
				);
			}

			echo new JResponseJson(null, Text::_('PLG_SYSTEM_SENDEMAIL_SUCCESSFULLY_SEND'), false);

			jexit();
		}
		catch (Exception $e)
		{
			echo new JResponseJson(null, Text::_('PLG_SYSTEM_SENDEMAIL_ERROR'), true);

			jexit();
		}
	}
}
