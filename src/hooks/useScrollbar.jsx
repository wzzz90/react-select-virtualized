import * as React from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
// import './scrollbar.less';
const { useEffect } = React;

const useScrollbar = (container, options) => {
  useEffect(() => {
    if (!container) return;

    const dom =
      typeof container === 'function'
        ? container()
        : typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!dom) return;

    let ps = new PerfectScrollbar(dom, options);
    return () => {
      ps && ps.destroy();
      ps = null;
    };
  }, [container, options]);
};

export default useScrollbar;
