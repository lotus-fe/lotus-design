import * as React from 'react';
import type { SizeType } from '../config-provider/SizeContext';

export type ThumbReact = {
  left: number;
  width: number;
} | null;

export type SegmentedValue = string | number;

export type SegmentedRawOption = SegmentedValue;

export interface SegmentedLabeledOption {
  className?: string;
  disabled?: boolean;
  label: React.ReactNode;
  value: SegmentedRawOption;
  /**
   * html `title` property for label
   */
  title?: string;
}

export type SegmentedOptions = (SegmentedRawOption | SegmentedLabeledOption)[];

export interface SegmentedLabeledOptionWithoutIcon extends SegmentedLabeledOption {
  label: SegmentedLabeledOption['label'];
}

export interface SegmentedLabeledOptionWithIcon extends Omit<SegmentedLabeledOption, 'label'> {
  label?: SegmentedLabeledOption['label'];
  /** Set icon for Segmented item */
  icon: React.ReactNode;
}

export interface SegmentedProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'onChange' | 'size'> {
  options: (SegmentedRawOption | SegmentedLabeledOption)[];
  defaultValue?: SegmentedValue;
  value?: SegmentedValue;
  onChange?: (value: SegmentedValue) => void;
  disabled?: boolean;
  prefixCls?: string;
  direction?: 'ltr' | 'rtl';
  motionName?: string;
  /** Option to fit width to its parent's width */
  block?: boolean;
  /** Option to control the display size */
  size?: SizeType;
}
