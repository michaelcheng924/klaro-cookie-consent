import React from 'react';
import { ServiceItems } from './services';
import { asTitle } from '../utils/strings';
import Text from './text';
import { Plus, Minus } from './icons';

export default class PurposeItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            servicesVisible: false,
        };
    }

    render() {
        const {
            allEnabled,
            onlyRequiredEnabled,
            allDisabled,
            services,
            config,
            onToggle,
            name,
            lang,
            manager,
            consents,
            title,
            description,
            t,
            isStrictlyNecessary,
        } = this.props;
        const { servicesVisible } = this.state;
        const required = this.props.required || false;
        const purposes = this.props.purposes || [];
        const onChange = (e) => {
            onToggle(e.target.checked);
        };
        const id = `purpose-item-${name}`;
        const titleid = `${id}-title`;
        const purposesText = purposes
            .map(
                (purpose) =>
                    t(['!', 'purposes', purpose, 'title?']) || asTitle(purpose)
            )
            .join(', ');
        const requiredText = required ? (
            <span
                className="cm-required"
                title={t(['!', 'service', 'required', 'description']) || ''}
            >
                {t(['service', 'required', 'title'])}
            </span>
        ) : (
            ''
        );

        let purposesContent;
        if (purposes.length > 0)
            purposesContent = (
                <p className="purposes">
                    {t([
                        'purpose',
                        purposes.length > 1 ? 'purposes' : 'purpose',
                    ])}
                    : {purposesText}
                </p>
            );

        const toggleServicesVisible = (e) => {
            e.preventDefault();
            const getCurrentExpandedStatus =
                e.currentTarget.getAttribute('aria-expanded') === 'false'
                    ? false
                    : true;
            e.currentTarget.setAttribute(
                'aria-expanded',
                !getCurrentExpandedStatus
            );
            this.setState({ servicesVisible: !servicesVisible });
        };

        const handleSpace = (e) => {
            // Spacebar press
            if (e.keyCode === 32) {
                toggleServicesVisible(e);
            }
        };

        const toggle = (services, value) => {
            services.map((service) => {
                if (!service.required) {
                    manager.updateConsent(service.name, value);
                }
            });
        };

        const serviceItems = (
            <ServiceItems
                config={config}
                lang={lang}
                services={services}
                toggle={toggle}
                consents={consents}
                visible={servicesVisible}
                t={t}
            />
        );

        let descriptionText =
            description || t(['!', 'purposes', name, 'description']);

        if (isStrictlyNecessary) {
            descriptionText =
                'These cookies are necessary for the website to function (e.g. navigation of the website) and cannot be switched off in our systems. These cookies do not store any personally identifiable information. You cannot opt-out of these cookies.';
        }

        const toggleTitle = (
            <span
                className="cm-list-title"
                id={`${titleid}`}
                style={{
                    cursor: 'pointer',
                    color: '#2C3337',
                    position: 'relative',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 400,
                }}
            >
                {title || t(['!', 'purposes', name, 'title?']) || asTitle(name)}
            </span>
        );

        return (
            <React.Fragment>
                <div
                    style={{
                        padding: '20px 18px',
                    }}
                >
                    {!isStrictlyNecessary && (
                        <input
                            id={id}
                            className={
                                'cm-list-input' +
                                (required ? ' required' : '') +
                                (!allEnabled
                                    ? onlyRequiredEnabled
                                        ? ' only-required'
                                        : ' half-checked'
                                    : '')
                            }
                            aria-labelledby={`${titleid}`}
                            aria-describedby={`${id}-description`}
                            disabled={required}
                            checked={
                                allEnabled ||
                                (!allDisabled && !onlyRequiredEnabled)
                            }
                            type="checkbox"
                            role="switch"
                            onChange={onChange}
                        />
                    )}
                    <label
                        htmlFor={id}
                        className="cm-list-label"
                        {...(required ? { tabIndex: '0' } : {})}
                    >
                        {servicesVisible ? (
                            <button
                                onClick={toggleServicesVisible}
                                style={{
                                    cursor: 'pointer',
                                    padding: '0 !important',
                                    background: '#fff',
                                    border: 0,
                                }}
                            >
                                <Minus />
                                {toggleTitle}
                            </button>
                        ) : (
                            <button
                                onClick={toggleServicesVisible}
                                style={{
                                    cursor: 'pointer',
                                    padding: '0 !important',
                                    background: '#fff',
                                    border: 0,
                                }}
                            >
                                <Plus />
                                {toggleTitle}
                            </button>
                        )}

                        {requiredText}
                        {!isStrictlyNecessary && (
                            <span className="cm-switch">
                                <div className="slider round active"></div>
                            </span>
                        )}
                    </label>
                    {isStrictlyNecessary && (
                        <div
                            style={{
                                color: '#C8102E',
                                fontWeight: 'bold',
                                position: 'absolute',
                                right: 8,
                                top: 20,
                                fontSize: 10,
                            }}
                        >
                            Always Active
                        </div>
                    )}
                    {/* <div id={`${id}-description`}>
                        {descriptionText && (
                            <p className="cm-list-description">
                                <Text config={config} text={descriptionText} />
                            </p>
                        )}
                        {purposesContent}
                    </div> */}
                </div>

                {/* {services.length > 0 && ( */}
                <div
                    className="cm-services"
                    style={{
                        background: '#F8F8F8',
                        padding: servicesVisible ? 16 : 0,
                    }}
                >
                    {/* <div className="cm-caret">
                            <a
                                href="#"
                                aria-haspopup="true"
                                aria-expanded="false"
                                tabIndex="0"
                                onClick={toggleServicesVisible}
                                onKeyDown={handleSpace}
                            >
                                {(servicesVisible && <span>&#8593;</span>) || (
                                    <span>&#8595;</span>
                                )}{' '}
                                {services.length}{' '}
                                {t([
                                    'purposeItem',
                                    services.length > 1
                                        ? 'services'
                                        : 'service',
                                ])}
                            </a>
                        </div> */}
                    <div
                        className={
                            'cm-content' + (servicesVisible ? ' expanded' : '')
                        }
                    >
                        {/* {serviceItems} */}
                        {descriptionText && (
                            <p
                                style={{
                                    color: '#6c7275',
                                    fontSize: 12,
                                    margin: 0,
                                }}
                            >
                                {descriptionText}
                            </p>
                        )}
                    </div>
                </div>
                {/* )} */}
            </React.Fragment>
        );
    }
}
