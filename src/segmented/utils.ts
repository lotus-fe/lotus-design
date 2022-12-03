import type { ThumbReact, SegmentedOptions, SegmentedLabeledOption } from './types';

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

export const calcThumbStyle = (
  targetElement: HTMLElement | null | undefined,
): ThumbReact =>
  targetElement
    ? {
        left: targetElement.offsetLeft,
        width: targetElement.clientWidth,
      }
    : null;
