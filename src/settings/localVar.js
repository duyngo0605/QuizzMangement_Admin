export const BE_ENDPOINT = 'http://localhost:5000/api/';

export const USERNAME = 'username';
export const TOKEN = 'token';


export const getMenuItems = (role) => {
    switch (role) {
      case 'admin':
        return [
          {
            title: "Quản lý tài khoản",
            icon: "manage_accounts",
            path: "/user",
          },
          {
            title: "Quản lý Topic",
            icon: "topic",
            path: "/topic",
          },
        ];
      default:
        return [];
    }
  };