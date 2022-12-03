import type {
  ThumbReact,
  SegmentedOptions,
  SegmentedLabeledOption,
  SegmentedRawOption,
  SegmentedLabeledOptionWithIcon,
  SegmentedLabeledOptionWithoutIcon,
} from './types';

export const toPX = (value?: number) =>
  value !== undefined ? `${value}px` : undefined;

export function getValidTitle(option: SegmentedLabeledOption) {
  if (typeof option.title !== 'undefined') {
    return option.title;
  }

  // read `label` when title is `undefined`
  if (typeof option.label !== 'object') {
    return option.label?.toString();
  }
}

export function normalizeOptions(options: SegmentedOptions): SegmentedLabeledOption[] {
  return options.map((option) => {
    if (typeof option === 'object' && option !== null) {
      const validTitle = getValidTitle(option);

      return {
        ...option,
        title: validTitle,
      };
    }

    return {
      label: option?.toString(),
      title: option?.toString(),
      value: option,
    };
  });
}

export function isSegmentedLabeledOptionWithIcon(
  option: SegmentedRawOption | SegmentedLabeledOptionWithIcon | SegmentedLabeledOptionWithoutIcon,
): option is SegmentedLabeledOptionWithIcon {
  return typeof option === 'object' && !!(option as SegmentedLabeledOptionWithIcon)?.icon;
}

export const calcThumbStyle = (
  targetElement: HTMLElement | null | undefined,
): ThumbReact =>
  targetElement
    ? {
        left: targetElement.offsetLeft,
        width: targetElement.clientWidth,
      }
    : null;
