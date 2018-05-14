<?php
/**
 * @link      https://dukt.net/craft/analytics/
 * @copyright Copyright (c) 2018, Dukt
 * @license   https://dukt.net/craft/analytics/docs/license
 */

namespace dukt\analytics\controllers;

use Craft;
use craft\web\Controller;
use dukt\analytics\errors\InvalidChartTypeException;
use dukt\analytics\Plugin as Analytics;
use yii\web\Response;

class ReportsController extends Controller
{
    // Public Methods
    // =========================================================================

    /**
     * Get element report.
     *
     * @return Response
     * @throws \yii\base\InvalidConfigException
     * @throws \yii\web\BadRequestHttpException
     */
    public function actionElement()
    {
        $elementId = Craft::$app->getRequest()->getRequiredParam('elementId');
        $siteId = (int)Craft::$app->getRequest()->getRequiredParam('siteId');
        $metric = Craft::$app->getRequest()->getRequiredParam('metric');

        $response = Analytics::$plugin->getReports()->getElementReport($elementId, $siteId, $metric);

        return $this->asJson([
            'type' => 'area',
            'chart' => $response
        ]);
    }

    /**
     * Get realtime widget report.
     *
     * @return Response
     * @throws \yii\base\InvalidConfigException
     */
    public function actionRealtimeWidget()
    {
        if (Analytics::$plugin->getSettings()->demoMode) {
            return $this->getRealtimeDemoResponse();
        }


        // Active users

        $activeUsers = 0;

        $viewId = Craft::$app->getRequest()->getBodyParam('viewId');

        $request = [
            'viewId' => $viewId,
            'metrics' => 'ga:activeVisitors',
            'optParams' => []
        ];

        $response = Analytics::$plugin->getReports()->getRealtimeReport($request);

        if (!empty($response['totalsForAllResults']) && isset($response['totalsForAllResults']['ga:activeVisitors'])) {
            $activeUsers = $response['totalsForAllResults']['ga:activeVisitors'];
        }


        // Pageviews

        $pageviewsRequest = [
            'viewId' => $viewId,
            'metrics' => 'rt:pageviews',
            'optParams' => ['dimensions' => 'rt:minutesAgo']
        ];

        $pageviews = Analytics::$plugin->getReports()->getRealtimeReport($pageviewsRequest);


        // Active pages

        $activePagesRequest = [
            'viewId' => $viewId,
            'metrics' => 'rt:activeUsers',
            'optParams' => ['dimensions' => 'rt:pagePath', 'max-results' => 5]
        ];

        $activePages = Analytics::$plugin->getReports()->getRealtimeReport($activePagesRequest);

        return $this->asJson([
            'activeUsers' => $activeUsers,
            'pageviews' => $pageviews,
            'activePages' => $activePages,
        ]);
    }

    /**
     * Get report widget report.
     *
     * @return Response
     * @throws InvalidChartTypeException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionReportWidget()
    {
        $viewId = Craft::$app->getRequest()->getBodyParam('viewId');
        $chart = Craft::$app->getRequest()->getBodyParam('chart');
        $period = Craft::$app->getRequest()->getBodyParam('period');
        $options = Craft::$app->getRequest()->getBodyParam('options');

        $request = [
            'viewId' => $viewId,
            'chart' => $chart,
            'period' => $period,
            'options' => $options,
        ];

        $cacheId = ['getReport', $request];

        $response = Analytics::$plugin->cache->get($cacheId);

        if (!$response) {
            switch ($chart) {
                case 'area':
                    $response = Analytics::$plugin->getReports()->getAreaReport($request);
                    break;
                case 'counter':
                    $response = Analytics::$plugin->getReports()->getCounterReport($request);
                    break;
                case 'pie':
                    $response = Analytics::$plugin->getReports()->getPieReport($request);
                    break;
                case 'table':
                    $response = Analytics::$plugin->getReports()->getTableReport($request);
                    break;
                case 'geo':
                    $response = Analytics::$plugin->getReports()->getGeoReport($request);
                    break;
                default:
                    throw new InvalidChartTypeException('Chart type `'.$chart.'` not supported.');
            }

            if ($response) {
                Analytics::$plugin->cache->set($cacheId, $response);
            }
        }

        return $this->asJson($response);
    }

    // Private Methods
    // =========================================================================

    /**
     * Get realtime demo response.
     *
     * @return Response
     */
    private function getRealtimeDemoResponse(): Response
    {
        if (Analytics::$plugin->getSettings()->demoMode === 'test') {
            return $this->getRealtimeDemoTestResponse();
        }

        $pageviews = [
            'rows' => []
        ];

        for ($i = 0; $i <= 30; $i++) {
            $pageviews['rows'][] = [$i, random_int(0, 20)];
        }

        $activePages = [
            'rows' => [
                ['/a-new-toga/', random_int(1, 20)],
                ['/parka-with-stripes-on-back/', random_int(1, 20)],
                ['/romper-for-a-red-eye/', random_int(1, 20)],
                ['/the-fleece-awakens/', random_int(1, 20)],
                ['/the-last-knee-high/', random_int(1, 20)],
            ]
        ];

        $activeUsers = 0;

        foreach ($activePages['rows'] as $row) {
            $activeUsers += $row[1];
        }

        return $this->asJson([
            'activeUsers' => $activeUsers,
            'pageviews' => $pageviews,
            'activePages' => $activePages,
        ]);
    }

    /**
     * Get realtime demo test response.
     *
     * @return Response
     */
    private function getRealtimeDemoTestResponse(): Response
    {
        $pageviews = [
            'rows' => []
        ];

        for ($i = 0; $i <= 30; $i++) {
            $pageviews['rows'][] = [$i, random_int(0, 20)];
        }

        $activePages = [
            'rows' => [
                ['/some-url/', random_int(1, 20)],
                ['/some-super-long-url/with-kebab-case/', random_int(1, 20)],
                ['/somesuperlongurlwithoutkebabcasebutstillsuperlong/', random_int(10000000, 20000000)],
                ['/someothersuperlongurl/withoutkebabcasebutstillsuperlong/', random_int(1, 20)],
                ['/one-last-url/', random_int(1, 20)],
            ]
        ];

        $activeUsers = 0;

        foreach ($activePages['rows'] as $row) {
            $activeUsers += $row[1];
        }

        return $this->asJson([
            'activeUsers' => $activeUsers,
            'pageviews' => $pageviews,
            'activePages' => $activePages,
        ]);
    }
}
