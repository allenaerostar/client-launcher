import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { userActions } from '_actions';
import FormBuilder from 'components/Form/FormBuilder';

const ipc = window.require('electron').ipcRenderer;

// const characterForm = [
//   {
//     name: 'character_name',
//     label: 'Character Name',
//     type: 'text',
//     required: true
//   }
// ];

const SelfSupport = props => {
  useEffect(() => {
    ipc.on('self-help-delete-cache-success', (e, res) => {
      props.delete_cache_success();
    });
    ipc.on('self-help-delete-cache-fail', (e, err) => {
      props.delete_cache_failed();
    });

    return () => {
      ipc.removeAllListeners('self-help-delete-cache-success');
      ipc.removeAllListeners('self-help-delete-cache-fail');
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div>
        {/* {<FormBuilder
          formFields={characterForm}
          submitFunction={props.disconnect}
          errorMessageGenerator={false}
          submitText={"Disconnect Character"}
        />} */}
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
