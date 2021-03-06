import * as api from '../api';
import ActionTypes from '../actionTypes';

const {
  CHANGE_PASSWORD_RESET,
  CHANGE_PASSWORD_FORM_INVALID,
  CHANGE_PASSWORD_PENDING,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE
} = ActionTypes;

function validate(password, passwordConfirm) {
  const errors = new Map();

  if (!password) {
    errors.set("password", "Password is required");
  }

  if (password && password.length < 6) {
    errors.set("password", "Password must be at least 6 characters long");
  }

  if (!passwordConfirm) {
    errors.set("passwordConfirm", "Please confirm your new password");
  }

  if (password && passwordConfirm && password !== passwordConfirm) {
    errors.set("passwordConfirm", "The passwords do not match");
  }

  return errors;

}


export function resetForm() {
  return { type: CHANGE_PASSWORD_RESET };
}

export function submitForm(password, passwordConfirm, code, loggedIn) {

  const errors = validate(password, passwordConfirm);

  if (errors.size > 0) {
    return {
      type: CHANGE_PASSWORD_FORM_INVALID,
      errors: errors
    }
  }

  return {
    types: [
      CHANGE_PASSWORD_PENDING,
      CHANGE_PASSWORD_SUCCESS,
      CHANGE_PASSWORD_FAILURE
    ],
    payload: {
      promise: api.changePassword(password, code),
    },
    meta: {
      loggedIn: loggedIn
    }
  };
}


