<?php
/**
 * @package     JGive
 * @subpackage  com_jgive
 *
 * @author      Techjoomla <extensions@techjoomla.com>
 * @copyright   Copyright (C) 2009 - 2019 Techjoomla. All rights reserved.
 * @license     http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

$doc = JFactory::getDocument();

// Add Javascript vars in array
$doc->addScriptOptions('tjEmail', array());

// Load JS files
JHtml::script(JUri::root() . '/plugins/system/plg_system_sendemail/js/core/class.js');
JHtml::script(JUri::root() . '/plugins/system/plg_system_sendemail/js/tjSendEmail.js');
JHtml::script(JUri::root() . '/plugins/system/plg_system_sendemail/js/core/base.js');
JHtml::script(Juri::root() . '/plugins/system/plg_system_sendemail/js/services/sendEmail.js');
JHtml::script(Juri::root() . '/plugins/system/plg_system_sendemail/js/ui/tjEmailUI.js');
