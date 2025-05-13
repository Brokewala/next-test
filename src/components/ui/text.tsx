import { Montserrat } from 'next/font/google';
import React, { ComponentPropsWithoutRef } from 'react';

const montserrat = Montserrat({ subsets: ['latin'], weight: '400' });

type TitleType = ComponentPropsWithoutRef<"p"> & {
  // size?: "small" | "normal" | "medium" | "title",
  // color?: "primary" | "dark" | "white" | "second" | "third" | "error",
  weight?: "normal" | "600" | "800",
  format: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p',
  classNameStyle?: string
}

export default function Text(props: TitleType) {
  const Style = React.useMemo(() => {
    return {
      // fontSize: `var(--text-${props.size})`,
      // color: `var(--${props.color}-color)`,
      fontWeight: props?.weight
    }
  }, [props?.weight]);

  if (props.format === 'h1') {
    return <h1 className={`title ${props?.classNameStyle} ${montserrat.className}`} style={Style}>{props.children}</h1>
  } else if (props.format === 'h2') {
    return <h2 className={`title ${props?.classNameStyle} ${montserrat.className}`} style={Style}>{props.children}</h2>
  } else if (props.format === 'h3') {
    return <h3 className={`title ${props?.classNameStyle} ${montserrat.className}`} style={Style}>{props.children}</h3>
  } else if (props.format === 'h4') {
    return <h4 className={`title ${props?.classNameStyle} ${montserrat.className}`} style={Style}>{props.children}</h4>
  } else if (props.format === 'h5') {
    return <h5 className={`title ${props?.classNameStyle} ${montserrat.className}`} style={Style}>{props.children}</h5>
  } else if (props.format === 'h6') {
    return <h6 className={`title ${props?.classNameStyle} ${montserrat.className}`} style={Style}>{props.children}</h6>
  } else if (props.format === 'p') {
    return <p className={`title ${props?.classNameStyle} ${montserrat.className}`} style={Style}>{props.children}</p>
  }
}
