import React, { PropTypes } from 'react'
import DelayRender from './../../../components/DelayedRender'
import Loading from './../../../components/Loading'
import Alert from './../../../components/Alert'
import { PromiseStatus } from '../models'

const PromiseResult = ({ error, isLoading, loadingMessage }) => {
  if (isLoading === true) {
    return (
      <DelayRender delay={200}>
        <Loading>{loadingMessage ? loadingMessage : 'Loading...'}</Loading>
      </DelayRender>
    )
  } else if (error) {
    return <Alert danger>{error}</Alert>;
  } else {
    return <span />;
  }
};

PromiseResult.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  loadingMessage: PropTypes.string
};

// This way we support both prop formats, the actual PromiseStatus object or status destructed
// into individual isLoading and error props.
export default ({ status, isLoading, error, loadingMessage }) => {
  if (status instanceof PromiseStatus) {
    return <PromiseResult isLoading={status.isLoading} error={status.error} loadingMessage={loadingMessage} />;
  } else {
    return <PromiseResult isLoading={isLoading} error={error} loadingMessage={loadingMessage} />;
  }
};
