import axios from 'axios';
import { reducer as notifReducer, actions as notifActions, Notifs } from 're-notif';
const { notifSend } = notifActions;
import notification from './notification';
import {hackathons} from './hackathons';

export const HACK = 'HACK';
export const UPDATE = 'UPDATE';

// ------------------------------------
// Actions
// ------------------------------------
export function hack (value: Object): Action {
  return {
    type: HACK,
    payload: value
  };
}

export function update (value: Object): Action {
  return {
    type: UPDATE,
    payload: value
  };
}

export const fetchFromServer = (id) => (dispatch) => {
  // TODO use config path instead
  axios.get('/api/hacks/' + id)
    .then((res) => {
      dispatch(hack(res.data));
    });
};

export const fetchHackathonsFromServer = () => (dispatch) => {
  // TODO use config path instead
  axios.get('/api/hackathons/')
    .then((res) => {
      dispatch(hackathons(res.data));
    });
};

export const reset = () => (dispatch) => {
  dispatch(hack({}));
};

export const updateToSever = (id, req) => (dispatch) => {
  // TODO use config path instead
  if(id) {
    axios.put('/api/hacks/' + id, req)
      .catch((res) => {
        dispatch(notifSend(notification('Could not update', 'warning')));
      })
      .then((res) => {
        if(res) {
          dispatch(update(res.data));
          dispatch(notifSend(notification(res.data.title + ' is now updated', 'success')));
        }
      });
  } else {
    axios.post('/api/hacks/', req)
      .catch((res) => {
        dispatch(notifSend(notification('Could not create hack', 'warning')));
      })
      .then((res) => {
        if(res) {
          dispatch(update(res.data));
          dispatch(notifSend(notification(res.data.title + ' is now created', 'success')));
        }
      });
  }
};

export const actions = {
  fetchFromServer,
  fetchHackathonsFromServer,
  updateToSever,
  reset
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [HACK]: (state: Object, action: {payload: Object}): Object => action.payload,
  [UPDATE]: (state: Object, action: {payload: Object}) : Object => action.payload
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = new Object();
export default function hackReducer (state: Object = initialState, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
