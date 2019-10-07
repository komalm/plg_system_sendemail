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

// Popup form validation
JHtml::_('behavior.formvalidator');

use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\CMS\Session\Session;
use Joomla\Utilities\ArrayHelper;

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

		$document = Factory::getDocument();

		$style = '.is-progress {
					background-color: #EEF2F6;
					cursor: not-allowed;
					z-index: 5;
					opacity: 0.6;
					-webkit-transition: background-color 500ms ease-out 1s;
					-moz-transition: background-color 500ms ease-out 1s;
					-o-transition: background-color 500ms ease-out 1s;
					transition: background-color 500ms ease-out 1s;
					position: relative;

				}

				.is-progress:before {
					font-family: "FontAwesome";
					content: "\f110";
					position: absolute;
					z-index:1040;
					left: 50%;
					top: 50%;
					font-size: 45px;
					color: #1664bd;
					-webkit-animation: fa-spin 2s infinite linear;
					animation: fa-spin 2s infinite linear;
					transform: translate(-50%, -50%);
					text-align: center;
				}';
		$document->addStyleDeclaration($style);

		parent::__construct($subject, $config);
	}

	/**
	 * Ajax call funcation to send email
	 *
	 * @return  string
	 *
	 * @since  __DEPLOY_VERSION__
	 */
	public function onAjaxtj_GetHTML()
	{
		$app = Factory::getApplication();

		// Load the layout & push variables
		ob_start();
		$layout = $this->buildLayoutPath('default');

		include $layout;
		$html = ob_get_contents();
		ob_end_clean();

		return $html;
	}

	/**
	 * Build Layout path
	 *
	 * @param   string  $layout  Layout name
	 *
	 * @since   2.2
	 *
	 * @return   string  Layout Path
	 */
	public function buildLayoutPath($layout)
	{
		$app = JFactory::getApplication();

		$core_file = dirname(__FILE__) . '/' . $this->_name . '/tmpl/default.php';

		$override = JPATH_BASE . '/' . 'templates' . '/' . $app->getTemplate() . '/html/plugins/' .
		$this->_type . '/' . $this->_name . '/' . 'default.php';

		if (JFile::exists($override))
		{
			return $override;
		}
		else
		{
			return $core_file;
		}
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

		// Add logs
		JLog::addLogger(
			array(
				'text_file' => 'sendEmail.logs.php'
			)
		);

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
			$emailSubject = $app->input->post->get('subject', '', 'STRING');

			// The mail body.
			$emailBody = $app->input->post->get('message', '', 'RAW');

			$emailCount = array();

			$sendEmailcount = 0;
			$failEmailcount = 0;

			foreach ($emails as $singleEmail)
			{
				// Send Email
				$return = Factory::getMailer()->sendMail($config->get('mailfrom'), $config->get('fromname'), trim($singleEmail), $emailSubject, $emailBody, true);

				// Check for an error.
				if ($return !== true)
				{
					JLog::add(Text::sprintf('PLG_SYSTEM_SENDEMAIL_FALL_TO_SENDEMAIL', $singleEmail));
					$failEmailcount ++;
				}
				else
				{
					JLog::add(Text::sprintf('PLG_SYSTEM_SENDEMAIL_SUCCESSFULLY_SENDEMAIL', $singleEmail));
					$sendEmailcount ++;
				}
			}

			$emailCount['fail'] = $failEmailcount;
			$emailCount['send'] = $sendEmailcount;

			echo new JResponseJson($emailCount, Text::_('PLG_SYSTEM_SENDEMAIL_SUCCESSFULLY_SEND'), false);

			jexit();
		}
		catch (Exception $e)
		{
			echo new JResponseJson(null, Text::_('PLG_SYSTEM_SENDEMAIL_ERROR'), true);

			jexit();
		}
	}
}
