import React from 'react'

const ForbiddenComponent = () => {
  return (
    <><div class="lock"></div><div class="message">
      <h1>Pristup ovoj stranici je ograničen</h1>
      <p>Molimo Vas da proverite vaša sistemska odobrenja sa administratorima.</p>
    </div></>
  )
}

export default ForbiddenComponent;