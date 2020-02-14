import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '_actions';
import FormBuilder from 'components/Form/FormBuilder';

const characterForm = [
  {
    name: 'character_name',
    label: 'Character Name',
    type: 'text',
    required: true
  }
];

const SelfSupport = props => {
  return (
    <div>
        {<FormBuilder
          formFields={characterForm}
          submitFunction={props.disconnect}
          errorMessageGenerator={false}
          submitText={"Disconnect Character"}
        />}
        {<FormBuilder
          formFields={[]}
          submitFunction={props.delete_cache}
          errorMessageGenerator={false}
          submitText={"Delete Cache"}
        />}
    </div>
  );
}

 const mapStateToProps = (state) => {
   return state;
}

export default connect(mapStateToProps, userActions)(SelfSupport);
