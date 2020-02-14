import * as React from 'react';
import useScrollbar, { ScrollBarOptions } from './useScrollbar';

const { useRef, useState, useEffect } = React;
const prefixCls = 'dmc-scrollbar';

const Scrollbar = props => {
  const listRef = useRef < HTMLDivElement > null;
  const { children, id, options } = props;
  const [, setMount] = useState(false);

  useScrollbar(listRef.current, options);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <div id={id} ref={listRef} className={prefixCls}>
      {children}
    </div>
  );
};

Scrollbar.whyDidYouRender = true;

const ScrollbarMemo = React.memo(Scrollbar);
ScrollbarMemo.displayName = 'Scrollbar';
export { ScrollbarMemo };

export default Scrollbar;
