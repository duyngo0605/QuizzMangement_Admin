import { get } from "../../../modules/lib/httpHandle";

export const getRankingStats = () => {
    return new Promise((resolve, reject) => {
        get(
            'quiz/stats',
            (response) => {
                if (response.status === 'OK') {
                    resolve(response.data);
                } else {
                    reject(response.message);
                }
            },
            (error) => {
                reject(error || 'Lấy thống kê xếp hạng thất bại');
            }
        );
    });
}; 