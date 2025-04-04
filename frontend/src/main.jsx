import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router-dom";

import { store, persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";

import { Provider } from "react-redux";

import Signup from "./components/Signup.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import WriteBlog from "./components/WriteBlog.jsx";
import Articles from "./components/Articles.jsx";
import UserBlogs from "./components/UserBlogs.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import EditPost from "./components/EditPost.jsx";

import EditPage from "./pages/EditPage.jsx";

const routes = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route
        path="/signup"
        element={
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        }
      />

      <Route
        path="/login"
        element={
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/write-blog"
        element={
          <AuthLayout authentication>
            <WriteBlog />
          </AuthLayout>
        }
      />
      <Route
        path="/edit-blog/:id"
        element={
          <AuthLayout authentication>
            <EditPost />
          </AuthLayout>
        }
      />
      <Route
        path="/edit-page/:id"
        element={
          <AuthLayout authentication>
            <EditPage />
          </AuthLayout>
        }
      />
      <Route path="/articles" element={<Articles />} />
      <Route
        path="/user-blogs"
        element={
          <AuthLayout authentication>
            <UserBlogs />
          </AuthLayout>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={routes} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
