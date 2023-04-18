import styled, { DefaultTheme, css } from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StyledIconSVG = styled.div<any>`
  font-size: 0;
  svg {
    display: inline-block;
    vertical-align: middle;
    width: ${props => (props.maxWidth ? `${props.maxWidth}px` : '100%')};
    height: ${props => (props.maxHeight ? `${props.maxHeight}px` : '100%')};
    pointer-events: none;
  }
  ${props => {
    return (
      props.type === 'fill' &&
      css`
        svg path,
        svg rect {
          fill: ${({ color, theme }: { color: string; theme: DefaultTheme }) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (theme as any)[color] || 'currentColor'};
        }
      `
    );
  }};
  ${props =>
    props.type === 'stroke' &&
    css`
      svg path,
      svg rect {
        stroke: ${({ color, theme }: { color: string; theme: DefaultTheme }) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (theme as any)[color] || 'currentColor'};
      }
    `};
`;
