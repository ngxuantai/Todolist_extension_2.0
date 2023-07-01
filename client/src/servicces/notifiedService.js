import axois from 'axios';

const API_URL = 'http://localhost:5000';

export function addNotified(notified, queryParams) {
  return axois.post(API_URL + '/notified', notified, {params: queryParams});
}
