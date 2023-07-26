import React from 'react';
import { Close } from './icons';
import Services from './services';
import Purposes from './purposes';

export default class ConsentModal extends React.Component {
    componentDidMount() {
        this.consentModalRef.focus();
    }

    render() {
        const {
            hide,
            confirming,
            saveAndHide,
            acceptAndHide,
            declineAndHide,
            config,
            manager,
            lang,
            t,
        } = this.props;
        const { embedded } = config;
        const groupByPurpose =
            config.groupByPurpose !== undefined ? config.groupByPurpose : true;

        let closeLink;
        if (!config.mustConsent) {
            closeLink = (
                <button
                    title={t(['close'])}
                    aria-label={t(['close'])}
                    className="hide"
                    type="button"
                    onClick={hide}
                    tabIndex="0"
                    ref={(div) => {
                        this.consentModalRef = div;
                    }}
                >
                    <Close t={t} />
                </button>
            );
        }

        let declineButton;

        if (!config.hideDeclineAll && !manager.confirmed)
            declineButton = (
                <button
                    disabled={confirming}
                    className="cm-btn cm-btn-decline cm-btn-danger cn-decline"
                    type="button"
                    onClick={declineAndHide}
                >
                    {t(['decline'])}
                </button>
            );
        let acceptAllButton;
        const acceptButton = (
            <button className="cm-button" type="button" onClick={saveAndHide}>
                Confirm My Choices
            </button>
        );
        if (config.acceptAll && !manager.confirmed) {
            acceptAllButton = (
                <button
                    className="cm-button"
                    type="button"
                    onClick={acceptAndHide}
                >
                    Allow All
                </button>
            );
        }

        let ppUrl;
        // to do: deprecate and remove this (also, this is duplicated from the notice)
        if (config.privacyPolicy !== undefined) {
            if (typeof config.privacyPolicy === 'string')
                ppUrl = config.privacyPolicy;
            else if (typeof config.privacyPolicy === 'object') {
                ppUrl =
                    config.privacyPolicy[lang] || config.privacyPolicy.default;
            }
        } else {
            // this is the modern way
            ppUrl = t(['!', 'privacyPolicyUrl'], { lang: lang });
            if (ppUrl !== undefined) ppUrl = ppUrl.join('');
        }

        let ppLink;
        if (ppUrl !== undefined)
            ppLink = (
                <a key="ppLink" href={ppUrl} target="_blank" rel="noopener">
                    {t(['privacyPolicy', 'name'])}
                </a>
            );

        let servicesOrPurposes;

        if (groupByPurpose)
            servicesOrPurposes = (
                <Purposes t={t} config={config} manager={manager} lang={lang} />
            );
        else
            servicesOrPurposes = (
                <Services t={t} config={config} manager={manager} lang={lang} />
            );

        const innerModal = (
            <div
                className="cm-modal cm-klaro"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: 20,
                            marginRight: 24,
                        }}
                    >
                        {closeLink}
                    </div>
                    <hr
                        style={{
                            marginTop: 20,
                            marginBottom: 24,
                        }}
                    />
                    <div className="cm-header">
                        <div
                            style={{
                                color: '#2C3337',
                                fontWeight: 'bold',
                                fontSize: 16,
                                marginBottom: 16,
                            }}
                        >
                            Privacy Preferences
                        </div>
                        <p
                            style={{
                                fontSize: 12,
                                color: '#6C7275',
                                marginBottom: 24,
                            }}
                        >
                            We use cookies that may store or retrieve
                            information on your browser. While some cookies are
                            required to operate this site or app, others ensure
                            a more personalized user experience.  If you choose,
                            click on the different category headings to find out
                            more and change our default settings. However,
                            blocking some types of cookies may impact your
                            experience of the site and the services we are able
                            to offer. For more information visit our{' '}
                            <a
                                href="https://www.gianteagle.com/privacy-notice"
                                id="cookie-consent-link"
                            >
                                Privacy Notice
                            </a>
                            .
                        </p>
                    </div>
                    <div className="cm-body">{servicesOrPurposes}</div>
                </div>
                <div>
                    <hr
                        style={{
                            margin: 0,
                        }}
                    />
                    <div
                        className="cm-footer"
                        style={{
                            border: 0,
                        }}
                    >
                        <div className="cm-footer-buttons">
                            {acceptButton}
                            {/* {declineButton} */}
                        </div>
                    </div>
                </div>
            </div>
        );

        if (embedded)
            return (
                <div id="cookieScreen" className="cookie-modal cm-embedded">
                    {innerModal}
                </div>
            );

        return (
            <div id="cookieScreen" className="cookie-modal">
                <div className="cm-bg" onClick={hide} />
                {innerModal}
            </div>
        );
    }
}
