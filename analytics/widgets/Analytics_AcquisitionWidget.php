<?php

namespace Craft;

class Analytics_AcquisitionWidget extends BaseWidget
{
    public function getName()
    {
        return Craft::t('Analytics : Acquisition');
    }

    public function getBodyHtml()
    {
        $variables = array();

        $originalTemplatesPath = craft()->path->getTemplatesPath();

        $templatePath = craft()->path->getPluginsPath().'analytics/templates/';

        craft()->path->setTemplatesPath($templatePath);

        $html = craft()->templates->render('_widgets/acquisition', $variables);

        $charset = craft()->templates->getTwig()->getCharset();

        $return = new \Twig_Markup($html, $charset);

        craft()->path->setTemplatesPath($originalTemplatesPath);

        return $return;
    }
}