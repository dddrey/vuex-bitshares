/* eslint no-underscore-dangle: 0 */
import { Apis } from 'bitsharesjs-ws';

/**
 * Subscribe to updates from bitsharesjs-ws
 */

class Updater {
  constructor() {
    this._signUpWaitingList = {};
    this._hasSignUpOperationsPending = false;
  }
  enable() {
    Apis.instance().db_api().exec('set_subscribe_callback', [this._mainCallback.bind(this), true]);
  }
  _mainCallback(data) {
    data[0].forEach(operation => {
      if (typeof (operation) === 'object') this._operationCb(operation);
    });
  }
  _operationCb(operation) {
    if (this._hasSignUpOperationsPending && Updater._isSignUpOperation(operation)) {
      this._handleSignUpOperation(operation);
    }
  }
  _handleSignUpOperation(operation) {
    const payload = operation.op[1];
    const { name } = payload;
    const id = operation.result[1];
    console.log('new user signed up : ', name, id);
    console.log(operation);
    if (this._signUpWaitingList[name]) {
      this._signUpWaitingList[name].resolve(id);
      delete this._signUpWaitingList[name];
      this._checkForSignUpOperations();
    }
  }
  static _isSignUpOperation(operation) {
    return (operation.id && operation.id.includes('1.11.') && operation.op[0] === 5);
  }
  _checkForSignUpOperations() {
    this._hasSignUpOperationsPending = !!(Object.keys(this._signUpWaitingList).length);
  }
  listenToSignupId({ name }) {
    console.log('started listening to sign up id : ', name);
    return new Promise((resolve) => {
      this._signUpWaitingList[name] = { resolve };
      this._hasSignUpOperationsPending = true;
    });
  }
}


export default new Updater();

