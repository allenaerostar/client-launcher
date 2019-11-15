import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

export const AppErrors = () => {
  return (
    <div>
      {
        // Object.keys(formErrors).map((fieldName, i) => {
        //   if (formErrors[fieldName].length > 0) {
        //     return (
        //       <p key={i}>{fieldName} {formErrors[fieldName]}</p>
        //     )
        //   } else {
        //     return '';
        //   }
        // })
      }
    </div>
  );
}
export default AppErrors;