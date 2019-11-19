import React, { useState } from 'react';

const FormBuilder = ({ formFields, submitFunction, errorMessageGenerator, submitText }) => {

  const [inputs, setInputs] = useState({});

  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    let submittable = checkFormErrors();
    if (submittable) {
      submitFunction(inputs);
    }
  }

  const checkFormErrors = () => {
    for (let key in formErrors) {
      if (formErrors[key] !== "") {
        return false;
      }
    }

    for(let field in formFields) {
      if(field.required){
        if(field in inputs){
          if (inputs.field.trim() === '') {
            return false;
          }
        } else {
          return false;
        }
      }
    }

    return true;
  }


  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setInputs(inputs => ({
      ...inputs, [name]: value
    }));

    let errorMessage = '';
    if(errorMessageGenerator) {
      errorMessage = errorMessageGenerator(name, value, inputs) || '';
    }

    setFormErrors(errors => ({
      ...errors, [name]: errorMessage
    }));
  }


  return (
    <form onSubmit={handleSubmit}>
      {
        formFields.map((input, i) => (
          <React.Fragment key={i}>
            <label htmlFor={input.name}>{input.label}:</label>
            <input
              id={input.name}
              type={input.type}
              name={input.name}
              placeholder={input.label}
              onChange={handleChange}
              required={input.required}
            >
            </input>
            {
              !!formErrors[input.name] && formErrors[input.name].length > 0 ?
                <p>{formErrors[input.name]}</p>
                : null
            }
            <br />
          </React.Fragment>
        ))
      }
      <button type="submit">{submitText}</button>
    </form>
  );
}

export default FormBuilder;
