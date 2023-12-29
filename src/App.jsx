import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Aos from "aos";
import "aos/dist/aos.css";
import Layout from "./components/Layout/Layout";

function NotFound() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate("/", { replace: true });
	}, [navigate]);

	return null;
}

function App() {
	useEffect(() => {
		Aos.init({ once: true });
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="*" element={<NotFound to="/" />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
