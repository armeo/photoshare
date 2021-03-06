import { combineReducers } from 'redux';

import photos from './photos';
import photoDetail from './photoDetail';
import auth from './auth';
import messages from './messages';
import upload from './upload';
import tags from './tags';
import recoverPassword from './recoverPassword';
import changePassword from './changePassword';
import forms from './forms';

export default combineReducers({
  photos,
  photoDetail,
  auth,
  messages,
  upload,
  tags,
  recoverPassword,
  changePassword,
  forms
});


