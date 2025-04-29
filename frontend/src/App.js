import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Menu from "./components/Menu";
import LeadsPipelinePage from "./pages/LeadsPipelinePage/LeadsPipelinePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";

function App() {
	return (
		<div className="App" >
			<Menu/>
			<Router>
				<Routes>
					<Route path="/" exact element={<LeadsPipelinePage />} />
					<Route path="/register" exact element={<RegisterPage />} />
					<Route path="/login" exact element={<LoginPage />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;