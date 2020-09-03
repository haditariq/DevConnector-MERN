import React, { Component, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../redux/profile/actions';
import PropTypes from 'prop-types';
import Spinner from '../layout/spinner';

const Dashboard = ({
  getCurrentProfile,
  register: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);
  return loading && profile == null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>Welcome {user && user.name}</p>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  register: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  register: state.register,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
