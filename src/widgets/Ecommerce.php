<?php
/**
 * @link      https://dukt.net/analytics/
 * @copyright Copyright (c) 2018, Dukt
 * @license   https://github.com/dukt/analytics/blob/master/LICENSE.md
 */

namespace dukt\analytics\widgets;

use Craft;
use craft\helpers\Json;
use dukt\analytics\Plugin as Analytics;
use dukt\analytics\web\assets\ecommercewidget\EcommerceWidgetAsset;
use craft\web\View;

class Ecommerce extends \craft\base\Widget
{
    // Properties
    // =========================================================================

    /**
     * @var string|null
     */
    public $viewId;

    /**
     * @var string|null
     */
    public $period;

    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public static function displayName(): string
    {
        return Craft::t('analytics', 'E-commerce');
    }

    /**
     * @inheritdoc
     */
    public static function iconPath()
    {
        return Craft::getAlias('@dukt/analytics/icons/report.svg');
    }

    /**
     * @inheritDoc IWidget::getBodyHtml()
     *
     * @return string|false
     * @throws \Twig_Error_Loader
     * @throws \yii\base\Exception
     * @throws \yii\base\InvalidConfigException
     */
    public function getBodyHtml()
    {
        $view = Craft::$app->getView();

        if (!Analytics::$plugin->getAnalytics()->checkPluginRequirements()) {
            return $view->renderTemplate('analytics/_special/not-connected');
        }

        if (!Analytics::$plugin->getSettings()->enableWidgets) {
            return $view->renderTemplate('analytics/_components/widgets/Ecommerce/disabled');
        }

        $reportingViews = Analytics::$plugin->getViews()->getViews();

        if (count($reportingViews) === 0) {
            return $view->renderTemplate('analytics/_special/no-views');
        }

        $widgetSettings = $this->settings;
        $reportingView = Analytics::$plugin->getViews()->getViewById($widgetSettings['viewId']);

        if (!$reportingView) {
            return $view->renderTemplate('analytics/_special/view-not-configured');
        }

        $widgetId = $this->id;
        $widgetSettings = $this->settings;
        $localeDefinition = Analytics::$plugin->getAnalytics()->getD3LocaleDefinition(['currency' => $reportingView->gaViewCurrency]);

        $widgetOptions = [
            'viewId' => $widgetSettings['viewId'],
            'period' => $widgetSettings['period'] ?? null,
            'localeDefinition' => $localeDefinition,
            'chartLanguage' => Analytics::$plugin->getAnalytics()->getChartLanguage(),
        ];

        $view->registerJsFile('//www.gstatic.com/charts/loader.js', [
            'position' => View::POS_HEAD,
        ]);
        $view->registerAssetBundle(EcommerceWidgetAsset::class);
        $view->registerJs('var AnalyticsChartLanguage = "'.Craft::$app->language.'";', true);
        $view->registerJs('new Analytics.EcommerceWidget("widget'.$widgetId.'", '.Json::encode($widgetOptions).');');

        return $view->renderTemplate('analytics/_components/widgets/Ecommerce/body', [
            'widgetSettings' => $widgetSettings
        ]);
    }

    /**
     * @inheritdoc
     */
    public static function maxColspan()
    {
        return 1;
    }

    /**
     * @inheritDoc ISavableComponentType::getSettingsHtml()
     *
     * @return string
     * @throws \Twig_Error_Loader
     * @throws \yii\base\Exception
     */
    public function getSettingsHtml()
    {
        $settings = $this->getSettings();
        $reportingViews = Analytics::$plugin->getViews()->getViews();

        if (count($reportingViews) > 0) {
            return Craft::$app->getView()->renderTemplate('analytics/_components/widgets/Ecommerce/settings', [
                'settings' => $settings,
                'reportingViews' => $reportingViews,
            ]);
        }

        return null;
    }
}
