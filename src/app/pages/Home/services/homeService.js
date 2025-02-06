import { get } from "../../../modules/lib/httpHandle";

export const getUserStats = () => {
    return new Promise((resolve, reject) => {
        get(
            'user/stats',
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy thống kê thất bại');
            }
        );
    });
}; 