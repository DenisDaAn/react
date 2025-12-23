import { authProvider, loginAction, protectedLoader } from "@/components/auth/auth";
import LoginPage from "@/pages/LoginPage";
import { MainPage } from "@/pages/MainPage";
import { createBrowserRouter, RouterProvider, redirect } from "react-router";

const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        loader() {
            return { token: authProvider.token };
        },
        Component: LoginPage,
        action: loginAction,
    },
    {
        path: "*",
        loader: protectedLoader,
        element: <div>Error 404 </div>,
    },
    {
        path: "home",
        Component: MainPage,
        loader: protectedLoader
    },
]);



export function MainTree() {
    return <RouterProvider router={router} />;
}