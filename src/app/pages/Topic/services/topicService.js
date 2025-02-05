import { post, get, put, del } from "../../../modules/lib/httpHandle";

const TOPIC = 'topic';

export const getTopic = (id = ' ') => {
    return new Promise((resolve, reject) => {
        get(
            `${TOPIC}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy danh sách topic thất bại');
            }
        );
    });
};

export const createTopic = (data) => {
    return new Promise((resolve, reject) => {
        post(
            TOPIC,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Tạo topic thất bại');
            }
        );
    });
};

export const updateTopic = (id, data) => {
    return new Promise((resolve, reject) => {
        put(
            `${TOPIC}/${id}`,
            data,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Cập nhật topic thất bại');
            }
        );
    });
};

export const deleteTopic = (id) => {
    return new Promise((resolve, reject) => {
        del(
            `${TOPIC}/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.message);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Xóa topic thất bại');
            }
        );
    });
}; 


export const getTopicStats = (id = ' ') => {
    return new Promise((resolve, reject) => {
        get(
            `${TOPIC}/stats/${id}`,
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy thông số topic thất bại');
            }
        );
    });
};