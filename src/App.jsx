import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "./components/context/dataContext";
import Events from "./components/Events/Events";
import Forgot from "./components/Forgot/Forgot";
import Logout from "./components/Logout/Logout";
import NavBar from "./components/NavBar/NavBar";
import UpdateUser from "./components/UpdateUser/UpdateUser";
import { ToastContainer } from 'react-toastify';
import PassRestoration from "./components/Forgot/PassRestoration";
import Users from "./components/Users/Users";
import UpdateMerchRequest from "./components/UpdateMerchRequest/UpdateMerchRequest";
import AdminNotifications from "./components/AdminNotifications/AdminNotifications";
import SystemUsers from "./components/SystemUsers/SystemUsers";
import SystemEvents from "./components/System/SystemEvents";
import SystemInscriptions from "./components/System/SystemInscriptions";
import SystemMerch from "./components/System/SystemMerch";
import UpdateEvent from "./components/System/UpdateEvent";
import SystemPayments from "./components/System/SystemPayments";
import SystemDebtors from "./components/System/SystemDebtors";
import UserPaymentsHistory from "./components/System/UserPaymentsHistory";
import Footer from "./components/Footer/Footer";

export default function App() {

  return (
    <UserProvider>
      <BrowserRouter>
      <NavBar/>
        <Routes>
          <Route exact path={"/"} element={<Events />} />
          <Route exact path={"/updatemerchrequest/:mid"} element={<UpdateMerchRequest />} />
          <Route exact path={"/users"} element={<Users />} />
          <Route exact path={"/updateuser/:uid"} element={<UpdateUser />} />
          <Route exact path={"/forgot/:uid"} element={<Forgot />} />
          <Route exact path={"/passrestoration"} element={<PassRestoration />} />
          <Route exact path={"/logout"} element={<Logout />} />

          <Route exact path={"/administrationusers"} element={<SystemUsers />} />
          <Route exact path={"/administrationevents"} element={<SystemEvents />} />
          <Route exact path={"/updateevent/:eid"} element={<UpdateEvent />} />
          <Route exact path={"/administrationinscriptions"} element={<SystemInscriptions />} />
          <Route exact path={"/administrationmerch"} element={<SystemMerch />} />
          <Route exact path={"/administrationpayments"} element={<SystemPayments />} />
          <Route exact path={"/administrationdebtors"} element={<SystemDebtors />} />
          <Route exact path={"/userpaymentshistory/:uid/:lastname"} element={<UserPaymentsHistory />} />

          <Route exact path={"/adminnotifications"} element={<AdminNotifications />} />
        </Routes>
        <Footer/>
      </BrowserRouter>

      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />

    </UserProvider>

  )
}

