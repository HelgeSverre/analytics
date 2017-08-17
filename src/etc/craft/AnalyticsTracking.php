<?php
/**
 * @link      https://dukt.net/craft/analytics/
 * @copyright Copyright (c) 2017, Dukt
 * @license   https://dukt.net/craft/analytics/docs/license
 */

namespace dukt\analytics\etc\craft;

use Craft;
use dukt\analytics\errors\InvalidAccountException;
use Racecore\GATracking\GATracking;

class AnalyticsTracking
{
    // Properties
    // =========================================================================

    /**
     * @var GATracking
     */
    private $tracking;

    // Public Methods
    // =========================================================================

    /**
     * Returns the string representation of the element.
     *
     * @return string
     */
    public function __toString()
    {
        return '';
    }

    /**
     * Constructor
     *
     * @param array|null $options
     *
     * @throws InvalidAccountException
     */
    public function __construct($options = null)
    {
        if(!empty($options['accountId']))
        {
            $accountId = $options['accountId'];

            $this->tracking = new \Racecore\GATracking\GATracking($accountId);
        }
        else
        {
            throw new InvalidAccountException("Account ID not provided");
        }
    }

    /**
     * Campaign
     *
     * @param $options
     *
     * @return $this
     */
    public function campaign($options)
    {
        $item = $this->tracking->createTracking('Page');
        $item = $this->_fillItem($item, $options);
        $this->tracking->sendTracking($item);
        return $this;
    }

    /**
     * Ecommerce Transaction
     *
     * @param $options
     *
     * @return $this
     */
    public function ecommerceTransaction($options)
    {
        $item = $this->tracking->createTracking('Ecommerce\Transaction');
        $item = $this->_fillItem($item, $options);
        $this->tracking->sendTracking($item);
        return $this;
    }

    /**
     * Ecommerce Item
     *
     * @param $options
     *
     * @return $this
     */
    public function ecommerceItem($options)
    {
        $item = $this->tracking->createTracking('Ecommerce\Item');
        $item = $this->_fillItem($item, $options);
        $this->tracking->sendTracking($item);
        return $this;
    }

    /**
     * Page
     *
     * @param $options
     *
     * @return $this
     */
    public function page($options)
    {
        $item = $this->tracking->createTracking('Page');
        $item = $this->_fillItem($item, $options);
        $this->tracking->sendTracking($item);
        return $this;
    }

    /**
     * Event
     *
     * @param $options
     *
     * @return $this
     */
    public function event($options)
    {
        $item = $this->tracking->createTracking('Event');
        $item = $this->_fillItem($item, $options);
        $this->tracking->sendTracking($item);
        return $this;
    }

    /**
     * Social
     *
     * @param $options
     *
     * @return $this
     */
    public function social($options)
    {
        $item = $this->tracking->createTracking('Social');
        $item = $this->_fillItem($item, $options);
        $this->tracking->sendTracking($item);
        return $this;
    }

    /**
     * App Event
     *
     * @param $options
     *
     * @return $this
     */
    public function appEvent($options)
    {
        $item = $this->tracking->createTracking('App\Event');
        $item = $this->_fillItem($item, $options);
        $this->tracking->sendTracking($item);
        return $this;
    }

    /**
     * App Screen
     *
     * @param $options
     *
     * @return $this
     */
    public function appScreen($options)
    {
        $item = $this->tracking->createTracking('App\Screen');
        $item = $this->_fillItem($item, $options);
        $this->tracking->sendTracking($item);
        return $this;
    }

    /**
     * User Timing
     *
     * @param $options
     *
     * @return $this
     */
    public function userTiming($options)
    {
        $item = $this->tracking->createTracking('User\Timing');
        $item = $this->_fillItem($item, $options);
        $this->tracking->sendTracking($item);
        return $this;
    }

    /**
     * Exception
     *
     * @param $options
     *
     * @return $this
     */
    public function exception($options)
    {
        $item = $this->tracking->createTracking('Exception');
        $item = $this->_fillItem($item, $options);
        $this->tracking->sendTracking($item);
        return $this;
    }

    /**
     * Send
     */
    public function send()
    {
        try {
            $this->tracking->send();
        }
        catch(\Exception $e)
        {
            Craft::info('Couldn’t send tracking: '.$e->getMessage(), __METHOD__);
        }
    }

    // Private Methods
    // =========================================================================

    /**
     * Fill Item
     *
     * @param $item
     * @param $options
     *
     * @return mixed
     */
    private function _fillItem($item, $options)
    {
        if(isset($item))
        {
            $aliases = array(
                'id' => 'ID',
                'transactionId' => 'transactionID',
                'nonInteractionHit' => 'asNonInteractionHit'
            );


            foreach($options as $k => $v)
            {

                if(!empty($aliases[$k]))
                {
                    $item->{'set'.ucfirst($aliases[$k])}($v);
                }
                else
                {
                    $item->{'set'.ucfirst($k)}($v);
                }
            }

        }

        return $item;
    }
}
