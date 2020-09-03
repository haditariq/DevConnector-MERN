import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../redux/auth/actions';

const Navbar = ({ register: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/dashboard'>Dashboard</Link>
      </li>
      <li>
        <a href='/#!' onClick={logout}>
          Logout
        </a>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  console.log({ isAuthenticated });
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to={'/'}>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propType = {
  logout: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  register: state.register
});
export default connect(mapStateToProps, { logout })(Navbar);
