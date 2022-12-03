import * as React from 'react';
import { classNames } from '@pansy/shared';

import { composeRef } from '../_utils/ref';
import { omit } from '../_utils/omit';
import { useMergedState } from '../_utils/hooks/useMergedState';

import { ConfigContext } from '../config-provider';
import SizeContext from '../config-provider/SizeContext';
import { MotionThumb } from './MotionThumb';
import { SegmentedOption } from './Option';
import { normalizeOptions, isSegmentedLabeledOptionWithIcon, } from './utils';
import useStyle from './style';

import type { SegmentedProps, SegmentedRawOption, } from './types';

export const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (props, ref) => {
    const {
      prefixCls: customizePrefixCls,
      options,
      disabled,
      defaultValue,
      value,
      block,
      onChange,
      className = '',
      size: customSize = 'middle',
      motionName = 'thumb-motion',
      ...restProps
    } = props;

    const { getPrefixCls, direction } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('segmented', customizePrefixCls);

    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // ===================== Size =====================
    const size = React.useContext(SizeContext);
    const mergedSize = customSize || size;

    const containerRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = React.useMemo(
      () => composeRef<HTMLDivElement>(containerRef, ref),
      [containerRef, ref],
    );

    // syntactic sugar to support `icon` for Segmented Item
    const segmentedOptions = React.useMemo(
      () =>
        normalizeOptions(options.map((option) => {
          if (isSegmentedLabeledOptionWithIcon(option)) {
            // @ts-ignore
            const { icon, label, ...restOption } = option;
            return {
              ...restOption,
              label: (
                <>
                  <span className={`${prefixCls}-item-icon`}>{icon}</span>
                  {label && <span>{label}</span>}
                </>
              ),
            };
          }
          return option;
        })),
      [options, prefixCls],
    );

    const [rawValue, setRawValue] = useMergedState(segmentedOptions[0]?.value, {
      value,
      defaultValue,
    });

    // ======================= Change ========================
    const [thumbShow, setThumbShow] = React.useState(false);

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      val: SegmentedRawOption,
    ) => {
      if (disabled) {
        return;
      }

      setRawValue(val);

      onChange?.(val);
    };

    const divProps = omit(restProps, ['children']);

    return wrapSSR(
      <div
        {...divProps}
        className={classNames(
          prefixCls,
          {
            [`${prefixCls}-block`]: block,
            [`${prefixCls}-sm`]: mergedSize === 'small',
            [`${prefixCls}-lg`]: mergedSize === 'large',
            [`${prefixCls}-rtl`]: direction === 'rtl',
            [`${prefixCls}-disabled`]: disabled,
          },
          hashId,
          className,
        )}
        ref={mergedRef}
      >
        <div className={`${prefixCls}-group`}>
          <MotionThumb
            prefixCls={prefixCls}
            value={rawValue}
            containerRef={containerRef}
            motionName={`${prefixCls}-${motionName}`}
            getValueIndex={(val) =>
              segmentedOptions.findIndex((n) => n.value === val)
            }
            onMotionStart={() => {
              setThumbShow(true);
            }}
            onMotionEnd={() => {
              setThumbShow(false);
            }}
          />
          {segmentedOptions.map((segmentedOption) => (
            <SegmentedOption
              key={segmentedOption.value}
              prefixCls={prefixCls}
              className={classNames(
                segmentedOption.className,
                `${prefixCls}-item`,
                {
                  [`${prefixCls}-item-selected`]:
                    segmentedOption.value === rawValue && !thumbShow,
                },
              )}
              checked={segmentedOption.value === rawValue}
              onChange={handleChange}
              {...segmentedOption}
              disabled={!!disabled || !!segmentedOption.disabled}
            />
          ))}
        </div>
      </div>
    )
  }
)

if (process.env.NODE_ENV !== 'production') {
  Segmented.displayName = 'Segmented';
}
