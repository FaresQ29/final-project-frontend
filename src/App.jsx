import {Route, Routes} from 'react-router-dom';
import Nav from './Components/Nav/Nav';
import { AuthProviderWrapper } from './Context/auth.context';
import ProfilePage from './Pages/ProfilePage/ProfilePage'
import IsPrivate from './Components/PageVisibility/isPrivate';

export default function App(){
    return (
        <AuthProviderWrapper>
            <Nav />
            <Routes>
                <Route path="/profile" element={<IsPrivate> <ProfilePage/> </IsPrivate>}></Route>
            </Routes>
            
        </AuthProviderWrapper>
    )
}

