import React from 'react'

import { IconVerified } from '@audius/stems'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Transition } from 'react-spring/renderprops'

import { ReactComponent as IconGradientSave } from 'assets/img/gradientSave.svg'
import InstagramButton from 'components/general/InstagramButton'
import TwitterAuthButton from 'components/general/TwitterAuthButton'
import LoadingSpinner from 'components/loading-spinner/LoadingSpinner'
import { useRemoteVar } from 'containers/remote-config/hooks'
import { BooleanKeys } from 'services/remote-config'

import styles from './TwitterOverlay.module.css'

const messages = {
  twitterButton: 'Complete With Twitter',
  instagramButton: 'Complete With Instagram',
  linkProfile:
    'Quickly complete your profile by linking one of your social accounts.',
  manual: 'I’d rather fill out my profile manually',
  twitterChecks: [
    'Display Name',
    'Handle',
    'Profile Picture',
    'Cover Photo',
    <div key={'verify'}>
      <div>
        {'Verification'} <IconVerified className={styles.verified} />
      </div>
      <div className={styles.ifApplicable}>{'(if applicable)'}</div>
    </div>
  ]
}

const TwitterOverlay = props => {
  const displayInstagram = useRemoteVar(
    BooleanKeys.DISPLAY_INSTAGRAM_VERIFICATION
  )

  return (
    <Transition
      items={props.showTwitterOverlay}
      from={{ opacity: props.initial ? 1 : 0 }}
      enter={{ opacity: 1 }}
      leave={{ opacity: 0 }}
      config={{ duration: 100 }}
    >
      {show =>
        show &&
        (transitionProps => (
          <div
            style={{
              ...transitionProps,
              zIndex: 10,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <div
              className={cn(styles.twitterOverlayContainer, {
                [styles.isMobile]: props.isMobile
              })}
            >
              <div className={styles.header}>{props.header}</div>
              {props.isLoading || !props.showTwitterOverlay ? (
                <div className={styles.loadingContainer}>
                  <LoadingSpinner className={styles.loadingSpinner} />
                </div>
              ) : (
                <>
                  {displayInstagram && (
                    <InstagramButton
                      className={styles.instagramButton}
                      textClassName={styles.btnText}
                      iconClassName={styles.btnIcon}
                      onClick={props.onClick}
                      onSuccess={props.onInstagramLogin}
                      onFailure={props.onFailure}
                      text={messages.instagramButton}
                    />
                  )}
                  <TwitterAuthButton
                    showIcon={false}
                    onClick={props.onClick}
                    className={styles.twitterButton}
                    iconClassName={styles.btnIcon}
                    textLabel={messages.twitterButton}
                    onSuccess={props.onTwitterLogin}
                    onFailure={props.onFailure}
                  />
                  <div className={styles.divider} />
                  <div className={styles.autofillContainer}>
                    <div className={styles.autofill}>
                      {messages.linkProfile}
                    </div>
                    <div className={styles.autofillChecklist}>
                      {messages.twitterChecks.map((check, ind) => (
                        <div key={ind} className={styles.checkItem}>
                          <div className={styles.checkIcon}>
                            {' '}
                            <IconGradientSave />
                          </div>
                          {check}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={cn(styles.divider, styles.lowerDivider)} />
                  <div
                    className={styles.manualText}
                    onClick={props.onToggleTwitterOverlay}
                  >
                    {messages.manual}
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      }
    </Transition>
  )
}

TwitterOverlay.propTypes = {
  header: PropTypes.string,
  showTwitterOverlay: PropTypes.bool,
  initial: PropTypes.bool,
  onTwitterLogin: PropTypes.func,
  onInstagramLogin: PropTypes.func,
  onToggleTwitterOverlay: PropTypes.func,
  onClick: PropTypes.func,
  onFailure: PropTypes.func,
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool
}

TwitterOverlay.defaultProps = {
  initial: false,
  isMobile: false
}

export default TwitterOverlay
