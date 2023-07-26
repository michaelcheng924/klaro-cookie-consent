import React from 'react';
import PropTypes from 'prop-types';

export const Close = ({ t }) => {
    return (
        <svg
            role="img"
            aria-label={t(['close'])}
            width="12"
            height="12"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>{t(['close'])}</title>
            <line x1="1" y1="11" x2="11" y2="1" strokeWidth="1" />
            <line x1="1" y1="1" x2="11" y2="11" strokeWidth="1" />
        </svg>
    );
};

Close.propTypes = {
    t: PropTypes.func,
};

export const Plus = ({ t }) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                color: '#2C3337',
                position: 'relative',
                marginRight: 8,
            }}
        >
            <path
                d="M6.5 3C6.5 2.72386 6.27614 2.5 6 2.5C5.72386 2.5 5.5 2.72386 5.5 3V5.5H3C2.72386 5.5 2.5 5.72386 2.5 6C2.5 6.27614 2.72386 6.5 3 6.5H5.5V9C5.5 9.27614 5.72386 9.5 6 9.5C6.27614 9.5 6.5 9.27614 6.5 9V6.5H9C9.27614 6.5 9.5 6.27614 9.5 6C9.5 5.72386 9.27614 5.5 9 5.5H6.5V3Z"
                fill="currentColor"
            />
        </svg>
    );
};

Plus.propTypes = {
    t: PropTypes.func,
};

export const Minus = ({ t }) => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                color: '#2C3337',
                position: 'relative',
                marginRight: 8,
            }}
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.5 6C1.5 5.72386 1.72386 5.5 2 5.5H10C10.2761 5.5 10.5 5.72386 10.5 6C10.5 6.27614 10.2761 6.5 10 6.5H2C1.72386 6.5 1.5 6.27614 1.5 6Z"
                fill="currentColor"
            />
        </svg>
    );
};

Minus.propTypes = {
    t: PropTypes.func,
};
