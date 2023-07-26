import React from 'react';
import ConsentModal from './consent-modal';
import { getPurposes } from '../utils/config';
import Text from './text';
import { asTitle } from '../utils/strings';

export default class ConsentNotice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: props.modal,
            confirming: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.modal !== this.props.modal)
            this.setState({ modal: this.props.modal });

        if (this.noticeRef) {
            this.noticeRef.focus();
        }
    }

    executeButtonClicked = (setChangedAll, changedAllValue, eventType) => {
        const { modal } = this.state;

        let changedServices = 0;

        if (setChangedAll)
            changedServices = this.props.manager.changeAll(changedAllValue);

        const confirmed = this.props.manager.confirmed;

        this.props.manager.saveAndApplyConsents(eventType);

        if (
            setChangedAll &&
            !confirmed &&
            (modal || this.props.config.mustConsent)
        ) {
            const close = () => {
                this.setState({ confirming: false });
                this.props.hide();
            };

            this.setState({ confirming: true });
            if (changedServices === 0) close();
            else {
                setTimeout(close, 800);
            }
        } else {
            this.props.hide();
        }

        window.mParticle.logEvent(
            'Cookie Consent',
            mParticle.EventType.UserPreference,
            {
                Performance: this.props.manager.consents.analytics_storage
                    ? 'yes'
                    : 'no',
                Functional: this.props.manager.consents.functionality_storage
                    ? 'yes'
                    : 'no',
                Targeting: this.props.manager.consents.ad_storage
                    ? 'yes'
                    : 'no',
                hardwareId: window.mParticle.getDeviceId(),
                hostname: window.location.hostname,
            }
        );

        // GPDR CONSENT
        var user = mParticle.Identity.getCurrentUser();
        // Create consents for different purposes (in this case, location and parental consent purposes)
        var analytics_storage = mParticle.Consent.createGDPRConsent(
            this.props.manager.consents.analytics_storage, // Consented
            Date.now(), // Timestamp
            '', // Document
            '', // Location
            window.mParticle.getDeviceId() // Hardware ID
        );

        var functionality_storage = mParticle.Consent.createGDPRConsent(
            this.props.manager.consents.functionality_storage, // Consented
            Date.now(), // Timestamp
            '', // Document
            '', // Location
            window.mParticle.getDeviceId() // Hardware ID
        );

        var ad_storage = mParticle.Consent.createGDPRConsent(
            this.props.manager.consents.ad_storage, // Consented
            Date.now(), // Timestamp
            '', // Document
            '', // Location
            window.mParticle.getDeviceId() // Hardware ID
        );

        // Add to your consent state
        var consentState = mParticle.Consent.createConsentState();
        consentState.addGDPRConsentState(
            'analytics_storage',
            analytics_storage
        );
        consentState.addGDPRConsentState(
            'functionality_storage',
            functionality_storage
        );
        consentState.addGDPRConsentState('ad_storage', ad_storage);
        user.setConsentState(consentState);
    };

    saveAndHide = () => {
        this.executeButtonClicked(false, false, 'save');
    };

    acceptAndHide = () => {
        this.executeButtonClicked(true, true, 'accept');
    };

    declineAndHide = () => {
        this.executeButtonClicked(true, false, 'decline');
    };

    render() {
        const { lang, config, show, manager, testing, t } = this.props;
        const { confirming, modal } = this.state;
        const { embedded, noticeAsModal, hideLearnMore } = config;

        // we exclude functional services from this list, as they are always required and
        // the user cannot decline their use...
        const purposeOrder = config.purposeOrder || [];
        const purposes = getPurposes(config)
            .filter((purpose) => purpose !== 'functional')
            .sort((a, b) => purposeOrder.indexOf(a) - purposeOrder.indexOf(b));
        const purposesTranslations = purposes.map(
            (purpose) =>
                t(['!', 'purposes', purpose, 'title?']) || asTitle(purpose)
        );
        let purposesText = '';
        if (purposesTranslations.length === 1)
            purposesText = purposesTranslations[0];
        else
            purposesText = [
                ...purposesTranslations.slice(0, -2),
                purposesTranslations.slice(-2).join(' & '),
            ].join(', ');
        let ppUrl;
        // to do: deprecate and remove this
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

        const showModal = (e) => {
            e.preventDefault();
            this.setState({ modal: true });
        };

        const hideModal = () => {
            if (config.mustConsent && !config.acceptAll) return;
            if (manager.confirmed && !testing) this.props.hide();
            else this.setState({ modal: false });

            setTimeout(() => {
                if (this.noticeRef) {
                    this.noticeRef.focus();
                }
            }, 1);
        };

        let changesText;
        if (manager.changed)
            changesText = (
                <p className="cn-changes">
                    {t(['consentNotice', 'changeDescription'])}
                </p>
            );

        // we only show the notice if it's explicitly demanded (show=True), if
        // testing mode is enabled (testing=true) or if there's a confirmation
        // process/animation going on (confirming=true)
        if (!show && !testing && !confirming) return <div />;

        const noticeIsVisible =
            (!config.mustConsent || noticeAsModal) &&
            !manager.confirmed &&
            !config.noNotice;

        const declineButton = config.hideDeclineAll ? (
            ''
        ) : (
            <button
                className="cm-button cm-button-decline"
                type="button"
                onClick={this.declineAndHide}
            >
                Reject All
            </button>
        );

        const acceptButton = config.acceptAll ? (
            <button
                className="cm-button"
                type="button"
                onClick={this.acceptAndHide}
            >
                Accept All Cookies
            </button>
        ) : (
            <button
                className="cm-btn cm-btn-success"
                type="button"
                onClick={this.saveAndHide}
            >
                {t(['ok'])}
            </button>
        );

        const learnMoreLink = () => (
            <button
                key="learnMoreLink"
                className="cm-button cm-button-decline cm-button-manage"
                type="button"
                onClick={showModal}
            >
                Cookie Settings
            </button>
        );

        let ppLink;

        if (ppUrl !== undefined)
            ppLink = (
                <a key="ppLink" href={ppUrl}>
                    {t(['privacyPolicy', 'name'])}
                </a>
            );

        if (
            modal ||
            (manager.confirmed && !testing) ||
            (!manager.confirmed && config.mustConsent)
        )
            return (
                <ConsentModal
                    t={t}
                    lang={lang}
                    config={config}
                    hide={hideModal}
                    confirming={confirming}
                    declineAndHide={this.declineAndHide}
                    saveAndHide={this.saveAndHide}
                    acceptAndHide={this.acceptAndHide}
                    manager={manager}
                />
            );

        const notice = (
            <div
                role="dialog"
                aria-describedby="id-cookie-notice"
                aria-labelledby="id-cookie-title"
                id="klaro-cookie-notice"
                tabIndex="0"
                autoFocus
                ref={(div) => {
                    this.noticeRef = div;
                }}
                className={`cookie-notice ${
                    !noticeIsVisible && !testing ? 'cookie-notice-hidden' : ''
                } ${noticeAsModal ? 'cookie-modal-notice' : ''} ${
                    embedded ? 'cn-embedded' : ''
                }`}
                style={{
                    background: '#fff',
                    boxSizing: 'border-box',
                    bottom: 24,
                    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
                    left: 24,
                    padding: '24px 24px 16px',
                    position: 'fixed',
                    top: 'inherit',
                    width: 375,
                }}
            >
                <div className="cn-body">
                    <div
                        style={{
                            color: '#2C3337',
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginBottom: 16,
                        }}
                    >
                        Your Privacy
                    </div>
                    <p
                        style={{
                            color: '#6c7275',
                            fontSize: 12,
                            margin: 0,
                        }}
                    >
                        This website uses cookies for purposes of site
                        operation, analyzing site traffic and personalizing
                        content and ads as described in our{' '}
                        <a
                            href="https://www.gianteagle.com/privacy-notice"
                            id="cookie-consent-link"
                        >
                            Privacy Notice
                        </a>
                        . You may choose to consent to our use of cookies,
                        reject non-essential cookies, or further manage your
                        preferences by clicking “Cookies Settings”.
                    </p>
                    {testing && <p>{t(['consentNotice', 'testing'])}</p>}
                    {/* {changesText} */}
                    <div className="cn-ok">
                        <div className="cn-buttons">
                            {acceptButton}
                            {declineButton}
                            {!hideLearnMore && learnMoreLink()}
                        </div>
                    </div>
                </div>
            </div>
        );

        if (!noticeAsModal) return notice;

        return (
            <div id="cookieScreen" className="cookie-modal">
                <div className="cm-bg" />
                {notice}
            </div>
        );
    }
}
