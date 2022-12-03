import * as React from 'react';
import { classNames } from '@pansy/shared';

import { composeRef } from '../_utils/ref';
import { omit } from '../_utils/omit';
import { useMergedState } from '../_utils/hooks/useMergedState';

import { MotionThumb } from './MotionThumb';
import { SegmentedOption } from './Option';
import { normalizeOptions } from './utils';

import type { SegmentedProps, SegmentedRawOption, } from './types';

export const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (props, ref) => {
    const {
      prefixCls = 'l-segmented',
      direction,
      options,
      disabled,
      defaultValue,
      value,
      onChange,
      className = '',
      motionName = 'thumb-motion',
      ...restProps
    } = props;

    const containerRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = React.useMemo(
      () => composeRef<HTMLDivElement>(containerRef, ref),
      [containerRef, ref],
    );

    const segmentedOptions = React.useMemo(() => {
      return normalizeOptions(options);
    }, [options]);

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

    return (
      <div
        {...divProps}
        className={classNames(
          prefixCls,
          {
            [`${prefixCls}-rtl`]: direction === 'rtl',
            [`${prefixCls}-disabled`]: disabled,
          },
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
