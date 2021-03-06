import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const Chat = ({ customClass }, { t, router: { pathname } }) => (
  <Link href="/chat">
    <a
      className={`navbar-item navbar-item-line navbar-item logo-twitelo ${customClass} ${pathname ===
        '/chat' && 'navbar-item-line-active'}`}
    >
      <span className="icon is-medium">
        <i className="fas fa-lg fa-comments" />
      </span>
      <span className="menu-button">{t('navbar.chat')}</span>
    </a>
  </Link>
);

Chat.contextTypes = {
  router: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

Chat.propTypes = {
  customClass: PropTypes.string,
};

Chat.defaultProps = {
  customClass: '',
};

export default Chat;
