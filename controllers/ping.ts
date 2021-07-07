import {http} from "../lib";

export const ping = () => {
    return http.get('/').then(res => res.data)
}
