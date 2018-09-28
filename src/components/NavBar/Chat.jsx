import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const Chat = (props, { t, router: { pathname } }) => (
  <Link href="/chat">
    <a
      className={`navbar-item navbar-item-line navbar-item logo-twitelo ${pathname ===
        '/chat' && 'navbar-item-line-active'}`}
    >
      <span className="icon is-medium has-text-info">
        <i className="fas fa-lg fa-info-circle" />
      </span>
      <span className="menu-button">{t('navbar.user.chat')}</span>
    </a>
  </Link>
);

Chat.contextTypes = {
  router: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default Chat;
