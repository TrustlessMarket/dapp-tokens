import React from 'react';
import _AutoSizer, {
  AutoSizerProps,
} from 'react-virtualized/dist/commonjs/AutoSizer';
import _List, { ListProps } from 'react-virtualized/dist/commonjs/List';

export const List = _List as unknown as React.FC<ListProps>;
export const AutoSizer = _AutoSizer as unknown as React.FC<AutoSizerProps>;
