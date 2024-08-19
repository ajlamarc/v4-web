import React, { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import isEmpty from 'lodash/isEmpty';
import {
  LanguageCode,
  ResolutionString,
  widget as Widget,
} from 'public/tradingview/charting_library';
import { shallowEqual } from 'react-redux';

import { DEFAULT_RESOLUTION } from '@/constants/candles';
import { LocalStorageKey } from '@/constants/localStorage';
import { STRING_KEYS, SUPPORTED_LOCALE_BASE_TAGS } from '@/constants/localization';
import { tooltipStrings } from '@/constants/tooltips';
import type { TvWidget } from '@/constants/tvchart';

import { store } from '@/state/_store';
import { getSelectedNetwork } from '@/state/appSelectors';
import { useAppSelector } from '@/state/appTypes';
import { getAppColorMode, getAppTheme } from '@/state/configsSelectors';
import { getSelectedLocale } from '@/state/localizationSelectors';
import { getCurrentMarketId, getMarketIds } from '@/state/perpetualsSelectors';

import { getDydxDatafeed } from '@/lib/tradingView/dydxfeed';
import { getSavedResolution, getWidgetOptions, getWidgetOverrides } from '@/lib/tradingView/utils';

import { useDydxClient } from '../useDydxClient';
import { useEnvFeatures } from '../useEnvFeatures';
import { useLocalStorage } from '../useLocalStorage';
import { useLocaleSeparators } from '../useLocaleSeparators';
import { useAllStatsigGateValues } from '../useStatsig';
import { useStringGetter } from '../useStringGetter';
import { useURLConfigs } from '../useURLConfigs';

/**
 * @description Hook to initialize TradingView Chart
 */
export const useTradingView = ({
  tvWidgetRef,
  orderLineToggleRef,
  orderbookCandlesToggleRef,
  orderbookCandlesToggleOn,
  buySellMarksToggleRef,
  setIsChartReady,
}: {
  tvWidgetRef: React.MutableRefObject<TvWidget | null>;
  orderLineToggleRef: React.MutableRefObject<HTMLElement | null>;
  orderbookCandlesToggleRef: React.MutableRefObject<HTMLElement | null>;
  orderbookCandlesToggleOn: boolean;
  buySellMarksToggleRef: React.MutableRefObject<HTMLElement | null>;
  setIsChartReady: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const stringGetter = useStringGetter();
  const urlConfigs = useURLConfigs();
  const featureFlags = useAllStatsigGateValues();
  const { isOhlcEnabled } = useEnvFeatures();
  const { group, decimal } = useLocaleSeparators();

  const appTheme = useAppSelector(getAppTheme);
  const appColorMode = useAppSelector(getAppColorMode);

  const marketId = useAppSelector(getCurrentMarketId);
  const marketIds = useAppSelector(getMarketIds, shallowEqual);
  const selectedLocale = useAppSelector(getSelectedLocale);
  const selectedNetwork = useAppSelector(getSelectedNetwork);

  const { getCandlesForDatafeed, getMarketTickSize } = useDydxClient();

  const [savedTvChartConfig, setTvChartConfig] = useLocalStorage<object | undefined>({
    key: LocalStorageKey.TradingViewChartConfig,
    defaultValue: undefined,
  });

  const savedResolution = getSavedResolution({ savedConfig: savedTvChartConfig });

  const [initialPriceScale, setInitialPriceScale] = useState<number | null>(null);

  const hasMarkets = marketIds.length > 0;
  const hasPriceScaleInfo = initialPriceScale !== null || hasMarkets;

  useEffect(() => {
    // we only need tick size from current market for the price scale settings
    // if markets haven't been loaded via abacus, get the current market info from indexer
    (async () => {
      if (marketId && !hasPriceScaleInfo) {
        const marketTickSize = await getMarketTickSize(marketId);
        const priceScale = BigNumber(10).exponentiatedBy(
          BigNumber(marketTickSize).decimalPlaces() ?? 2
        );
        setInitialPriceScale(priceScale.toNumber());
      }
    })();
  }, [marketId, hasPriceScaleInfo, getMarketTickSize]);

  useEffect(() => {
    if (marketId && hasPriceScaleInfo) {
      const widgetOptions = getWidgetOptions();
      const widgetOverrides = getWidgetOverrides({ appTheme, appColorMode });
      const options = {
        ...widgetOptions,
        ...widgetOverrides,
        datafeed: getDydxDatafeed(
          store,
          getCandlesForDatafeed,
          initialPriceScale,
          orderbookCandlesToggleOn,
          { decimal, group },
          selectedLocale,
          stringGetter
        ),
        interval: (savedResolution ?? DEFAULT_RESOLUTION) as ResolutionString,
        locale: SUPPORTED_LOCALE_BASE_TAGS[selectedLocale] as LanguageCode,
        symbol: marketId,
        saved_data: !isEmpty(savedTvChartConfig) ? savedTvChartConfig : undefined,
        auto_save_delay: 1,
      };

      const tvChartWidget = new Widget(options);
      tvWidgetRef.current = tvChartWidget;

      tvWidgetRef.current?.onChartReady(() => {
        tvWidgetRef.current?.headerReady().then(() => {
          if (tvWidgetRef.current) {
            if (orderLineToggleRef) {
              orderLineToggleRef.current = tvWidgetRef.current.createButton();
              orderLineToggleRef.current.innerHTML = `<span>${stringGetter({
                key: STRING_KEYS.ORDER_LINES,
              })}</span> <div class="toggle"></div>`;
              orderLineToggleRef.current.setAttribute(
                'title',
                stringGetter({ key: STRING_KEYS.ORDER_LINES_TOOLTIP })
              );
            }
            if (isOhlcEnabled && orderbookCandlesToggleRef) {
              const getOhlcTooltipString = tooltipStrings.ohlc;
              const { title: ohlcTitle, body: ohlcBody } = getOhlcTooltipString({
                stringGetter,
                stringParams: {},
                urlConfigs,
                featureFlags,
              });

              orderbookCandlesToggleRef.current = tvWidgetRef.current.createButton();
              orderbookCandlesToggleRef.current.innerHTML = `<span>${`${ohlcTitle}*`}</span> <div class="toggle"></div>`;
              orderbookCandlesToggleRef.current.setAttribute('title', ohlcBody as string);
            }
            if (buySellMarksToggleRef) {
              buySellMarksToggleRef.current = tvWidgetRef.current.createButton();
              buySellMarksToggleRef.current.innerHTML = `<span>${stringGetter({ key: STRING_KEYS.BUYS_SELLS_TOGGLE })}</span> <div class="toggle"></div>`;
              buySellMarksToggleRef.current.setAttribute(
                'title',
                stringGetter({ key: STRING_KEYS.BUYS_SELLS_TOGGLE_TOOLTIP })
              );
            }
          }
        });

        tvWidgetRef?.current?.subscribe('onAutoSaveNeeded', () =>
          tvWidgetRef?.current?.save((chartConfig: object) => setTvChartConfig(chartConfig))
        );

        setIsChartReady(true);
      });
    }

    return () => {
      orderLineToggleRef.current?.remove();
      orderLineToggleRef.current = null;
      orderbookCandlesToggleRef.current?.remove();
      orderbookCandlesToggleRef.current = null;
      buySellMarksToggleRef.current?.remove();
      buySellMarksToggleRef.current = null;
      tvWidgetRef.current?.remove();
      tvWidgetRef.current = null;
      setIsChartReady(false);
    };
  }, [selectedLocale, selectedNetwork, !!marketId, hasPriceScaleInfo, orderbookCandlesToggleOn]);

  return { savedResolution };
};
