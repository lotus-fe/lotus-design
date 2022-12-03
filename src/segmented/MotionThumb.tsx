import * as React from 'react';
import CSSMotion from 'rc-motion';
import { classNames } from '@pansy/shared';

import { composeRef } from '../_utils/ref';
import { useLayoutEffect } from '../_utils/hooks/useLayoutEffect';

import { toPX, calcThumbStyle, } from './utils';

import type { ThumbReact, SegmentedValue } from './types';

export interface MotionThumbProps {
  containerRef: React.RefObject<HTMLDivElement>;
  value: SegmentedValue;
  getValueIndex: (value: SegmentedValue) => number;
  prefixCls: string;
  motionName: string;
  onMotionStart: VoidFunction;
  onMotionEnd: VoidFunction;
}

export function MotionThumb(props: MotionThumbProps) {
  const {
    prefixCls,
    containerRef,
    value,
    getValueIndex,
    motionName,
    onMotionStart,
    onMotionEnd,
  } = props;

  const thumbRef = React.useRef<HTMLDivElement>(null);
  const [prevValue, setPrevValue] = React.useState(value);

  // =========================== Effect ===========================
  const [prevStyle, setPrevStyle] = React.useState<ThumbReact>(null);
  const [nextStyle, setNextStyle] = React.useState<ThumbReact>(null);

  const findValueElement = (val: SegmentedValue) => {
    const index = getValueIndex(val);

    const ele = containerRef.current?.querySelectorAll<HTMLDivElement>(
      `.${prefixCls}-item`,
    )[index];

    return ele;
  };

  useLayoutEffect(() => {
    if (prevValue !== value) {
      const prev = findValueElement(prevValue);
      const next = findValueElement(value);

      const calcPrevStyle = calcThumbStyle(prev);
      const calcNextStyle = calcThumbStyle(next);

      setPrevValue(value);
      setPrevStyle(calcPrevStyle);
      setNextStyle(calcNextStyle);

      if (prev && next) {
        onMotionStart();
      } else {
        onMotionEnd();
      }
    }
  }, [value]);

  // =========================== Motion ===========================
  const onAppearStart = () => {
    return {
      transform: `translateX(var(--thumb-start-left))`,
      width: `var(--thumb-start-width)`,
    };
  };

  const onAppearActive = () => {
    return {
      transform: `translateX(var(--thumb-active-left))`,
      width: `var(--thumb-active-width)`,
    };
  };

  const onAppearEnd = () => {
    setPrevStyle(null);
    setNextStyle(null);
    onMotionEnd();
  };

  // =========================== Render ===========================
  if (!prevStyle || !nextStyle) {
    return null;
  }

  return (
    <CSSMotion
      visible
      motionName={motionName}
      motionAppear
      onAppearStart={onAppearStart}
      onAppearActive={onAppearActive}
      onAppearEnd={onAppearEnd}
    >
      {({ className: motionClassName, style: motionStyle }, ref) => {
        const mergedStyle = {
          ...motionStyle,
          '--thumb-start-left': toPX(prevStyle?.left),
          '--thumb-start-width': toPX(prevStyle?.width),
          '--thumb-active-left': toPX(nextStyle?.left),
          '--thumb-active-width': toPX(nextStyle?.width),
        } as React.CSSProperties;

        const motionProps = {
          ref: composeRef(thumbRef, ref),
          style: mergedStyle,
          className: classNames(`${prefixCls}-thumb`, motionClassName),
        };

        return <div {...motionProps} />;
      }}
    </CSSMotion>
  )
}
