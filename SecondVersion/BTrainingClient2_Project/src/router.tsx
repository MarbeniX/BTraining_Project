import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import Home from "@/mainPages/Home";
import MyActivity from "@/mainPages/MyActivity";
import MyRoutines from "@/mainPages/MyRoutines";
import Train from "@/mainPages/Train";
import NotFound from "@/mainPages/NotFound";
import AdminExercises from "@/pages/admin/Exercises";

const router = createBrowserRouter([
    //So you can have glogal 404 page and local error page
    {
        path: "/404",
        element: <NotFound />,
        errorElement: <NotFound />,
    },
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "my-activity", element: <MyActivity /> },
            { path: "my-routines", element: <MyRoutines /> },
            { path: "train", element: <Train /> },
        ],
    },
    {
        path: "/admin",
        children: [{ path: "exercises", element: <AdminExercises /> }],
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
