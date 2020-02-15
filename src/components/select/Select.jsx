import { FastReactSelect } from '../fast-react-select';
import PropTypes, { string } from 'prop-types';
import React, {
  useRef,
  useImperativeHandle,
  useState,
  forwardRef,
  useMemo,
  memo,
  useCallback,
  useEffect,
} from 'react';
import './styles.css';
import { buildListComponents, getStyles } from '@rsv-lib/select';
import { defaultGroupFormat } from '@rsv-lib/renderers';
import 'react-virtualized/styles.css';
import { optionsPropTypes } from '@rsv-lib/prop-types';
import { buildErrorText } from '@rsv-lib/error';
// import ArrowDown from '../static/ArrowDown.js';

const throwMixControlledError = () => {
  throw new Error(
    buildErrorText(
      `Select do not support using defaultValue and value at the same time. Choose between uncontrolled or controlled component.
    Clear and Select component methods can only be used with uncontrolled components`,
    ),
  );
};

const DEAFULT_SELECT_PLACEHOLDER = '请选择';
const DEAFULT_SELECT_NO_OPTIONS_MESSAGE = '无选项';

let Select = (props, ref) => {
  const reactSelect = useRef('react-select');

  const {
    grouped,
    formatGroupHeaderLabel,
    groupHeaderHeight,
    onChange,
    defaultValue,
    value,
    optionHeight,
    creatable,
    type,
  } = props;

  if (defaultValue && value) {
    throwMixControlledError();
  }

  const [selection, setSelection] = useState(defaultValue || value);
  const prefixCls = 'dmc-select';

  const rowRender = option => {
    return (
      <div className={`${prefixCls}-option`}>
        <svg
          className={`${prefixCls}-check`}
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36 18L19.5 34 12 26.727"
            stroke="currentColor"
            stroke-width="4.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {option.label}
      </div>
    );
  };

  const DropdownIndicator = () => {
    return (
      <svg
        className={`${prefixCls}-arrow-down`}
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M15.3 20.346h17.39l-8.695 8.694-8.694-8.694z" fill="currentColor" />
      </svg>
    );
  };

  const noOptionsMessage = () => DEAFULT_SELECT_NO_OPTIONS_MESSAGE;
  const formatCreateLabel = string => {
    return (
      <div className={`${prefixCls}-create-options`}>
        <svg
          className={`${prefixCls}-create-icon`}
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11.5 24H36.5" stroke="currentColor" stroke-width="6" stroke-linecap="round" />
          <path
            d="M24 11.5L24 36.5"
            stroke="currentColor"
            stroke-width="6"
            stroke-linecap="round"
          />
        </svg>
        {`创建选项“${string}”`}
      </div>
    );
  };
  const selectCls = `${prefixCls} ${prefixCls}-${type} ${prefixCls}-no-border`;

  const defaultProps = {
    isMulti: false,
    isClearable: true,
    isDisabled: false,
    classNamePrefix: prefixCls,
    className: selectCls,
    isSearchable: true,
    // menuIsOpen: true,
    blurInputOnSelect: true,
    isClearable: false,
    formatCreateLabel: formatCreateLabel,

    // components: { DropdownIndicator },
    placeholder: DEAFULT_SELECT_PLACEHOLDER,
    noOptionsMessage,
    // loadingMessage,
  };

  useEffect(() => setSelection(value), [value]);

  const memoGroupHeaderOptions = useMemo(() => {
    if (!grouped && !formatGroupHeaderLabel && !groupHeaderHeight)
      return { formatGroupHeaderLabel: false };

    const groupHeaderHeightValue = groupHeaderHeight || optionHeight;
    return {
      groupHeaderHeight: groupHeaderHeightValue,
      formatGroupHeaderLabel: formatGroupHeaderLabel || defaultGroupFormat(groupHeaderHeightValue),
    };
  }, [grouped, formatGroupHeaderLabel, groupHeaderHeight, optionHeight]);

  const onChangeHandler = useCallback(
    (valueChanged, { action }) => {
      onChange(valueChanged, { action });
      setSelection(valueChanged);
    },
    [onChange, setSelection],
  );

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (value) {
        throwMixControlledError();
      }
      setSelection(null);
    },
    focus: () => {
      reactSelect.current.focus();
    },
    select: item => {
      if (value) {
        throwMixControlledError();
      }
      setSelection(item);
    },
  }));

  return (
    <FastReactSelect
      creatable={creatable}
      ref={reactSelect}
      {...defaultProps}
      {...props}
      styles={{ ...getStyles(), ...props.styles }} //  keep react-select styles implementation and pass to any customization done
      value={value !== undefined ? value : selection}
      onChange={onChangeHandler}
      options={props.options}
      // formatOptionLabel={rowRender}
      components={{
        DropdownIndicator,
        ...props.components,
        ...buildListComponents({
          formatOptionLabel: rowRender,
          ...props,
          ...memoGroupHeaderOptions,
        }),
      }} // props.components comes from react-select if present
    />
  );
};

Select = forwardRef(Select);

Select = memo(Select);

Select.propTypes = {
  ...FastReactSelect.propTypes,
  options: optionsPropTypes.isRequired,
  onChange: PropTypes.func,
  grouped: PropTypes.bool, // this is only for performance enhancement so we do not need to iterate in the array many times. It is not needed if formatGroupHeaderLabel or groupHeaderHeight are defined
  formatGroupHeaderLabel: PropTypes.func,
  optionHeight: PropTypes.number,
  groupHeaderHeight: PropTypes.number,
  defaultValue: PropTypes.object,
  creatable: PropTypes.bool,
};

Select.defaultProps = {
  grouped: false,
  optionHeight: 31,
  creatable: false,
  onChange: () => {},
};

Select.displayName = 'Select';

export default Select;
