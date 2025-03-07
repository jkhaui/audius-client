/* globals fetch, File */
import React, { Component } from 'react'

import cn from 'classnames'
import PropTypes from 'prop-types'

import BackButton from 'components/general/BackButton'
import ProfileForm from 'containers/sign-on/components/ProfileForm'
import DesktopTwitterOverlay from 'containers/sign-on/components/desktop/TwitterOverlay'
import MobileTwitterOverlay from 'containers/sign-on/components/mobile/TwitterOverlay'
import {
  formatInstagramProfile,
  formatTwitterProfile
} from 'containers/sign-on/utils/formatSocialProfile'
import { resizeImage } from 'utils/imageProcessingUtil'

import styles from './ProfilePage.module.css'

const messages = {
  header: 'Tell Us About Yourself So Others Can Find You'
}

export class ProfilePage extends Component {
  state = {
    // If the handle field is disabled, don't let the user twitter auth
    showTwitterOverlay: this.props.handle.status !== 'disabled',
    handleError: '',
    profileValid: false,
    initial: true,
    isSubmitted: false,
    isLoading: false
  }

  onToggleTwitterOverlay = () =>
    this.setState({
      showTwitterOverlay: !this.state.showTwitterOverlay,
      initial: false
    })

  onContinue = () => {
    if (this.getProfileValid() && !this.state.isSubmitted) {
      this.props.onNextPage()
      this.setState({ isSubmitted: true })
    }
  }

  getProfileValid = () => {
    const { name, handle } = this.props
    return (
      name.value &&
      (handle.status === 'success' || handle.status === 'disabled')
    )
  }

  setIsLoading = () => {
    this.setState({ isLoading: true })
  }

  setDidFinishLoading = () => {
    this.setState({ isLoading: false })
  }

  onTwitterLogin = async twitterProfileRes => {
    const { uuid, profile: twitterProfile } = await twitterProfileRes.json()
    try {
      const {
        profile,
        profileImage,
        profileBanner,
        requiresUserReview
      } = await formatTwitterProfile(twitterProfile)

      this.props.validateHandle(profile.screen_name, error => {
        this.props.setTwitterProfile(
          uuid,
          profile,
          profileImage,
          profileBanner,
          !error && !requiresUserReview
        )
        this.setState({
          showTwitterOverlay: false,
          initial: false,
          isLoading: false
        })
      })
    } catch (err) {
      console.error(err)
      this.setState({
        showTwitterOverlay: false,
        initial: false,
        isLoading: false
      })
    }
  }

  onInstagramLogin = async (uuid, instagramProfile) => {
    try {
      const {
        profile,
        profileImage,
        requiresUserReview
      } = await formatInstagramProfile(uuid, profile)
      this.props.validateHandle(profile.username, error => {
        this.props.setInstagramProfile(
          uuid,
          profile,
          profileImage,
          !error && !requiresUserReview
        )
        this.setState({
          showTwitterOverlay: false,
          initial: false,
          isLoading: false
        })
      })
    } catch (err) {
      this.setState({
        showTwitterOverlay: false,
        initial: false,
        isLoading: false
      })
    }
  }

  onHandleKeyDown = e => {
    if (e.keyCode === 13 /** enter */) {
      this.onContinue()
    }
  }

  render() {
    const {
      name,
      handle,
      profileImage,
      isVerified,
      setProfileImage,
      twitterId,
      isMobile
    } = this.props
    const { showTwitterOverlay, initial, isLoading } = this.state
    const canUpdateHandle = !(
      isVerified &&
      twitterId &&
      handle.status === 'success'
    )
    const profileValid = this.getProfileValid()
    const TwitterOverlay = isMobile
      ? MobileTwitterOverlay
      : DesktopTwitterOverlay
    return (
      <div
        className={cn(styles.container, {
          [styles.isMobile]: isMobile
        })}
      >
        {isMobile ? null : (
          <>
            <div className={styles.header}>{messages.header}</div>
            <BackButton
              light
              onClickBack={this.onToggleTwitterOverlay}
              className={cn(styles.backButton, {
                [styles.hide]: showTwitterOverlay
              })}
            />
          </>
        )}
        <div className={styles.profileContentContainer}>
          <TwitterOverlay
            header={messages.header}
            isMobile={isMobile}
            initial={initial}
            isLoading={isLoading}
            showTwitterOverlay={showTwitterOverlay}
            onClick={this.setIsLoading}
            onFailure={this.setDidFinishLoading}
            onTwitterLogin={this.onTwitterLogin}
            onInstagramLogin={this.onInstagramLogin}
            onToggleTwitterOverlay={this.onToggleTwitterOverlay}
          />
          <ProfileForm
            isMobile={isMobile}
            header={messages.header}
            showTwitterOverlay={showTwitterOverlay}
            profileImage={profileImage}
            name={name}
            onTwitterLogin={this.onTwitterLogin}
            onInstagramLogin={this.onInstagramLogin}
            onToggleTwitterOverlay={this.onToggleTwitterOverlay}
            canUpdateHandle={canUpdateHandle}
            handle={handle}
            setProfileImage={setProfileImage}
            profileValid={profileValid}
            onHandleKeyDown={this.onHandleKeyDown}
            onHandleChange={this.props.onHandleChange}
            onNameChange={this.props.onNameChange}
            onContinue={this.onContinue}
          />
        </div>
      </div>
    )
  }
}

export default ProfilePage
