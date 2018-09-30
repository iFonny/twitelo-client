import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

function UserList(props) {
  const { latestUsers } = props;

  const listUsers = latestUsers.map(user => (
    <a
      className="is-hidden-mobile no-select"
      key={user.username}
      target="_blank"
      rel="noopener noreferrer"
      href={`https://twitter.com/${user.username}`}
    >
      <img
        src={user.profile_image_url}
        onError={e => {
          e.target.onerror = null;
          e.target.src = '/images/errors/default_profile.png';
        }}
        alt={user.name}
        className="round-pp-user-footer no-select"
      />
      <style jsx>{`
        .round-pp-user-footer {
          object-fit: cover;
          height: 40px;
          width: 40px;
          border-radius: 100%;
          border: 1px solid white;
          cursor: pointer;
          margin: 0 0.2rem;
        }
      `}</style>
    </a>
  ));
  return <div>{listUsers}</div>;
}

UserList.propTypes = {
  latestUsers: PropTypes.array.isRequired,
};

const FooterHome = ({ latestUsers }, { t }) => (
  <Fragment>
    <footer className="footer is-fixed-bottom has-text-centered">
      <p className="sub-title is-6 has-text-weight-light">
        {t('home.latest-users')}
      </p>
      <UserList latestUsers={latestUsers} />
      <p className="sub-title is-8 has-text-weight-light">
        <b>Twitelo</b> -{' '}
        <Link href="/about">
          <a>{t('home.more-informations')}</a>
        </Link>
      </p>
    </footer>
    <style jsx>
      {`
        .footer {
          letter-spacing: 1px;
          background-color: #363636fa;
          padding-top: 0;
          padding-bottom: 0;
          height: 6rem;
        }
      `}
    </style>
  </Fragment>
);

FooterHome.contextTypes = {
  t: PropTypes.func.isRequired,
};

FooterHome.propTypes = {
  latestUsers: PropTypes.array.isRequired,
};

export default FooterHome;
