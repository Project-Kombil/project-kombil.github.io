import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Aos from "aos";
import "aos/dist/aos.css";
import Layout from "./components/Layout/Layout";

import ReactGA from "react-ga";

function NotFound() {
	useEffect(() => {
		ReactGA.initialize("G-VX8LXY705E");
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);

	const navigate = useNavigate();

	useEffect(() => {
		navigate("/", { replace: true });
	}, [navigate]);

	return null;
}

function App() {
	useEffect(() => {
		Aos.init({ once: true });

		const handleScroll = () => {
			ReactGA.event({
				category: "Scroll",
				action: "User Scrolled",
			});
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route
						index
						element={<Home />}
						onStart={() => {
							ReactGA.pageview(
								window.location.pathname + window.location.search
							);
						}}
					/>
					<Route path="*" element={<NotFound to="/" />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
