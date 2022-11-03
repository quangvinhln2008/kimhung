import Dashboard from "../containers/Dashboard";
import NhomDoiTuong from "../containers/List/NhomDoiTuong";

const Routes = {
  admin:[
    {
      key: 'dashboard',
      path: '/',
      exact: true,
      component: Dashboard,
    },
    {
      key: 'nhomdoituong',
      path: 'nhomdoituong',
      exact: true,
      component: NhomDoiTuong,
    }
  ]
}

export default Routes