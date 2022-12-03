import * as React from 'react';
import { classNames } from '@pansy/shared';

import type { SegmentedRawOption } from './types';

export const SegmentedOption: React.FC<{
  prefixCls: string;
  className?: string;
  disabled?: boolean;
  checked: boolean;
  label: React.ReactNode;
  title?: string;
  value: SegmentedRawOption;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    value: SegmentedRawOption,
  ) => void;
}> = ({
  prefixCls,
  className,
  disabled,
  checked,
  label,
  title,
  value,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    onChange(event, value);
  };

  return (
    <label
      className={classNames(className, {
        [`${prefixCls}-item-disabled`]: disabled,
      })}
    >
      <input
        className={`${prefixCls}-item-input`}
        type="radio"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />
      <div className={`${prefixCls}-item-label`} title={title}>
        {label}
      </div>
    </label>
  );
};
