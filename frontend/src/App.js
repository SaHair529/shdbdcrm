import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Menu from "./components/Menu";
import LeadsPipelinePage from "./pages/LeadsPipelinePage/LeadsPipelinePage";

function App() {
	return (
		<div className="App" >
			<Menu/>
			<Router>
				<Routes>
					<Route path="/" exact element={<LeadsPipelinePage />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;