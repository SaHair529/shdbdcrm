import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Menu from "./components/Menu";
import LeadsPipelinePage from "./pages/LeadsPipelinePage/LeadsPipelinePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { UserSessionProvider } from "./contexts/UserSessionContext";

function App() {
	return (
		<UserSessionProvider>
			<div className="App" >
				<Router>
					<Menu/>
					<Routes>
						<Route path="/" exact element={<LeadsPipelinePage />} />
						<Route path="/register" exact element={<RegisterPage />} />
						<Route path="/login" exact element={<LoginPage />} />
					</Routes>
				</Router>
			</div>
		</UserSessionProvider>
	);
}

export default App;