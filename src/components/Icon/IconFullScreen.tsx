import { memo } from 'react';
import * as React from 'react';

export const IconFullScreen = memo<JSX.IntrinsicElements['svg']>(
  function IconChatGPT(props) {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        width='16'
        height='16'
        fill='none'
        viewBox='0 0 16 16'
      >
        <defs>
          <rect
            id='path_0'
            width='16'
            height='16'
            x='0'
            y='0'
          />
        </defs>
        <g
          opacity='1'
          transform='translate(0 0) rotate(0 8 8)'
        >
          <mask
            id='bg-mask-0'
            fill='#fff'
          >
            <use xlinkHref='#path_0' />
          </mask>
          <g mask='url(#bg-mask-0)'>
            <path
              id='路径 1'
              style={{
                stroke: '#333',
                strokeWidth: '1.3333333333333333',
                strokeOpacity: '1',
                strokeDasharray: '0 0',
              }}
              d='M0,0L3.33,3.3'
              transform='translate(2 2) rotate(0 1.6666666666666665 1.6499166666666665)'
            />
            <path
              id='路径 2'
              style={{
                stroke: '#333',
                strokeWidth: '1.3333333333333333',
                strokeOpacity: '1',
                strokeDasharray: '0 0',
              }}
              d='M0,3.3L3.33,0'
              transform='translate(2 10.666666666666666) rotate(0 1.6666666666666665 1.6499166666666671)'
            />
            <path
              id='路径 3'
              style={{
                stroke: '#333',
                strokeWidth: '1.3333333333333333',
                strokeOpacity: '1',
                strokeDasharray: '0 0',
              }}
              d='M3.3,3.3L0,0'
              transform='translate(10.700199999999999 10.666666666666666) rotate(0 1.6499166666666671 1.6499166666666671)'
            />
            <path
              id='路径 4'
              style={{
                stroke: '#333',
                strokeWidth: '1.3333333333333333',
                strokeOpacity: '1',
                strokeDasharray: '0 0',
              }}
              d='M3.3,0L0,3.3'
              transform='translate(10.666666666666666 2) rotate(0 1.6499166666666671 1.6499166666666665)'
            />
            <path
              id='路径 5'
              style={{
                stroke: '#333',
                strokeWidth: '1.3333333333333333',
                strokeOpacity: '1',
                strokeDasharray: '0 0',
              }}
              d='M0,0L3,0L3,3'
              transform='translate(11 2) rotate(0 1.5 1.5)'
            />
            <path
              id='路径 6'
              style={{
                stroke: '#333',
                strokeWidth: '1.3333333333333333',
                strokeOpacity: '1',
                strokeDasharray: '0 0',
              }}
              d='M3,0L3,3L0,3'
              transform='translate(11 11) rotate(0 1.5 1.5)'
            />
            <path
              id='路径 7'
              style={{
                stroke: '#333',
                strokeWidth: '1.3333333333333333',
                strokeOpacity: '1',
                strokeDasharray: '0 0',
              }}
              d='M3,3L0,3L0,0'
              transform='translate(2 11) rotate(0 1.5 1.5)'
            />
            <path
              id='路径 8'
              style={{
                stroke: '#333',
                strokeWidth: '1.3333333333333333',
                strokeOpacity: '1',
                strokeDasharray: '0 0',
              }}
              d='M0,3L0,0L3,0'
              transform='translate(2 2) rotate(0 1.5 1.5)'
            />
          </g>
        </g>
      </svg>
    );
  }
);
