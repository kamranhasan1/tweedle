import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./components/routes/Feed";
import LeftAside from "./components/layouts/LeftAside";
import Search from "./components/routes/Search";
import NotFound from "./components/routes/NotFound";
import Activity from "./components/routes/Activity";
import NewPost from "./components/routes/NewPost";
import Profile from "./components/routes/Profile";
import Login from "./components/routes/Login";
import Signup from "./components/routes/Signup";
import { AppContextProvider } from "./context/AppContext";
import MobileTop from "./components/layouts/MobileTop";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

function App() {
  const colors = {
    brand: {
      black: "#000",
      white: "#fff",
      maingray: "#18181b",
    },
  };
  const theme = extendTheme({ colors });
  return (
    <ChakraProvider theme={theme}>
      <AppContextProvider>
        <Router>
          <div className="flex flex-col md:flex-row">
            <div>
              <MobileTop />
              <LeftAside />
            </div>
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/search" element={<Search />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/new-post" element={<NewPost />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AppContextProvider>
    </ChakraProvider>
  );
}

export default App;
