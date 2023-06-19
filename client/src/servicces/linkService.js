import axois from "axios";

const API_URL = "http://localhost:5000";

export function getLink() {
  return axois.get(API_URL + "/link");
}

export function addLink(link) {
  return axois.post(API_URL + "/link", link);
}
